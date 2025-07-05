"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 使用resolvedTheme作为fallback，提供更稳定的主题检测
  const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'light';
  const logoSrc = currentTheme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png";

  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      {/* 图片容器，保持固定尺寸避免布局跳动 */}
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
        {/* 加载时的占位符 */}
        {!mounted && (
          <div className="absolute inset-0 bg-muted rounded-sm animate-pulse" />
        )}
      </div>
      <span className="font-bold text-lg text-foreground">MasterAlpha</span>
    </Link>
  );
}
