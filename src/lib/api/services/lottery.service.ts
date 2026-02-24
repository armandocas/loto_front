import type { LotterySlug, LotteryResult, LotteryStatistics } from "@/types/lottery";
import { apiClient } from "../client";
import { MOCK_RESULTS, getMockStatistics } from "@/mocks/results";

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const lotteryService = {
  async getResults(
    slug: LotterySlug,
    limit = 10
  ): Promise<LotteryResult[]> {
    if (useMocks) {
      return MOCK_RESULTS[slug]?.slice(0, limit) || [];
    }
    return apiClient.get<LotteryResult[]>(`/lotteries/${slug}/results`, {
      params: { limit: String(limit) },
    });
  },

  async getLatestResult(slug: LotterySlug): Promise<LotteryResult | null> {
    if (useMocks) {
      return MOCK_RESULTS[slug]?.[0] || null;
    }
    return apiClient.get<LotteryResult>(`/lotteries/${slug}/latest`);
  },

  async getStatistics(slug: LotterySlug): Promise<LotteryStatistics> {
    if (useMocks) {
      return getMockStatistics(slug);
    }
    return apiClient.get<LotteryStatistics>(`/lotteries/${slug}/statistics`);
  },
};
