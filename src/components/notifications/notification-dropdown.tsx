
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import type { Notification } from '@/types';
import { NotificationItem } from './notification-item';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for notifications
const initialMockNotifications: Notification[] = [
  { id: '1', type: 'scan_complete', message: 'Your scan for example.com is complete.', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), read: false, link: '/reports/123' },
  { id: '2', type: 'credits', message: 'Your monthly credits have been refilled.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false },
  { id: '3', type: 'warning', message: 'Scheduled scan for mysite.org failed to start.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: '4', type: 'info', message: 'A new feature "AI Insights" is now available!', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: '5', type: 'error', message: 'Failed to process payment. Please update your billing details.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), read: false, link: '/settings#billing' },
];


export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(initialMockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const router = useRouter(); // Initialize router

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // In a real app, this would also call an API to update backend state.
  };

  const handleViewAllNotifications = () => {
    router.push('/notifications');
  };
  
  const handleDismissNotification = (id: string) => {
    // In the dropdown, dismissing usually means marking as read or removing from this short list
    // For simplicity here, we'll just mark as read. A full implementation might remove it or call an API.
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n ));
    // If you want to remove from dropdown view:
    // setNotifications(prev => prev.filter(n => n.id !== id)); 
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`View notifications. ${unreadCount > 0 ? unreadCount + " unread." : "No unread notifications."}`}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 shadow-xl">
        <DropdownMenuLabel className="flex justify-between items-center px-3 py-2">
          <span className="text-base font-semibold">Notifications</span>
          {unreadCount > 0 && (
             <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs h-auto p-1">
                <CheckCheck className="mr-1 h-3 w-3" /> Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="max-h-80"> {/* Display up to 7 most recent or a fixed height */}
          {notifications.length > 0 ? (
            notifications.slice(0, 7).map((notification) => ( 
              <NotificationItem key={notification.id} notification={notification} onDismiss={handleDismissNotification} />
            ))
          ) : (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No new notifications.
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem onClick={handleViewAllNotifications} className="justify-center py-2 text-sm text-primary hover:text-primary focus:text-primary cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

NotificationDropdown.displayName = "NotificationDropdown";
