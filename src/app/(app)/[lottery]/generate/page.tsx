"use client";

import { use, useState, useMemo, useCallback } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shuffle,
  BarChart3,
  Flame,
  TrendingUp,
  SlidersHorizontal,
  Brain,
  Star,
  Hash,
  CalendarHeart,
  FingerprintPattern,
  Activity,
  CloudMoon,
  Moon,
  Palette,
  Zap,
  MapPin,
  Clock,
  Atom,
  Bookmark,
  Copy,
  Trash2,
  Plus,
  X,
  Sparkles,
  User,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOTTERIES, GENERATION_METHODS } from "@/constants/lotteries";
import { generateGames } from "@/lib/generators";
import { ZODIAC_INFO } from "@/lib/generators/zodiac";
import { isEntropyReady } from "@/lib/generators/moment-entropy";
import { useGameStore } from "@/stores/game.store";
import { useResponsibleStore } from "@/stores/responsible.store";
import { MOCK_RESULTS, getMockFrequency } from "@/mocks/results";
import { ShareGameDialog } from "@/components/games/ShareGameDialog";
import { useSubscriptionStore } from "@/stores/subscription.store";
import { useFeatureGate } from "@/hooks/use-feature-gate";
import { MethodLock } from "@/components/subscription/MethodLock";

import { BiorhythmChart } from "@/components/generators/BiorhythmChart";
import { DreamInput } from "@/components/generators/DreamInput";
import { LunarPhaseDisplay } from "@/components/generators/LunarPhaseDisplay";
import { ColorPicker } from "@/components/generators/ColorPicker";
import { EntropyCollector } from "@/components/generators/EntropyCollector";
import { GeoLocationDisplay } from "@/components/generators/GeoLocationDisplay";
import { QuantumControls } from "@/components/generators/QuantumControls";

import type { LotterySlug } from "@/types/lottery";
import type {
  GenerationMethod,
  GeneratedGame,
  PersonalData,
  ZodiacSign,
} from "@/types/game";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shuffle, BarChart3, Flame, TrendingUp, SlidersHorizontal, Brain,
  Star, Hash, CalendarHeart, FingerprintPattern,
  Activity, CloudMoon, Moon, Palette, Zap, MapPin, Clock, Atom,
};

const PERSONAL_METHODS_SET = new Set<GenerationMethod>([
  "zodiac", "numerology", "birthday", "personal-profile",
]);

const INNOVATIVE_METHODS_SET = new Set<GenerationMethod>([
  "biorhythm", "dream", "lunar", "color-synesthesia",
  "moment-entropy", "geo-energy", "temporal", "quantum-resonance",
]);

interface Props {
  params: Promise<{ lottery: string }>;
}

