"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { SynapseXLogo } from "@/components/ui/SynapseXLogo";
import { Badge } from "@/components/ui/primitives";
import { loadDemoStore, saveDemoStore, type DemoStore } from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const NAV = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/forecast", label: "Forecast", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [store, setStore] = useState<DemoStore | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setStore(loadDemoStore());
  }, []);

  const logout = () => {
    const s = loadDemoStore();
    s.session = null;
    saveDemoStore(s);
    router.push("/login");
  };

  const demo = !isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[var(--ink)] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-[var(--steel)] md:flex">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
            <SynapseXLogo className="h-4 w-4 text-[var(--ember)]" />
            <span className="font-mono text-[13px]">SousXChef</span>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-[14px] transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="truncate text-[13px] text-white/80">
              {store?.profile.name ?? "Kitchen"}
            </p>
            <p className="mt-1 truncate font-mono text-[10px] text-white/35">
              {store?.session?.email ?? "demo@sousxchef.local"}
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-[var(--ink)]/90 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center border border-white/15 md:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <p className="text-[14px] font-medium text-white">
                  {store?.profile.name ?? "Maison Demo"}
                </p>
                <p className="font-mono text-[10px] text-white/40">
                  {store?.profile.location ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {demo && <Badge tone="warn">Demo mode</Badge>}
              {store?.profile.telegramLinked ? (
                <Badge tone="ok">Telegram linked</Badge>
              ) : (
                <Badge tone="muted">Telegram off</Badge>
              )}
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-9 items-center gap-2 border border-white/15 px-3 text-[12px] text-white/70 transition hover:border-white hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 md:px-10 md:py-10">{children}</main>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute top-0 left-0 flex h-full w-[280px] flex-col bg-[var(--steel)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-2">
                <SynapseXLogo className="h-4 w-4 text-[var(--ember)]" />
                <span className="font-mono text-[13px]">SousXChef</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-[15px] text-white/80"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
