import { GENERATION_METHODS, LOTTERIES } from "@/constants/lotteries";
import type { GeneratedGame } from "@/types/game";

function getMethodName(method: string): string {
  return GENERATION_METHODS.find((m) => m.id === method)?.name ?? method;
}

function buildHtml(games: GeneratedGame[]): string {
  const gameCards = games
    .map((game) => {
      const config = LOTTERIES[game.lottery];
      const date = new Date(game.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const numberCircles = game.numbers
        .map(
          (n) =>
            `<span style="
              display:inline-flex;align-items:center;justify-content:center;
              width:38px;height:38px;border-radius:50%;
              background:${config.color};color:#fff;
              font-weight:700;font-size:14px;margin:3px;
            ">${n.toString().padStart(2, "0")}</span>`
        )
        .join("");

      const extraCircles = game.extraNumbers?.length
        ? `<div style="margin-top:8px;">
            <span style="font-size:12px;color:#888;margin-right:6px;">Extras:</span>
            ${game.extraNumbers
              .map(
                (n) =>
                  `<span style="
                    display:inline-flex;align-items:center;justify-content:center;
                    width:34px;height:34px;border-radius:50%;
                    background:${config.color}55;color:${config.color};
                    font-weight:700;font-size:13px;margin:2px;
                    border:2px solid ${config.color};
                  ">${n.toString().padStart(2, "0")}</span>`
              )
              .join("")}
           </div>`
        : "";

      return `
        <div style="
          border:1px solid #e5e7eb;border-radius:12px;padding:20px;
          margin-bottom:16px;page-break-inside:avoid;
        ">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div style="
              width:40px;height:40px;border-radius:10px;
              background:${config.color};color:#fff;
              display:flex;align-items:center;justify-content:center;
              font-weight:800;font-size:14px;
            ">${config.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <div style="font-weight:700;font-size:16px;">${config.name}</div>
              <div style="font-size:12px;color:#888;">${getMethodName(game.method)} • ${date}</div>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;align-items:center;">
            ${numberCircles}
          </div>
          ${extraCircles}
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>LotoSmart - Meus Jogos</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
         padding:32px;color:#1a1a1a;max-width:800px;margin:0 auto;}
    @media print{
      body{padding:16px;}
      .no-print{display:none!important;}
    }
  </style>
</head>
<body>
  <div style="text-align:center;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #e5e7eb;">
    <h1 style="font-size:28px;font-weight:800;margin-bottom:4px;">
      <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
        LotoSmart
      </span>
    </h1>
    <p style="color:#888;font-size:13px;">${games.length} jogo${games.length === 1 ? "" : "s"} gerado${games.length === 1 ? "" : "s"} • ${new Date().toLocaleDateString("pt-BR")}</p>
  </div>
  ${gameCards}
  <div style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#aaa;">
    Gerado por LotoSmart • lotosmart.com.br
  </div>
  <script>window.onload=function(){window.print();}</script>
</body>
</html>`;
}

export function exportGamesToPdf(games: GeneratedGame[]) {
  const html = buildHtml(games);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.onload = () => URL.revokeObjectURL(url);
    return;
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = "lotosmart-jogos.html";
  a.click();
  URL.revokeObjectURL(url);
}
