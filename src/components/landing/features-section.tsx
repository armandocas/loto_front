"use client";

import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  Shield,
  Shuffle,
  SlidersHorizontal,
  History,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "Inteligência Artificial",
    description:
      "Algoritmos de IA analisam padrões históricos para gerar combinações inteligentes.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: BarChart3,
    title: "Análise Estatística",
    description:
      "Frequência, tendências e probabilidades calculadas com dados reais de todos os concursos.",
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    icon: SlidersHorizontal,
    title: "Filtros Avançados",
    description:
      "Defina critérios como par/ímpar, faixa de soma e distribuição por dezenas.",
    gradient: "from-cyan-500 to-teal-600",
  },
  {
    icon: Shuffle,
    title: "Geração Randômica",
    description:
      "Jogos completamente aleatórios usando algoritmos criptograficamente seguros.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: History,
    title: "Histórico Completo",
    description:
      "Base de dados com todos os resultados passados, atualizada diariamente.",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description:
      "Seus dados e jogos protegidos com criptografia e autenticação avançada.",
    gradient: "from-red-500 to-rose-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Tecnologia a favor da sua{" "}
            <span className="text-gradient">sorte</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combine inteligência artificial com análise de dados para criar os
            melhores jogos possíveis.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="group glass hover:glass-strong transition-all duration-300 h-full border-white/10 hover:border-white/20">
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
