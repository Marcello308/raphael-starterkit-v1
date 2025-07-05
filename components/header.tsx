"use client";

import { signOutToHomeAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Settings, LogOut, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  user: any;
}

interface NavItem {
  label: string;
  href: string;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/admin");
  const [isScrolled, setIsScrolled] = useState(false);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Main navigation items that are always shown
  const mainNavItems: NavItem[] = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  // Dashboard items - empty array as we don't want navigation items in dashboard
  const dashboardItems: NavItem[] = [];

  // Choose which navigation items to show
  const navItems = isDashboard ? dashboardItems : mainNavItems;

  // 获取用户头像和昵称
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0];
  const userEmail = user?.email;

  return (
    <div className="sticky top-0 z-50 w-full p-4">
      <header className={`container mx-auto backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-3xl transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-background/98 border border-border/30 shadow-lg shadow-black/5' 
          : 'bg-background/95 border border-transparent shadow-sm'
      }`}>
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 md:gap-8">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {!isDashboard && (
                  <Button asChild size="sm" variant="outline" className="gap-2 px-3 py-2 h-9 rounded-full border-border/50 hover:border-border hover:bg-secondary/50 transition-all duration-200">
                    <Link href="/admin" className="flex items-center">
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                  </Button>
                )}
                
                {/* User Avatar Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-secondary/80">
                      <Avatar className="h-8 w-8">
                        {avatarUrl && (
                          <AvatarImage src={avatarUrl} alt={userName || "User avatar"} />
                        )}
                        <AvatarFallback className="text-xs font-medium">
                          {userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">{userName || userEmail}</p>
                        <p className="text-xs text-muted-foreground">
                          {userEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isDashboard ? "Administrator" : "User"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <form action={signOutToHomeAction} className="w-full">
                        <button type="submit" className="flex items-center w-full">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button asChild size="sm" variant="default">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>
            )}
            <MobileNav items={navItems} user={user} isDashboard={isDashboard} />
          </div>
        </div>
      </header>
    </div>
  );
}
