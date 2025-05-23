
import type { NavItem } from "@/types";
import { LayoutDashboard, Settings, Accessibility, FileText, FileScan, ScanSearch } from "lucide-react"; // Added ScanSearch

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
      title: "Main Dashboard",
      href: "/",
      icon: LayoutDashboard,
      description: "Overview of your accessible application.",
    },
    {
      title: "Ad Hoc Scans",
      href: "/accessibility-check", 
      icon: Accessibility, 
      description: "Perform single web page scans.",
    },
    {
      title: "PDF Scan",
      href: "/pdf-scan",
      icon: FileScan,
      description: "Scan a PDF document for accessibility issues.",
    },
    {
      title: "Add Domain Scan",
      href: "/domain-scan/add",
      icon: ScanSearch,
      description: "Add a new site for comprehensive domain scanning."
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

    