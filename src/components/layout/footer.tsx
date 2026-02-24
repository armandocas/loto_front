import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  produto: [
    { href: "#features", label: "Funcionalidades" },
    { href: "#loterias", label: "Loterias" },
    { href: "#como-funciona", label: "Como Funciona" },
  ],
  suporte: [
    { href: "/faq", label: "FAQ" },
    { href: "/contato", label: "Contato" },
    { href: "/termos", label: "Termos de Uso" },
  ],
  legal: [
    { href: "/privacidade", label: "Privacidade" },
    { href: "/termos", label: "Termos" },
    { href: "/cookies", label: "Cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-neon-blue" />
              <span className="text-lg font-bold text-gradient">LotoSmart</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Gerador inteligente de jogos da loteria federal. Tecnologia e
              estatística a favor da sua sorte.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LotoSmart. Todos os direitos reservados.</p>
          <p>
            Este site não possui vínculo com a Caixa Econômica Federal.
          </p>
        </div>
      </div>
    </footer>
  );
}
