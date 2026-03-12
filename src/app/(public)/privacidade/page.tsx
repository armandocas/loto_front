"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const sections = [
  {
    title: "1. Dados Coletados",
    content: `O LotoSmart coleta as seguintes categorias de dados pessoais:

Dados de cadastro: nome completo, endereço de e-mail, senha (armazenada de forma criptografada) e, opcionalmente, data de nascimento e telefone.

Dados de uso: informações sobre como você utiliza a Plataforma, incluindo jogos gerados, loterias selecionadas, funcionalidades acessadas e preferências de configuração.

Dados técnicos: endereço IP, tipo e versão do navegador, sistema operacional, identificadores de dispositivo, páginas visitadas, horários de acesso e dados de desempenho.

Dados de pagamento: quando aplicável, informações de faturamento são processadas por nossos parceiros de pagamento certificados. O LotoSmart não armazena dados completos de cartão de crédito.`,
  },
  {
    title: "2. Como Usamos Seus Dados",
    content: `Seus dados pessoais são utilizados para as seguintes finalidades:

• Fornecer, manter e melhorar nossos serviços;
• Criar e gerenciar sua conta de usuário;
• Processar transações e enviar confirmações;
• Personalizar sua experiência na Plataforma;
• Enviar comunicações sobre atualizações, novidades e promoções (com seu consentimento);
• Realizar conferência automática de jogos e enviar notificações de resultados;
• Gerar análises estatísticas agregadas e anônimas sobre o uso da Plataforma;
• Prevenir fraudes e garantir a segurança da Plataforma;
• Cumprir obrigações legais e regulatórias.

A base legal para o tratamento dos seus dados inclui: execução de contrato, consentimento do titular, legítimo interesse e cumprimento de obrigação legal, conforme previsto na LGPD.`,
  },
  {
    title: "3. Cookies e Rastreamento",
    content: `Utilizamos cookies e tecnologias similares para melhorar sua experiência. Os cookies utilizados são categorizados em:

Essenciais: necessários para o funcionamento básico da Plataforma, como autenticação e segurança.

Analíticos: utilizados para entender como os usuários interagem com a Plataforma, através de ferramentas como Google Analytics, permitindo melhorias contínuas.

Preferências: armazenam suas escolhas de configuração, como tema visual e loterias favoritas.

Para informações detalhadas, consulte nossa Política de Cookies.`,
  },
  {
    title: "4. Compartilhamento com Terceiros",
    content: `O LotoSmart não vende, aluga ou comercializa seus dados pessoais. Podemos compartilhar informações nas seguintes circunstâncias:

Prestadores de serviço: empresas contratadas para operar partes da Plataforma (hospedagem, processamento de pagamentos, envio de e-mails), que atuam sob nossas instruções e estão sujeitas a obrigações de confidencialidade.

Obrigações legais: quando exigido por lei, regulamentação, processo judicial ou solicitação governamental legítima.

Proteção de direitos: quando necessário para proteger os direitos, propriedade ou segurança do LotoSmart, de nossos usuários ou do público.

Dados anonimizados: podemos compartilhar dados agregados e anonimizados que não permitem a identificação individual, para fins de pesquisa e análise.`,
  },
  {
    title: "5. Segurança dos Dados",
    content: `Adotamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais, incluindo:

• Criptografia de dados em trânsito (TLS/SSL) e em repouso;
• Controle de acesso restrito a dados pessoais;
• Monitoramento contínuo de segurança e detecção de ameaças;
• Auditorias periódicas de segurança;
• Treinamento regular da equipe sobre proteção de dados;
• Plano de resposta a incidentes de segurança.

Embora adotemos as melhores práticas do mercado, nenhum sistema é 100% seguro. Em caso de incidente de segurança que possa afetar seus dados, notificaremos você e a Autoridade Nacional de Proteção de Dados (ANPD) conforme exigido pela LGPD.`,
  },
  {
    title: "6. Seus Direitos (LGPD)",
    content: `De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem os seguintes direitos:

• Confirmação da existência de tratamento de dados;
• Acesso aos seus dados pessoais;
• Correção de dados incompletos, inexatos ou desatualizados;
• Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;
• Portabilidade dos dados a outro fornecedor;
• Eliminação dos dados tratados com base no consentimento;
• Informação sobre compartilhamento de dados com terceiros;
• Informação sobre a possibilidade de não fornecer consentimento e suas consequências;
• Revogação do consentimento a qualquer momento.

Para exercer qualquer destes direitos, entre em contato com nosso Encarregado de Proteção de Dados (DPO). Responderemos sua solicitação em até 15 (quinze) dias úteis.`,
  },
  {
    title: "7. Retenção de Dados",
    content: `Seus dados pessoais são retidos pelo tempo necessário para cumprir as finalidades descritas nesta Política, salvo quando um período de retenção mais longo for exigido ou permitido por lei.

Dados de conta: mantidos enquanto sua conta estiver ativa. Após o cancelamento, seus dados são retidos por até 6 (seis) meses para fins operacionais e, quando aplicável, por períodos adicionais para cumprimento de obrigações legais.

Dados de transação: mantidos pelo prazo legal de 5 (cinco) anos para fins fiscais e contábeis.

Dados de uso e analíticos: anonimizados após 24 (vinte e quatro) meses.

Após o término do período de retenção, os dados são eliminados de forma segura e irreversível.`,
  },
  {
    title: "8. Contato do DPO",
    content: `O Encarregado de Proteção de Dados (Data Protection Officer — DPO) do LotoSmart é o responsável por garantir a conformidade com a LGPD e atender suas solicitações.

Para exercer seus direitos, esclarecer dúvidas ou registrar reclamações sobre o tratamento de dados pessoais, entre em contato:

E-mail: dpo@lotosmart.com.br

Você também tem o direito de apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD) caso considere que o tratamento dos seus dados viola a legislação aplicável.`,
  },
];

export default function PrivacidadePage() {
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
              <Shield className="h-8 w-8 text-neon-blue" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">
              Política de Privacidade
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            Saiba como coletamos, usamos e protegemos seus dados pessoais.
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
              Dúvidas sobre privacidade? Fale com nosso DPO:{" "}
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
