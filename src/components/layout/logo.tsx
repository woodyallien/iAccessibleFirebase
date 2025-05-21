import { MountainSnow } from "lucide-react";
import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl";

  return (
    <Link href="/" className="flex items-center gap-2" aria-label="iAccessible Home">
      <MountainSnow className={`${iconSize} text-primary`} aria-hidden="true" />
      <span className={`font-semibold ${textSize} text-foreground group-data-[collapsible=icon]:hidden`}>
        {/* Using a more descriptive name as per guidelines */}
        iAccessible
      </span>
    </Link>
  );
}
Logo.displayName = "Logo";
