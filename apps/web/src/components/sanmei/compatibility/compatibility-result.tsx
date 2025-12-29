"use client";

import { ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { GOGYO, NIKKAN_INFO, SHUSEI_INFO } from "../constants";
import { ShareButtons } from "../share-buttons";
import type { CompatibilityResult } from "./compatibility-constants";
import { CosmicChart } from "./cosmic-chart";
import { CompatibilityPdfDialog } from "./pdf";
import { RelationshipCard } from "./relationship-card";
import { cn } from "@/lib/utils";

interface CompatibilityResultViewProps {
  result: CompatibilityResult;
  person1BirthDate: string;
  person2BirthDate: string;
  onBack: () => void;
}

export function CompatibilityResultView({
  result,
  person1BirthDate,
  person2BirthDate,
  onBack,
}: CompatibilityResultViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const nikkan1Info = NIKKAN_INFO[result.person1.nikkan];
  const nikkan2Info = NIKKAN_INFO[result.person2.nikkan];
  const element1 = GOGYO[result.person1.nikkan];
  const element2 = GOGYO[result.person2.nikkan];

  return (
    <div className="p-4 overflow-hidden relative">
      <div className="mx-auto max-w-2xl relative z-10">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="-ml-2 h-10 w-10 px-0 sm:w-auto sm:px-4 rounded-full hover:bg-white/50 dark:hover:bg-black/20 text-muted-foreground/80"
          >
            <ArrowLeft className="size-4 mr-0 sm:mr-1.5" />
            <span className="text-sm font-medium hidden sm:inline">戻る</span>
          </Button>
          <div className="flex items-center gap-3">
            <ShareButtons
              text={`相性診断結果: ${result.overallScore}点（${result.relationshipType.type}）\n\n#算命学 #相性診断 #占い`}
              hideLabelOnMobile
            />
            <CompatibilityPdfDialog
              result={result}
              person1BirthDate={person1BirthDate}
              person2BirthDate={person2BirthDate}
              hideLabelOnMobile
            />
          </div>
        </div>

        {/* 二人の日干表示 */}
        <Card variant="premium" className="mb-6">
          <div className="bg-linear-to-br from-[oklch(0.95_0.02_160)] via-[oklch(0.95_0.02_210)] to-[oklch(0.95_0.02_275)] p-8">
            <div className="flex items-center justify-between gap-4">
              {/* Person 1 */}
              <div className="flex-1 text-center space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  あなた
                </p>
                <div className="relative inline-block group">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/40 transition-colors" />
                  <div
                    className="size-20 relative rounded-full flex items-center justify-center text-3xl font-black shadow-2xl border-4 border-white/50"
                    style={{
                      background: `var(--gogyo-${element1})`,
                      color: `var(--gogyo-${element1}-foreground)`,
                    }}
                  >
                    {result.person1.nikkan}
                  </div>
                </div>
                <div className="text-[13px] font-bold text-foreground/80">{nikkan1Info.nature}</div>
              </div>

              {/* 中央のスコア */}
              <div className="text-center px-4 relative">
                <div className="absolute inset-0 bg-pink-500/10 blur-2xl rounded-full" />
                <div className="relative">
                  <div className="text-5xl font-black text-pink-500 tracking-tighter drop-shadow-sm">
                    {result.overallScore}
                  </div>
                  <div className="text-[10px] font-bold text-pink-500/70 uppercase tracking-widest -mt-1">
                    Match Score
                  </div>
                </div>
              </div>

              {/* Person 2 */}
              <div className="flex-1 text-center space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  相手
                </p>
                <div className="relative inline-block group">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/40 transition-colors" />
                  <div
                    className="size-20 relative rounded-full flex items-center justify-center text-3xl font-black shadow-2xl border-4 border-white/50"
                    style={{
                      background: `var(--gogyo-${element2})`,
                      color: `var(--gogyo-${element2}-foreground)`,
                    }}
                  >
                    {result.person2.nikkan}
                  </div>
                </div>
                <div className="text-[13px] font-bold text-foreground/80">{nikkan2Info.nature}</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex p-1 gap-1 mb-8 rounded-[1.25rem] bg-zinc-200/50 dark:bg-zinc-800/50">
          {[
            { id: "overview", label: "概要" },
            { id: "special", label: "特殊関係" },
            { id: "gogyo", label: "五行" },
            { id: "uchuban", label: "宇宙盤" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-2.5 px-1 rounded-[1.1rem] text-[11px] sm:text-xs font-bold transition-all duration-200 relative",
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

        <Tabs value={activeTab} className="mt-4">
          {/* 概要タブ */}
          <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
            <Card variant="premium">
              <CardContent className="p-6">
                <RelationshipCard
                  result={result.relationshipType}
                  overallScore={result.overallScore}
                />

                {/* 強み・課題 */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Sparkles className="size-4 text-green-500" />
                      この関係の強み
                    </h4>
                    <ul className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="size-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.challenges.length > 0 &&
                    result.challenges[0] !== "大きな課題は見当たりません" && (
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <X className="size-4 text-orange-500" />
                          気をつけるポイント
                        </h4>
                        <ul className="space-y-2">
                          {result.challenges.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="size-4 text-orange-500 mt-0.5 shrink-0 inline-flex items-center justify-center">
                                !
                              </span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 特殊関係タブ */}
          <TabsContent value="special" className="mt-0 focus-visible:outline-none">
            <Card variant="premium">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-bold">特殊な関係性</h3>
                <p className="text-sm text-muted-foreground">算命学における特別な縁のある関係性</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 日干干合 */}
                <SpecialRelationItem
                  title="日干干合"
                  description="魂レベルで惹かれ合う非常に強い縁"
                  exists={result.nikkanKango.exists}
                  detail={
                    result.nikkanKango.exists
                      ? `${result.person1.nikkan}と${result.person2.nikkan}が干合`
                      : undefined
                  }
                />

                {/* 大半会 */}
                <SpecialRelationItem
                  title="大半会"
                  description="干が干合し支が半会する最も強い結びつき"
                  exists={result.daihan.exists}
                  detail={result.daihan.exists ? `${result.daihan.element}の半会` : undefined}
                />

                {/* 律音 */}
                <SpecialRelationItem
                  title="律音"
                  description="同じ干支を持つ深い縁"
                  exists={result.ritchin.exists}
                  detail={
                    result.ritchin.exists
                      ? `${result.ritchin.positions?.join("、")}柱が一致`
                      : undefined
                  }
                />

                {/* 納音 */}
                <SpecialRelationItem
                  title="納音"
                  description="干が同じで支が対冲する補完関係"
                  exists={result.natchin.exists}
                />

                {/* 天剋地冲 */}
                <SpecialRelationItem
                  title="天剋地冲"
                  description="干が相剋し支が対冲する対立関係"
                  exists={result.tenkoku.exists}
                  isNegative
                />

                {/* 支合 */}
                <SpecialRelationItem
                  title="支合"
                  description="自然と惹かれ合う関係"
                  exists={result.shigoMatches.length > 0}
                  detail={
                    result.shigoMatches.length > 0
                      ? `${result.shigoMatches.length}つの支合`
                      : undefined
                  }
                />

                {/* 対冲 */}
                <SpecialRelationItem
                  title="対冲"
                  description="正反対の位置にある対立的な関係"
                  exists={result.taichuMatches.length > 0}
                  detail={
                    result.taichuMatches.length > 0
                      ? `${result.taichuMatches.length}つの対冲`
                      : undefined
                  }
                  isNegative
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 五行タブ */}
          <TabsContent value="gogyo" className="mt-0 focus-visible:outline-none">
            <Card variant="premium">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-bold">五行の相性</h3>
                <p className="text-sm text-muted-foreground">五行の相生・相剋による相性分析</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 日干の相性 */}
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="text-sm font-semibold mb-2">日干（本質）の相性</h4>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `var(--gogyo-${element1})` }}
                      >
                        {element1}
                      </span>
                      <span className="text-sm">{result.person1.nikkan}</span>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="size-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `var(--gogyo-${element2})` }}
                      >
                        {element2}
                      </span>
                      <span className="text-sm">{result.person2.nikkan}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span
                      className={`font-medium ${result.nikkanCompatibility.score >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {result.nikkanCompatibility.relation}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({result.nikkanCompatibility.score >= 0 ? "+" : ""}
                      {result.nikkanCompatibility.score}点)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {result.nikkanCompatibility.description}
                  </p>
                </div>

                {/* 中心星の相性 */}
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="text-sm font-semibold mb-2">中心星の相性</h4>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: `var(--gogyo-${SHUSEI_INFO[result.person1.stars.center].element})`,
                        }}
                      >
                        {SHUSEI_INFO[result.person1.stars.center].element}
                      </span>
                      <span className="text-sm">{result.person1.stars.center}</span>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="size-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: `var(--gogyo-${SHUSEI_INFO[result.person2.stars.center].element})`,
                        }}
                      >
                        {SHUSEI_INFO[result.person2.stars.center].element}
                      </span>
                      <span className="text-sm">{result.person2.stars.center}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span
                      className={`font-medium ${result.centerStarCompatibility.score >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {result.centerStarCompatibility.relation}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({result.centerStarCompatibility.score >= 0 ? "+" : ""}
                      {result.centerStarCompatibility.score}点)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {result.centerStarCompatibility.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 宇宙盤タブ */}
          <TabsContent value="uchuban" className="mt-0 focus-visible:outline-none">
            <Card variant="premium">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-bold">宇宙盤（行動領域）</h3>
                <p className="text-sm text-muted-foreground">二人の行動パターンの重なりを可視化</p>
              </CardHeader>
              <CardContent>
                <CosmicChart
                  person1Triangle={result.uchuban.person1}
                  person2Triangle={result.uchuban.person2}
                  overlap={result.uchuban.overlap}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// 特殊関係性アイテム
function SpecialRelationItem({
  title,
  description,
  exists,
  detail,
  isNegative = false,
}: {
  title: string;
  description: string;
  exists: boolean;
  detail?: string;
  isNegative?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        exists
          ? isNegative
            ? "bg-red-500/5 border-red-500/20"
            : "bg-green-500/5 border-green-500/20"
          : "bg-muted/30 border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {exists ? (
          <div
            className={`flex items-center gap-1 ${isNegative ? "text-red-500" : "text-green-500"}`}
          >
            {isNegative ? <X className="size-4" /> : <Check className="size-4" />}
            <span className="text-sm font-medium">あり</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">なし</span>
        )}
      </div>
      {detail && <p className="text-sm mt-2 text-muted-foreground">{detail}</p>}
    </div>
  );
}
