
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileScan, Zap, Save, FileTextIcon, Info, AlertTriangle } from "lucide-react";
import React, { useState, ChangeEvent } from 'react';
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdHocPdfScanPage() {
  const currentUserCredits = 20; 
  const pdfScanCreditsRequired = 5; // Credits for PDF scan

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          setSelectedFile(file);
          setFileName(file.name);
        } else {
          setError("File size exceeds 10MB limit.");
          setSelectedFile(null);
          setFileName("");
        }
      } else {
        setError("Invalid file type. Please upload a PDF.");
        setSelectedFile(null);
        setFileName("");
      }
    }
  };

  const handleScanAttempt = () => {
    setError(null);
    if (!selectedFile) {
      setError("Please select a PDF file to scan.");
      return;
    }
    setIsModalOpen(true);
  };

  const performActualScan = () => {
    setIsModalOpen(false);
    setIsScanning(true);
    setScanResult(null);
    console.log(`Scanning PDF: ${selectedFile?.name}. This would deduct ${pdfScanCreditsRequired} credits.`);
    
    // Simulate API call for scanning
    setTimeout(() => {
      setIsScanning(false);
      // Simulate a result
      setScanResult(`Scan for PDF "${selectedFile?.name}" completed. Issues found: 2 Critical, 5 Warnings. Full report details would appear here.`);
      // In a real app, you'd deduct credits here
    }, 2500);
  };

  const handleSaveReport = () => {
    console.log("Saving PDF report for:", selectedFile?.name, scanResult);
    alert("PDF Report saved (simulation)!");
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
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Scan a Single PDF Document</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileScan className="h-6 w-6 text-primary" aria-hidden="true"/>
            New PDF Scan
          </CardTitle>
          <CardDescription>
            Upload a PDF document to perform an on-demand accessibility check. This scan will use {pdfScanCreditsRequired} credit(s). Max file size: 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>File Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="pdf-upload" className="text-base font-medium">Upload PDF File</Label>
            <Input 
              id="pdf-upload" 
              type="file" 
              accept=".pdf"
              className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              onChange={handleFileChange}
              disabled={isScanning}
              aria-describedby="pdf-upload-description"
            />
            {fileName && <p className="text-sm text-muted-foreground mt-1">Selected file: {fileName}</p>}
            <p id="pdf-upload-description" className="text-sm text-muted-foreground mt-1">
              Ensure the PDF is not password protected.
            </p>
          </div>

          <Alert variant="default" className="mt-4">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Note on PDF Scanning</AlertTitle>
            <AlertDescription>
              This PDF appears to be image-based. Full accessibility scanning requires OCR, which is planned for a future update. Results may be limited. (This is a placeholder message, actual detection is not implemented).
            </AlertDescription>
          </Alert>

          <Button variant="default" size="lg" onClick={handleScanAttempt} disabled={isScanning || !selectedFile}>
            {isScanning ? (
              <>
                <svg aria-hidden="true" className="w-5 h-5 mr-2 animate-spin text-primary-foreground fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                Scanning PDF...
              </>
            ) : (
              <>Scan PDF Now <Zap className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </CardContent>
      </Card>

      {scanResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-6 w-6 text-primary" />
              PDF Scan Results (Temporary View)
            </CardTitle>
            <CardDescription>This is a temporary report view for your ad hoc PDF scan. Save it to retain access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default">
              <AlertTitle>Scan Completed</AlertTitle>
              <AlertDescription>{scanResult}</AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleSaveReport} variant="outline">
                <Save className="mr-2 h-4 w-4" /> Save PDF Report
              </Button>
              <Button variant="outline" disabled>Export (Coming Soon)</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              If not saved, these results may be lost after navigating away.
            </p>
          </CardContent>
        </Card>
      )}

      <CreditConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={performActualScan}
        creditsRequired={pdfScanCreditsRequired}
        currentCredits={currentUserCredits}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}

