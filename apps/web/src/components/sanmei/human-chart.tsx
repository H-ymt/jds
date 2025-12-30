"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Stars, Shusei, Jusei } from "./constants";
import { StarCell, JuseiCell, GogyoLegend } from "./star-cell";

interface HumanChartProps {
  stars: Stars;
  onStarClick: (star: Shusei, position: string) => void;
  onJuseiClick: (star: Jusei, position: string) => void;
}

export function HumanChart({ stars, onStarClick, onJuseiClick }: HumanChartProps) {
  return (
    <Card variant="premium" className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black tracking-tight">陽占人体星図</CardTitle>
          <CardDescription>Aura & Talent Chart</CardDescription>
        </div>
        <span className="text-[10px] font-extrabold text-(--gogyo-wood) bg-(--gogyo-wood-light) border border-(--gogyo-wood)/10 rounded-full px-3 py-1 uppercase tracking-wider">
          才能・本質
        </span>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* 人体星図グリッド - 算命学Stockの配置に準拠 */}
        <div className="grid grid-cols-3 gap-3">
          {/* 1行目: 右肩(主星/見守り星) - 頭(主星/北方星) - 左肩(従星/第三従星) */}
          <StarCell
            star={stars.northWest}
            position="右肩"
            onClick={() => onStarClick(stars.northWest, "右肩（見守り星）")}
          />
          <StarCell
            star={stars.north}
            position="頭"
            onClick={() => onStarClick(stars.north, "頭（北方星）")}
          />
          <JuseiCell
            star={stars.jusei.center}
            position="左肩"
            onClick={() => onJuseiClick(stars.jusei.center, "左肩（幼少期）")}
          />

          {/* 2行目: 右手(主星/西方星) - 胸(主星/中心星) - 左手(主星/東方星) */}
          <StarCell
            star={stars.west}
            position="右手"
            onClick={() => onStarClick(stars.west, "右手（西方星）")}
          />
          <StarCell
            star={stars.center}
            position="胸"
            onClick={() => onStarClick(stars.center, "胸（中心星）")}
          />
          <StarCell
            star={stars.east}
            position="左手"
            onClick={() => onStarClick(stars.east, "左手（東方星）")}
          />

          {/* 3行目: 右足(従星/第一従星) - 腹(主星/南方星) - 左足(従星/第二従星) */}
          <JuseiCell
            star={stars.jusei.right}
            position="右足"
            onClick={() => onJuseiClick(stars.jusei.right, "右足（晩年期）")}
          />
          <StarCell
            star={stars.south}
            position="腹"
            onClick={() => onStarClick(stars.south, "腹（南方星）")}
          />
          <JuseiCell
            star={stars.jusei.left}
            position="左足"
            onClick={() => onJuseiClick(stars.jusei.left, "左足（中年期）")}
          />
        </div>

        {/* 五行カラー凡例 */}
        <div className="pt-4 border-t border-border/40">
          <GogyoLegend />
        </div>
      </CardContent>
    </Card>
  );
}

// 陰占カード
interface InsenCardProps {
  pillars: {
    year: { kan: string; shi: string };
    month: { kan: string; shi: string };
    day: { kan: string; shi: string };
  };
}

