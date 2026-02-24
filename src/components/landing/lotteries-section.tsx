"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES } from "@/constants/lotteries";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export function LotteriesSection() {
  const lotteries = Object.values(LOTTERIES);

  return (
    <section id="loterias" className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-purple/10 rounded-full blur-[200px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Todas as <span className="text-gradient">loterias</span> em um só
            lugar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Suporte completo para todas as 10 loterias da Caixa Econômica
            Federal.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {lotteries.map((lottery) => (
            <motion.div key={lottery.slug} variants={itemVariants}>
              <Card className="group glass hover:glass-strong transition-all duration-300 cursor-pointer border-white/10 hover:border-white/20 overflow-hidden">
                <CardContent className="p-5 text-center space-y-3">
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: lottery.color }}
                  >
                    {lottery.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-sm">{lottery.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    R$ {lottery.price.toFixed(2)}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
