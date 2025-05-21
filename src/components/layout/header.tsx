
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle, ScanLine, FileScan, ChevronDown, Accessibility } from "lucide-react";
import { Logo } from "./logo";
import { CreditBalanceDisplay } from "@/components/credit-balance-display";

export function Header() {
  const placeholderCredits = 20; // Example initial credits

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" aria-label="Open navigation menu"/>
          <div className="hidden md:block">
            <Logo size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ScanLine className="h-4 w-4 mr-2" />
                Quick Scan
                <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Start a New Scan</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/accessibility-check" passHref legacyBehavior>
                  <DropdownMenuItem asChild>
                    <a>
                      <Accessibility className="mr-2 h-4 w-4" />
                      Scan Web Page
                    </a>
                  </DropdownMenuItem>
                </Link>
                <Link href="/pdf-scan" passHref legacyBehavior>
                  <DropdownMenuItem asChild>
                    <a>
                      <FileScan className="mr-2 h-4 w-4" />
                      Scan PDF Document
                    </a>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <CreditBalanceDisplay credits={placeholderCredits} /> 
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person" />
                  <AvatarFallback>
                    <UserCircle className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <Link href="/settings" passHref legacyBehavior>
                <DropdownMenuItem asChild><a>Settings</a></DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
Header.displayName = "Header";
