import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-background via-background to-background overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-neon-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neon-purple/20 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-md text-center space-y-8 p-8">
          <Link href="/" className="flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-neon-blue" />
            <span className="text-3xl font-bold text-gradient">LotoSmart</span>
          </Link>
          <p className="text-muted-foreground text-lg">
            Gere jogos inteligentes para todas as loterias federais usando IA e
            análise estatística avançada.
          </p>
          <div className="flex justify-center gap-3">
            {[8, 15, 23, 34, 47, 58].map((num) => (
              <div
                key={num}
                className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary"
              >
                {num.toString().padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
