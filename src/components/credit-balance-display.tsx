
"use client";

import Link from "next/link";
import { Coins, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from 'react';


interface CreditBalanceDisplayProps {
  credits: number; // In a real app, this might come from a global state or context
}

// Define your low credit threshold here
const LOW_CREDIT_THRESHOLD = 10;

export function CreditBalanceDisplay({ credits: initialCredits }: CreditBalanceDisplayProps) {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching credits or set initial value on client-side
    setCredits(initialCredits); 
  }, [initialCredits]);

  if (credits === null) {
    // You can return a loading state or null
    return <div className="h-6 w-20 animate-pulse rounded-md bg-muted"></div>;
  }

  const isLowCredits = credits <= LOW_CREDIT_THRESHOLD && credits > 0;
  const isZeroCredits = credits === 0;

  const creditTextStyle = cn(
    "text-sm font-medium",
    isLowCredits && !isZeroCredits && "text-amber-500 dark:text-amber-400", // Using amber for low credits as per style guide for accent
    isZeroCredits && "text-destructive"
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/settings#credits-subscription" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label={`Current credit balance: ${credits}. Click to manage credits.`}>
            {isLowCredits || isZeroCredits ? (
              <AlertCircle className={cn("h-5 w-5", creditTextStyle)} aria-hidden="true" />
            ) : (
              <Coins className="h-5 w-5 text-primary" aria-hidden="true" />
            )}
            <span className={creditTextStyle}>
              Credits: {credits}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your current scan credit balance. Click to manage credits.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

CreditBalanceDisplay.displayName = "CreditBalanceDisplay";
