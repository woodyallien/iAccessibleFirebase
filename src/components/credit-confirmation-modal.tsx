
"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Coins, TrendingUp } from "lucide-react";
import { cn } from '@/lib/utils';

interface CreditConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  creditsRequired: number;
  currentCredits: number;
  onTopUp: () => void; // Action to navigate to top-up
  onUpgrade: () => void; // Action to navigate to upgrade
}

export function CreditConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  creditsRequired,
  currentCredits,
  onTopUp,
  onUpgrade,
}: CreditConfirmationModalProps) {
  const hasSufficientCredits = currentCredits >= creditsRequired;

  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {hasSufficientCredits ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-destructive" />
            )}
            {hasSufficientCredits ? "Confirm Scan Start" : "Insufficient Credits"}
          </AlertDialogTitle>
          <AlertDialogDescription className="py-2 text-base">
            {hasSufficientCredits ? (
              <>
                This scan will use <strong className="text-foreground">{creditsRequired}</strong> credit(s). 
                You currently have <strong className="text-foreground">{currentCredits}</strong> credit(s) remaining.
                <br />
                Proceed with the scan?
              </>
            ) : (
              <>
                This scan requires <strong className="text-foreground">{creditsRequired}</strong> credit(s), 
                but you only have <strong className={cn("text-foreground", currentCredits <= 0 && "text-destructive font-bold")}>{currentCredits}</strong> available.
                <br />
                Please top-up your credits or upgrade your subscription.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel onClick={onClose} aria-label="Cancel and close dialog">
            {hasSufficientCredits ? "Cancel" : "Close"}
          </AlertDialogCancel>
          {hasSufficientCredits ? (
            <AlertDialogAction onClick={onConfirm} aria-label="Confirm and start scan">
              Confirm & Start Scan
            </AlertDialogAction>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={onTopUp} variant="default" className="w-full sm:w-auto" aria-label="Top-up credits">
                <Coins className="mr-2 h-4 w-4" /> Top-up Credits
              </Button>
              <Button onClick={onUpgrade} variant="outline" className="w-full sm:w-auto" aria-label="Upgrade subscription">
                <TrendingUp className="mr-2 h-4 w-4" /> Upgrade Subscription
              </Button>
            </div>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

CreditConfirmationModal.displayName = "CreditConfirmationModal";
