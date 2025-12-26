"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function SidebarMarginWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  
  // Workspace pages handle their own margins, so only apply margin on non-workspace pages
  const isWorkspace = pathname.startsWith("/workspace");

  // Remove margin on homepage and all workspace pages (they handle it themselves)
  const shouldRemoveMargin = isHomepage || isWorkspace;

  return (
    <div
      className={`transition-all duration-300 ${
        shouldRemoveMargin ? "ml-0" : "ml-[260px]"
      }`}
    >
      {children}
    </div>
  );
}
