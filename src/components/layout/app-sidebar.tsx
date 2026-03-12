"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Bookmark,
  User,
  LogOut,
  CalendarDays,
  Target,
  ShieldCheck,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LOTTERIES } from "@/constants/lotteries";
import { ROUTES } from "@/constants/routes";
import { signOut } from "@/lib/firebase/auth";
import { useAuthContext } from "@/lib/firebase/providers";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { useSubscriptionStore } from "@/stores/subscription.store";

const mainNav = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.savedGames, label: "Jogos Salvos", icon: Bookmark },
  { href: ROUTES.calendar, label: "Calendário", icon: CalendarDays },
  { href: ROUTES.strategies, label: "Estratégias", icon: Target },
  { href: ROUTES.responsible, label: "Jogo Responsável", icon: ShieldCheck },
  { href: ROUTES.profile, label: "Perfil", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { subscription } = useSubscriptionStore();
  const lotteries = Object.values(LOTTERIES);

  return (
    <aside className="app-sidebar hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="p-4 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-neon-blue" />
        <span className="text-lg font-bold text-gradient">LotoSmart</span>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-4 bg-sidebar-border" />

        <div className="mb-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-2">
            Loterias
          </p>
          <nav className="space-y-1">
            {lotteries.map((lottery) => (
              <Link
                key={lottery.slug}
                href={ROUTES.lottery(lottery.slug)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname.startsWith(`/${lottery.slug}`)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: lottery.color }}
                />
                {lottery.name}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>

      {subscription.tier === "free" && (
        <div className="px-3 pb-2">
          <Link
            href="/pricing"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all"
          >
            <Crown className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 font-medium">Fazer upgrade</span>
          </Link>
        </div>
      )}

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold">
            {user?.displayName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {user?.displayName || "Usuário"}
              </p>
              <PlanBadge />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/70"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
