"use client";

import { motion } from "framer-motion";
import { UserPlus, Settings2, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crie sua conta",
    description:
      "Registre-se em segundos com email ou conta Google. Rápido e seguro.",
  },
  {
    icon: Settings2,
    step: "02",
    title: "Escolha seu método",
    description:
      "Selecione entre IA, estatísticas, filtros avançados ou geração aleatória.",
  },
  {
    icon: Trophy,
    step: "03",
    title: "Gere seus jogos",
    description:
      "Receba combinações otimizadas, salve seus favoritos e acompanhe os resultados.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Como <span className="text-gradient">funciona</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Em 3 passos simples você já está gerando jogos inteligentes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center space-y-4"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-neon-blue/50 to-transparent" />
              )}

              <div className="relative mx-auto w-24 h-24 rounded-3xl glass flex items-center justify-center neon-glow">
                <step.icon className="h-10 w-10 text-neon-blue" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
