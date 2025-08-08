"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DashboardNavbar } from "@/components/dashboard-navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Use dashboard navbar for dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return <DashboardNavbar />;
  }
  
  // Use regular navbar for all other routes
  return <Navbar />;
}
