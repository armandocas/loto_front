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

Cada loteria possui **18 métodos de geração** disponíveis na tela `/{loteria}/generate`, divididos em três categorias:

- **Métodos Clássicos** (6): Aleatório, Frequência, Quentes/Frios, Estatístico, Filtro Inteligente, IA
- **Métodos Personalizados** (4): Signos, Numerologia, Datas Especiais, Perfil Pessoal
- **Métodos Inovadores** (8): Biorritmo, Sonhos, Fase Lunar, Sinestesia, Entropia, Geo Energético, Temporal, Quântico

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
| 7 | Signos | `zodiac` | Números da sorte do zodíaco | Pool baseado no signo + números planetários |
| 8 | Numerologia | `numerology` | Energia numérica do nome | Cálculo pitagórico (destino, alma, personalidade) |
| 9 | Datas Especiais | `birthday` | Derivação de datas marcantes | Dia, mês, soma, múltiplos, combinações |
| 10 | Perfil Pessoal | `personal-profile` | Combina todos os dados pessoais | Peso ponderado: signo(3) + nome(2) + datas(2) + frase(1) |
| 11 | Biorritmo | `biorhythm` | 3 ciclos biológicos geram números diários | sin(2PI*dias/período) para físico(23), emocional(28), intelectual(33) |
| 12 | Sonhos | `dream` | Texto de sonho vira números | Dicionário PT-BR ~200 palavras-chave + tokenização |
| 13 | Fase Lunar | `lunar` | Fase da lua em tempo real | Ciclo sinótico 29.53d, 8 fases com faixas numéricas |
| 14 | Sinestesia | `color-synesthesia` | Cores selecionadas viram números | HEX→HSL, 12 zonas de hue + complementares |
| 15 | Entropia | `moment-entropy` | Movimentos do mouse como seed | xorshift128 PRNG com entropia coletada |
| 16 | Geo Energético | `geo-energy` | Localização GPS gera números | Lat/lng + golden ratio + timezone |
| 17 | Temporal | `temporal` | Instante exato da geração | 12+ features temporais + feriados BR + horas espelho |
| 18 | Quântico | `quantum-resonance` | Atrator de Lorenz caótico | Sistema de eq. diferenciais + mapa logístico |

