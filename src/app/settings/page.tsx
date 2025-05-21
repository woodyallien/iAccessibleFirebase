"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle"; // Import the ThemeToggle we created
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Fingerprint, Palette, Bell } from "lucide-react";

export default function SettingsPage() {
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
            {/* This is where the theme toggle is used */}
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
    </div>
  );
}
