
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "./logo";
import { Separator } from "../ui/separator";

export function SidebarNav() {
  const pathname = usePathname();
  const navItems = siteConfig.sidebarNav;

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 group-data-[collapsible=icon]:p-2 transition-all duration-200 ease-linear">
        <Logo />
      </div>
      <Separator className="mb-2" />
      <ScrollArea className="flex-1 px-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.title,
                    "aria-label": item.description || item.title,
                   }}
                  aria-current={pathname === item.href ? "page" : undefined}
                  aria-label={item.description || item.title}
                >
                  <a> {/* <a> tag is required by asChild with next/link legacyBehavior */}
                    <item.icon aria-hidden="true" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </ScrollArea>
    </div>
  );
}
SidebarNav.displayName = "SidebarNav";
