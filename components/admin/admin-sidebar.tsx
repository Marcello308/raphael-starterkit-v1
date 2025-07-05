"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { 
  LayoutDashboard
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
];

import { User } from "@supabase/supabase-js";

interface AdminSidebarProps {
  user?: User;
  isCollapsed?: boolean;
}

// 折叠状态下的Logo组件
function CollapsedLogo() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'light';
  const logoSrc = currentTheme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png";

  return (
    <Link
      href="/admin"
      className="flex items-center justify-center hover:opacity-90 transition-opacity"
    >
      <div className="relative h-8 w-8 flex-shrink-0">
        <Image 
          src={logoSrc}
          alt="MasterAlpha Logo" 
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          priority
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
        {!mounted && (
          <div className="absolute inset-0 bg-muted rounded-sm animate-pulse" />
        )}
      </div>
    </Link>
  );
}

export function AdminSidebar({ user, isCollapsed = false }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "hidden md:flex md:flex-col sidebar-collapse-animation",
      isCollapsed ? "md:w-16" : "md:w-64"
    )}>
      <div className="flex flex-col flex-grow pt-6 overflow-y-auto bg-admin-sidebar-background border-r border-border">
        {/* Logo */}
        <div className={cn(
          "flex items-center flex-shrink-0 mb-8 sidebar-collapse-animation",
          isCollapsed ? "justify-center px-2" : "justify-start px-4"
        )}>
          <div className="sidebar-collapse-animation">
            {isCollapsed ? (
              <CollapsedLogo />
            ) : (
              <Logo />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-6 space-y-1">
          {/* General Header with fade animation */}
          <div className={cn(
            "mb-3 sidebar-collapse-animation",
            isCollapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100 h-auto mb-3"
          )}>
            <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              General
            </h3>
          </div>
          
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center text-sm font-medium rounded-lg sidebar-collapse-animation relative overflow-hidden mb-1",
                  isCollapsed 
                    ? "px-3 py-3 justify-center mx-0" 
                    : "px-3 py-2.5 mx-0",
                  isActive
                    ? "bg-admin-sidebar-active-background text-admin-sidebar-active-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-sm"
                )}
                title={isCollapsed ? item.title : undefined}
                style={{
                  transitionDelay: isCollapsed ? `${index * 30}ms` : '0ms'
                }}
              >
                <Icon className={cn(
                  "h-4 w-4 flex-shrink-0 sidebar-collapse-animation",
                  isCollapsed ? "mr-0" : "mr-3"
                )} />
                
                {/* Text with slide and fade animation */}
                <span className={cn(
                  "whitespace-nowrap sidebar-collapse-animation font-medium",
                  isCollapsed 
                    ? "opacity-0 translate-x-2 w-0 overflow-hidden" 
                    : "opacity-100 translate-x-0 w-auto"
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 