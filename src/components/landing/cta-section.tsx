"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function CtaSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-3xl glass-strong p-12 md:p-16 text-center space-y-6 overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-neon-blue/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-neon-purple/20 rounded-full blur-[100px]" />

          <div className="relative z-10 space-y-6">
            <div className="flex justify-center">
              <Sparkles className="h-12 w-12 text-neon-cyan" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold">
              Pronto para testar sua{" "}
              <span className="text-gradient">sorte</span>?
            </h2>

            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Junte-se a milhares de jogadores que já usam tecnologia para gerar
              seus jogos da loteria.
            </p>

            <Button
              size="lg"
              asChild
              className="text-base neon-glow"
            >
              <Link href={ROUTES.register}>
                Criar conta gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
