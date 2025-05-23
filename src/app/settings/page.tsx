
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
  Lock // Added Lock icon
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal";
import React, { useState, useEffect } from 'react';
import { useCredits } from "@/contexts/credit-context"; 
import { Separator } from "@/components/ui/separator";

// --- Placeholder Data (In a real app, fetch from backend/user data) ---
const USER_SUBSCRIPTION_TIER_NAME = "Pro Plan"; 
const MONTHLY_CREDIT_ALLOWANCE = 1000; 
const IS_SUBSCRIPTION_HAS_ALLOWANCE = true;
const IS_SUBSCRIPTION_HAS_RESET_DATE = true;
const IS_TOP_UP_FEATURE_ENABLED = true;
const IS_USER_NOT_ON_HIGHEST_TIER = true;
const IS_EMAIL_PASSWORD_ACCOUNT = true; // Placeholder for conditional visibility of password section
// --- End Placeholder Data ---

export default function SettingsPage() {
  const { creditBalance } = useCredits(); // Dynamic value from context

  const [nextResetDate, setNextResetDate] = useState<string | null>(null);
  const [userName, setUserName] = useState("Demo User"); // Placeholder for user's full name
  const userEmail = "demo@example.com"; // Placeholder for user's email

  // Password fields state (for stubbed interaction)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");


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

  const handleProfileUpdate = () => {
    // In a real app, this would send data to a backend
    console.log("Updating profile with name:", userName);
    alert("Profile update simulated. Check console.");
  };

  const handlePasswordChange = () => {
    // In a real app, this would call an API to change the password
    console.log("Attempting to change password with:", { currentPassword, newPassword, confirmNewPassword });
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirmation password do not match.");
      return;
    }
    if (newPassword.length < 8) {
        alert("New password must be at least 8 characters long.");
        return;
    }
    alert("Password change simulated. Check console.");
    // Clear fields after attempt
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };


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
            Notifications
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
          {/* Profile Information Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName" className="text-base font-medium">Full Name</Label>
                <Input 
                  id="userName" 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  placeholder="Enter your full name" 
                  className="mt-1"
                  aria-describedby="userName-help"
                />
                <p id="userName-help" className="text-sm text-muted-foreground mt-1">How your name appears in the application.</p>
              </div>
              <div>
                <Label htmlFor="userEmail" className="text-base font-medium">Email Address</Label>
                <Input 
                  id="userEmail" 
                  type="email" 
                  value={userEmail} 
                  readOnly 
                  className="mt-1 bg-muted/50 cursor-not-allowed" 
                  aria-describedby="userEmail-help"
                />
                <p id="userEmail-help" className="text-sm text-muted-foreground mt-1">Your email address cannot be changed here. Contact support for assistance.</p>
              </div>
              <Button onClick={handleProfileUpdate} variant="default">Update Profile</Button>
            </div>
          </div>
          {/* End Profile Information Section */}

          {IS_EMAIL_PASSWORD_ACCOUNT && (
            <>
              <Separator className="my-6" />
              {/* Password Management Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  Password Management
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1" 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1" 
                      aria-describedby="newPassword-help"
                      required 
                    />
                    <p id="newPassword-help" className="text-sm text-muted-foreground mt-1">
                      Minimum 8 characters. Include numbers and symbols for strength.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmNewPassword" 
                      type="password" 
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="mt-1" 
                      required 
                    />
                  </div>
                  <Button onClick={handlePasswordChange} variant="default">Change Password</Button>
                </div>
              </div>
              {/* End Password Management Section */}
            </>
          )}

        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="default" disabled>Save All Settings (Disabled)</Button>
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

    