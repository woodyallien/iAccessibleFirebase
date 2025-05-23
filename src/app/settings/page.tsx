
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  ScrollText,
  UserCircle,
  Mail,
  Lock
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal";
import React, { useState, useEffect } from 'react';
import { useCredits } from "@/contexts/credit-context"; 

// --- Placeholder Data (In a real app, fetch from backend/user data) ---
const USER_SUBSCRIPTION_TIER_NAME = "Pro Plan"; 
const MONTHLY_CREDIT_ALLOWANCE = 1000; 
const IS_SUBSCRIPTION_HAS_ALLOWANCE = true;
const IS_SUBSCRIPTION_HAS_RESET_DATE = true;
const IS_TOP_UP_FEATURE_ENABLED = true;
const IS_USER_NOT_ON_HIGHEST_TIER = true;
// --- End Placeholder Data ---

export default function SettingsPage() {
  const { creditBalance } = useCredits(); // Dynamic value from context

  const [nextResetDate, setNextResetDate] = useState<string | null>(null);

  useEffect(() => {
    // Calculate next reset date on the client to avoid hydration issues
    const date = new Date();
    const clientNextResetDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    setNextResetDate(clientNextResetDate);
  }, []);

  // Modal state (remains for potential future use, though not directly used by this refactor for display)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<() => void>(() => {});
  const [modalCreditsRequired, setModalCreditsRequired] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>

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
                <Badge variant="secondary">{USER_SUBSCRIPTION_TIER_NAME}</Badge>
              </li>
              {IS_SUBSCRIPTION_HAS_ALLOWANCE && (
                <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                  <span className="font-medium text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Monthly Credit Allowance:</span>
                  <span>{MONTHLY_CREDIT_ALLOWANCE.toLocaleString()}</span>
                </li>
              )}
              <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                <span className="font-medium text-muted-foreground flex items-center gap-1.5"><Coins className="h-4 w-4" />Remaining Credits:</span>
                <span className="font-semibold text-lg text-primary">{creditBalance.toLocaleString()}</span>
              </li>
              {IS_SUBSCRIPTION_HAS_RESET_DATE && nextResetDate && (
                <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                  <span className="font-medium text-muted-foreground flex items-center gap-1.5"><History className="h-4 w-4" />Credits Reset On:</span>
                  <span>{nextResetDate}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {IS_TOP_UP_FEATURE_ENABLED && (
              <Button variant="default" onClick={() => console.log("Initiate credit purchase flow")}>
                <Coins className="mr-2 h-4 w-4" /> Top-up Credits
              </Button>
            )}
            {IS_USER_NOT_ON_HIGHEST_TIER && (
              <Button variant="outline" onClick={() => console.log("Navigate to subscription upgrade page")}>
                <TrendingUp className="mr-2 h-4 w-4" /> Upgrade Subscription
              </Button>
            )}
          </div>
          
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
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    No credit usage history found. (This is a placeholder)
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableCaption>A summary of your recent credit transactions.</TableCaption>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" aria-hidden="true"/>
            Notifications (Coming Soon)
          </CardTitle>
          <CardDescription>Manage your notification preferences. This feature is under development but will allow you to control in-app and email alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2 p-4 border rounded-lg shadow-sm">
                <h4 className="font-medium text-foreground">In-App Notifications</h4>
                <div className="flex items-center justify-between">
                    <Label htmlFor="inapp-scan-complete" className="text-muted-foreground">Scan Completions</Label>
                    <Switch id="inapp-scan-complete" disabled checked={true} aria-label="Toggle in-app notifications for scan completions (disabled)"/>
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="inapp-credit-warnings" className="text-muted-foreground">Credit Warnings</Label>
                    <Switch id="inapp-credit-warnings" disabled checked={true} aria-label="Toggle in-app notifications for credit warnings (disabled)"/>
                </div>
            </div>
             <div className="space-y-2 p-4 border rounded-lg shadow-sm">
                <h4 className="font-medium text-foreground">Email Notifications</h4>
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-weekly-digest" className="text-muted-foreground">Weekly Digest</Label>
                    <Switch id="email-weekly-digest" disabled aria-label="Toggle email notifications for weekly digest (disabled)"/>
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-security-alerts" className="text-muted-foreground">Security Alerts</Label>
                    <Switch id="email-security-alerts" disabled checked={true} aria-label="Toggle email notifications for security alerts (disabled)"/>
                </div>
            </div>
            <p className="text-sm text-muted-foreground">More granular notification controls are planned for a future update.</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-6 w-6 text-primary" aria-hidden="true"/>
            Account Management
          </CardTitle>
          <CardDescription>Manage your profile details, password, and account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content for account management will be added in subsequent steps */}
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="default" disabled>Save Changes (Disabled)</Button>
      </div>

      {/* CreditConfirmationModal is kept for completeness, though not directly triggered by settings page actions */}
      <CreditConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction}
        creditsRequired={modalCreditsRequired}
        currentCredits={creditBalance} // Uses dynamic creditBalance from context
        onTopUp={() => {
          setIsModalOpen(false);
          const topUpSection = document.getElementById('credits-subscription');
          if (topUpSection) topUpSection.scrollIntoView({ behavior: 'smooth' });
          console.log("Navigate to top-up credits");
        }}
        onUpgrade={() => {
          setIsModalOpen(false);
           const topUpSection = document.getElementById('credits-subscription');
          if (topUpSection) topUpSection.scrollIntoView({ behavior: 'smooth' });
          console.log("Navigate to upgrade subscription");
        }}
      />
    </div>
  );
}

