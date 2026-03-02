import type { GeneratedGame } from "@/types/game";
import { LOTTERIES } from "@/constants/lotteries";

export async function generateGameImage(game: GeneratedGame): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 340;
  const ctx = canvas.getContext("2d")!;
  const config = LOTTERIES[game.lottery];

  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, 600, 340);

  ctx.fillStyle = config.color;
  ctx.fillRect(0, 0, 600, 60);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px system-ui";
  ctx.fillText(config.name, 20, 40);

  ctx.font = "12px system-ui";
  ctx.fillText(`Método: ${game.method}`, 400, 40);

  const cols = Math.min(game.numbers.length, 10);
  const startX = (600 - cols * 55) / 2;

  game.numbers.forEach((num, i) => {
    const row = Math.floor(i / 10);
    const col = i % 10;
    const x = startX + col * 55;
    const y = 100 + row * 55;

    ctx.beginPath();
    ctx.arc(x + 22, y + 22, 22, 0, Math.PI * 2);
    ctx.fillStyle = `${config.color}40`;
    ctx.fill();
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(num.toString().padStart(2, "0"), x + 22, y + 28);
  });

  ctx.textAlign = "left";
  ctx.fillStyle = "#666";
  ctx.font = "11px system-ui";
  const dateStr = new Date(game.createdAt).toLocaleDateString("pt-BR");
  ctx.fillText(`Gerado em ${dateStr} | LotoSmart`, 20, 320);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export async function downloadGameImage(game: GeneratedGame) {
  const blob = await generateGameImage(game);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lotosmart-${game.lottery}-${game.id.slice(0, 8)}.png`;
  a.click();
  URL.revokeObjectURL(url);
}
