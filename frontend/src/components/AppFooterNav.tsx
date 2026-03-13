"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, BarChart3, Settings } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "My Cards",
    href: "/cards",
    icon: CreditCard,
  },
  {
    label: "Statistics",
    href: "/statistics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function AppFooterNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-sm -translate-x-1/2 items-center justify-around border-t border-white/5 bg-[#4A455C]/70 px-4 py-3 backdrop-blur-md">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-[#1976FF]" : "text-white/45"
            }`}
          >
            <Icon size={20} />
            <span className="text-[11px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}