**Request (frontend):**
```
POST /{loteria}/generate
Body: { lottery: "megasena", method: "random"|...|"quantum-resonance", quantity: 1-20, filters?: {...}, personalData?: { fullName?, birthDate?, zodiacSign?, specialDates?, luckyPhrase?, dreamText?, selectedColors?, quantumSeed?, chaosIntensity?, geoCoords?, entropyData? } }
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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

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
| 7-10 | Signos / Numerologia / Datas / Perfil | `zodiac` `numerology` `birthday` `personal-profile` | Métodos pessoais | Dados pessoais do usuário |

**Extra:** `extraNumbers` = 2 trevos de 1 a 6

---

## Métodos Personalizados e Inovadores - Detalhamento

Os 4 métodos personalizados e 8 métodos inovadores usam dados do usuário, ambiente e ciência para gerar números. Todos disponíveis para **todas as 10 loterias**.

### Signos do Zodíaco (`zodiac`)
- **Entrada:** Signo do zodíaco OU data de nascimento (auto-detecta signo)
- **Lógica:** Cada signo possui um pool de números da sorte + números planetários. ~70% dos números vêm do pool do signo, ~30% são aleatórios
- **12 signos:** Áries, Touro, Gêmeos, Câncer, Leão, Virgem, Libra, Escorpião, Sagitário, Capricórnio, Aquário, Peixes

### Numerologia (`numerology`)
- **Entrada:** Nome completo do usuário
- **Lógica:** Tabela pitagórica (A=1, B=2 ... I=9, J=1 ...). Calcula 3 números mestres:
  - **Número do Destino:** soma total de todas as letras
  - **Número da Alma:** soma das vogais
  - **Número da Personalidade:** soma das consoantes
- ~60% dos números derivam dos múltiplos dos números mestres, ~40% aleatórios

### Datas Especiais (`birthday`)
- **Entrada:** Data de nascimento + datas marcantes (casamento, filhos, etc.)
- **Lógica:** Extrai dia, mês, soma dia+mês, diferença, últimos 2 dígitos do ano, soma dos dígitos do ano. Gera combinações (soma, diferença, múltiplos). ~70% do pool derivado, ~30% aleatórios

### Perfil Pessoal (`personal-profile`)
- **Entrada:** Combinação de todos os dados (signo + nome + datas + frase da sorte)
- **Lógica:** Sistema de peso ponderado:
  - Números do signo: peso 3
  - Números do nome (numerologia): peso 2
  - Números das datas: peso 2-3
  - Números da frase da sorte: peso 1-2
- Gera um ranking de candidatos e seleciona ~70% dos mais bem pontuados + ~30% aleatórios

### Biorritmo (`biorhythm`)
- **Entrada:** Data de nascimento
- **Lógica:** 3 ciclos senoidais: Físico (23d), Emocional (28d), Intelectual (33d). Fórmula: sin(2*PI*dias/período). Mapeia posição [-1,+1] de cada ciclo para faixas numéricas. "Dia de Ouro" quando todos os ciclos são positivos
- **UI:** Gráfico SVG das 3 ondas com indicador do dia atual

### Interpretação de Sonhos (`dream`)
- **Entrada:** Texto livre descrevendo um sonho
- **Lógica:** Dicionário PT-BR com ~200 palavras-chave (animais, elementos, emoções, ações, objetos). Tokenização com normalização de acentos e stemming básico. Confiança proporcional ao número de símbolos detectados
- **UI:** Textarea com detecção de keywords em tempo real + barra de confiança

### Fase Lunar (`lunar`)
- **Entrada:** Nenhuma (auto-calculado)
- **Lógica:** Ciclo sinótico (29.53059 dias) a partir de lua nova conhecida (06/01/2000). 8 fases: Nova→Cheia→Minguante. Cada fase favorece faixas diferentes (Nova=baixos, Cheia=altos). Iluminação e dia lunar como números extras
- **UI:** Visualização da fase lunar com emoji + percentual de iluminação

### Sinestesia Cromática (`color-synesthesia`)
- **Entrada:** 2-5 cores selecionadas pelo usuário
- **Lógica:** HEX→HSL. Hue dividido em 12 zonas com números associados. Saturação alta=ímpares, baixa=pares. Luminosidade alta=baixos, baixa=altos. Cores complementares geram números espelhados
- **UI:** Grid de 16 cores preset com seleção visual + badges das selecionadas

### Entropia do Momento (`moment-entropy`)
- **Entrada:** Movimentos do mouse coletados interativamente
- **Lógica:** Coleta mouseX, mouseY + timestamp em microsegundos. xorshift128 PRNG com seed derivada da entropia. Mínimo 20 amostras para gerar
- **UI:** Área interativa com partículas visuais + barra de progresso de energia

### Mapa Geo Energético (`geo-energy`)
- **Entrada:** Geolocation API do browser (lat/lng)
- **Lógica:** Graus e minutos como números base. Cross-multiplication lat*lng. Multiplicação por golden ratio (phi=1.618...) + extração de dígitos. Fallback: timezone offset se permissão negada
- **UI:** Botão de permissão de localização + display de coordenadas

### Inteligência Temporal (`temporal`)
- **Entrada:** Nenhuma (timestamp exato da geração)
- **Lógica:** 12+ features: hora, minuto, segundo, dia semana, dia mês, dia ano, semana ISO. 13 feriados brasileiros (bonus). Números mestres (11/22/33). Horas espelho (11:11, 22:22)
- **UI:** Indicador de análise temporal automática

### Ressonância Quântica (`quantum-resonance`)
- **Entrada:** Frase semente + intensidade do caos (1-10)
- **Lógica:** Atrator de Lorenz (dx/dt=σ*(y-x), dy/dt=x*(ρ-z)-y, dz/dt=x*y-β*z). Condição inicial: hash da frase semente. Intensidade controla iterações (100-10000). Mapa logístico (r=3.57-4.0) como camada extra
- **UI:** Visualização SVG do atrator em tempo real + slider de intensidade

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
| `/{loteria}/generate` | Gerar Jogos | 18 métodos (6 clássicos + 4 pessoais + 8 inovadores), seletor quantidade, formulários condicionais (dados pessoais, sonhos, cores, entropia, geoloc, quântico), lista de jogos gerados (copiar, salvar) |
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
| `POST` | `/api/games/generate-personal` | Gerar jogos pessoais (server) | `/{loteria}/generate` (métodos pessoais) |
| `PUT` | `/api/user/personal-data` | Salvar dados pessoais | `/{loteria}/generate` (formulário pessoal) |
| `GET` | `/api/user/personal-data` | Buscar dados pessoais | `/{loteria}/generate` (pré-preencher) |
| `POST` | `/api/games/save` | Salvar jogo | `/{loteria}/generate` |
| `GET` | `/api/games/saved` | Listar salvos | `/saved-games` |
| `DELETE` | `/api/games/saved/{id}` | Remover salvo | `/saved-games` |
| `GET` | `/api/user/profile` | Dados do usuário | `/profile` |
| `PUT` | `/api/user/preferences` | Atualizar preferências | `/profile` |

**Obs:** Enquanto `NEXT_PUBLIC_USE_MOCKS=true`, todos os dados vêm de `src/mocks/results.ts`. Os métodos de geração (exceto IA) rodam 100% no client-side. Os 8 métodos inovadores (biorritmo, sonhos, lunar, sinestesia, entropia, geo, temporal, quântico) também rodam 100% client-side.
