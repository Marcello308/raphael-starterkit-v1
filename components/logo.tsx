"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoSrc = theme === "light" ? "/images/logo-light.png" : "/images/logo-dark.png";

  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      <Image 
        src={logoSrc}
        alt="MasterAlpha Logo" 
        width={32}
        height={32}
        className="h-8 w-auto"
      />
      <span className="font-bold text-lg text-foreground">MasterAlpha</span>
    </Link>
  );
}
