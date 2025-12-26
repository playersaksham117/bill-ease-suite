"use client";

import { SidebarNav } from "./sidebar-nav";
import { Zap, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

// Tool paths where main sidebar should be hidden
const toolPaths = ["/workspace/pos", "/workspace/crm", "/workspace/exin", "/workspace/tracinvent", "/workspace/accounts"];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isHomepage = pathname === "/";
  const isInsideTool = toolPaths.some((path) => pathname.startsWith(path));
  
  // Hide sidebar on homepage and inside tool apps
  const shouldHide = isHomepage || isInsideTool;
  const sidebarWidth = shouldHide ? "w-0" : "w-[260px]";
  const sidebarPadding = shouldHide ? "px-0 py-0" : "px-4 py-6";
  const sidebarOpacity = shouldHide ? "opacity-0 invisible" : "opacity-100 visible";

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };
  
  return (
    <aside className={`fixed left-0 top-0 z-50 ${sidebarWidth} h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ${sidebarOpacity}`}>
      {/* Logo Section */}
      <div className={`${sidebarPadding} border-b border-border`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-base text-foreground">BillEase</h1>
            <p className="text-xs text-muted-foreground">Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation - Flexible */}
      <div className="flex-1 overflow-y-auto pb-4">
        <SidebarNav />
      </div>

      {/* User Profile & Logout - Fixed at bottom */}
      <div className={`border-t border-border ${sidebarPadding}`}>
        <div className="space-y-2">
          {/* User Info */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userEmail || "User"}
              </p>
              <p className="text-xs text-muted-foreground">Account</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
