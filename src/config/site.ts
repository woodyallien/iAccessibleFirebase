
import type { NavItem } from "@/types";
import { LayoutDashboard, Settings, Accessibility, FileText, FileScan } from "lucide-react"; // Added FileText, FileScan

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  sidebarNav: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "iAccessible",
  description: "An MVP focused on accessibility, built with Next.js and ShadCN UI.",
  url: "https://example.com", // Replace with your actual URL
  ogImage: "https://example.com/og.jpg", // Replace with your actual OG image URL
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      description: "Overview of your accessible application.",
    },
    {
      title: "Accessibility Check",
      href: "/accessibility-check",
      icon: Accessibility,
      description: "Scan a web page for accessibility issues.",
    },
    {
      title: "PDF Scan",
      href: "/pdf-scan",
      icon: FileScan,
      description: "Scan a PDF document for accessibility issues.",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: FileText,
      description: "View and generate accessibility reports.",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Manage your application settings and preferences.",
    },
  ],
};
