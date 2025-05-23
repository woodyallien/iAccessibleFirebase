
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScanLine, Zap, Settings2, Save, FileTextIcon, Info, ScanSearch } from "lucide-react";
import Image from "next/image";
import React, { useState } from 'react';
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCredits } from "@/contexts/credit-context"; 
import Link from "next/link";

// Placeholder for credit cost. In a real app, this would be fetched from config or backend.
const WEB_PAGE_SCAN_COST = 10;

export default function AdHocWebScanPage() {
  const { creditBalance, deductCredits } = useCredits(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlToScan, setUrlToScan] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for scan service checkboxes
  const [scanServiceAccessibility, setScanServiceAccessibility] = useState(true);
  const [scanServiceReadability, setScanServiceReadability] = useState(true);
  const [scanServiceSEO, setScanServiceSEO] = useState(true);
  const [scanServicePageHealth, setScanServicePageHealth] = useState(true);

  const handleScanAttempt = () => {
    setError(null);
    if (!urlToScan.trim() || !urlToScan.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://.");
      return;
    }
    // Log selected services (for future use)
    console.log("Selected services for report:", {
      accessibility: scanServiceAccessibility,
      readability: scanServiceReadability,
      seo: scanServiceSEO,
      pageHealth: scanServicePageHealth,
    });
    setIsModalOpen(true);
  };

  const performActualScan = () => {
    setIsModalOpen(false);
    setIsScanning(true);
    setScanResult(null);
    
    deductCredits(WEB_PAGE_SCAN_COST);
    console.log(`Scanning URL: ${urlToScan}. Deducted ${WEB_PAGE_SCAN_COST} credits.`);
    // Log selected services (for future use when generating actual report)
    console.log("Scan initiated with selected services:", {
      accessibility: scanServiceAccessibility,
      readability: scanServiceReadability,
      seo: scanServiceSEO,
      pageHealth: scanServicePageHealth,
    });
    
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(`Scan for ${urlToScan} completed. Issues found: 5 Critical, 12 Warnings. Full report details (filtered by your selections) would appear here.`);
    }, 2000);
  };

  const handleSaveReport = () => {
    console.log("Saving report for:", urlToScan, scanResult);
    alert("Report saved (simulation)!");
  };

  const handleTopUp = () => {
    setIsModalOpen(false);
    window.location.href = '/settings#credits-subscription'; 
  };

  const handleUpgrade = () => {
    setIsModalOpen(false);
    window.location.href = '/settings#credits-subscription';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Ad Hoc Accessibility Scans</h1>
        <Link href="/domain-scan/add" passHref>
          <Button variant="outline">
            <ScanSearch className="mr-2 h-4 w-4" /> Monitor & Scan Full Domains
          </Button>
        </Link>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-primary" aria-hidden="true"/>
            Scan a Single Web Page
          </CardTitle>
          <CardDescription>
            Enter a URL to perform an on-demand accessibility check. This scan will use {WEB_PAGE_SCAN_COST} credit(s).
            You currently have {creditBalance} credit(s).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="url-input" className="text-base font-medium">Web Page URL</Label>
            <Input 
              id="url-input" 
              type="url" 
              placeholder="https://example.com/page" 
              className="mt-1" 
              aria-describedby="url-input-description"
              value={urlToScan}
              onChange={(e) => setUrlToScan(e.target.value)}
              disabled={isScanning}
            />
            <p id="url-input-description" className="text-sm text-muted-foreground mt-1">
              Ensure the URL is publicly accessible.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-options">
              <AccordionTrigger>
                <Settings2 className="mr-2 h-4 w-4" /> Select Scan Services & Options
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm font-medium text-foreground mb-2">Choose services to include in this scan:</p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="scanServiceAccessibility" 
                      checked={scanServiceAccessibility} 
                      onCheckedChange={(checked) => setScanServiceAccessibility(Boolean(checked))}
                      aria-labelledby="scanServiceAccessibility-label"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="scanServiceAccessibility" id="scanServiceAccessibility-label" className="font-medium cursor-pointer">
                        Web Accessibility (WCAG)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Checks against WCAG 2.1/2.2 guidelines.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="scanServiceReadability" 
                      checked={scanServiceReadability} 
                      onCheckedChange={(checked) => setScanServiceReadability(Boolean(checked))}
                      aria-labelledby="scanServiceReadability-label"
                    />
                     <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="scanServiceReadability" id="scanServiceReadability-label" className="font-medium cursor-pointer">
                        Readability Analysis
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Assesses content readability using standard metrics.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="scanServiceSEO" 
                      checked={scanServiceSEO} 
                      onCheckedChange={(checked) => setScanServiceSEO(Boolean(checked))}
                      aria-labelledby="scanServiceSEO-label"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="scanServiceSEO" id="scanServiceSEO-label" className="font-medium cursor-pointer">
                        Core SEO & Metadata
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Checks basic SEO metadata (titles, descriptions, OG tags, etc.).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="scanServicePageHealth" 
                      checked={scanServicePageHealth} 
                      onCheckedChange={(checked) => setScanServicePageHealth(Boolean(checked))}
                      aria-labelledby="scanServicePageHealth-label"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="scanServicePageHealth" id="scanServicePageHealth-label" className="font-medium cursor-pointer">
                        Basic Page Health Checks
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Includes broken link detection and basic image optimization insights.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-3">
                  Note: Deselecting services will tailor your report output. The credit cost for this ad hoc scan remains fixed at {WEB_PAGE_SCAN_COST} credit(s) for the MVP.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button variant="default" size="lg" onClick={handleScanAttempt} disabled={isScanning || !urlToScan.trim()}>
            {isScanning ? (
              <>
                <svg aria-hidden="true" className="w-5 h-5 mr-2 animate-spin text-primary-foreground fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                Scanning...
              </>
            ) : (
              <>Scan Page Now <Zap className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </CardContent>
      </Card>

      {scanResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-6 w-6 text-primary" />
              Scan Results (Temporary View)
            </CardTitle>
            <CardDescription>This is a temporary report view for your ad hoc scan. Save it to retain access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default">
              <AlertTitle>Scan Completed</AlertTitle>
              <AlertDescription>{scanResult}</AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleSaveReport} variant="outline">
                <Save className="mr-2 h-4 w-4" /> Save Report to History
              </Button>
              <Button variant="outline" disabled>Export (Coming Soon)</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              If not saved, these results may be lost after navigating away.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg mt-4">
        <CardHeader>
          <CardTitle>Understanding Your Results</CardTitle>
          <CardDescription>
            Our automated checks cover many common accessibility issues based on WCAG guidelines. 
            However, manual testing is crucial for comprehensive compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What We Check:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Contrast Ratios</li>
              <li>Missing Alt Text for Images</li>
              <li>Form Label Associations</li>
              <li>Keyboard Navigation</li>
              <li>ARIA Attribute Usage</li>
              <li>And more...</li>
            </ul>
          </div>
           <div className="relative aspect-video rounded-md overflow-hidden">
            <Image 
              src="https://placehold.co/600x338.png" 
              alt="Placeholder image depicting a code scanning process"
              data-ai-hint="code scan"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        </CardContent>
      </Card>

      <CreditConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={performActualScan}
        creditsRequired={WEB_PAGE_SCAN_COST}
        currentCredits={creditBalance}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
    

    