export default function GeneratePage({ params }: Props) {
  const { lottery: slug } = use(params);
  const config = LOTTERIES[slug as LotterySlug];

  if (!config) notFound();

  const [method, setMethod] = useState<GenerationMethod>("random");
  const [quantity, setQuantity] = useState("1");
  const [games, setGames] = useState<GeneratedGame[]>([]);
  const { addGeneratedGames, saveGame } = useGameStore();
  const { isPaused, isDailyLimitReached, addSpending, config: responsibleConfig } = useResponsibleStore();
  const { canUseMethod, canGenerateToday } = useSubscriptionStore();
  const { tier } = useFeatureGate();

  const [personalData, setPersonalData] = useState<PersonalData>({
    fullName: "",
    birthDate: "",
    zodiacSign: undefined,
    specialDates: [],
    luckyPhrase: "",
    dreamText: "",
    selectedColors: [],
    quantumSeed: "",
    chaosIntensity: 5,
    geoCoords: undefined,
    entropyData: [],
  });

  const [newSpecialDate, setNewSpecialDate] = useState("");

  const isPersonalMethod = PERSONAL_METHODS_SET.has(method);
  const isInnovativeMethod = INNOVATIVE_METHODS_SET.has(method);
  const needsForm = isPersonalMethod || isInnovativeMethod;

  const classicMethods = useMemo(
    () => GENERATION_METHODS.filter((m) => m.category === "classic"), []
  );
  const personalMethods = useMemo(
    () => GENERATION_METHODS.filter((m) => m.category === "personal"), []
  );
  const innovativeMethods = useMemo(
    () => GENERATION_METHODS.filter((m) => m.category === "innovative"), []
  );

  function addSpecialDate() {
    if (!newSpecialDate) return;
    setPersonalData((prev) => ({
      ...prev,
      specialDates: [...(prev.specialDates || []), newSpecialDate],
    }));
    setNewSpecialDate("");
  }

  function removeSpecialDate(index: number) {
    setPersonalData((prev) => ({
      ...prev,
      specialDates: (prev.specialDates || []).filter((_, i) => i !== index),
    }));
  }

  const updatePersonalData = useCallback(
    (updates: Partial<PersonalData>) => {
      setPersonalData((prev) => ({ ...prev, ...updates }));
    }, []
  );

  function canGenerate(): boolean {
    switch (method) {
      case "zodiac":
        return !!(personalData.zodiacSign || personalData.birthDate);
      case "numerology":
        return !!personalData.fullName?.trim();
      case "birthday":
        return !!(personalData.birthDate || (personalData.specialDates && personalData.specialDates.length > 0));
      case "personal-profile":
        return !!(personalData.fullName?.trim() || personalData.birthDate);
      case "biorhythm":
        return !!personalData.birthDate;
      case "dream":
        return !!(personalData.dreamText && personalData.dreamText.trim().length >= 10);
      case "color-synesthesia":
        return !!(personalData.selectedColors && personalData.selectedColors.length >= 2);
      case "moment-entropy":
        return isEntropyReady(personalData.entropyData || []);
      case "geo-energy":
        return !!personalData.geoCoords;
      default:
        return true;
    }
  }

  function handleGenerate() {
    if (!canUseMethod(method)) {
      toast.error("Este método requer um plano superior. Faça upgrade para continuar.");
      return;
    }
    if (isPaused()) {
      toast.error("A geração de jogos está pausada. Acesse Jogo Responsável para retomar.");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    const todayGenerations = responsibleConfig.dailyGameLimit; // reuse existing count logic
    if (!canGenerateToday(todayGenerations)) {
      toast.error("Você atingiu o limite diário do seu plano. Faça upgrade para gerar mais.");
      return;
    }
    if (isDailyLimitReached(todayStr)) {
      toast.error("Você atingiu seu limite diário de jogos.");
      return;
    }
    if (!canGenerate()) {
      toast.error("Preencha os dados necessários para este método.");
      return;
    }

    const results = MOCK_RESULTS[slug as LotterySlug] || [];
    const frequencyMap = getMockFrequency(slug as LotterySlug);
    const qty = Number.parseInt(quantity);

    const newGames = generateGames({
      config,
      method,
      quantity: qty,
      results,
      frequencyMap,
      personalData: needsForm ? personalData : undefined,
    }).map((g) => ({
      ...g,
      audit: {
        seed: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date().toISOString(),
        method,
      },
    }));

    setGames(newGames);
    addGeneratedGames(newGames);
    addSpending({
      date: todayStr,
      lottery: slug,
      gamesCount: qty,
      estimatedCost: qty * (config.price || 0),
    });
    if (responsibleConfig.remindersEnabled && Math.random() > 0.5) {
      toast.info("Lembre-se: loterias são jogos de azar. Jogue com responsabilidade.");
    }
    toast.success(
      `${newGames.length} jogo${newGames.length > 1 ? "s" : ""} gerado${newGames.length > 1 ? "s" : ""}!`
    );
  }

  function handleSave(game: GeneratedGame) {
    saveGame(game);
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, saved: true } : g))
    );
    toast.success("Jogo salvo!");
  }

  function handleCopy(game: GeneratedGame) {
    const text = game.numbers.map((n) => n.toString().padStart(2, "0")).join(", ");
    navigator.clipboard.writeText(text);
    toast.success("Números copiados!");
  }

  function getMethodCategory(): "classic" | "personal" | "innovative" {
    if (isInnovativeMethod) return "innovative";
    if (isPersonalMethod) return "personal";
    return "classic";
  }

  function getGameCategory(m: GenerationMethod): "classic" | "personal" | "innovative" {
    if (INNOVATIVE_METHODS_SET.has(m)) return "innovative";
    if (PERSONAL_METHODS_SET.has(m)) return "personal";
    return "classic";
  }

  const BADGE_CLASSES: Record<string, string> = {
    innovative: "border-cyan-500/30 text-cyan-400",
    personal: "border-purple-500/30 text-purple-400",
    classic: "",
  };

  const categoryColors = {
    classic: { btn: "neon-glow", border: "border-primary", bg: "" },
    personal: { btn: "bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.3)]", border: "border-purple-500/20", bg: "" },
    innovative: { btn: "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]", border: "border-cyan-500/20", bg: "" },
  };

  const cat = getMethodCategory();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: config.color }}
        >
          {config.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Gerar Jogos - {config.name}</h1>
          <p className="text-muted-foreground text-sm">{config.description}</p>
        </div>
      </div>

      {/* Metodos Classicos */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Métodos Clássicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {classicMethods.map((m) => {
              const Icon = iconMap[m.icon];
              return (
                <MethodLock key={m.id} method={m.id} methodName={m.name}>
                  <button
                    onClick={() => setMethod(m.id)}
                    className={`w-full p-4 rounded-xl border text-center space-y-2 transition-all ${
                      method === m.id
                        ? "border-primary bg-primary/10 neon-glow"
                        : "border-white/10 hover:border-white/20 glass"
                    }`}
                  >
                    {Icon && <Icon className={`h-6 w-6 mx-auto ${method === m.id ? "text-primary" : "text-muted-foreground"}`} />}
                    <p className="text-xs font-medium">{m.name}</p>
                  </button>
                </MethodLock>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Metodos Pessoais */}
      <Card className="glass border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-400" />
            Métodos Personalizados
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Use seus dados pessoais para gerar números com significado
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {personalMethods.map((m) => {
              const Icon = iconMap[m.icon];
              return (
                <MethodLock key={m.id} method={m.id} methodName={m.name}>
                  <button
                    onClick={() => setMethod(m.id)}
                    className={`w-full p-4 rounded-xl border text-center space-y-2 transition-all ${
                      method === m.id
                        ? "border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                        : "border-white/10 hover:border-purple-500/30 glass"
                    }`}
                  >
                    {Icon && <Icon className={`h-6 w-6 mx-auto ${method === m.id ? "text-purple-400" : "text-muted-foreground"}`} />}
                    <p className="text-xs font-medium">{m.name}</p>
                  </button>
                </MethodLock>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Metodos Inovadores */}
      <Card className="glass border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-cyan-400" />
            Métodos Inovadores
            <Badge variant="outline" className="text-[10px] ml-2 border-cyan-500/30 text-cyan-400">
              Exclusivo
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tecnologias inéditas que transformam energia, cosmos e caos em números
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {innovativeMethods.map((m) => {
              const Icon = iconMap[m.icon];
              return (
                <MethodLock key={m.id} method={m.id} methodName={m.name}>
                  <button
                    onClick={() => setMethod(m.id)}
                    className={`w-full p-4 rounded-xl border text-center space-y-2 transition-all ${
                      method === m.id
                        ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                        : "border-white/10 hover:border-cyan-500/30 glass"
                    }`}
                  >
                    {Icon && <Icon className={`h-6 w-6 mx-auto ${method === m.id ? "text-cyan-400" : "text-muted-foreground"}`} />}
                    <p className="text-xs font-medium">{m.name}</p>
                  </button>
                </MethodLock>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Descricao do metodo */}
      <p className="text-sm text-muted-foreground px-1">
        <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
        {GENERATION_METHODS.find((m) => m.id === method)?.description}
      </p>

      {/* Formularios condicionais */}
      <AnimatePresence mode="wait">
        {needsForm && (
          <motion.div
            key={method}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`glass ${categoryColors[cat].border}`}>
              <CardContent className="p-6 space-y-6">

                {/* ===== PERSONAL: Zodiac ===== */}
                {(method === "zodiac" || method === "personal-profile") && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Signo do Zodíaco</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {(Object.entries(ZODIAC_INFO) as [ZodiacSign, typeof ZODIAC_INFO[ZodiacSign]][]).map(
                        ([key, info]) => (
                          <button
                            key={key}
                            onClick={() => updatePersonalData({ zodiacSign: key })}
                            className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                              personalData.zodiacSign === key
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-white/10 hover:border-purple-500/30 glass"
                            }`}
                          >
                            <span className="text-2xl block">{info.symbol}</span>
                            <p className="text-[10px] font-medium">{info.name}</p>
                            <p className="text-[8px] text-muted-foreground">{info.period}</p>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* ===== PERSONAL: Name ===== */}
                {(method === "numerology" || method === "personal-profile") && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      placeholder="Digite seu nome completo..."
                      value={personalData.fullName || ""}
                      onChange={(e) => updatePersonalData({ fullName: e.target.value })}
                      className="bg-background/50 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Cada letra tem um valor numérico pela tabela pitagórica
                    </p>
                  </div>
                )}

                {/* ===== PERSONAL + INNOVATIVE: Birth date ===== */}
                {(method === "zodiac" || method === "birthday" || method === "personal-profile" || method === "biorhythm") && (
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={personalData.birthDate || ""}
                      onChange={(e) => updatePersonalData({ birthDate: e.target.value })}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                )}

                {/* ===== PERSONAL: Special dates ===== */}
                {(method === "birthday" || method === "personal-profile") && (
                  <div className="space-y-3">
                    <Label>Datas Especiais</Label>
                    <p className="text-xs text-muted-foreground">
                      Aniversários de casamento, filhos, datas marcantes...
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={newSpecialDate}
                        onChange={(e) => setNewSpecialDate(e.target.value)}
                        className="bg-background/50 border-white/10 flex-1"
                      />
                      <Button variant="outline" onClick={addSpecialDate} disabled={!newSpecialDate} className="border-purple-500/30">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {personalData.specialDates && personalData.specialDates.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {personalData.specialDates.map((date, i) => (
                          <Badge key={`date-${date}-${i}`} variant="secondary" className="gap-1 pr-1">
                            {new Date(date + "T12:00:00").toLocaleDateString("pt-BR")}
                            <button onClick={() => removeSpecialDate(i)} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ===== PERSONAL: Lucky phrase ===== */}
                {method === "personal-profile" && (
                  <div className="space-y-2">
                    <Label htmlFor="luckyPhrase">Frase da Sorte <span className="text-muted-foreground">(opcional)</span></Label>
                    <Input
                      id="luckyPhrase"
                      placeholder='Ex: "Minha família é minha sorte"'
                      value={personalData.luckyPhrase || ""}
                      onChange={(e) => updatePersonalData({ luckyPhrase: e.target.value })}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                )}

                {/* ===== INNOVATIVE: Biorhythm ===== */}
                {method === "biorhythm" && personalData.birthDate && (
                  <BiorhythmChart birthDate={personalData.birthDate} />
                )}

                {/* ===== INNOVATIVE: Dream ===== */}
                {method === "dream" && (
                  <DreamInput
                    value={personalData.dreamText || ""}
                    onChange={(val) => updatePersonalData({ dreamText: val })}
                  />
                )}

                {/* ===== INNOVATIVE: Lunar ===== */}
                {method === "lunar" && <LunarPhaseDisplay />}

                {/* ===== INNOVATIVE: Color Synesthesia ===== */}
                {method === "color-synesthesia" && (
                  <ColorPicker
                    selectedColors={personalData.selectedColors || []}
                    onChange={(colors) => updatePersonalData({ selectedColors: colors })}
                  />
                )}

                {/* ===== INNOVATIVE: Entropy ===== */}
                {method === "moment-entropy" && (
                  <EntropyCollector
                    entropyData={personalData.entropyData || []}
                    onChange={(data) => updatePersonalData({ entropyData: data })}
                  />
                )}

                {/* ===== INNOVATIVE: Geo ===== */}
                {method === "geo-energy" && (
                  <GeoLocationDisplay
                    coords={personalData.geoCoords}
                    onChange={(coords) => updatePersonalData({ geoCoords: coords })}
                  />
                )}

                {/* ===== INNOVATIVE: Temporal ===== */}
                {method === "temporal" && (
                  <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-center space-y-2">
                    <Clock className="h-8 w-8 mx-auto text-cyan-400" />
                    <p className="text-sm font-medium text-cyan-400">
                      Análise do instante exato da geração
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hora, minuto, dia do ano, semana ISO, feriados brasileiros, números mestres e horas espelho serão analisados no momento do clique
                    </p>
                  </div>
                )}

                {/* ===== INNOVATIVE: Quantum ===== */}
                {method === "quantum-resonance" && (
                  <QuantumControls
                    seed={personalData.quantumSeed || ""}
                    onSeedChange={(seed) => updatePersonalData({ quantumSeed: seed })}
                    intensity={personalData.chaosIntensity || 5}
                    onIntensityChange={(val) => updatePersonalData({ chaosIntensity: val })}
                  />
                )}

              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantidade + Gerar */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="space-y-2 w-full sm:w-48">
          <Label className="text-sm font-medium">Quantidade</Label>
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 3, 5, 10, 20].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n} jogo{n > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          size="lg"
          disabled={!canGenerate()}
          className={`w-full sm:w-auto ${categoryColors[cat].btn}`}
        >
          {isInnovativeMethod ? (
            <Rocket className="mr-2 h-5 w-5" />
          ) : isPersonalMethod ? (
            <Sparkles className="mr-2 h-5 w-5" />
          ) : (
            <Shuffle className="mr-2 h-5 w-5" />
          )}
          Gerar Jogos
        </Button>
      </div>

      {/* Jogos Gerados */}
      <AnimatePresence mode="popLayout">
        {games.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Jogos Gerados ({games.length})</h2>
              <Button variant="ghost" size="sm" onClick={() => setGames([])} className="text-muted-foreground">
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game, idx) => {
                const gameCat = getGameCategory(game.method);
                const badgeClass = BADGE_CLASSES[gameCat];
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="glass border-white/10">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`text-[10px] ${badgeClass}`}>
                            {GENERATION_METHODS.find((m) => m.id === game.method)?.name || game.method}
                          </Badge>
                          <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {game.numbers.map((num, i) => (
                            <span
                              key={`n-${num}-${i}`}
                              className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center"
                              style={{ backgroundColor: config.color, color: "white" }}
                            >
                              {num.toString().padStart(2, "0")}
                            </span>
                          ))}
                          {game.extraNumbers?.map((num, i) => (
                            <span
                              key={`e-${num}-${i}`}
                              className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center border-2"
                              style={{ borderColor: config.color, color: config.color }}
                            >
                              {num.toString().padStart(2, "0")}
                            </span>
                          ))}
                        </div>

                        {game.audit && (
                          <p className="text-[10px] text-muted-foreground/50 font-mono truncate">
                            Seed: {game.audit.seed}
                          </p>
                        )}

                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(game)} className="flex-1 text-xs h-8">
                            <Copy className="mr-1 h-3 w-3" />
                            Copiar
                          </Button>
                          <ShareGameDialog
                            game={game}
                            trigger={
                              <Button variant="ghost" size="sm" className="flex-1 text-xs h-8">
                                <Sparkles className="mr-1 h-3 w-3" />
                                Enviar
                              </Button>
                            }
                          />
                          <Button
                            variant={game.saved ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => handleSave(game)}
                            disabled={game.saved}
                            className="flex-1 text-xs h-8"
                          >
                            <Bookmark className="mr-1 h-3 w-3" />
                            {game.saved ? "Salvo" : "Salvar"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
