import type { NextApiRequest, NextApiResponse } from 'next';
// Use require for accessibility-checker as it's a CommonJS module
// and this is the documented way to use it.
const accessibilityChecker = require("accessibility-checker");
// Puppeteer is NOT directly used by your API code if accessibility-checker handles it.
// However, accessibility-checker USES puppeteer internally for URL scans,
// so it still needs to be installed as a dependency in your project.

import { doc, getDoc, updateDoc, addDoc, collection, setDoc, writeBatch, serverTimestamp, Timestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config'; // Your initialized Firestore instance
import admin from '@/lib/firebase/adminConfig'; // Import initialized admin from central config

const WEB_PAGE_SCAN_COST = 10; // As defined in accessibility-check/page.tsx

type ServicesToScan = {
  accessibility?: boolean;
  readability?: boolean; // You might handle other services later
  seo?: boolean;
  pageHealth?: boolean;
};

type ScanRequestBody = {
  url: string;
  servicesToScan: ServicesToScan;
};

// Define a more specific type for the report if possible, based on the checker's output
type AccessibilityScanReport = any; // Replace 'any' with a more specific interface later

type SuccessResponse = {
  success: true;
  message: string;
  data: {
    url: string;
    services: ServicesToScan;
    report?: AccessibilityScanReport; // Changed from scanResult
    creditDeductionStatus: "pending" | "success" | "failed_insufficient_funds" | "error_user_profile_not_found" | "error_deduction_failed" | "error_no_userid"; // Add this field
  };
};

type ErrorResponse = {
  success: false;
  message: string;
  error?: string; // Optional error details
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  console.log('Starting API handler');
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { url, servicesToScan }: ScanRequestBody = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: 'Missing URL in request body' });
  }
  if (!servicesToScan) {
    return res.status(400).json({ success: false, message: 'Missing servicesToScan in request body' });
  }

  let userId: string | undefined;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split(' ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      userId = decodedToken.uid;
      console.log('Token verification successful, userId:', userId);
    } catch (error: any) {
      console.error('Error verifying Firebase ID token:', error);
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
  } else {
    console.warn('No Authorization header or Bearer token found.');
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  console.log('Scan request received:');
  console.log('URL:', url);
  console.log('Services to Scan:', servicesToScan);

  let report: AccessibilityScanReport | undefined;
  let creditDeductionStatus: SuccessResponse['data']['creditDeductionStatus'] = "pending"; // To inform the client

  console.log('Initiating accessibility scan block');
  if (servicesToScan?.accessibility) {
    const scanLabel = `webpage-${new Date().toISOString()}-${encodeURIComponent(url)}`;
    try {
      console.log(`Initiating accessibility scan for URL: ${url} with label: ${scanLabel}`);
      // accessibility-checker's getCompliance can take a URL directly.
      // It will handle launching Puppeteer internally for URL scans.
      const results = await accessibilityChecker.getCompliance(url, scanLabel);
      console.log('Accessibility scan completed');

      if (results && results.report) {
        report = results.report;
        console.log('Accessibility scan successful.');

        if (report && userId) { // Ensure userId is available
          console.log(`Attempting to save scan results to Firestore for user: ${userId}`);
          const scanReport = report; // Use the report variable
          const newScanDocRef = doc(collection(db, "scans")); // Auto-generates a new ID for the scan

          const scanData = {
            userId: userId,
            // monitoredSiteId: null, // Not applicable for this ad-hoc page scan yet
            targetUrl: scanReport.summary.URL || url,
            scanLabel: scanLabel,
            scanType: "webpage_accessibility", // Specific to this endpoint's current function
            servicesRequested: servicesToScan, // From the request body
            status: "completed",
            startTimestamp: Timestamp.fromDate(new Date(scanReport.summary.startScan || Date.now())),
            endTimestamp: serverTimestamp(),
            creditsConsumed: WEB_PAGE_SCAN_COST,
            summaryCounts: scanReport.summary.counts, // Store the counts object
            toolId: scanReport.toolID,
            ruleArchive: scanReport.summary.ruleArchive,
            policies: scanReport.summary.policies,
            numRulesExecuted: scanReport.numExecuted,
          };

          try {
            await setDoc(newScanDocRef, scanData);
            console.log("Main scan document saved to Firestore with ID:", newScanDocRef.id);

            // Batch write individual issues to the subcollection
            if (scanReport.results && scanReport.results.length > 0) {
              const batch = writeBatch(db);
              const resultsSubCollectionRef = collection(db, "scans", newScanDocRef.id, "scanResultItems");

              scanReport.results.forEach((issue: any) => { // Consider defining a more specific type for 'issue'
                const issueDocRef = doc(resultsSubCollectionRef); // Auto-generate ID for each issue
                const issueData = {
                  ruleId: issue.ruleId,
                  reasonId: issue.reasonId || null, // Ensure all fields exist or provide defaults
                  level: issue.level,
                  value: issue.value,
                  message: issue.message,
                  snippet: issue.snippet,
                  pathDom: issue.path?.dom || null,
                  pathAria: issue.path?.aria || null,
                  category: issue.category,
                  // helpUrl: issue.help, // The CLI output showed a help URL. If the raw report contains it, map it.
                                          // Otherwise, you might need a helper function: constructHelpUrl(issue.ruleId, scanReport.summary.ruleArchive)
                  pageUrl: scanReport.summary.URL || url, // For single page scan, it's the targetUrl
                };
                batch.set(issueDocRef, issueData);
              });

              await batch.commit();
              console.log('Firestore save successful');
            }

            // This block comes after successfully saving scan results and newScanDocRef.id is available
            // const userId = decodedToken.uid; // This should already be defined from Prompt 7
            const scanCost = WEB_PAGE_SCAN_COST;
            // let creditDeductionStatus: SuccessResponse['data']['creditDeductionStatus'] = "pending"; // Moved declaration

            console.log('Attempting credit deduction block');
            if (userId) { // Ensure userId is valid
                const userRef = doc(db, "users", userId);
                try {
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        console.error(`CRITICAL: User profile not found in Firestore for authenticated user: ${userId} during credit deduction.`);
                        creditDeductionStatus = 'error_user_profile_not_found';
                    } else {
                        const userData = userSnap.data();
                        const currentCredits = userData?.creditBalance || 0; // Use optional chaining

                        if (currentCredits >= scanCost) {
                            await updateDoc(userRef, {
                                creditBalance: increment(-scanCost),
                                updatedAt: serverTimestamp()
                            });

                            const transactionRef = collection(db, "creditTransactions");
                            await addDoc(transactionRef, {
                                userId: userId,
                                amount: -scanCost,
                                type: "scan_usage_webpage_accessibility",
                                description: `Ad-hoc accessibility scan for URL: ${url}`, // 'url' is from req.body
                                relatedScanId: newScanDocRef.id, // 'newScanDocRef' is from saving the main scan document
                                transactionDate: serverTimestamp(),
                                balanceAfter: currentCredits - scanCost,
                            });
                            console.log(`Successfully deducted ${scanCost} credits for user ${userId}. New balance: ${currentCredits - scanCost}`);
                            creditDeductionStatus = 'success';
                        } else {
                            console.warn(`Insufficient credits for user ${userId} to perform scan costing ${scanCost}. Current balance: ${currentCredits}`);
                            creditDeductionStatus = 'failed_insufficient_funds';
                            // Note: The scan results were already saved. This is a post-scan credit check.
                            // The frontend modal (CreditConfirmationModal) should ideally prevent this scenario.
                        }
                    }
                } catch (creditError: any) {
                    console.error(`Error during credit deduction for user ${userId}:`, creditError);
                    creditDeductionStatus = 'error_deduction_failed';
                }
            } else {
                console.error("UserID not available for credit deduction. This shouldn't happen if API is secured.");
                creditDeductionStatus = 'error_no_userid';
            }
            console.log('Credit deduction logic completed with status:', creditDeductionStatus);

          } catch (firestoreError: any) {
            console.error("Error saving scan results to Firestore:", firestoreError);
            // Decide if this should make the API call fail or just log.
            // For now, we'll let the API succeed but log this critical error.
            // In production, you might want to handle this more gracefully or queue for retry.
          }
        } else if (!userId) {
            console.warn("No userId available, skipping Firestore save for scan results.");
        }

      } else {
        console.error('Scan completed but no report was generated.');
        // Decide if this is a 500 or a different error/response
        return res.status(500).json({ success: false, message: 'Scan completed but no report was generated.' });
      }
    } catch (error: any) {
      console.error('Error during accessibility scan:', error);
      return res.status(500).json({ success: false, message: `Accessibility scan failed: ${error.message}`, error: error.toString() });
    } finally {
      // IMPORTANT: Close the checker to free up resources (like Puppeteer instances it launched)
      try {
        await accessibilityChecker.close();
        console.log("Accessibility checker closed successfully.");
      } catch (closeError: any) {
        console.error("Error closing accessibility checker:", closeError);
      }
    }
  }

  if (!report && servicesToScan?.accessibility) {
    // This case means accessibility was requested, but the report is still undefined
    // (perhaps an error occurred before report generation but was caught differently)
    return res.status(500).json({ success: false, message: 'Accessibility scan was requested but report is unavailable.' });
  }

  console.log('Sending final response');
  // Return a success response
  res.status(200).json({
    success: true,
    message: report ? `Accessibility scan completed for URL: ${url}` : `Scan request processed for URL: ${url}. Accessibility scan not requested or no report generated.`,
    data: {
        url,
        services: servicesToScan,
        report, // This is the scan report from accessibility-checker
        creditDeductionStatus // Add this new field
    },
  });
}
