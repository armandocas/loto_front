"use client";

import { motion } from "framer-motion";
import { Cookie, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const sections = [
  {
    title: "1. O Que São Cookies",
    content: `Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles permitem que o site reconheça seu dispositivo e armazene informações sobre suas preferências e ações anteriores.

Os cookies podem ser "persistentes" (permanecem no dispositivo até serem excluídos ou expirarem) ou "de sessão" (são removidos ao fechar o navegador).

Além de cookies, podemos utilizar tecnologias similares como web beacons, pixels de rastreamento e armazenamento local (localStorage) para finalidades semelhantes.`,
  },
  {
    title: "2. Cookies Essenciais",
    content: `Estes cookies são estritamente necessários para o funcionamento da Plataforma e não podem ser desativados. Eles incluem:

• Autenticação: mantêm sua sessão ativa enquanto você navega pela Plataforma, evitando a necessidade de fazer login a cada página;
• Segurança: protegem contra ataques CSRF (Cross-Site Request Forgery) e outras ameaças;
• Preferências do sistema: armazenam configurações essenciais como idioma e região;
• Balanceamento de carga: garantem o desempenho adequado dos nossos servidores.

Base legal: legítimo interesse e execução de contrato.`,
  },
  {
    title: "3. Cookies de Análise",
    content: `Utilizamos cookies analíticos para entender como os visitantes interagem com a Plataforma, permitindo melhorias contínuas. Esses cookies coletam informações de forma agregada e anônima.

Ferramentas utilizadas:

• Google Analytics: coleta dados sobre páginas visitadas, tempo de permanência, origem do tráfego e comportamento de navegação. Os dados são anonimizados através de mascaramento de IP;
• Ferramentas internas: métricas de uso das funcionalidades da Plataforma, como loterias mais acessadas e métodos de geração mais utilizados.

Base legal: consentimento do titular.
Retenção: até 26 meses.`,
  },
  {
    title: "4. Cookies de Preferências",
    content: `Estes cookies permitem que a Plataforma lembre de escolhas que você faz para oferecer uma experiência mais personalizada:

• Tema visual: claro, escuro ou automático;
• Loterias favoritas: suas loterias preferenciais para acesso rápido;
• Configurações de geração: parâmetros salvos dos seus métodos de geração favoritos;
• Notificações: suas preferências de comunicação e alertas;
• Layout: personalização da interface do usuário.

Base legal: consentimento do titular.
Retenção: até 12 meses.`,
  },
  {
    title: "5. Como Gerenciar Cookies",
    content: `Você tem controle total sobre os cookies utilizados pela Plataforma. Existem diferentes formas de gerenciá-los:

Configurações do navegador: a maioria dos navegadores permite bloquear ou excluir cookies através das configurações de privacidade. Consulte a documentação do seu navegador:

• Chrome: Configurações > Privacidade e segurança > Cookies
• Firefox: Configurações > Privacidade e Segurança > Cookies
• Safari: Preferências > Privacidade > Cookies
• Edge: Configurações > Privacidade > Cookies

Atenção: desativar cookies essenciais pode comprometer o funcionamento da Plataforma, incluindo a impossibilidade de fazer login e salvar jogos.

Cookies de análise e preferências podem ser desativados sem impacto nas funcionalidades principais.`,
  },
  {
    title: "6. Atualizações da Política",
    content: `Esta Política de Cookies pode ser atualizada periodicamente para refletir mudanças nas tecnologias utilizadas, nas práticas da Plataforma ou na legislação aplicável.

Alterações significativas serão comunicadas por meio de aviso destacado na Plataforma. A data da última atualização será sempre indicada no topo desta página.

Recomendamos que você revise esta política periodicamente para se manter informado sobre como utilizamos cookies.

Para dúvidas sobre esta Política de Cookies, entre em contato com nosso Encarregado de Proteção de Dados: dpo@lotosmart.com.br.`,
  },
];

export default function CookiesPage() {
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
              <Cookie className="h-8 w-8 text-neon-blue" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">
              Política de Cookies
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            Entenda como utilizamos cookies e tecnologias similares na nossa
            plataforma.
          </p>
          <p className="text-sm text-muted-foreground mb-12">
            Última atualização: Março de 2026
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card className="glass">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="glass p-8">
            <p className="text-muted-foreground">
              Dúvidas sobre cookies? Fale com nosso DPO:{" "}
              <a
                href="mailto:dpo@lotosmart.com.br"
                className="text-neon-blue hover:underline"
              >
                dpo@lotosmart.com.br
              </a>
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
