
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScanLine, Zap, Settings2, Save, FileTextIcon, Info } from "lucide-react";
import Image from "next/image";
import React, { useState } from 'react';
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdHocWebScanPage() {
  const currentUserCredits = 20; 
  const scanCreditsRequired = 10; // Credits for web page scan

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlToScan, setUrlToScan] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScanAttempt = () => {
    setError(null);
    if (!urlToScan.trim() || !urlToScan.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://.");
      return;
    }
    setIsModalOpen(true);
  };

  const performActualScan = () => {
    setIsModalOpen(false);
    setIsScanning(true);
    setScanResult(null);
    console.log(`Scanning URL: ${urlToScan}. This would deduct ${scanCreditsRequired} credits.`);
    
    // Simulate API call for scanning
    setTimeout(() => {
      setIsScanning(false);
      // Simulate a result
      setScanResult(`Scan for ${urlToScan} completed. Issues found: 5 Critical, 12 Warnings. Full report details would appear here.`);
      // In a real app, you'd deduct credits here or in the backend
      // setcurrentUserCredits(prev => prev - scanCreditsRequired)
    }, 2000);
  };

  const handleSaveReport = () => {
    console.log("Saving report for:", urlToScan, scanResult);
    // In a real app, this would save the report to user's history/database
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
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Scan a Single Web Page</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-primary" aria-hidden="true"/>
            New Web Page Scan
          </CardTitle>
          <CardDescription>
            Enter a URL to perform an on-demand accessibility check. This scan will use {scanCreditsRequired} credit(s).
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
                <Settings2 className="mr-2 h-4 w-4" /> Advanced Options (Coming Soon)
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground p-4">
                  Future options like specifying viewport size, user agent, or wait times before scanning will appear here.
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
              {/* Placeholder for export options */}
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
        creditsRequired={scanCreditsRequired}
        currentCredits={currentUserCredits}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
