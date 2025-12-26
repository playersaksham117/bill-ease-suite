"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ChevronLeft, Zap, type LucideIcon } from "lucide-react";
import type { ToolConfig } from "@/lib/tool-navigation";

interface ToolSidebarProps {
  config: ToolConfig;
}

export function ToolSidebar({ config }: ToolSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === config.basePath) {
      return pathname === config.basePath;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const IconComponent = config.icon;

  return (
    <aside className="w-[260px] flex-shrink-0 bg-card border-r border-border flex flex-col h-screen">
      {/* Logo & Back */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-border">
        <Link href="/workspace" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-base text-foreground">BillEase</h1>
            <p className="text-xs text-muted-foreground">Suite</p>
          </div>
          <ChevronLeft className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* Tool Header */}
      <div className="flex-shrink-0 px-4 py-4 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg">{config.name}</h2>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3">
        {config.sections.map((section) => (
          <div key={section.id} className="mb-2">
            <h3 className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
            <nav className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const ItemIcon = item.icon;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm font-medium"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <ItemIcon className={cn("w-4 h-4 flex-shrink-0", active ? "" : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full min-w-[20px] text-center",
                          active
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Quick Actions Footer */}
      <div className="flex-shrink-0 p-3 border-t border-border bg-muted/20">
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 text-xs font-medium bg-background border border-border rounded-lg hover:bg-muted transition-colors text-center">
            Help
          </button>
          <button className="flex-1 px-3 py-2 text-xs font-medium bg-background border border-border rounded-lg hover:bg-muted transition-colors text-center">
            Settings
          </button>
        </div>
      </div>
    </aside>
  );
}
