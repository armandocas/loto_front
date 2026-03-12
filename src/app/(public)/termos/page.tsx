"use client";

import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const sections = [
  {
    title: "1. Aceitação dos Termos",
    content: `Ao acessar e utilizar a plataforma LotoSmart ("Plataforma"), você declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição, solicitamos que interrompa imediatamente o uso da Plataforma.

O uso continuado da Plataforma após eventuais atualizações destes Termos constitui sua aceitação das modificações realizadas.`,
  },
  {
    title: "2. Descrição do Serviço",
    content: `O LotoSmart é uma plataforma digital que oferece ferramentas de geração, gestão e conferência de jogos das loterias federais brasileiras operadas pela Caixa Econômica Federal.

Nossos serviços incluem: geração de combinações numéricas através de algoritmos estatísticos e aleatórios, armazenamento e organização de jogos, conferência automática de resultados e análises estatísticas de sorteios anteriores.

O LotoSmart NÃO realiza venda de bilhetes de loteria, apostas ou qualquer operação financeira relacionada a jogos. A compra de bilhetes deve ser feita exclusivamente nos canais oficiais da Caixa Econômica Federal.`,
  },
  {
    title: "3. Cadastro e Conta",
    content: `Para utilizar determinadas funcionalidades da Plataforma, é necessário criar uma conta fornecendo informações pessoais verídicas e atualizadas.

Você é responsável por manter a confidencialidade de suas credenciais de acesso (e-mail e senha) e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente em caso de uso não autorizado.

Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos, apresentem informações falsas ou sejam utilizadas para atividades ilícitas.`,
  },
  {
    title: "4. Uso Permitido",
    content: `A Plataforma deve ser utilizada exclusivamente para fins pessoais e não comerciais. É expressamente proibido:

• Utilizar a Plataforma para fins ilegais ou não autorizados;
• Reproduzir, distribuir ou comercializar o conteúdo da Plataforma sem autorização;
• Tentar acessar sistemas, dados ou informações de outros usuários;
• Utilizar bots, scrapers ou ferramentas automatizadas para acessar a Plataforma;
• Interferir no funcionamento normal da Plataforma ou de seus servidores;
• Revender ou sublicenciar o acesso à Plataforma ou a seus serviços.`,
  },
  {
    title: "5. Propriedade Intelectual",
    content: `Todo o conteúdo da Plataforma, incluindo mas não limitado a textos, gráficos, logotipos, ícones, imagens, algoritmos, software e design, é de propriedade exclusiva do LotoSmart ou de seus licenciadores, protegido pelas leis brasileiras de propriedade intelectual.

O uso da Plataforma não confere ao usuário qualquer direito de propriedade sobre o conteúdo ou a tecnologia utilizada. É proibida a reprodução, modificação, distribuição ou uso comercial do conteúdo sem autorização prévia e expressa.`,
  },
  {
    title: "6. Limitação de Responsabilidade",
    content: `O LotoSmart é uma ferramenta de apoio ao jogador e NÃO GARANTE, sob nenhuma hipótese, a obtenção de prêmios em jogos de loteria. Os sorteios são eventos aleatórios e independentes, regulamentados exclusivamente pela Caixa Econômica Federal.

O LotoSmart não se responsabiliza por:
• Perdas financeiras decorrentes de jogos realizados com base nas combinações geradas;
• Indisponibilidade temporária da Plataforma por motivos técnicos ou de manutenção;
• Erros ou atrasos na conferência de resultados, devendo o usuário sempre conferir os resultados oficiais;
• Danos indiretos, incidentais ou consequenciais decorrentes do uso da Plataforma;
• Decisões de jogo tomadas pelo usuário com base em informações da Plataforma.

A responsabilidade total do LotoSmart, em qualquer circunstância, está limitada ao valor pago pelo usuário nos últimos 12 meses pelo uso da Plataforma.`,
  },
  {
    title: "7. Jogo Responsável",
    content: `O LotoSmart promove e incentiva o jogo responsável. Recomendamos que você:

• Defina um orçamento mensal para jogos e não o ultrapasse;
• Não jogue com dinheiro destinado a despesas essenciais;
• Encare a loteria como entretenimento, não como fonte de renda;
• Procure ajuda profissional se perceber sinais de jogo compulsivo.

Oferecemos ferramentas de autogestão, incluindo limites de gastos e opção de autoexclusão temporária ou permanente. Para suporte, entre em contato com nosso atendimento.`,
  },
  {
    title: "8. Modificações dos Termos",
    content: `Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento, mediante publicação da versão atualizada na Plataforma. Alterações significativas serão comunicadas por e-mail ou notificação na Plataforma com antecedência mínima de 30 (trinta) dias.

O uso contínuo da Plataforma após a data de vigência das alterações implica aceitação dos novos termos. Caso não concorde, você poderá encerrar sua conta sem qualquer ônus.`,
  },
  {
    title: "9. Foro Competente",
    content: `Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo, Estado de São Paulo, como competente para dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.

Para questões, dúvidas ou solicitações relacionadas a estes Termos, entre em contato pelo e-mail: juridico@lotosmart.com.br.`,
  },
];

export default function TermosPage() {
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
              <FileText className="h-8 w-8 text-neon-blue" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">Termos de Uso</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            Leia atentamente os termos e condições de uso da plataforma
            LotoSmart.
          </p>
          <p className="text-sm text-muted-foreground mb-12">
            Última atualização: Março de 2026
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="show"
        >
          {sections.map((section) => (
            <motion.div
              key={section.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="glass p-8">
            <p className="text-muted-foreground">
              Dúvidas sobre os termos? Entre em contato pelo e-mail{" "}
              <a
                href="mailto:juridico@lotosmart.com.br"
                className="text-neon-blue hover:underline"
              >
                juridico@lotosmart.com.br
              </a>
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
