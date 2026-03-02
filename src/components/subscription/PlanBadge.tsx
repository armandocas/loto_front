"use client";

import { Crown, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/constants/plans";
import { useSubscriptionStore } from "@/stores/subscription.store";

export function PlanBadge({ className }: { className?: string }) {
  const { subscription } = useSubscriptionStore();
  const plan = PLANS[subscription.tier];

  const icons = {
    free: null,
    premium: <Zap className="h-3 w-3" />,
    pro: <Star className="h-3 w-3" />,
  };

  if (subscription.tier === "free") {
    return (
      <Badge
        variant="outline"
        className={`text-[10px] border-muted-foreground/30 text-muted-foreground ${className}`}
      >
        FREE
      </Badge>
    );
  }

  return (
    <Badge
      className={`text-[10px] gap-1 ${className}`}
      style={{
        backgroundColor: `${plan.color}20`,
        color: plan.color,
        borderColor: `${plan.color}40`,
      }}
    >
      {icons[subscription.tier]}
      {plan.badge}
    </Badge>
  );
}
