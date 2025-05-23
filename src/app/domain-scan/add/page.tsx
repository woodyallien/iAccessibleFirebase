
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ScanSearch, CalendarClock, AlertCircle, PlusCircle, Wand2 } from "lucide-react";
import React, { useState } from 'react';
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal";
import { useCredits } from "@/contexts/credit-context";

// Placeholder for credit cost. In a real app, this might be dynamic or fetched.
const DOMAIN_SCAN_ESTIMATED_COST = 50; 
// Placeholder for feature flags
const isPaidTierWithScheduling = true; 
const MVP_PAGE_LIMIT = 1500;

export default function AddNewMonitoredSitePage() {
  const { creditBalance, deductCredits } = useCredits();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startingUrl, setStartingUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [scanFrequency, setScanFrequency] = useState("scan_once");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null); // Placeholder for result
  const [error, setError] = useState<string | null>(null);

  const handleAddSiteAttempt = () => {
    setError(null);
    if (!startingUrl.trim() || !startingUrl.startsWith("http")) {
      setError("Please enter a valid starting URL (e.g., https://example.com).");
      return;
    }
    setIsModalOpen(true);
  };

  const performActualDomainScan = () => {
    setIsModalOpen(false);
    setIsScanning(true);
    setScanResult(null);
    
    deductCredits(DOMAIN_SCAN_ESTIMATED_COST);
    console.log(`Initiating domain scan for: ${startingUrl}. Site Name: ${siteName}. Frequency: ${scanFrequency}. Deducted ~${DOMAIN_SCAN_ESTIMATED_COST} credits.`);
    
    // Simulate API call for domain scanning
    setTimeout(() => {
      setIsScanning(false);
      // In a real app, you'd redirect to a page showing scan progress or the newly added site in a list
      setScanResult(`Domain scan for ${startingUrl} initiated successfully. It will be processed in the background. You can monitor its progress in the 'Monitored Sites' list (coming soon).`); 
    }, 3000);
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ScanSearch className="h-8 w-8 text-primary" />
          Add New Site for Domain Scanning
        </h1>
      </div>
      <CardDescription>
        Add a website to continuously monitor its accessibility or perform a one-time full domain scan.
      </CardDescription>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {scanResult && (
        <Alert variant="default" className="mt-2">
          <Info className="h-4 w-4" />
          <AlertTitle>Scan Initiated</AlertTitle>
          <AlertDescription>{scanResult}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Site Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="starting-url" className="text-base font-medium">Website Starting URL <span className="text-destructive">*</span></Label>
            <Input 
              id="starting-url" 
              type="url" 
              placeholder="https://example.com" 
              className="mt-1"
              value={startingUrl}
              onChange={(e) => setStartingUrl(e.target.value)}
              disabled={isScanning}
              aria-describedby="starting-url-help"
              required
            />
            <p id="starting-url-help" className="text-sm text-muted-foreground mt-1">
              The crawler will start from this URL and discover linked pages within the same domain.
            </p>
          </div>
          <div>
            <Label htmlFor="site-name" className="text-base font-medium">Site Name / Label (Optional)</Label>
            <Input 
              id="site-name" 
              type="text" 
              placeholder="e.g., My Company Website" 
              className="mt-1"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              disabled={isScanning}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Scan Configuration (MVP)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>MVP Scan Limit</AlertTitle>
            <AlertDescription>
              Up to <strong>{MVP_PAGE_LIMIT.toLocaleString()} pages</strong> will be crawled and analyzed per domain scan during the MVP.
            </AlertDescription>
          </Alert>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>JavaScript Rendering</AlertTitle>
            <AlertDescription>
              JavaScript rendering is <strong>NOT</strong> enabled for MVP scans. Results may be affected for JS-heavy sites.
            </AlertDescription>
          </Alert>
          <div className="p-4 border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Scan Depth / Specific Path Inclusions (Coming Soon)
            </p>
          </div>
        </CardContent>
      </Card>

      {isPaidTierWithScheduling && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Scheduling
            </CardTitle>
            <CardDescription>Set how often you want this site to be scanned.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={scanFrequency} onValueChange={setScanFrequency} disabled={isScanning}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scan_once" id="scan-once" />
                <Label htmlFor="scan-once" className="font-normal">Scan Once Now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="scan-monthly" />
                <Label htmlFor="scan-monthly" className="font-normal">Monthly Automated Scan (Basic)</Label>
              </div>
              {/* Add more options like Weekly, Daily post-MVP */}
            </RadioGroup>
          </CardContent>
        </Card>
      )}
      
      <Card className="shadow-lg border-primary/20 bg-primary/5">
        <CardHeader>
             <CardTitle className="text-primary">Confirm and Initiate Scan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <AlertDescription>
                Initiating a new domain scan will use approximately <strong className="text-foreground">{DOMAIN_SCAN_ESTIMATED_COST}</strong> credit(s). 
                You currently have <strong className="text-foreground">{creditBalance}</strong> credit(s) remaining.
            </AlertDescription>
            <Button 
                variant="default" 
                size="lg" 
                onClick={handleAddSiteAttempt} 
                disabled={isScanning || !startingUrl.trim()}
                className="w-full sm:w-auto"
            >
                {isScanning ? (
                <>
                    <svg aria-hidden="true" className="w-5 h-5 mr-2 animate-spin text-primary-foreground fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    Initiating Scan...
                </>
                ) : (
                <> <PlusCircle className="mr-2 h-5 w-5" />Add Site & Start Initial Scan</>
                )}
            </Button>
        </CardContent>
      </Card>

      <CreditConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={performActualDomainScan}
        creditsRequired={DOMAIN_SCAN_ESTIMATED_COST}
        currentCredits={creditBalance}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}

    