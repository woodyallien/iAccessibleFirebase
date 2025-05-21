
"use client"; // Added "use client" as we'll use useState for modal

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanLine, Zap } from "lucide-react";
import Image from "next/image";
import React, { useState } from 'react'; // Added React and useState
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal"; // Import the modal

export default function AccessibilityCheckPage() {
  // Placeholder credit balance and required credits - in a real app, this would come from state/context/API
  const currentUserCredits = 5; 
  const scanCreditsRequired = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlToScan, setUrlToScan] = useState("");

  const handleScanAttempt = () => {
    // Basic URL validation (optional, can be more robust)
    if (!urlToScan || !urlToScan.startsWith("http")) {
      // Here you might use a toast notification to inform the user
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    setIsModalOpen(true);
  };

  const performActualScan = () => {
    console.log(`Scanning URL: ${urlToScan}. This would deduct ${scanCreditsRequired} credits.`);
    // Actual scan logic and credit deduction would go here
    // For now, just log and close modal
    setIsModalOpen(false);
    setUrlToScan(""); // Optionally clear the input
  };

  const handleTopUp = () => {
    setIsModalOpen(false);
    // For now, just log. In a real app, navigate to /settings#credits-subscription
    window.location.href = '/settings#credits-subscription'; 
    console.log("User wants to top-up credits.");
  };

  const handleUpgrade = () => {
    setIsModalOpen(false);
    // For now, just log. In a real app, navigate to upgrade page or /settings#credits-subscription
    window.location.href = '/settings#credits-subscription';
    console.log("User wants to upgrade subscription.");
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Accessibility Check</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-primary" aria-hidden="true"/>
            Start a New Scan
          </CardTitle>
          <CardDescription>
            Enter a URL to perform an automated accessibility check. Each scan may consume credits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url-input" className="text-base font-medium">Website URL</Label>
            <Input 
              id="url-input" 
              type="url" 
              placeholder="https://example.com" 
              className="mt-1" 
              aria-describedby="url-input-description"
              value={urlToScan}
              onChange={(e) => setUrlToScan(e.target.value)}
            />
            <p id="url-input-description" className="text-sm text-muted-foreground mt-1">
              Ensure the URL is publicly accessible. This scan will cost {scanCreditsRequired} credit(s).
            </p>
          </div>
          <Button variant="default" size="lg" onClick={handleScanAttempt}>
            Scan Now <Zap className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Scans (Placeholder)</CardTitle>
          <CardDescription>
            A list of your previous accessibility checks will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent scans found.</p>
          {/* Future: Table of recent scans */}
        </CardContent>
      </Card>

      {/* Credit Confirmation Modal Instance */}
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

