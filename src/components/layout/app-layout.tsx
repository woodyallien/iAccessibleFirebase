"use client";

import type React from "react";
import { useEffect } from 'react'; // Import useEffect
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarRail, // Added import for SidebarRail
} from "@/components/ui/sidebar";
import { Header } from "./header";
import { SidebarNav } from "./sidebar-nav";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from 'lucide-react'; // Import Loader2
import { useAuth } from '../../contexts/auth-context'; // Import useAuth
import { useRouter } from 'next/navigation'; // Import useRouter


interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // The redirect useEffect handles the !isAuthenticated case,
  // but we can also prevent rendering the layout if not authenticated and not loading.
  if (!isAuthenticated) {
      return null; // Or a minimal redirecting message, useEffect handles the redirect
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarRail /> {/* Added SidebarRail component */}
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
