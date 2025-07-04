"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import { Footer } from "@/components/footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  user: any;
}

export function ConditionalLayout({ children, user }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes: no header/footer, just the content
    return <>{children}</>;
  }

  // Regular routes: with header and footer
  return (
    <div className="relative min-h-screen">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
} 