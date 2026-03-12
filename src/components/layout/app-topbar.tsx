"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Sparkles,
  LayoutDashboard,
  Bookmark,
  User,
  LogOut,
  Moon,
  Sun,
  Bell,
  CalendarDays,
  Target,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LOTTERIES } from "@/constants/lotteries";
import { ROUTES } from "@/constants/routes";
import { signOut } from "@/lib/firebase/auth";
import { useAuthContext } from "@/lib/firebase/providers";
import { getUpcomingDraws } from "@/lib/utils/draw-schedule";

const mainNav = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.savedGames, label: "Jogos Salvos", icon: Bookmark },
  { href: ROUTES.calendar, label: "Calendário", icon: CalendarDays },
  { href: ROUTES.strategies, label: "Estratégias", icon: Target },
  { href: ROUTES.responsible, label: "Jogo Responsável", icon: ShieldCheck },
  { href: ROUTES.profile, label: "Perfil", icon: User },
];

export function AppTopbar() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const lotteries = Object.values(LOTTERIES);
  const todayDraws = getUpcomingDraws(0);

  return (
    <header className="app-topbar sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
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
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <Separator className="my-4" />

            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Loterias
            </p>
            <nav className="space-y-1 pb-4">
              {lotteries.map((lottery) => (
                <Link
                  key={lottery.slug}
                  href={ROUTES.lottery(lottery.slug)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname.startsWith(`/${lottery.slug}`)
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50"
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
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {todayDraws.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                {todayDraws.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end">
          <div className="p-3 border-b">
            <p className="font-semibold text-sm">Notificações</p>
          </div>
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {todayDraws.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">Nenhum sorteio hoje.</p>
            ) : (
              todayDraws.map((draw) => (
                <Link
                  key={`${draw.lottery}-${draw.date.toISOString()}`}
                  href={ROUTES.lottery(draw.lottery)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: draw.color }} />
                  <div>
                    <p className="text-xs font-medium">{draw.lotteryName}</p>
                    <p className="text-[10px] text-muted-foreground">Sorteio hoje às 20h</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar tema</span>
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm hidden md:block">
          {user?.displayName || "Usuário"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          className="text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
