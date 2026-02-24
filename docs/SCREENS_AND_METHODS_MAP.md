# LotoSmart - Mapa Completo de Telas e Métodos de Geração

---

## Mapa Geral de Navegação

```
/                                Landing Page (pública)
├── /login                       Tela de Login
├── /register                    Tela de Registro
├── /forgot-password             Recuperação de Senha
│
├── /dashboard                   Dashboard (área logada)
├── /profile                     Perfil do Usuário
├── /saved-games                 Jogos Salvos
│
├── /megasena                    Módulo Mega-Sena
│   ├── /megasena/generate       Gerar Jogos
│   ├── /megasena/results        Resultados Passados
│   └── /megasena/statistics     Estatísticas
│
├── /lotofacil                   Módulo Lotofácil
│   ├── /lotofacil/generate
│   ├── /lotofacil/results
│   └── /lotofacil/statistics
│
├── /quina                       Módulo Quina
│   ├── /quina/generate
│   ├── /quina/results
│   └── /quina/statistics
│
├── /lotomania                   Módulo Lotomania
│   ├── /lotomania/generate
│   ├── /lotomania/results
│   └── /lotomania/statistics
│
├── /timemania                   Módulo Timemania
│   ├── /timemania/generate
│   ├── /timemania/results
│   └── /timemania/statistics
│
├── /duplasena                   Módulo Dupla Sena
│   ├── /duplasena/generate
│   ├── /duplasena/results
│   └── /duplasena/statistics
│
├── /federal                     Módulo Federal
│   ├── /federal/generate
│   ├── /federal/results
│   └── /federal/statistics
│
├── /diadesorte                  Módulo Dia de Sorte
│   ├── /diadesorte/generate
│   ├── /diadesorte/results
│   └── /diadesorte/statistics
│
├── /supersete                   Módulo Super Sete
│   ├── /supersete/generate
│   ├── /supersete/results
│   └── /supersete/statistics
│
└── /maismilionaria              Módulo +Milionária
    ├── /maismilionaria/generate
    ├── /maismilionaria/results
    └── /maismilionaria/statistics
```

---

## Métodos de Geração por Loteria

Cada loteria possui 6 métodos de geração disponíveis na tela `/{loteria}/generate`.

---

### 1. MEGA-SENA

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração totalmente randômica | 6 números de 1 a 60 |
| 2 | Frequência | `frequency` | Baseado nos números mais sorteados historicamente | Pool dos top 18 mais frequentes, sorteia 6 |
| 3 | Quentes/Frios | `hot-cold` | Análise dos últimos concursos | 60% quentes + 40% frios dos últimos N sorteios |
| 4 | Estatístico | `statistical` | Análise de probabilidade avançada | Score: 40% frequência + 60% gap (tempo sem sair) |
| 5 | Filtro Inteligente | `smart-filter` | Critérios definidos pelo usuário | Par/ímpar, faixa soma, excluir/incluir números, consecutivos |
| 6 | Inteligência Artificial | `ai` | Sugestões baseadas em IA | Request à API backend (mock: random) |

**Request (frontend):**
```
POST /{loteria}/generate
Body: { lottery: "megasena", method: "random"|"frequency"|"hot-cold"|"statistical"|"smart-filter"|"ai", quantity: 1-20, filters?: {...} }
```

**Response:**
```json
{
  "id": "1708900000000-abc1234",
  "lottery": "megasena",
  "numbers": [7, 14, 23, 35, 42, 58],
  "method": "random",
  "createdAt": "2026-02-24T...",
  "saved": false
}
```

---

### 2. LOTOFÁCIL

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração totalmente randômica | 15 números de 1 a 25 |
| 2 | Frequência | `frequency` | Números mais sorteados | Pool dos top 45 mais frequentes, sorteia 15 |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | 60% quentes + 40% frios |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score frequência + gap |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Par/ímpar, soma, consecutivos |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

---

### 3. QUINA

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração randômica | 5 números de 1 a 80 |
| 2 | Frequência | `frequency` | Números mais sorteados | Pool dos top 15, sorteia 5 |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | 60% quentes + 40% frios |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score frequência + gap |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Par/ímpar, soma, consecutivos |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

---

### 4. LOTOMANIA

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração randômica | 50 números de 0 a 99 |
| 2 | Frequência | `frequency` | Números mais sorteados | Pool dos top 150, sorteia 50 |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | 60% quentes + 40% frios |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score frequência + gap |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Par/ímpar, soma, consecutivos |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

---

### 5. TIMEMANIA

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração randômica | 10 números de 1 a 80 + 1 extra (Time) |
| 2 | Frequência | `frequency` | Números mais sorteados | Pool dos top 30, sorteia 10 |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | 60% quentes + 40% frios |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score frequência + gap |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Par/ímpar, soma, consecutivos |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

**Extra:** `extraNumbers` = 1 número de 1 a 80 (Time do Coração)

---

### 6. DUPLA SENA

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração randômica | 6 números de 1 a 50 |
| 2 | Frequência | `frequency` | Números mais sorteados | Pool dos top 18, sorteia 6 |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | 60% quentes + 40% frios |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score frequência + gap |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Par/ímpar, soma, consecutivos |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

