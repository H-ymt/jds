"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  type SanmeiResult,
  type Shusei,
  type Jusei,
  NIKKAN_INFO,
  SHUSEI_INFO,
  JUSEI_INFO,
} from "./constants";
import { HumanChart, InsenCard, KangoCard, NikkanCard } from "./human-chart";
import { PdfExportDialog } from "./pdf";
import { ShareButtons } from "./share-buttons";
import { GogyoBadge } from "./star-cell";
import { StarModal } from "./star-modal";

type TabId = "chart" | "personality" | "detail";

interface ResultViewProps {
  result: SanmeiResult;
  birthDate: string;
  gender: "male" | "female";
  isTransformed: boolean;
  onToggleTransformed: () => void;
  onBack: () => void;
}

export function ResultView({
  result,
  birthDate,
  gender,
  isTransformed,
  onToggleTransformed,
  onBack,
}: ResultViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("chart");
  const [selectedStar, setSelectedStar] = useState<{
    type: "shusei" | "jusei";
    star: Shusei | Jusei;
    position: string;
  } | null>(null);

  const nikkanInfo = NIKKAN_INFO[result.nikkan];

  const tabs: { id: TabId; label: string }[] = [
    { id: "chart", label: "星図" },
    { id: "personality", label: "性格" },
    { id: "detail", label: "詳細" },
  ];

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto relative z-10">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="-ml-2 h-10 w-10 px-0 sm:w-auto sm:px-4 rounded-full hover:bg-white/50 dark:hover:bg-black/20 text-muted-foreground/80"
          >
            <ArrowLeft className="size-4 mr-0 sm:mr-1.5" />
            <span className="text-sm font-medium hidden sm:inline">新しい鑑定</span>
          </Button>
          <div className="flex items-center gap-3">
            <ShareButtons
              text={`【算命学診断結果】\n私の中心星は「${result.stars.center}」でした！\n\n#算命学 #占い #運勢診断`}
              hideLabelOnMobile
            />
            <PdfExportDialog
              result={result}
              birthDate={birthDate}
              gender={gender}
              isTransformed={isTransformed}
              hideLabelOnMobile
            />
          </div>
        </div>

        <div className="flex p-1 gap-1 mb-8 rounded-[1.25rem] bg-zinc-200/50 dark:bg-zinc-800/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-[1rem] text-[13px] font-bold transition-all duration-200 relative",
                  isActive
                    ? "text-zinc-900 bg-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 hover:bg-white/20",
                )}
              >
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 星図タブ */}
        {activeTab === "chart" && (
          <div className="space-y-4">
            {/* 干合（存在する場合） */}
            {result.kango.exists &&
              result.kango.pair &&
              result.kango.transformed &&
              (result.kango.pair[0] as string) &&
              (result.kango.pair[1] as string) && (
                <KangoCard
                  pair={[result.kango.pair[0] as string, result.kango.pair[1] as string]}
                  transformed={result.kango.transformed}
                  isTransformed={isTransformed}
                  onToggle={onToggleTransformed}
                />
              )}

            {/* 日干解説 */}
            <NikkanCard nikkanInfo={nikkanInfo} />

            {/* 陰占 */}
            <InsenCard pillars={result.pillars} />

            {/* 人体星図 */}
            <HumanChart
              stars={result.stars}
              onStarClick={(star, position) => setSelectedStar({ type: "shusei", star, position })}
              onJuseiClick={(star, position) => setSelectedStar({ type: "jusei", star, position })}
            />
          </div>
        )}

        {/* 性格タブ */}
        {activeTab === "personality" && (
          <div className="space-y-4">
            <PersonalityTab result={result} />
          </div>
        )}

        {/* 詳細タブ */}
        {activeTab === "detail" && (
          <div className="space-y-4">
            <DetailTab result={result} />
          </div>
        )}

        {/* 星詳細モーダル */}
        {selectedStar && (
          <StarModal
            isOpen={!!selectedStar}
            onClose={() => setSelectedStar(null)}
            type={selectedStar.type}
            star={selectedStar.star as any}
            position={selectedStar.position}
          />
        )}
      </div>
    </div>
  );
}

