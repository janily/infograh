"use client";

import { Link } from "@heroui/link";
import { useRouter, usePathname } from "next/navigation";

interface SmoothScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  color?: "foreground" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

export function SmoothScrollLink({ href, children, className, color, size }: SmoothScrollLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if it's a hash link
    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.substring(2); // Remove "/#"
      
      // If we're not on the home page, navigate to home first
      if (pathname !== "/") {
        router.push("/");
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        // We're already on home page, just scroll
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  return (
    <Link href={href} className={className} color={color} size={size} onClick={handleClick}>
      {children}
    </Link>
  );
}
