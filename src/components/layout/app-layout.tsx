"use client";

import type React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Header } from "./header";
import { SidebarNav } from "./sidebar-nav";
import { Toaster } from "@/components/ui/toaster";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
AppLayout.displayName = "AppLayout";
