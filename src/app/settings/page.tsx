
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, 
  Palette, 
  Bell, 
  WalletCards, 
  Award, 
  CalendarDays, 
  Coins, 
  History,
  ListChecks,
  TrendingUp,
  ScrollText
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal";
import React, { useState, useEffect } from 'react';


export default function SettingsPage() {
  // Placeholder data - in a real app, this would come from user data/API
  const userSubscriptionTierName = "Pro Plan";
  const monthlyAllowanceAmount = 1000;
  const userCreditBalance = 5; // Example, could be dynamic
  
  const [nextResetDate, setNextResetDate] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date();
    setNextResetDate(new Date(date.getFullYear(), date.getMonth() + 1, 1).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const isSubscriptionHasAllowance = true;
  const isSubscriptionHasResetDate = true;
  const isTopUpFeatureEnabled = true;
  const isUserNotOnHighestTier = true;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<() => void>(() => {});
  const [modalCreditsRequired, setModalCreditsRequired] = useState(0);

  // Example action that would trigger the modal
  const handleExampleScanAction = () => {
    const creditsRequired = 10; // Example
    setModalCreditsRequired(creditsRequired);
    setModalAction(() => () => {
      console.log("Scan action confirmed and processed!");
      // Deduct credits, perform scan, etc.
    });
    setIsModalOpen(true);
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>

      {/* Appearance Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" aria-hidden="true" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application. Your preferences are saved locally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4 shadow-sm">
            <div>
              <Label htmlFor="theme-toggle-label" className="text-base font-medium">Theme</Label>
              <p id="theme-description" className="text-sm text-muted-foreground">
                Select your preferred color scheme for the interface.
              </p>
            </div>
            <div id="theme-toggle-label">
              <ThemeToggle />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-size" className="text-base font-medium">Font Size (Coming Soon)</Label>
            <Input id="font-size" type="number" placeholder="Default (16px)" disabled className="max-w-xs" aria-describedby="font-size-description"/>
            <p id="font-size-description" className="text-sm text-muted-foreground">Adjust the base font size for better readability. This feature is under development.</p>
          </div>
        </CardContent>
      </Card>

      {/* Credits & Subscription Card */}
      <Card className="shadow-lg" id="credits-subscription">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletCards className="h-6 w-6 text-primary" aria-hidden="true" />
            Credits & Subscription
          </CardTitle>
          <CardDescription>
            Manage your scan credits and subscription plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-muted-foreground" />
              Current Credit Status
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                <span className="font-medium text-muted-foreground flex items-center gap-1.5"><Award className="h-4 w-4" />Subscription Tier:</span>
                <Badge variant="secondary">{userSubscriptionTierName}</Badge>
              </li>
              {isSubscriptionHasAllowance && (
                <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                  <span className="font-medium text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Monthly Credit Allowance:</span>
                  <span>{monthlyAllowanceAmount.toLocaleString()}</span>
                </li>
              )}
              <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                <span className="font-medium text-muted-foreground flex items-center gap-1.5"><Coins className="h-4 w-4" />Remaining Credits:</span>
                <span className="font-semibold text-lg text-primary">{userCreditBalance.toLocaleString()}</span>
              </li>
              {isSubscriptionHasResetDate && (
                <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                  <span className="font-medium text-muted-foreground flex items-center gap-1.5"><History className="h-4 w-4" />Credits Reset On:</span>
                  <span>{nextResetDate || 'Loading...'}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {isTopUpFeatureEnabled && (
              <Button variant="default" onClick={() => console.log("Initiate credit purchase flow")}>
                <Coins className="mr-2 h-4 w-4" /> Top-up Credits
              </Button>
            )}
            {isUserNotOnHighestTier && (
              <Button variant="outline" onClick={() => console.log("Navigate to subscription upgrade page")}>
                <TrendingUp className="mr-2 h-4 w-4" /> Upgrade Subscription
              </Button>
            )}
          </div>
          
          {/* Example button to trigger the credit confirmation modal */}
          {/* <Button variant="destructive" onClick={handleExampleScanAction} className="mt-4">
            Test Scan Action (10 Credits)
          </Button> */}


          <div>
            <h3 className="text-lg font-semibold mb-3 mt-6 flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-muted-foreground" />
                Recent Credit Usage
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action/Description</TableHead>
                  <TableHead className="text-right">Credits Used</TableHead>
                  <TableHead className="text-right">Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Placeholder for no data. In a real app, map over usage data here. */}
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    No credit usage history found.
                  </TableCell>
                </TableRow>
                {/* Example Row (commented out):
                <TableRow>
                  <TableCell>2024-07-28</TableCell>
                  <TableCell>Website Scan: example.com</TableCell>
                  <TableCell className="text-right">-10</TableCell>
                  <TableCell className="text-right">990</TableCell>
                </TableRow>
                */}
              </TableBody>
              <TableCaption>A summary of your recent credit transactions.</TableCaption>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Notifications Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" aria-hidden="true"/>
            Notifications (Coming Soon)
          </CardTitle>
          <CardDescription>Manage your notification preferences. This feature is under development.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Notification settings will appear here.</p>
        </CardContent>
      </Card>
      
      {/* Account Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-6 w-6 text-primary" aria-hidden="true"/>
            Account (Coming Soon)
          </CardTitle>
          <CardDescription>Manage your account details. This feature is under development.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Account management options will appear here.</p>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="default" disabled>Save Changes (Disabled)</Button>
      </div>

      {/* Credit Confirmation Modal Instance */}
      <CreditConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction}
        creditsRequired={modalCreditsRequired}
        currentCredits={userCreditBalance}
        onTopUp={() => {
          setIsModalOpen(false);
          // In a real app, navigate to top-up section or open a top-up modal
          const topUpSection = document.getElementById('credits-subscription');
          if (topUpSection) topUpSection.scrollIntoView({ behavior: 'smooth' });
          console.log("Navigate to top-up credits");
        }}
        onUpgrade={() => {
          setIsModalOpen(false);
          // In a real app, navigate to upgrade page or open an upgrade modal
           const topUpSection = document.getElementById('credits-subscription');
          if (topUpSection) topUpSection.scrollIntoView({ behavior: 'smooth' });
          console.log("Navigate to upgrade subscription");
        }}
      />
    </div>
  );
}

