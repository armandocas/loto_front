"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { UpgradeDialog } from "./UpgradeDialog";
import { useFeatureGate } from "@/hooks/use-feature-gate";
import type { GenerationMethod } from "@/types/game";

interface MethodLockProps {
  method: GenerationMethod;
  methodName: string;
  children: React.ReactNode;
}

export function MethodLock({ method, methodName, children }: MethodLockProps) {
  const { checkMethod } = useFeatureGate();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (checkMethod(method)) {
    return <>{children}</>;
  }

  return (
    <>
      <button
        onClick={() => setUpgradeOpen(true)}
        className="relative w-full text-left opacity-60 hover:opacity-80 transition-opacity cursor-pointer"
      >
        {children}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg backdrop-blur-[1px]">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>
      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        reason={`O método "${methodName}" está disponível nos planos Premium e Pro.`}
      />
    </>
  );
}
