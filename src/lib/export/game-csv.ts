import type { GeneratedGame } from "@/types/game";
import { LOTTERIES } from "@/constants/lotteries";

export function gamesToCSV(games: GeneratedGame[]): string {
  const headers = ["Loteria", "Método", "Números", "Extras", "Data"];
  const rows = games.map((g) => {
    const config = LOTTERIES[g.lottery];
    const nums = g.numbers.map((n) => n.toString().padStart(2, "0")).join(" - ");
    const extras = g.extraNumbers?.map((n) => n.toString().padStart(2, "0")).join(" - ") || "";
    const date = new Date(g.createdAt).toLocaleDateString("pt-BR");
    return [config.name, g.method, nums, extras, date].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export function downloadCSV(games: GeneratedGame[], filename = "lotosmart-jogos") {
  const csv = gamesToCSV(games);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
