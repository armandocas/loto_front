"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LOTTERIES, LOTTERY_SLUGS } from "@/constants/lotteries";
import { generateGames } from "@/lib/generators";
import { useGameStore } from "@/stores/game.store";
import type { LotterySlug } from "@/types/lottery";

export function QuickPlayFab() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { addGeneratedGames, saveGame } = useGameStore();

  function handleQuickPlay(slug: LotterySlug) {
    const config = LOTTERIES[slug];
    const games = generateGames({
      config,
      method: "random",
      quantity: 1,
    });
    addGeneratedGames(games);
    saveGame(games[0]);
    setOpen(false);
    toast.success(`Jogo rápido gerado para ${config.name}!`);
    router.push(`/${slug}/generate`);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-56 p-2 rounded-xl glass border border-white/10 shadow-2xl space-y-1 mb-2"
          >
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">Gerar Rápido</p>
            {LOTTERY_SLUGS.map((slug) => {
              const l = LOTTERIES[slug];
              return (
                <button
                  key={slug}
                  onClick={() => handleQuickPlay(slug)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm hover:bg-white/5 transition-colors"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                  {l.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setOpen(!open)}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 transition-all"
      >
        {open ? <X className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
      </Button>
    </div>
  );
}
