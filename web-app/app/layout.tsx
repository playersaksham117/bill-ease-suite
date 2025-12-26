import type { Metadata, Viewport } from "next";
import { Sidebar } from "@/components/sidebar";
import SidebarMarginWrapper from "@/components/sidebar-margin-wrapper";
import { QueryProvider } from "@/lib/query-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "BillEase Suite",
  description: "Unified business platform for modern enterprises",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <Sidebar />
          <SidebarMarginWrapper>
            {children}
          </SidebarMarginWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