export function InsenCard({ pillars }: InsenCardProps) {
  const pillarData = [
    { key: "year", label: "年柱", desc: "親・目上" },
    { key: "month", label: "月柱", desc: "社会・仕事" },
    { key: "day", label: "日柱", desc: "自分自身" },
  ] as const;

  return (
    <Card variant="premium" className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black tracking-tight">陰占（いんせん）</CardTitle>
          <CardDescription>Destiny Pillars</CardDescription>
        </div>
        <span className="text-[10px] font-extrabold text-(--gogyo-water) bg-(--gogyo-water-light) border border-(--gogyo-water)/10 rounded-full px-3 py-1 uppercase tracking-wider">
          宿命・エネルギー
        </span>
      </CardHeader>

      <CardContent className="pb-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {pillarData.map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-3xl bg-muted/30 dark:bg-zinc-800/50 p-8 transition-colors group border border-transparent dark:border-white/5"
            >
              <span className="text-[10px] font-bold text-muted-foreground mb-6 uppercase tracking-widest">
                {label}
              </span>
              <span className="text-5xl font-black text-foreground tracking-tighter mb-6">
                {pillars[key].kan}
                {pillars[key].shi}
              </span>
              <span className="text-[11px] font-bold text-muted-foreground/50">{desc}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 干合カード
interface KangoCardProps {
  pair: [string, string];
  transformed: string;
  isTransformed: boolean;
  onToggle: () => void;
}

export function KangoCard({ pair, transformed, isTransformed, onToggle }: KangoCardProps) {
  return (
    <Card className="rounded-[3rem] border-none shadow-xl bg-linear-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-pink-900/20 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
      <CardContent className="p-10">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="space-y-2 flex-1">
            <p className="text-[10px] font-black text-pink-500 dark:text-pink-400 flex items-center gap-2 uppercase tracking-widest">
              <span className="inline-block size-1.5 rounded-full bg-pink-500 dark:bg-pink-400 animate-pulse" />
              干合（かんごう）検出
            </p>
            <p className="text-sm font-bold text-foreground leading-snug">
              <span className="text-pink-500 dark:text-pink-400">{pair[0]}</span>と
              <span className="text-purple-500 dark:text-purple-400">{pair[1]}</span>
              が魂レベルで惹き合い、
              <br />
              周波数そのものが
              <span className="text-pink-600 dark:text-pink-300 font-extrabold">
                {transformed}性
              </span>
              へと昇華しました。
            </p>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "relative h-8 w-14 rounded-full transition-all duration-500 p-1 flex items-center shrink-0 mt-1",
              isTransformed
                ? "bg-linear-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-200 dark:shadow-pink-900/50"
                : "bg-muted shadow-inner",
            )}
          >
            <div
              className={cn(
                "size-6 rounded-full bg-white shadow-md transition-all duration-500 ease-in-out flex items-center justify-center",
                isTransformed ? "translate-x-6" : "translate-x-0",
              )}
            >
              <div
                className={cn(
                  "size-2 rounded-full transition-colors",
                  isTransformed ? "bg-pink-500" : "bg-muted-foreground/30",
                )}
              />
            </div>
          </button>
        </div>

        <div className="pt-5 border-t border-pink-500/10 dark:border-pink-500/20 space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground/80 font-medium">
            干合とは、特定のきっかけによって自分の性質が別人のように変化する、非常にドラマチックな現象です。
          </p>
          <div className="grid gap-3">
            {[
              {
                title: "対人関係",
                text: "特定の相手と出会うことで強烈に惹かれ合い、相手に合わせて自分の性格が変化するような深い縁が生じます。",
              },
              {
                title: "自分の性質",
                text: "生まれつき干合を持っている場合は、TPOに応じて自分を使い分ける多面的な性格や、独特のミステリアスな雰囲気を持つようになります。",
              },
              {
                title: "運勢のタイミング",
                text: "特定の時期が巡ることで、結婚や転職といった人生を大きく変えるような環境の変化や新しい出会いが訪れます。",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/10 dark:border-pink-500/20 mt-0.5">
                  {item.title}
                </span>
                <p className="text-[12px] leading-relaxed text-muted-foreground font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-pink-400 dark:text-pink-300 font-bold italic pt-1">
            人・自分・時期という3つの側面から、人生にドラマチックな変容をもたらします。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 日干解説カード
interface NikkanCardProps {
  nikkanInfo: {
    name: string;
    nature: string;
    desc: string;
  };
}

export function NikkanCard({ nikkanInfo }: NikkanCardProps) {
  return (
    <Card variant="premium" className="relative group overflow-hidden">
      {/* 水影文字 */}
      <div className="absolute top-4 right-8 opacity-5 select-none pointer-events-none transition-opacity duration-300">
        <span className="text-[180px] font-black leading-none">{nikkanInfo.name[0]}</span>
      </div>

      <CardContent className="px-6 pt-6 sm:px-10 sm:pt-10">
        <div className="flex flex-row items-center sm:gap-8 gap-6 mb-10">
          <div className="flex size-20 items-center justify-center rounded-[1.5rem] bg-linear-to-br from-amber-400 to-orange-600 shadow-xl shadow-orange-500/20 text-white shrink-0">
            <span className="text-4xl font-black">{nikkanInfo.name[0]}</span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Your Essence (Nikkan)
            </p>
            <p className="sm:text-4xl text-2xl flex flex-col sm:flex-row gap-y-2 items-start font-black text-foreground tracking-tight leading-none">
              {nikkanInfo.name}
              <span className="text-2xl font-bold text-muted-foreground/40 sm:ml-2">
                （しんきん）
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-orange-500/5 dark:bg-linear-to-br dark:from-orange-500/10 dark:to-transparent p-8 border border-orange-500/10 dark:border-orange-500/20">
          <p className="text-[15px] text-foreground/80 leading-relaxed font-bold">
            <span className="text-orange-600 dark:text-orange-400 mr-2 font-black">
              「{nikkanInfo.nature}」の性質：
            </span>
            {nikkanInfo.desc}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
