
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
};

export type NotificationType = "info" | "success" | "warning" | "error" | "scan_complete" | "credits";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string; // Or Date object, for simplicity using string for mock
  read: boolean;
  link?: string; // Optional link to navigate to on click
}
