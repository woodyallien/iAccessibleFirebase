
"use client";

import React from 'react';
import type { Notification, NotificationType } from '@/types';
import { cn } from '@/lib/utils';
import { Info, CheckCircle2, AlertTriangle, XCircle, ScanEye, Coins, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void; // Callback to dismiss/remove notification
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />;
    case 'scan_complete':
      return <ScanEye className="h-5 w-5 text-primary" aria-hidden="true" />;
    case 'credits':
      return <Coins className="h-5 w-5 text-amber-600" aria-hidden="true" />;
    default:
      return <Info className="h-5 w-5 text-muted-foreground" aria-hidden="true" />;
  }
};

// Basic relative time formatter (for demo purposes)
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return then.toLocaleDateString();
};

export function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const handleItemClick = () => {
    // In a real app, mark as read and navigate if link exists
    console.log(`Notification ${notification.id} clicked. Read: ${notification.read}. Link: ${notification.link}`);
    // Mark as read (state update would happen in parent)
    if (notification.link) {
      // window.location.href = notification.link; // Or use Next.js router
    }
  };

  const handleDismissClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent item click when dismissing
    onDismiss(notification.id);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 hover:bg-accent/50 transition-colors rounded-md",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        notification.link ? "cursor-pointer" : "cursor-default"
      )}
      onClick={handleItemClick}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(); }}
      aria-label={`Notification: ${notification.message}. ${notification.read ? 'Read.' : 'Unread.'} Received ${formatRelativeTime(notification.timestamp)}.`}
    >
      {!notification.read && (
        <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 shrink-0" aria-label="Unread notification"></div>
      )}
      <div className={cn("shrink-0 mt-0.5", notification.read && "ml-4")}>
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-grow space-y-0.5">
        <p className={cn("text-sm text-foreground", !notification.read && "font-semibold")}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(notification.timestamp)}
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={handleDismissClick}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dismiss</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

NotificationItem.displayName = "NotificationItem";
