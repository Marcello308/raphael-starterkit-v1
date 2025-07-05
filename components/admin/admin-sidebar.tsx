"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Settings, 
  Archive,
  Zap,
  Link2
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: CreditCard,
  },
  {
    title: "Metrics",
    href: "/admin/metrics",
    icon: BarChart3,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield,
  },
  {
    title: "API",
    href: "/admin/api",
    icon: Zap,
  },
  {
    title: "Quick Setup",
    href: "/admin/setup",
    icon: Settings,
  },
  {
    title: "Payment Links",
    href: "/admin/payment-links",
    icon: Link2,
  },
  {
    title: "Archive",
    href: "/admin/archive",
    icon: Archive,
  },
];

import { User } from "@supabase/supabase-js";

interface AdminSidebarProps {
  user?: User;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-admin-sidebar-background border-r border-border">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-6">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 pb-4 space-y-1">
          <div className="mb-6">
            <h3 className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
              General
            </h3>
          </div>
          
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative",
                  isActive
                    ? "bg-admin-sidebar-active-background text-admin-sidebar-active-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 