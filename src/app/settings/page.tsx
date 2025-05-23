
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button"; // Added buttonVariants
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
  Lock,
  KeyRound,
  ShieldCheck,
  Power, 
  LogOut, 
  Download, 
  Trash2, 
  AlertTriangle 
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditConfirmationModal } from "@/components/credit-confirmation-modal"; 
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"; 
import React, { useState, useEffect } from 'react';
import { useCredits } from "@/contexts/credit-context"; 
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils"; // Added cn import


// --- Placeholder Data (In a real app, fetch from backend/user data) ---
const USER_SUBSCRIPTION_TIER_NAME = "Pro Plan"; 
const MONTHLY_CREDIT_ALLOWANCE = 1000; 
const IS_SUBSCRIPTION_HAS_ALLOWANCE = true;
const IS_SUBSCRIPTION_HAS_RESET_DATE = true;
const IS_TOP_UP_FEATURE_ENABLED = true;
const IS_USER_NOT_ON_HIGHEST_TIER = true;
const IS_EMAIL_PASSWORD_ACCOUNT = true; 
const IS_GOOGLE_LINKED = true; 
const USER_GOOGLE_EMAIL = "user@gmail.com"; 
// --- End Placeholder Data ---

export default function SettingsPage() {
  const { creditBalance } = useCredits(); 

  const [nextResetDate, setNextResetDate] = useState<string | null>(null);
  const [userName, setUserName] = useState("Demo User"); 
  const userEmail = "demo@example.com"; 

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // State for general confirmation modals
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalTitle, setActionModalTitle] = useState("");
  const [actionModalDescription, setActionModalDescription] = useState("");
  const [actionModalConfirmText, setActionModalConfirmText] = useState("Confirm");
  const [actionModalAction, setActionModalAction] = useState<() => void>(() => {});
  const [actionModalVariant, setActionModalVariant] = useState<"default" | "destructive">("default");


  useEffect(() => {
    const date = new Date();
    const clientNextResetDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    setNextResetDate(clientNextResetDate);
  }, []);

  const handleProfileUpdate = () => {
    console.log("Updating profile with name:", userName);
    alert("Profile update simulated. Check console.");
  };

  const handlePasswordChange = () => {
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
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleGoogleDisconnect = () => {
    if(confirm("Are you sure you want to disconnect your Google account?")) {
        console.log("Disconnecting Google Account...");
        alert("Google account disconnect simulated.");
    }
  };

  const handleLogoutAllDevices = () => {
    setActionModalTitle("Log Out From All Devices?");
    setActionModalDescription("This will sign you out from all other active sessions on other browsers and devices. You will remain logged in on this device.");
    setActionModalConfirmText("Log Out All");
    setActionModalAction(() => () => {
      console.log("Logging out from all devices...");
      alert("Logged out from all devices (simulation).");
      setIsActionModalOpen(false);
    });
    setActionModalVariant("destructive");
    setIsActionModalOpen(true);
  };

  const handleDeleteAccount = () => {
    setActionModalTitle("Delete Account Permanently?");
    setActionModalDescription(
      "This action is irreversible and will permanently delete your account and all associated data, including scan history and reports. This cannot be undone. Are you absolutely sure?"
    );
    setActionModalConfirmText("Yes, Delete My Account");
    setActionModalAction(() => () => {
      console.log("Deleting account...");
      alert("Account deletion initiated (simulation).");
      setIsActionModalOpen(false);
    });
    setActionModalVariant("destructive");
    setIsActionModalOpen(true);
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
          
          <Separator className="my-6" />
          {/* Authentication Methods Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
              Authentication Methods
            </h3>
            <div className="space-y-4">
              {IS_EMAIL_PASSWORD_ACCOUNT && (
                <div className="p-4 border rounded-md bg-muted/30 shadow-sm">
                  <p className="font-medium text-foreground">Email & Password</p>
                  <p className="text-sm text-muted-foreground">Primary authentication method.</p>
                </div>
              )}
              {IS_GOOGLE_LINKED && (
                <div className="p-4 border rounded-md bg-muted/30 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <p className="font-medium text-foreground">Connected with Google</p>
                    <p className="text-sm text-muted-foreground">Signed in as: {USER_GOOGLE_EMAIL}</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleGoogleDisconnect}>Disconnect Google</Button>
                </div>
              )}
            </div>
          </div>
          {/* End Authentication Methods Section */}

          <Separator className="my-6" />
          {/* Two-Factor Authentication Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              Two-Factor Authentication (2FA)
            </h3>
            <Alert variant="default">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Coming Soon!</AlertTitle>
                <AlertDescription>
                Enhance your account security with Two-Factor Authentication. This feature is currently under development and will be available in a future update.
                </AlertDescription>
            </Alert>
          </div>
          {/* End Two-Factor Authentication Section */}
          
          <Separator className="my-6" />
          {/* Account Actions Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Power className="h-5 w-5 text-muted-foreground" />
              Account Actions
            </h3>
            <div className="space-y-4">
              <div>
                <Button variant="outline" onClick={handleLogoutAllDevices} className="w-full sm:w-auto">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out from All Other Devices
                </Button>
                <p className="text-sm text-muted-foreground mt-1">
                  This will sign you out from all active sessions except the current one.
                </p>
              </div>

              <Alert variant="default" className="mt-4">
                <Download className="h-4 w-4" />
                <AlertTitle>Export Your Data (Coming Soon)</AlertTitle>
                <AlertDescription>
                  Functionality to export your account data, scan history, and reports will be available here in a future update.
                </AlertDescription>
              </Alert>

              <div>
                <Button variant="destructive" onClick={handleDeleteAccount} className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
                 <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete your account and all associated data. This action is irreversible.
                </p>
              </div>
            </div>
          </div>
          {/* End Account Actions Section */}

        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="default" disabled>Save All Settings (Disabled)</Button>
      </div>

      {/* General Action Confirmation Modal */}
      <AlertDialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {actionModalVariant === "destructive" && <AlertTriangle className="h-6 w-6 text-destructive" />}
              {actionModalTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="py-2 text-base">
              {actionModalDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsActionModalOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={actionModalAction} className={cn(actionModalVariant === "destructive" && buttonVariants({variant: "destructive"}))}>
              {actionModalConfirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CreditConfirmationModal is kept for completeness if other parts of settings page might need it */}
      {/* 
      <CreditConfirmationModal
        isOpen={isCreditModalOpen} // Placeholder if settings actions required credits
        onClose={() => setIsCreditModalOpen(false)}
        onConfirm={() => {}} // Placeholder
        creditsRequired={0} // Placeholder
        currentCredits={creditBalance}
        onTopUp={() => {
          setIsCreditModalOpen(false);
          const topUpSection = document.getElementById('credits-subscription');
          if (topUpSection) topUpSection.scrollIntoView({ behavior: 'smooth' });
        }}
        onUpgrade={() => {
          setIsCreditModalOpen(false);
           const topUpSection = document.getElementById('credits-subscription');
          if (topUpSection) topUpSection.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      */}
    </div>
  );
}

    