"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="rounded-[2rem] border-none shadow-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black tracking-tight">陽占人体星図</CardTitle>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Aura & Talent Chart
            </p>
          </div>
          <span className="text-[10px] font-extrabold text-(--gogyo-wood) bg-(--gogyo-wood-light) border border-(--gogyo-wood)/10 rounded-full px-3 py-1 uppercase tracking-wider">
            才能・本質
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pb-8">
        {/* 人体星図グリッド */}
        <div className="grid grid-cols-3 gap-3">
          {/* 1行目: 右手(従星) - 頭(主星) - 左手(従星) */}
          <JuseiCell
            star={stars.jusei.right}
            position="右手"
            onClick={() => onJuseiClick(stars.jusei.right, "右手（初年運）")}
          />
          <StarCell
            star={stars.north}
            position="頭"
            onClick={() => onStarClick(stars.north, "頭")}
          />
          <JuseiCell
            star={stars.jusei.left}
            position="左手"
            onClick={() => onJuseiClick(stars.jusei.left, "左手（中年運）")}
          />

          {/* 2行目: 左肩(主星) - 胸(主星/中心) - 右肩(主星) */}
          <StarCell
            star={stars.east}
            position="左肩"
            onClick={() => onStarClick(stars.east, "左肩")}
          />
          <StarCell
            star={stars.center}
            position="胸"
            onClick={() => onStarClick(stars.center, "胸")}
          />
          <StarCell
            star={stars.west}
            position="右肩"
            onClick={() => onStarClick(stars.west, "右肩")}
          />

          {/* 3行目: 空 - 腹(主星) - 左足(従星) */}
          <div className="flex items-center justify-center">
            <div className="size-1 rounded-full bg-border/40" />
          </div>
          <StarCell
            star={stars.south}
            position="腹"
            onClick={() => onStarClick(stars.south, "腹")}
          />
          <JuseiCell
            star={stars.jusei.center}
            position="左足"
            onClick={() => onJuseiClick(stars.jusei.center, "左足（晩年運）")}
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
    <Card className="rounded-[2rem] border-none shadow-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black tracking-tight">陰占（いんせん）</CardTitle>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Destiny Pillars
            </p>
          </div>
          <span className="text-[10px] font-extrabold text-(--gogyo-water) bg-(--gogyo-water-light) border border-(--gogyo-water)/10 rounded-full px-3 py-1 uppercase tracking-wider">
            宿命・エネルギー
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-8">
        <div className="grid grid-cols-3 gap-4">
          {pillarData.map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-2xl bg-muted/80 p-5 border border-white/20 dark:hover:bg-black/20 transition-colors group"
            >
              <span className="text-[10px] font-black text-muted-foreground mb-2 uppercase tracking-widest">
                {label}
              </span>
              <span className="text-3xl font-black text-foreground tracking-tighter">
                {pillars[key].kan}
                {pillars[key].shi}
              </span>
              <span className="text-[11px] font-bold text-muted-foreground/80 mt-2">{desc}</span>
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
    <Card className="rounded-3xl border-none shadow-xl bg-linear-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
      <CardContent className="py-6">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <p className="text-[10px] font-black text-pink-500 flex items-center gap-2 uppercase tracking-widest">
              <span className="inline-block size-1.5 rounded-full bg-pink-500 animate-pulse" />
              干合（かんごう）検出
            </p>
            <p className="text-sm font-bold text-foreground leading-snug">
              <span className="text-pink-500">{pair[0]}</span>と
              <span className="text-purple-500">{pair[1]}</span>が魂レベルで惹き合い、
              <br />
              周波数そのものが<span className="text-pink-600 font-extrabold">{transformed}性</span>
              へと昇華しました。
            </p>
          </div>

          {/* トグルスイッチ - プレミアムデザイン */}
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "relative h-8 w-14 rounded-full transition-all duration-500 p-1 flex items-center shrink-0",
              isTransformed
                ? "bg-linear-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-200"
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
    <Card className="rounded-[2rem] border-none shadow-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <span className="text-8xl font-black">{nikkanInfo.name[0]}</span>
      </div>

      <CardContent className="py-8 px-8">
        <div className="flex items-center gap-5 mb-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-600 shadow-xl shadow-orange-500/20 text-white">
            <span className="text-3xl font-black">{nikkanInfo.name[0]}</span>
          </div>
          <div>
            <p className="text-2xs font-black text-muted-foreground uppercase tracking-widest mb-1">
              Your Essence (Nikkan)
            </p>
            <p className="text-2xl font-black text-foreground tracking-tight">{nikkanInfo.name}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-500/5 p-5 border border-amber-500/10">
          <p className="text-sm text-foreground/90 leading-relaxed font-medium">
            <span className="text-orange-600 font-black mr-2">「{nikkanInfo.nature}」の性質：</span>
            {nikkanInfo.desc}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
