
import type { ReactNode } from 'react';
import { Logo } from '@/components/layout/logo';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        {children}
      </div>
    </div>
  );
}
AuthLayout.displayName = "AuthLayout";
