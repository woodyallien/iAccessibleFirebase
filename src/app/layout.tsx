
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppLayout } from '@/components/layout/app-layout';
import { siteConfig } from '@/config/site';
import { CreditProvider } from '@/contexts/credit-context'; // Added import

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  display: 'swap', 
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap', 
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["accessibility", "MVP", "Next.js", "React", "Tailwind CSS"],
  authors: [{ name: "Your Name/Company", url: siteConfig.url }],
  creator: "Your Name/Company",
  // openGraph: {
  //   type: "website",
  //   locale: "en_US",
  //   url: siteConfig.url,
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   siteName: siteConfig.name,
  //   images: [
  //     {
  //       url: siteConfig.ogImage,
  //       width: 1200,
  //       height: 630,
  //       alt: siteConfig.name,
  //     },
  //   ],
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [siteConfig.ogImage],
  //   creator: "@yourtwitterhandle", 
  // },
  // icons: {
  //   icon: "/favicon.ico", 
  //   shortcut: "/favicon-16x16.png", 
  //   apple: "/apple-touch-icon.png", 
  // },
  // manifest: `${siteConfig.url}/site.webmanifest`, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} antialiased min-h-screen bg-background font-sans text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CreditProvider> {/* Added CreditProvider wrapper */}
            <AppLayout>
              {children}
            </AppLayout>
          </CreditProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
