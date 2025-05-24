"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle, MoreVertical, HelpCircle, Info, FileText, Accessibility, FileScan, ScanLine } from "lucide-react";
import { CreditBalanceDisplay } from "@/components/credit-balance-display";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import React from 'react';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import { signOut } from 'firebase/auth'; // Import signOut
import { auth } from '@/lib/firebase/config'; // Import auth
import { useRouter } from 'next/navigation'; // Import useRouter
import { useToast } from '@/hooks/use-toast'; // Import useToast
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

const getInitials = (name?: string | null, email?: string | null): string => {
  if (name) {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "";
};

export function Header() {
  const { currentUser, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out Successfully",
        description: "You have been signed out.",
      });
      router.push('/auth/sign-in');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign Out Failed",
        description: "An error occurred during sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const initials = currentUser ? getInitials(currentUser.displayName, currentUser.email) : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"> {/* Changed items-start back to items-center */}
        <div className="flex items-center gap-2"> {/* Removed pt-1 sm:pt-0 */}
          <SidebarTrigger className="md:hidden" aria-label="Open navigation menu"/>
        </div>

        <div className="flex items-center gap-x-1 sm:gap-x-2">
          {/* Conditionally render CreditBalanceDisplay and NotificationDropdown */}
          {!isLoading && isAuthenticated && (
            <>
              <CreditBalanceDisplay />
              <NotificationDropdown />
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More options">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Navigate to Help/Documentation")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help/Documentation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Navigate to Platform Status")}>
                <Info className="mr-2 h-4 w-4" />
                Platform Status
              </DropdownMenuItem>
              <Link href="/changelog" passHref legacyBehavior>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a>
                    <FileText className="mr-2 h-4 w-4" />
                    View Changelog
                  </a>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {/* Conditionally render User Dropdown Menu */}
          {!isLoading && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person" />
                    <AvatarFallback>
                      {initials ? initials : <UserCircle className="h-6 w-6" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {currentUser?.displayName || currentUser?.email || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <Link href="/settings" passHref legacyBehavior>
                  <DropdownMenuItem asChild className="cursor-pointer"><a>Settings</a></DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Optional: Show Sign In/Sign Up buttons or nothing if not authenticated and not loading
            // For now, we'll just hide the user menu
            isLoading ? (
              // Show a loading state for the user section if needed
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
            ) : (
              // Show nothing or alternative UI if not authenticated
              null
            )
          )}
        </div>
      </div>
    </header>
  );
}
Header.displayName = "Header";
