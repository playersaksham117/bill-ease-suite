"use client";

import { ToolSidebar } from "@/components/tool-sidebar";
import { accountsNavigation } from "@/lib/tool-navigation";

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ToolSidebar config={accountsNavigation} />
      <main className="flex-1 overflow-hidden bg-background">{children}</main>
    </div>
  );
}
