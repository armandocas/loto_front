import type { LotteryConfig } from "@/types/lottery";

interface DreamSymbol {
  keywords: string[];
  numbers: number[];
  weight: number;
}

const DREAM_DICTIONARY: DreamSymbol[] = [
  // Animais
  { keywords: ["avestruz", "ema"], numbers: [1, 2, 3, 4], weight: 3 },
  { keywords: ["aguia", "falcao"], numbers: [5, 6, 7, 8], weight: 3 },
  { keywords: ["burro", "jumento", "mula"], numbers: [9, 10, 11, 12], weight: 3 },
  { keywords: ["borboleta", "mariposa"], numbers: [13, 14, 15, 16], weight: 3 },
  { keywords: ["cachorro", "cao", "cadela"], numbers: [17, 18, 19, 20], weight: 3 },
  { keywords: ["cabra", "bode"], numbers: [21, 22, 23, 24], weight: 3 },
  { keywords: ["carneiro", "ovelha"], numbers: [25, 26, 27, 28], weight: 3 },
  { keywords: ["camelo", "dromedario"], numbers: [29, 30, 31, 32], weight: 3 },
  { keywords: ["cobra", "serpente", "vibora"], numbers: [33, 34, 35, 36], weight: 3 },
  { keywords: ["coelho", "lebre"], numbers: [37, 38, 39, 40], weight: 3 },
  { keywords: ["cavalo", "egua", "potro"], numbers: [41, 42, 43, 44], weight: 3 },
  { keywords: ["elefante"], numbers: [45, 46, 47, 48], weight: 3 },
  { keywords: ["galo", "galinha", "frango"], numbers: [49, 50, 51, 52], weight: 3 },
  { keywords: ["gato", "gata", "felino"], numbers: [53, 54, 55, 56], weight: 3 },
  { keywords: ["jacare", "crocodilo"], numbers: [57, 58, 59, 60], weight: 3 },
  { keywords: ["leao", "leoa"], numbers: [1, 13, 25, 37], weight: 3 },
  { keywords: ["macaco", "gorila", "chipanze"], numbers: [2, 14, 26, 38], weight: 3 },
  { keywords: ["porco", "javali"], numbers: [3, 15, 27, 39], weight: 3 },
  { keywords: ["pavao", "peru"], numbers: [4, 16, 28, 40], weight: 3 },
  { keywords: ["peru", "faisao"], numbers: [5, 17, 29, 41], weight: 2 },
  { keywords: ["touro", "boi", "vaca"], numbers: [6, 18, 30, 42], weight: 3 },
  { keywords: ["tigre", "onca", "pantera"], numbers: [7, 19, 31, 43], weight: 3 },
  { keywords: ["urso", "panda"], numbers: [8, 20, 32, 44], weight: 3 },
  { keywords: ["veado", "cervo", "corsa"], numbers: [9, 21, 33, 45], weight: 3 },
  { keywords: ["peixe", "peixes", "sardinha", "tubarao"], numbers: [10, 22, 34, 46], weight: 3 },
  { keywords: ["passaro", "ave", "pomba", "coruja"], numbers: [11, 23, 35, 47], weight: 3 },

  // Elementos naturais
  { keywords: ["agua", "rio", "mar", "oceano", "cachoeira", "chuva"], numbers: [4, 12, 24, 36, 48], weight: 4 },
  { keywords: ["fogo", "incendio", "chama", "fogueira"], numbers: [7, 14, 21, 42, 49], weight: 4 },
  { keywords: ["terra", "chao", "solo", "montanha", "morro"], numbers: [3, 9, 27, 36, 54], weight: 4 },
  { keywords: ["ar", "vento", "brisa", "tempestade", "furacão"], numbers: [5, 15, 25, 35, 55], weight: 3 },
  { keywords: ["sol", "luz", "brilho", "aurora"], numbers: [1, 10, 19, 37, 46], weight: 4 },
  { keywords: ["lua", "noite", "luar", "estrela"], numbers: [7, 14, 28, 42, 56], weight: 4 },
  { keywords: ["nuvem", "ceu", "arco-iris"], numbers: [7, 11, 22, 33, 44], weight: 3 },
  { keywords: ["flor", "rosa", "jardim", "planta"], numbers: [6, 16, 26, 36, 46], weight: 3 },
  { keywords: ["arvore", "floresta", "mata", "bosque"], numbers: [8, 18, 28, 38, 48], weight: 3 },

  // Pessoas e relações
  { keywords: ["mae", "mãe", "mama"], numbers: [5, 15, 25, 50], weight: 4 },
  { keywords: ["pai", "papa"], numbers: [4, 14, 24, 44], weight: 4 },
  { keywords: ["filho", "filha", "bebe", "criança", "crianca"], numbers: [3, 13, 23, 33], weight: 4 },
  { keywords: ["irmao", "irma", "irmão", "irmã"], numbers: [2, 12, 22, 32], weight: 3 },
  { keywords: ["avo", "avó", "avô"], numbers: [9, 19, 29, 59], weight: 3 },
  { keywords: ["marido", "esposa", "namorado", "namorada", "amor"], numbers: [6, 16, 26, 56], weight: 4 },
  { keywords: ["amigo", "amiga", "companheiro"], numbers: [11, 21, 31, 41], weight: 3 },
  { keywords: ["desconhecido", "estranho", "sombra"], numbers: [13, 31, 43, 57], weight: 3 },
  { keywords: ["morto", "falecido", "espirito", "fantasma"], numbers: [7, 17, 47, 57], weight: 4 },
  { keywords: ["rei", "rainha", "principe", "princesa"], numbers: [1, 11, 33, 55], weight: 3 },

  // Objetos
  { keywords: ["casa", "lar", "apartamento", "predio"], numbers: [8, 18, 28, 48], weight: 3 },
  { keywords: ["carro", "veiculo", "moto", "onibus"], numbers: [10, 20, 30, 40], weight: 3 },
  { keywords: ["dinheiro", "ouro", "prata", "moeda", "riqueza"], numbers: [1, 10, 24, 50, 60], weight: 5 },
  { keywords: ["chave", "porta", "cadeado"], numbers: [7, 17, 27, 37], weight: 3 },
  { keywords: ["espelho", "reflexo", "vidro"], numbers: [11, 22, 33, 44], weight: 3 },
  { keywords: ["relogio", "tempo", "hora"], numbers: [12, 24, 36, 48], weight: 3 },
  { keywords: ["livro", "carta", "papel", "escrita"], numbers: [5, 15, 35, 55], weight: 3 },
  { keywords: ["telefone", "celular", "mensagem"], numbers: [9, 19, 39, 49], weight: 2 },
  { keywords: ["comida", "alimento", "fruta", "pao"], numbers: [6, 16, 26, 46], weight: 3 },
  { keywords: ["roupa", "vestido", "sapato"], numbers: [4, 14, 34, 54], weight: 2 },
  { keywords: ["anel", "joia", "coroa", "diamante"], numbers: [1, 11, 21, 51], weight: 4 },
  { keywords: ["faca", "espada", "arma"], numbers: [13, 23, 43, 53], weight: 3 },
  { keywords: ["escada", "elevador", "subir"], numbers: [8, 18, 38, 58], weight: 3 },
  { keywords: ["ponte", "caminho", "estrada"], numbers: [10, 20, 40, 50], weight: 3 },

  // Ações e estados
  { keywords: ["voar", "voo", "asas", "planar"], numbers: [5, 15, 25, 45, 55], weight: 4 },
  { keywords: ["cair", "queda", "despencar"], numbers: [13, 23, 33, 43], weight: 3 },
  { keywords: ["correr", "fugir", "perseguir", "perseguicao"], numbers: [7, 17, 27, 47], weight: 3 },
  { keywords: ["nadar", "mergulhar", "afundar", "afogar"], numbers: [4, 14, 24, 44], weight: 3 },
  { keywords: ["morrer", "morte", "funeral"], numbers: [7, 17, 47, 57], weight: 4 },
  { keywords: ["casar", "casamento", "noiva", "noivo"], numbers: [6, 16, 26, 56], weight: 4 },
  { keywords: ["nascer", "nascimento", "parto"], numbers: [3, 13, 23, 33], weight: 4 },
  { keywords: ["chorar", "lagrima", "tristeza"], numbers: [9, 19, 29, 49], weight: 3 },
  { keywords: ["rir", "riso", "alegria", "felicidade"], numbers: [1, 11, 21, 51], weight: 3 },
  { keywords: ["gritar", "grito", "berro"], numbers: [8, 18, 38, 58], weight: 2 },
  { keywords: ["dormir", "sonhar", "acordar"], numbers: [2, 12, 22, 42], weight: 3 },
  { keywords: ["perder", "perdido", "procurar"], numbers: [13, 23, 33, 53], weight: 3 },
  { keywords: ["encontrar", "achar", "descobrir"], numbers: [1, 10, 20, 50], weight: 3 },
  { keywords: ["lutar", "briga", "guerra", "conflito"], numbers: [7, 17, 37, 57], weight: 3 },
  { keywords: ["dançar", "dancar", "danca", "musica", "cantar"], numbers: [6, 16, 36, 46], weight: 3 },

  // Emoções
  { keywords: ["medo", "terror", "pavor", "pesadelo"], numbers: [13, 31, 43, 57], weight: 4 },
  { keywords: ["paz", "calma", "tranquilidade", "serenidade"], numbers: [2, 12, 22, 42], weight: 3 },
  { keywords: ["raiva", "furia", "odio"], numbers: [7, 17, 37, 47], weight: 3 },
  { keywords: ["saudade", "nostalgia", "lembranca"], numbers: [9, 19, 29, 39], weight: 3 },
  { keywords: ["esperanca", "fe", "confianca"], numbers: [1, 11, 21, 31], weight: 3 },
  { keywords: ["surpresa", "susto", "choque"], numbers: [5, 15, 25, 55], weight: 3 },
  { keywords: ["vergonha", "timidez", "nu", "nua", "pelado"], numbers: [4, 14, 24, 34], weight: 3 },

  // Lugares
  { keywords: ["praia", "litoral", "areia"], numbers: [10, 20, 30, 50], weight: 3 },
  { keywords: ["igreja", "templo", "altar", "rezar", "orar"], numbers: [7, 17, 27, 37], weight: 3 },
  { keywords: ["escola", "aula", "professor", "aluno"], numbers: [5, 15, 25, 35], weight: 3 },
  { keywords: ["hospital", "medico", "doenca", "doente"], numbers: [8, 18, 28, 58], weight: 3 },
  { keywords: ["cemiterio", "tumba", "cova"], numbers: [13, 23, 33, 53], weight: 3 },
  { keywords: ["festa", "celebracao", "aniversario"], numbers: [6, 16, 26, 46], weight: 3 },
  { keywords: ["trabalho", "escritorio", "empresa"], numbers: [10, 20, 40, 50], weight: 2 },

  // Cores em sonhos
  { keywords: ["branco", "claro", "puro"], numbers: [1, 10, 20, 30], weight: 2 },
  { keywords: ["preto", "escuro", "trevas"], numbers: [13, 26, 39, 52], weight: 2 },
  { keywords: ["vermelho", "sangue", "rubro"], numbers: [7, 14, 28, 42], weight: 3 },
  { keywords: ["azul", "celeste", "safira"], numbers: [4, 16, 28, 40], weight: 2 },
  { keywords: ["verde", "esmeralda"], numbers: [5, 15, 30, 45], weight: 2 },
  { keywords: ["dourado", "amarelo"], numbers: [1, 10, 24, 50], weight: 3 },

  // Números mencionados
  { keywords: ["um", "uma", "primeiro"], numbers: [1, 10, 11], weight: 2 },
  { keywords: ["dois", "duas", "segundo", "par", "dupla"], numbers: [2, 20, 22], weight: 2 },
  { keywords: ["tres", "terceiro", "trio", "triangulo"], numbers: [3, 30, 33], weight: 2 },
  { keywords: ["quatro", "quadrado"], numbers: [4, 40, 44], weight: 2 },
  { keywords: ["cinco", "mao"], numbers: [5, 50, 55], weight: 2 },
  { keywords: ["seis", "meia-duzia"], numbers: [6, 16, 60], weight: 2 },
  { keywords: ["sete", "sorte"], numbers: [7, 17, 27], weight: 3 },
  { keywords: ["oito", "infinito"], numbers: [8, 18, 28], weight: 2 },
  { keywords: ["nove", "quase-dez"], numbers: [9, 19, 29], weight: 2 },
  { keywords: ["dez", "dezena"], numbers: [10, 20, 30], weight: 2 },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractDreamKeywords(dreamText: string): { symbol: DreamSymbol; matchedWord: string }[] {
  const normalized = normalize(dreamText);
  const words = normalized.split(" ");
  const matches: { symbol: DreamSymbol; matchedWord: string }[] = [];
  const usedSymbols = new Set<number>();

  for (const symbol of DREAM_DICTIONARY) {
    const symbolIdx = DREAM_DICTIONARY.indexOf(symbol);
    if (usedSymbols.has(symbolIdx)) continue;

    for (const keyword of symbol.keywords) {
      const normalizedKeyword = normalize(keyword);
      const found = words.some(
        (w) => w === normalizedKeyword || w.startsWith(normalizedKeyword.slice(0, -1))
      );
      if (found) {
        matches.push({ symbol, matchedWord: keyword });
        usedSymbols.add(symbolIdx);
        break;
      }
    }
  }

  return matches;
}

export function generateByDream(
  config: LotteryConfig,
  dreamText: string
): number[] {
  const { min, max, pick } = config.numbers;
  const matches = extractDreamKeywords(dreamText);

  const candidatePool = new Map<number, number>();

  for (const { symbol } of matches) {
    for (const num of symbol.numbers) {
      if (num >= min && num <= max) {
        const current = candidatePool.get(num) || 0;
        candidatePool.set(num, current + symbol.weight);
      }
    }
  }

  const textHash = normalize(dreamText)
    .split("")
    .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
  const hashNums = Math.abs(textHash).toString().split("").map(Number);
  for (const d of hashNums) {
    for (let mult = 1; mult * d <= max && d > 0; mult++) {
      const num = mult * d;
      if (num >= min && num <= max) {
        candidatePool.set(num, (candidatePool.get(num) || 0) + 1);
      }
    }
  }

  const confidence = Math.min(matches.length / 5, 1);
  const fromPool = Math.ceil(pick * (0.4 + confidence * 0.4));

  const ranked = Array.from(candidatePool.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => num);

  const selected = new Set<number>();
  const topPool = ranked.slice(0, Math.max(fromPool * 3, pick * 2));
  const range = max - min + 1;

  while (selected.size < pick) {
    if (topPool.length > 0 && selected.size < fromPool) {
      const idx = Math.floor(Math.random() * topPool.length);
      selected.add(topPool[idx]);
    } else {
      selected.add(Math.floor(Math.random() * range) + min);
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}
