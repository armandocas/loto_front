"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const faqItems = [
  {
    question: "O que é o LotoSmart?",
    answer:
      "O LotoSmart é uma plataforma inteligente de geração e gestão de jogos da loteria federal brasileira. Utilizamos algoritmos estatísticos avançados e análise de dados históricos para ajudar você a criar combinações otimizadas para seus jogos.",
  },
  {
    question: "Como funciona a geração de jogos?",
    answer:
      "Nossa plataforma oferece diferentes métodos de geração: aleatório (totalmente randômico), estatístico (baseado em frequência e padrões dos sorteios anteriores) e personalizado (onde você define critérios como números quentes, frios, pares/ímpares, entre outros). Cada método utiliza algoritmos próprios para criar combinações únicas.",
  },
  {
    question: "Os métodos de geração garantem prêmio?",
    answer:
      "Não. Nenhum método, sistema ou algoritmo pode garantir prêmios em jogos de loteria. Os sorteios são eventos aleatórios regulamentados pela Caixa Econômica Federal. O LotoSmart é uma ferramenta de apoio que utiliza estatística para otimizar suas escolhas, mas o resultado final depende exclusivamente do sorteio oficial.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Levamos a segurança dos seus dados muito a sério. Utilizamos criptografia de ponta a ponta, armazenamento seguro em servidores protegidos e seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD). Seus dados pessoais jamais são compartilhados com terceiros sem seu consentimento.",
  },
  {
    question: "Quais loterias são suportadas?",
    answer:
      "O LotoSmart suporta todas as principais loterias da Caixa Econômica Federal: Mega-Sena, Lotofácil, Quina, Lotomania, Timemania, Dupla Sena, Federal, Dia de Sorte, Super Sete e +Milionária. Cada loteria possui regras e configurações específicas de geração.",
  },
  {
    question: "Posso gerar jogos gratuitamente?",
    answer:
      "Sim! O LotoSmart oferece um plano gratuito com funcionalidades básicas de geração de jogos. Para acessar métodos avançados de geração, análises estatísticas detalhadas e funcionalidades premium como conferência automática e histórico ilimitado, oferecemos planos pagos com excelente custo-benefício.",
  },
  {
    question: "Como funciona a conferência automática?",
    answer:
      "A conferência automática verifica seus jogos salvos contra os resultados oficiais dos sorteios assim que são divulgados pela Caixa Econômica Federal. Você recebe notificações sobre acertos e eventuais premiações diretamente na plataforma, sem precisar conferir manualmente.",
  },
  {
    question: "O LotoSmart é ligado à Caixa Econômica Federal?",
    answer:
      "Não. O LotoSmart é uma plataforma independente, sem qualquer vínculo, afiliação ou parceria com a Caixa Econômica Federal. Somos uma ferramenta de apoio ao jogador. Os sorteios, regras e premiações são de responsabilidade exclusiva da Caixa.",
  },
  {
    question: "Como salvo meus jogos?",
    answer:
      "Após gerar seus jogos, você pode salvá-los na sua conta com um clique. Todos os jogos ficam organizados por loteria e data de criação, facilitando a gestão e conferência. Você também pode criar grupos e categorias personalizadas para organizar melhor seus jogos.",
  },
  {
    question: "Posso compartilhar meus jogos?",
    answer:
      "Sim! Você pode compartilhar seus jogos gerados com amigos e familiares através de link, WhatsApp, e-mail ou redes sociais. Também é possível exportar seus jogos em formato PDF para impressão.",
  },
  {
    question: "O que é o Jogo Responsável?",
    answer:
      "O Jogo Responsável é um compromisso do LotoSmart com o bem-estar dos nossos usuários. Incentivamos a prática consciente de jogos de loteria, com limites de gastos, alertas de frequência e recursos de autoexclusão. Lembre-se: jogue com moderação e nunca comprometa seu orçamento.",
  },
  {
    question: "Como cancelo minha conta?",
    answer:
      "Você pode cancelar sua conta a qualquer momento através das configurações do seu perfil. Ao cancelar, todos os seus dados pessoais serão removidos conforme previsto na LGPD. Jogos salvos e histórico serão excluídos permanentemente após o período legal de retenção.",
  },
  {
    question: "Quais métodos de pagamento são aceitos?",
    answer:
      "Aceitamos cartão de crédito (Visa, Mastercard, Elo), PIX, boleto bancário e carteiras digitais. Todos os pagamentos são processados de forma segura através de parceiros certificados PCI-DSS.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-neon-blue/10">
              <HelpCircle className="h-8 w-8 text-neon-blue" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">
              Perguntas Frequentes
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mb-12">
            Encontre respostas para as dúvidas mais comuns sobre o LotoSmart.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card className="glass overflow-hidden">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                >
                  <span className="font-medium text-foreground pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <CardContent className="pt-0 pb-5">
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="glass p-8">
            <p className="text-muted-foreground">
              Não encontrou o que procurava? Entre em contato conosco pelo
              e-mail{" "}
              <a
                href="mailto:suporte@lotosmart.com.br"
                className="text-neon-blue hover:underline"
              >
                suporte@lotosmart.com.br
              </a>
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
