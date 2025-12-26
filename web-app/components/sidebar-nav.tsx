"use client";

import { Home, BarChart3, HelpCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const menuItems = [
  { id: "home", name: "Home", href: "/workspace", icon: Home },
  { id: "dashboard", name: "Dashboard", href: "/workspace/dashboard", icon: BarChart3 },
];

const footerItems = [
  { id: "support", name: "Support", href: "/workspace/support", icon: HelpCircle },
  { id: "settings", name: "Settings", href: "/workspace/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/workspace") {
      return pathname === "/workspace";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Main Menu */}
      <nav className="space-y-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Applications Section */}
      <div className="py-4">
        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Applications
        </h3>
        <nav className="space-y-1">
          <AppLink href="/workspace/pos" label="POS" active={isActive("/workspace/pos")} />
          <AppLink href="/workspace/crm" label="CRM" active={isActive("/workspace/crm")} />
          <AppLink href="/workspace/exin" label="ExIn" active={isActive("/workspace/exin")} />
          <AppLink
            href="/workspace/tracinvent"
            label="TracInvent"
            active={isActive("/workspace/tracinvent")}
          />
          <AppLink
            href="/workspace/accounts"
            label="Accounts+"
            active={isActive("/workspace/accounts")}
          />
        </nav>
      </div>

      {/* Footer Menu - Sticky */}
      <nav className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4 space-y-1">
        {footerItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function AppLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-2.5 rounded-md text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground/60 hover:text-foreground hover:bg-muted"
      )}
    >
      {label}
    </Link>
  );
}
