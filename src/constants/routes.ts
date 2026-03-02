export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  profile: "/profile",
  savedGames: "/saved-games",
  calendar: "/calendar",
  strategies: "/strategies",
  responsible: "/responsible",
  pricing: "/pricing",
  lottery: (slug: string) => `/${slug}`,
  lotteryGenerate: (slug: string) => `/${slug}/generate`,
  lotteryResults: (slug: string) => `/${slug}/results`,
  lotteryStatistics: (slug: string) => `/${slug}/statistics`,
  lotteryCheck: (slug: string) => `/${slug}/check`,
} as const;

export const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];
export const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
export const PROTECTED_ROUTE_PREFIX = ["/dashboard", "/profile", "/saved-games", "/calendar", "/strategies", "/responsible", "/pricing"];
