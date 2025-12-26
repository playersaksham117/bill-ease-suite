"use client";

import { ToolSidebar } from "@/components/tool-sidebar";
import { posNavigation } from "@/lib/tool-navigation";

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ToolSidebar config={posNavigation} />
      <main className="flex-1 overflow-hidden bg-background">{children}</main>
    </div>
  );
}
