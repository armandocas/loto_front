"use client";

import { useState } from "react";
import { Share2, Download, Image, FileText, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { downloadGameImage } from "@/lib/export/game-image";
import { downloadCSV } from "@/lib/export/game-csv";
import { LOTTERIES } from "@/constants/lotteries";
import type { GeneratedGame } from "@/types/game";

interface ShareGameDialogProps {
  game: GeneratedGame;
  trigger?: React.ReactNode;
}

export function ShareGameDialog({ game, trigger }: ShareGameDialogProps) {
  const [loading, setLoading] = useState(false);
  const config = LOTTERIES[game.lottery];

  const numbersText = game.numbers
    .map((n) => n.toString().padStart(2, "0"))
    .join(" - ");

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `${config.name}: ${numbersText}\nGerado por LotoSmart`
    );
    toast.success("Copiado!");
  }

  async function handleDownloadImage() {
    setLoading(true);
    try {
      await downloadGameImage(game);
      toast.success("Imagem baixada!");
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadCSV() {
    downloadCSV([game], `lotosmart-${game.lottery}`);
    toast.success("CSV exportado!");
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `🍀 *${config.name}*\n\n${numbersText}\n\nGerado por LotoSmart`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Share2 className="mr-1 h-3 w-3" />
            Compartilhar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Jogo</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleCopy}>
            <Copy className="h-5 w-5" />
            <span className="text-xs">Copiar</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleWhatsApp}>
            <MessageCircle className="h-5 w-5 text-green-500" />
            <span className="text-xs">WhatsApp</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={handleDownloadImage}
            disabled={loading}
          >
            <Image className="h-5 w-5 text-blue-500" />
            <span className="text-xs">Imagem</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleDownloadCSV}>
            <FileText className="h-5 w-5 text-orange-500" />
            <span className="text-xs">CSV</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
