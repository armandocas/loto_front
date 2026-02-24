# LotoSmart - Gerador Inteligente de Jogos da Loteria

Sistema frontend completo para geração de jogos da loteria federal brasileira usando IA, análise estatística e filtros avançados.

## Stack Tecnológica

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Auth**: Firebase Authentication
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Animações**: Framer Motion
- **Gráficos**: Recharts

## Loterias Suportadas

Mega-Sena, Lotofácil, Quina, Lotomania, Timemania, Dupla Sena, Federal, Dia de Sorte, Super Sete, +Milionária

## Métodos de Geração

- **Aleatório** - Geração randômica
- **Frequência** - Baseado nos números mais sorteados
- **Quentes/Frios** - Análise dos últimos concursos
- **Estatístico** - Análise de probabilidade
- **Filtro Inteligente** - Critérios personalizados
- **IA** - Sugestões baseadas em inteligência artificial

## Pré-requisitos

- Node.js 20+
- pnpm 10+

## Setup

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Preencha as credenciais do Firebase no .env.local

# Rodar em desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Rodar build de produção
pnpm start
```

## Estrutura do Projeto

```
src/
├── app/              # Rotas (App Router)
│   ├── (public)/     # Landing page
│   ├── (auth)/       # Login, Register, Forgot Password
│   └── (app)/        # Dashboard, Loterias (protegido)
├── components/       # Componentes reutilizáveis
│   ├── ui/           # shadcn/ui
│   ├── layout/       # Header, Footer, Sidebar
│   ├── landing/      # Seções da landing page
│   ├── auth/         # Formulários de autenticação
│   └── ...
├── lib/              # Lógica de negócio
│   ├── firebase/     # Config e auth helpers
│   ├── api/          # Client HTTP e services
│   └── generators/   # Algoritmos de geração
├── hooks/            # Custom hooks
├── stores/           # Zustand stores
├── types/            # TypeScript types
├── constants/        # Configurações e constantes
└── mocks/            # Dados simulados
```

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |
| `NEXT_PUBLIC_API_BASE_URL` | URL base da API backend |
| `NEXT_PUBLIC_USE_MOCKS` | `true` para usar dados mockados |

## Licença

MIT