**Obs:** O mesmo jogo vale para os 2 sorteios da Dupla Sena.

---

### 7. FEDERAL

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração randômica | 1 bilhete (0 a 99999) |
| 2 | Frequência | `frequency` | Terminações mais sorteadas | Baseado em padrões de terminação |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | Análise de finais quentes/frios |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score de distribuição |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Faixa de valores, terminações |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

**Obs:** Loteria de bilhete, não de dezenas. Geração de número de 5 dígitos.

---

### 8. DIA DE SORTE

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração randômica | 7 números de 1 a 31 + 1 mês (1 a 12) |
| 2 | Frequência | `frequency` | Números mais sorteados | Pool dos top 21, sorteia 7 |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | 60% quentes + 40% frios |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score frequência + gap |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Par/ímpar, soma, consecutivos |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

**Extra:** `extraNumbers` = 1 número de 1 a 12 (Mês da Sorte)

---

### 9. SUPER SETE

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração randômica | 7 números (1 por coluna, 0 a 9) |
| 2 | Frequência | `frequency` | Dígitos mais sorteados | Por coluna |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | Análise por coluna |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score por coluna |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Distribuição de dígitos |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

**Obs:** 7 colunas, cada coluna de 0 a 9. Estrutura diferente das demais.

---

### 10. +MILIONÁRIA

| # | Método | ID | Descrição | Regra |
|---|--------|----|-----------|-------|
| 1 | Aleatório | `random` | Geração randômica | 6 números de 1 a 50 + 2 trevos de 1 a 6 |
| 2 | Frequência | `frequency` | Números mais sorteados | Pool dos top 18, sorteia 6 + trevos |
| 3 | Quentes/Frios | `hot-cold` | Últimos concursos | 60% quentes + 40% frios + trevos |
| 4 | Estatístico | `statistical` | Probabilidade avançada | Score frequência + gap |
| 5 | Filtro Inteligente | `smart-filter` | Critérios do usuário | Par/ímpar, soma, consecutivos |
| 6 | Inteligência Artificial | `ai` | IA | Request à API backend |

**Extra:** `extraNumbers` = 2 trevos de 1 a 6

---

## Resumo Compilado - Todas as Telas

### Telas Públicas (sem autenticação)

| Rota | Tela | Componentes |
|------|------|-------------|
| `/` | Landing Page | Hero, Features, Loterias, ComoFunciona, Stats, CTA, Footer |
| `/login` | Login | LoginForm (email/senha + Google) |
| `/register` | Registro | RegisterForm (nome, email, senha, confirmar) |
| `/forgot-password` | Recuperar Senha | ForgotPasswordForm (email) |

### Telas Protegidas (autenticação obrigatória)

| Rota | Tela | Componentes |
|------|------|-------------|
| `/dashboard` | Dashboard | StatsCards (4), LotteryGrid (10 cards), RecentGames |
| `/profile` | Perfil | Info pessoal, Preferências (tema), Logout |
| `/saved-games` | Jogos Salvos | Lista de jogos salvos (copiar, remover) |

### Telas por Módulo de Loteria (x10 loterias)

| Rota | Tela | Componentes |
|------|------|-------------|
| `/{loteria}` | Home da Loteria | 3 cards (Gerar, Resultados, Estatísticas), Último resultado, Info |
| `/{loteria}/generate` | Gerar Jogos | 6 métodos, seletor quantidade, lista de jogos gerados (copiar, salvar) |
| `/{loteria}/results` | Resultados | Lista dos últimos concursos com números, prêmios, acumulado |
| `/{loteria}/statistics` | Estatísticas | Gráfico frequência (Recharts), Top 10 quentes, Top 10 frios, Par/Ímpar |

### Total de Telas

| Categoria | Quantidade |
|-----------|-----------|
| Públicas | 4 |
| Protegidas (fixas) | 3 |
| Por loteria (10 x 4) | 40 |
| **Total** | **47 telas** |

---

## Mapa de Requests à API Backend (futuro)

| Método HTTP | Endpoint | Descrição | Usado em |
|-------------|----------|-----------|----------|
| `GET` | `/api/lotteries/{slug}/results?limit=N` | Resultados passados | `/{loteria}/results` |
| `GET` | `/api/lotteries/{slug}/latest` | Último resultado | `/{loteria}`, `/dashboard` |
| `GET` | `/api/lotteries/{slug}/statistics` | Frequência, stats | `/{loteria}/statistics` |
| `POST` | `/api/games/generate` | Gerar jogos (IA) | `/{loteria}/generate` (método ai) |
| `POST` | `/api/games/save` | Salvar jogo | `/{loteria}/generate` |
| `GET` | `/api/games/saved` | Listar salvos | `/saved-games` |
| `DELETE` | `/api/games/saved/{id}` | Remover salvo | `/saved-games` |
| `GET` | `/api/user/profile` | Dados do usuário | `/profile` |
| `PUT` | `/api/user/preferences` | Atualizar preferências | `/profile` |

**Obs:** Enquanto `NEXT_PUBLIC_USE_MOCKS=true`, todos os dados vêm de `src/mocks/results.ts`. Os métodos de geração (exceto IA) rodam 100% no client-side.
