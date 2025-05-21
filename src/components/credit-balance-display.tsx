
"use client";

import Link from "next/link";
import { Coins, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCredits } from "@/contexts/credit-context"; // Added import
import React, { useState, useEffect } from 'react';


// Define your low credit threshold here
const LOW_CREDIT_THRESHOLD = 10;

export function CreditBalanceDisplay() { // Removed initialCredits prop
  const { creditBalance } = useCredits(); // Use context
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client to avoid hydration mismatch for creditBalance
    setIsClient(true);
  }, []);


  if (!isClient) {
    // Return a loading state or null until client-side hydration is complete
    return <div className="h-6 w-24 animate-pulse rounded-md bg-muted"></div>;
  }

  const isLowCredits = creditBalance <= LOW_CREDIT_THRESHOLD && creditBalance > 0;
  const isZeroCredits = creditBalance === 0;

  const creditTextStyle = cn(
    "text-sm font-medium",
    isLowCredits && !isZeroCredits && "text-amber-500 dark:text-amber-400", 
    isZeroCredits && "text-destructive"
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/settings#credits-subscription" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label={`Current credit balance: ${creditBalance}. Click to manage credits.`}>
            {isLowCredits || isZeroCredits ? (
              <AlertCircle className={cn("h-5 w-5", creditTextStyle)} aria-hidden="true" />
            ) : (
              <Coins className="h-5 w-5 text-primary" aria-hidden="true" />
            )}
            <span className={creditTextStyle}>
              Credits: {creditBalance}
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
