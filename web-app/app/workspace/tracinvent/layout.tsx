"use client";

import { ToolSidebar } from "@/components/tool-sidebar";
import { tracinventNavigation } from "@/lib/tool-navigation";

export default function TracInventLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ToolSidebar config={tracinventNavigation} />
      <main className="flex-1 overflow-hidden bg-background">{children}</main>
    </div>
  );
}
