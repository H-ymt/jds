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
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">陽占（ようせん）人体星図</CardTitle>
          <span className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1">
            才能・行動パターン
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 人体星図グリッド */}
        <div className="grid grid-cols-3 gap-2">
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
          <div />
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

        {/* ヒント */}
        <p className="text-xs text-muted-foreground text-center">
          各星をタップすると詳しい解説が見られます
        </p>

        {/* 五行カラー凡例 */}
        <GogyoLegend />
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
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">陰占（いんせん）</CardTitle>
          <span className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1">
            生まれ持った宿命
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {pillarData.map(({ key, label, desc }) => (
            <div key={key} className="flex flex-col items-center rounded-xl bg-muted/50 p-4">
              <span className="text-xs text-muted-foreground mb-1">{label}</span>
              <span className="text-2xl font-bold text-foreground tracking-wide">
                {pillars[key].kan}
                {pillars[key].shi}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1.5">{desc}</span>
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
    <Card className="rounded-2xl border-border bg-gradient-to-r from-pink-500/5 to-purple-500/5">
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block size-1.5 rounded-full bg-pink-500" />
              干合（かんごう）検出
            </p>
            <p className="text-sm font-bold text-foreground mt-1">
              {pair[0]}と{pair[1]}が結びつき → {transformed}性に変化
            </p>
          </div>

          {/* トグルスイッチ */}
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "relative h-7 w-14 rounded-full transition-all duration-200",
              isTransformed ? "bg-pink-500" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "absolute top-1 size-5 rounded-full bg-white shadow transition-transform",
                isTransformed ? "translate-x-8" : "translate-x-1",
              )}
            />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          干合とは、特定の干同士が引き合い、新しい性質に変化する現象です。ONにすると変化後の星図を表示します。
        </p>
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
    <Card className="rounded-2xl border-border bg-gradient-to-r from-amber-500/5 to-orange-500/5">
      <CardContent className="py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10">
            <span className="text-2xl">⭐</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">あなたの日干（本質）</p>
            <p className="text-lg font-bold text-foreground">{nikkanInfo.name}</p>
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">「{nikkanInfo.nature}」の性質：</span>
            {nikkanInfo.desc}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
