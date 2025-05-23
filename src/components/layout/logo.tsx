import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl";

  return (
    <Link href="/" className="flex items-center gap-2" aria-label="iAccessible Home">
      <svg
        className={`${iconSize} text-primary`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Dot of the 'i' */}
        <circle cx="12" cy="6.5" r="2.5" fill="currentColor" />
        {/* Stem of the 'i' */}
        <rect x="10.5" y="11" width="3" height="7" rx="1.5" fill="currentColor" />
      </svg>
      <span className={`font-semibold ${textSize} text-foreground group-data-[collapsible=icon]:hidden`}>
        iAccessible
      </span>
    </Link>
  );
}
Logo.displayName = "Logo";
