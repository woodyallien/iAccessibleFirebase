
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { PlusCircle, BarChartBig } from "lucide-react";

// Placeholder for tiered access - in a real app, this would come from user context/API
const isPaidTier = true; 
const isFreeTier = !isPaidTier;
const savedReportsEnabled = isPaidTier; // Example: saved reports only for paid tiers

export default function ReportsLandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChartBig className="h-8 w-8 text-primary" />
          Reports Dashboard
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Create New Report</CardTitle>
          <CardDescription>
            Build custom accessibility reports tailored to your needs or view standard reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPaidTier ? (
            <Link href="/reports/build" passHref>
              <Button variant="default" size="lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Build Custom Report
              </Button>
            </Link>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Upgrade to a paid plan to build and customize detailed reports.
              </p>
              <Link href="/settings#credits-subscription" passHref>
                <Button variant="outline">View Subscription Options</Button>
              </Link>
              {/* Optionally, list some pre-defined free reports here */}
            </div>
          )}
        </CardContent>
      </Card>

      {savedReportsEnabled && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Saved / Recent Reports</CardTitle>
            <CardDescription>
              Access your previously generated or saved report configurations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Date Generated</TableHead>
                  <TableHead>Key Filters</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Placeholder for no data. In a real app, map over saved reports here. */}
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    You have not generated or saved any reports yet.
                  </TableCell>
                </TableRow>
                {/* Example Row (commented out):
                <TableRow>
                  <TableCell>Monthly Blog Audit</TableCell>
                  <TableCell>2024-08-15</TableCell>
                  <TableCell>example.com, /blog/, Critical Severity</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-2">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
                */}
              </TableBody>
              <TableCaption>A list of your saved or recently generated reports.</TableCaption>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
