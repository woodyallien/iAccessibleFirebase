
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
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      description: "Overview of your accessible application.",
    },
    {
      title: "Ad Hoc Scans", // Renamed for clarity
      href: "/accessibility-check", // Existing single page scan
      icon: Accessibility, // Keep this for general web accessibility
      description: "Perform single web page or PDF scans.",
    },
    // { // Domain Scan might be a sub-section or a new top-level item post-MVP or if very distinct
    //   title: "Domain Scans",
    //   href: "/domain-scan", // Example path for a dedicated domain scan section
    //   icon: ScanSearch,
    //   description: "Manage and initiate full domain scans."
    // },
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

    