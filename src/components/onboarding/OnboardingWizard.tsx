"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Dices,
  Target,
  BarChart3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/stores/preferences.store";
import { LOTTERIES, LOTTERY_SLUGS } from "@/constants/lotteries";
import type { LotterySlug } from "@/types/lottery";

const PLAY_STYLES = [
  {
    id: "casual" as const,
    icon: Dices,
    label: "Casual",
    description: "Gero jogos rápidos para me divertir",
  },
  {
    id: "strategic" as const,
    icon: Target,
    label: "Estratégico",
    description: "Gosto de analisar estatísticas e criar estratégias",
  },
  {
    id: "data-driven" as const,
    icon: BarChart3,
    label: "Data-Driven",
    description: "Quero usar todos os métodos disponíveis, incluindo IA",
  },
];

const TOTAL_STEPS = 3;

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

interface OnboardingWizardProps {
  readonly open: boolean;
  readonly onComplete: () => void;
}

export function OnboardingWizard({ open, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const { favoriteLotteries, toggleFavoriteLottery, playStyle, setPlayStyle } =
    usePreferencesStore();

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  }

  function back() {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }

  const canAdvance =
    step === 0 ||
    (step === 1 && favoriteLotteries.length > 0) ||
    (step === 2 && playStyle !== null);

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="items-center">
          <div className="flex gap-1.5 mb-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const dotKey = `step-dot-${i}`;
              let dotStyle = "w-2 bg-muted";
              if (i === step) dotStyle = "w-8 bg-primary";
              else if (i < step) dotStyle = "w-2 bg-primary/60";

              return (
                <div
                  key={dotKey}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    dotStyle
                  )}
                />
              );
            })}
          </div>
          <DialogTitle className="sr-only">Onboarding</DialogTitle>
        </DialogHeader>

        <div className="relative min-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {step === 0 && <StepWelcome />}
              {step === 1 && (
                <StepLotteries
                  selected={favoriteLotteries}
                  onToggle={toggleFavoriteLottery}
                />
              )}
              {step === 2 && (
                <StepPlayStyle selected={playStyle} onSelect={setPlayStyle} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0}
            className="gap-1"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          <Button onClick={next} disabled={!canAdvance} className="gap-1">
            {step === TOTAL_STEPS - 1 ? (
              <>
                Começar
                <Check className="size-4" />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepWelcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-2">
      <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10">
        <Sparkles className="size-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">
        Bem-vindo ao LotoSmart!
      </h2>
      <p className="text-muted-foreground max-w-sm leading-relaxed">
        Vamos personalizar sua experiência em poucos passos. Escolha suas
        loterias favoritas e seu estilo de jogo para receber sugestões sob
        medida.
      </p>
    </div>
  );
}

function StepLotteries({
  selected,
  onToggle,
}: Readonly<{
  selected: LotterySlug[];
  onToggle: (slug: LotterySlug) => void;
}>) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <h2 className="text-xl font-bold">Suas Loterias Favoritas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione pelo menos uma loteria
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LOTTERY_SLUGS.map((slug) => {
          const lottery = LOTTERIES[slug];
          const isSelected = selected.includes(slug);

          return (
            <button
              key={slug}
              type="button"
              onClick={() => onToggle(slug)}
              className={cn(
                "relative flex items-center gap-2 rounded-lg border p-3 text-left transition-all duration-200 hover:scale-[1.02]",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: lottery.color }}
              />
              <span className="text-sm font-medium truncate">
                {lottery.name}
              </span>
              {isSelected && (
                <Check className="size-3.5 text-primary ml-auto shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepPlayStyle({
  selected,
  onSelect,
}: Readonly<{
  selected: string | null;
  onSelect: (style: "casual" | "strategic" | "data-driven") => void;
}>) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <h2 className="text-xl font-bold">Seu Estilo de Jogo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Como você prefere jogar?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {PLAY_STYLES.map((style) => {
          const Icon = style.icon;
          const isSelected = selected === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelect(style.id)}
              className={cn(
                "flex items-start gap-4 rounded-lg border p-4 text-left transition-all duration-200 hover:scale-[1.01]",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center size-10 shrink-0 rounded-lg transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{style.label}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {style.description}
                </p>
              </div>
              {isSelected && (
                <Check className="size-4 text-primary mt-1 ml-auto shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
