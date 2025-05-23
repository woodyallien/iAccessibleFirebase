
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
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LogOut, UserCircle, ScanLine, FileScan, ChevronDown, Accessibility, MoreVertical, HelpCircle, Info, FileText } from "lucide-react";
import { CreditBalanceDisplay } from "@/components/credit-balance-display";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import React from 'react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" aria-label="Open navigation menu"/>
          {/* Logo removed from here */}
        </div>

        <div className="flex items-center gap-x-1 sm:gap-x-2">
          <Menubar className="rounded-md border-none p-0 h-9 bg-transparent shadow-none">
            <MenubarMenu>
              <MenubarTrigger asChild>
                 <Button variant="outline" size="sm">
                    <ScanLine className="h-4 w-4 mr-2" />
                    Scan
                    <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                  </Button>
              </MenubarTrigger>
              <MenubarContent align="end" className="w-56">
                <DropdownMenuLabel>Start a New Scan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/accessibility-check" passHref legacyBehavior>
                  <MenubarItem asChild className="cursor-pointer">
                    <a>
                      <Accessibility className="mr-2 h-4 w-4" />
                      Scan a Single Web Page
                    </a>
                  </MenubarItem>
                </Link>
                {/* PDF Scan option can be added here if needed in menubar later */}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <CreditBalanceDisplay /> 
          <NotificationDropdown />

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
                <DropdownMenuItem asChild className="cursor-pointer"><a>Settings</a></DropdownMenuItem>
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
