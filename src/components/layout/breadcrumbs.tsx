"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { LOTTERIES } from "@/constants/lotteries";
import type { LotterySlug } from "@/types/lottery";

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  "saved-games": "Jogos Salvos",
  profile: "Perfil",
  calendar: "Calendário",
  strategies: "Estratégias",
  responsible: "Jogo Responsável",
  generate: "Gerar Jogos",
  results: "Resultados",
  statistics: "Estatísticas",
  check: "Conferir",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs: { label: string; href: string }[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");
    const lotteryConfig = LOTTERIES[segment as LotterySlug];

    if (lotteryConfig) {
      crumbs.push({ label: lotteryConfig.name, href });
    } else if (LABEL_MAP[segment]) {
      crumbs.push({ label: LABEL_MAP[segment], href });
    }
  }

  if (crumbs.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
      <Link href="/dashboard" className="hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {i === crumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