// 性格タブの内容
function PersonalityTab({ result }: { result: SanmeiResult }) {
  const centerStarInfo = SHUSEI_INFO[result.stars.center];

  return (
    <>
      {/* 主な傾向 */}
      <Card variant="premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">あなたの主な傾向</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 最も強い五行 */}
          <div className="rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-4">
            <p className="text-xs text-muted-foreground mb-1">最も強い五行</p>
            <div className="flex items-center gap-2">
              <GogyoBadge element={result.dominantElement[0]} className="text-sm px-3 py-1.5" />
              <span className="text-lg font-bold text-foreground">
                {result.dominantElement[0]}性が{result.dominantElement[1]}つ
              </span>
            </div>
          </div>

          {/* 中心星の特徴 */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">中心星（胸）の特徴</p>
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <GogyoBadge element={centerStarInfo.element} />
                <span className="text-sm text-muted-foreground">{centerStarInfo.keyword}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{centerStarInfo.desc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* エネルギーバランス */}
      <Card variant="premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">エネルギーバランス</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { star: result.stars.jusei.right, label: "初年運" },
            { star: result.stars.jusei.left, label: "中年運" },
            { star: result.stars.jusei.center, label: "晩年運" },
          ].map(({ star, label }) => {
            const info = JUSEI_INFO[star];
            return (
              <div key={label} className="flex items-center gap-3">
                <div className="w-16 text-xs text-muted-foreground">{star}</div>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all"
                    style={{ width: `${(info.energy / 12) * 100}%` }}
                  />
                </div>
                <div className="w-6 text-sm font-medium text-foreground text-right">
                  {info.energy}
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground mt-2">
            エネルギー値が高いほど、その時期の運勢が力強くなります（最大12）
          </p>
        </CardContent>
      </Card>
    </>
  );
}

// 詳細タブの内容
function DetailTab({ result }: { result: SanmeiResult }) {
  const positions = ["頭（北）", "胸（中心）", "腹（南）", "左肩（東）", "右肩（西）"];

  return (
    <>
      {/* 全ての星の解説 */}
      <Card variant="premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">全ての星の解説</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.allStars.map((star, i) => {
            const info = SHUSEI_INFO[star];
            return (
              <div key={i} className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <GogyoBadge element={info.element} />
                  <span className="text-sm font-semibold text-foreground">{star}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{positions[i]}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 十二大従星の解説 */}
      <Card variant="premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">十二大従星の解説</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { star: result.stars.jusei.right, pos: "右手（初年運）" },
            { star: result.stars.jusei.left, pos: "左手（中年運）" },
            { star: result.stars.jusei.center, pos: "左足（晩年運）" },
          ].map(({ star, pos }) => {
            const info = JUSEI_INFO[star];
            return (
              <div key={pos} className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{star}</span>
                    <span className="text-xs text-muted-foreground">{pos}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    力量 {info.energy} / {info.phase}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 用語解説 */}
      <Card
        variant="premium"
        className="bg-linear-to-br from-background/50 to-muted/30 backdrop-blur-xl"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            用語解説
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground">干合（かんごう）とは</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              特定のきっかけによって自分の性質が別人のように変化する現象です。人生にドラマチックな変容をもたらす要素として、以下の3つのパターンがあります。
            </p>
            <ul className="space-y-2 pt-1">
              {[
                {
                  label: "対人関係",
                  text: "特定の相手と出会うことで強烈に惹かれ合い、相手に合わせて自分の性格が変化するような深い縁が生じます。",
                },
                {
                  label: "自分自身の性質",
                  text: "生まれつき命式に干合を持っている場合は、TPOに応じて自分を使い分ける多面的な性格や、独特のミステリアスな雰囲気を持つようになります。",
                },
                {
                  label: "運勢のタイミング",
                  text: "特定の時期が巡ってくることで、結婚や転職といった人生を大きく変えるような環境の変化や新しい出会いが訪れます。",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="shrink-0 text-[10px] font-bold text-primary mt-0.5">●</span>
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-foreground">{item.label}</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
