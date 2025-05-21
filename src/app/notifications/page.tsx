
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { BellRing, Filter, Trash2, CheckCheck, ListChecks, CalendarIcon } from "lucide-react";
import type { Notification } from '@/types';
import { NotificationItem } from '@/components/notifications/notification-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Expanded mock data for the history page
const allMockNotifications: Notification[] = [
  { id: '1', type: 'scan_complete', message: 'Your scan for example.com is complete.', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), read: false, link: '/reports/123' },
  { id: '2', type: 'credits', message: 'Your monthly credits have been refilled.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: true },
  { id: '3', type: 'warning', message: 'Scheduled scan for mysite.org failed to start.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: '4', type: 'info', message: 'A new feature "AI Insights" is now available!', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: '5', type: 'error', message: 'Failed to process payment. Please update your billing details.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: false, link: '/settings#billing' },
  { id: '6', type: 'scan_complete', message: 'PDF scan for "Annual_Report.pdf" succeeded.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), read: false, link: '/reports/456' },
  { id: '7', type: 'credits', message: 'You are running low on credits. Only 10 remaining.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), read: false, link: '/settings#credits-subscription'},
  { id: '8', type: 'info', message: 'Platform maintenance scheduled for Sunday at 2 AM.', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: '9', type: 'warning', message: 'API key for integration X is expiring in 7 days.', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), read: false},
  { id: '10', type: 'success', message: 'Subscription plan successfully upgraded to Pro.', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), read: true},
  { id: '11', type: 'info', message: 'Your report "Monthly Audit" is ready to view.', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), read: false, link: '/reports/789' },
  { id: '12', type: 'scan_complete', message: 'Scan for newdomain.com finished with 2 critical issues.', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), read: true, link: '/reports/012' },
];

const ITEMS_PER_PAGE = 7;

export default function FullNotificationHistoryPage() {
  const [notifications, setNotifications] = useState<Notification[]>(allMockNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState(''); // Placeholder for date filter
  const [dateTo, setDateTo] = useState(''); // Placeholder for date filter
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNotifications = notifications
    .filter(n => filterType === 'all' || n.type === filterType)
    .filter(n => filterStatus === 'all' || (filterStatus === 'read' && n.read) || (filterStatus === 'unread' && !n.read));
    // Date filtering logic would go here

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDismissNotification = (id: string) => {
    // For history page, dismissing could mean marking as read or just hiding from view if not deleting.
    // Here, we'll just mark as read as an example.
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
    console.log(`Dismissed/marked as read notification ${id} from history page.`);
  };

  const handleSelectNotification = (id: string, checked: boolean) => {
    setSelectedNotifications(prev =>
      checked ? [...prev, id] : prev.filter(nid => nid !== id)
    );
  };

  const handleSelectAllOnPage = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...new Set([...prev, ...paginatedNotifications.map(n => n.id)])]);
    } else {
      const pageIds = paginatedNotifications.map(n => n.id);
      setSelectedNotifications(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };
  
  const isAllSelectedOnPage = paginatedNotifications.length > 0 && paginatedNotifications.every(n => selectedNotifications.includes(n.id));

  const handleMarkSelectedAsRead = () => {
    setNotifications(prev =>
      prev.map(n => (selectedNotifications.includes(n.id) ? { ...n, read: true } : n))
    );
    setSelectedNotifications([]);
  };

  const handleDeleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BellRing className="h-8 w-8 text-primary" />
          All Notifications
        </h1>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5 text-primary" />Filter Notifications</CardTitle>
          <CardDescription>Refine the list by type, status, or date range.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="filter-type" className="text-sm font-medium">Type</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="scan_complete">Scan Complete</SelectItem>
                <SelectItem value="credits">Credits</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="filter-status" className="text-sm font-medium">Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filter-status"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date Range (Coming Soon)</label>
            <div className="flex items-center gap-2">
              <Input type="text" placeholder="From" disabled className="text-sm"/>
              <span className="text-muted-foreground">-</span>
              <Input type="text" placeholder="To" disabled className="text-sm"/>
              <Button variant="outline" size="icon" disabled><CalendarIcon className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" />Notification List</CardTitle>
            <CardDescription>Showing {paginatedNotifications.length} of {filteredNotifications.length} notifications. Page {currentPage} of {totalPages}.</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleMarkSelectedAsRead} disabled={selectedNotifications.length === 0}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark as Read ({selectedNotifications.length})
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={selectedNotifications.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedNotifications.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {paginatedNotifications.length > 0 ? (
            <>
              <div className="flex items-center px-4 py-3 border-b bg-muted/30">
                <Checkbox
                  id="select-all-page"
                  checked={isAllSelectedOnPage}
                  onCheckedChange={(checked) => handleSelectAllOnPage(Boolean(checked))}
                  aria-label="Select all notifications on this page"
                  className="mr-3"
                />
                <label htmlFor="select-all-page" className="text-sm font-medium cursor-pointer">Select all on page</label>
              </div>
              <ScrollArea className="h-[calc(100vh-480px)] min-h-[300px]"> {/* Adjust height dynamically or set a fixed one */}
                <div className="divide-y divide-border">
                  {paginatedNotifications.map(notification => (
                    <div key={notification.id} className="flex items-center hover:bg-muted/20 transition-colors">
                       <Checkbox
                          id={`select-${notification.id}`}
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={(checked) => handleSelectNotification(notification.id, Boolean(checked))}
                          aria-labelledby={`notification-message-${notification.id}`}
                          className="mx-4 shrink-0"
                        />
                      <div className="flex-grow" id={`notification-message-${notification.id}`}>
                        <NotificationItem
                          notification={notification}
                          onDismiss={handleDismissNotification}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <BellRing className="mx-auto h-16 w-16 mb-4 text-primary/20" />
              <p className="text-xl font-medium">No notifications match your filters.</p>
              <p className="text-sm">Try adjusting or clearing your filters.</p>
            </div>
          )}
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="py-4 border-t justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); if(currentPage > 1) setCurrentPage(p => p - 1); }} 
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} 
                  />
                </PaginationItem>
                {/* Basic pagination display: first, current, last if different */}
                <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(1);}} isActive={currentPage === 1}>1</PaginationLink>
                </PaginationItem>
                {currentPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                {currentPage !== 1 && currentPage !== totalPages && (
                    <PaginationItem><PaginationLink href="#" isActive>{currentPage}</PaginationLink></PaginationItem>
                )}
                {totalPages > 1 && currentPage < totalPages -1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                {totalPages > 1 && (
                    <PaginationItem>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages);}} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) setCurrentPage(p => p + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

