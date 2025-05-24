"use client";

import { usePathname } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { AuthLayout } from '@/components/layout/auth-layout';
import React from 'react';

export function ConditionalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password'];

  if (authRoutes.includes(pathname)) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <AppLayout>{children}</AppLayout>;
}
