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
    <div className="min-h-screen p-4">
      <div className="max-w-xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="-ml-2">
            <ArrowLeft className="size-4 mr-1" />
            新しい鑑定
          </Button>
          <div className="flex items-center gap-2">
            <ShareButtons centerStar={result.stars.center} birthDate={birthDate} />
            <PdfExportDialog
              result={result}
              birthDate={birthDate}
              gender={gender}
              isTransformed={isTransformed}
            />
          </div>
        </div>

        {/* タブ */}
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 星図タブ */}
        {activeTab === "chart" && (
          <div className="space-y-4">
            {/* 日干解説 */}
            <NikkanCard nikkanInfo={nikkanInfo} />

            {/* 陰占 */}
            <InsenCard pillars={result.pillars} />

            {/* 干合（存在する場合） */}
            {result.kango.exists && result.kango.pair && result.kango.transformed && (
              <KangoCard
                pair={result.kango.pair}
                transformed={result.kango.transformed}
                isTransformed={isTransformed}
                onToggle={onToggleTransformed}
              />
            )}

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
      <Card className="rounded-2xl border-border/50">
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
      <Card className="rounded-2xl border-border/50">
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
      <Card className="rounded-2xl border-border/50">
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
      <Card className="rounded-2xl border-border/50">
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
    </>
  );
}
