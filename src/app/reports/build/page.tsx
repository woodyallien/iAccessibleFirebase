
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, PlusCircle, Settings2, Trash2, CalendarIcon, CheckCircle, Info } from "lucide-react";

// Placeholder data
const userScannedDomains = [
  { id: 'domain1', name: 'example.com' },
  { id: 'domain2', name: 'shop.example.org' },
  { id: 'domain3', name: 'blog.example.co' },
];
const scanTypeOptions = ['Web Accessibility', 'PDF Accessibility', 'Readability', 'Page Health'];
const issueTypeOptions = ['Contrast Error', 'Missing Alt Text', 'Keyboard Trap', 'Empty Link'];
const issueSeverityOptions = ['Critical', 'High', 'Medium', 'Low', 'Informational'];
const reportTemplateOptions = ['Standard Summary Report', 'Detailed Issue Log'];

// Placeholder for tiered access
const isPaidTier = true;
const saveReportConfigFeatureEnabled = isPaidTier;

export default function NewReportConfigurationUI() {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedScanTypes, setSelectedScanTypes] = useState<string[]>([]);
  
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [contentGrouping, setContentGrouping] = useState('');

  const [reportTemplate, setReportTemplate] = useState(reportTemplateOptions[0]);
  const [reportName, setReportName] = useState('');

  const [reportGenerated, setReportGenerated] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleDomainToggle = (domainName: string) => {
    setSelectedDomains(prev => 
      prev.includes(domainName) ? prev.filter(d => d !== domainName) : [...prev, domainName]
    );
  };

  const handleScanTypeToggle = (scanType: string) => {
    setSelectedScanTypes(prev =>
      prev.includes(scanType) ? prev.filter(st => st !== scanType) : [...prev, scanType]
    );
  };
  
  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setReportGenerated(false);
    // Simulate API call
    setTimeout(() => {
      setGeneratingReport(false);
      setReportGenerated(true);
      // In a real app, you'd fetch and display report data here
    }, 1500);
  };

  const handleResetForm = () => {
    setSelectedDomains([]);
    setDateRange(undefined);
    setSelectedScanTypes([]);
    setSelectedIssueTypes([]);
    setSelectedSeverity('');
    setContentGrouping('');
    setReportTemplate(reportTemplateOptions[0]);
    setReportName('');
    setReportGenerated(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
        <PlusCircle className="h-8 w-8 text-primary" /> Build New Custom Report
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary" />1. Select Data Source & Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block">Select Domain(s)</Label>
                <div className="space-y-2 rounded-md border p-3 max-h-40 overflow-y-auto">
                  {userScannedDomains.map(domain => (
                    <div key={domain.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`domain-${domain.id}`}
                        checked={selectedDomains.includes(domain.name)}
                        onCheckedChange={() => handleDomainToggle(domain.name)}
                        aria-label={`Select domain ${domain.name}`}
                      />
                      <Label htmlFor={`domain-${domain.id}`} className="font-normal cursor-pointer">{domain.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="date-range" className="text-base font-medium">Select Scan Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-base font-medium mb-2 block">Scan Types to Include</Label>
                <div className="space-y-2 rounded-md border p-3">
                  {scanTypeOptions.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`scan-type-${type.replace(/\s+/g, '-')}`}
                        checked={selectedScanTypes.includes(type)}
                        onCheckedChange={() => handleScanTypeToggle(type)}
                        aria-label={`Include scan type ${type}`}
                      />
                      <Label htmlFor={`scan-type-${type.replace(/\s+/g, '-')}`} className="font-normal cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary" />2. Filter Issues & Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* For multi-select, Checkbox group in Popover or custom component would be needed. Using single Select for simplicity. */}
              <div>
                <Label htmlFor="issue-type" className="text-base font-medium">Issue Type(s) (Select one for MVP)</Label>
                 <Select onValueChange={(value) => setSelectedIssueTypes(value ? [value] : [])} value={selectedIssueTypes[0] || ""}>
                  <SelectTrigger id="issue-type" className="mt-1">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">Multiple selections will be supported in a future update.</p>
              </div>
              <div>
                <Label htmlFor="issue-severity" className="text-base font-medium">Issue Severity/Priority</Label>
                <Select onValueChange={setSelectedSeverity} value={selectedSeverity}>
                  <SelectTrigger id="issue-severity" className="mt-1">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueSeverityOptions.map(severity => (
                      <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content-grouping" className="text-base font-medium">Content Grouping (URL Path Contains)</Label>
                <Input 
                  id="content-grouping" 
                  value={contentGrouping}
                  onChange={(e) => setContentGrouping(e.target.value)}
                  placeholder="e.g., /blog/ or /products/" 
                  className="mt-1" 
                />
                <p className="text-sm text-muted-foreground mt-1">Filter report data to specific sections of your site.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary" />3. Report Output & Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Report Template</Label>
                <RadioGroup defaultValue={reportTemplate} onValueChange={setReportTemplate} className="mt-1 space-y-1">
                  {reportTemplateOptions.map(template => (
                     <div key={template} className="flex items-center space-x-2">
                        <RadioGroupItem value={template} id={`template-${template.replace(/\s+/g, '-')}`} />
                        <Label htmlFor={`template-${template.replace(/\s+/g, '-')}`} className="font-normal cursor-pointer">{template}</Label>
                      </div>
                  ))}
                </RadioGroup>
              </div>
              {saveReportConfigFeatureEnabled && (
                <div>
                  <Label htmlFor="report-name" className="text-base font-medium">Report Name (Optional, for saving)</Label>
                  <Input 
                    id="report-name" 
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="e.g., Monthly Main Site Audit" 
                    className="mt-1" 
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-end">
            <Button variant="ghost" onClick={handleResetForm} className="sm:order-1">
              <Trash2 className="mr-2 h-4 w-4" /> Cancel / Reset
            </Button>
            {saveReportConfigFeatureEnabled && (
              <Button variant="outline" onClick={() => console.log("Save config clicked")} className="sm:order-2">
                Save Configuration
              </Button>
            )}
            <Button size="lg" onClick={handleGenerateReport} disabled={generatingReport} className="sm:order-3">
              {generatingReport ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </div>

        {/* Report Display Area Placeholder */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md sticky top-24"> {/* Sticky for visibility while scrolling form */}
            <CardHeader>
              <CardTitle>Generated Report</CardTitle>
              <CardDescription>Your report will appear here once generated.</CardDescription>
            </CardHeader>
            <CardContent>
              {generatingReport && (
                 <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <div role="status" aria-live="polite">
                    <svg aria-hidden="true" className="w-8 h-8 mr-2 animate-spin text-primary fill-accent" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Generating report...</span>
                  </div>
                  <p className="ml-2">Generating your report, please wait...</p>
                </div>
              )}
              {!generatingReport && !reportGenerated && (
                <div className="text-center py-10 text-muted-foreground">
                  <Info className="mx-auto h-12 w-12 mb-2" />
                  <p>Configure your report options on the left and click "Generate Report".</p>
                </div>
              )}
              {reportGenerated && (
                <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/30">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-700 dark:text-green-300">Report Generated Successfully!</AlertTitle>
                  <AlertDescription className="text-green-600 dark:text-green-500">
                    <p className="mt-2">Your custom report is ready. In a full implementation, the report content (tables, charts, issue details) would be displayed here.</p>
                    <div className="mt-4 space-x-2">
                      <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export CSV</Button>
                      <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export PDF</Button>
                      <Button variant="outline" size="sm">View HTML Report</Button>
                    </div>
                    <p className="text-xs mt-3">Placeholders for report content and export options.</p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

