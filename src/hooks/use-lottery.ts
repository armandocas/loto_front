"use client";

import { useQuery } from "@tanstack/react-query";
import { LOTTERIES } from "@/constants/lotteries";
import { lotteryService } from "@/lib/api/services/lottery.service";
import type { LotterySlug } from "@/types/lottery";

export function useLotteryResults(slug: LotterySlug, limit = 10) {
  return useQuery({
    queryKey: ["lottery-results", slug, limit],
    queryFn: () => lotteryService.getResults(slug, limit),
    enabled: !!slug,
  });
}

export function useLotteryLatest(slug: LotterySlug) {
  return useQuery({
    queryKey: ["lottery-latest", slug],
    queryFn: () => lotteryService.getLatestResult(slug),
    enabled: !!slug,
  });
}

export function useLotteryStatistics(slug: LotterySlug) {
  return useQuery({
    queryKey: ["lottery-statistics", slug],
    queryFn: () => lotteryService.getStatistics(slug),
    enabled: !!slug,
  });
}

export function useLotteryConfig(slug: LotterySlug) {
  return LOTTERIES[slug] || null;
}
