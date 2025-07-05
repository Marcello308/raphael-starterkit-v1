"use client";

import { Bell, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { signOutToHomeAction } from "@/app/actions";

interface AdminHeaderProps {
  user: User;
  onToggleSidebar?: () => void;
}

export function AdminHeader({ user, onToggleSidebar }: AdminHeaderProps) {
  // 获取用户头像和昵称
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
  const userEmail = user.email;

  return (
    <header className="bg-admin-header-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side - Collapse Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="menu-button-hover hover:bg-secondary hover:text-accent"
          >
            <Menu className="h-5 w-5 transition-transform duration-300 ease-in-out" />
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hover:bg-secondary hover:text-accent">
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {avatarUrl && (
                    <AvatarImage src={avatarUrl} alt={userName || "User avatar"} />
                  )}
                  <AvatarFallback>
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
                    Administrator
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
                    Log out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 