"use client";

import { ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GOGYO, NIKKAN_INFO, SHUSEI_INFO } from "../constants";
import { ShareButtons } from "../share-buttons";
import type { CompatibilityResult } from "./compatibility-constants";
import { CosmicChart } from "./cosmic-chart";
import { CompatibilityPdfDialog } from "./pdf";
import { RelationshipCard } from "./relationship-card";

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
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-2xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="-ml-2 flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4 mr-1" />
            <span>戻る</span>
          </Button>
          <div className="flex items-center gap-2">
            <CompatibilityPdfDialog
              result={result}
              person1BirthDate={person1BirthDate}
              person2BirthDate={person2BirthDate}
            />
            <ShareButtons
              text={`相性診断結果: ${result.overallScore}点（${result.relationshipType.type}）\n\n#算命学 #相性診断 #占い`}
            />
          </div>
        </div>

        {/* 二人の日干表示 */}
        <Card className="rounded-2xl border-border overflow-hidden mb-4 py-0">
          <div className="bg-linear-to-r from-blue-500/10 via-pink-500/10 to-orange-500/10 p-6">
            <div className="flex items-center justify-center gap-4">
              {/* Person 1 */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">あなた</div>
                <div
                  className="size-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: `var(--gogyo-${element1})` }}
                >
                  {result.person1.nikkan}
                </div>
                <div className="text-sm mt-2 font-medium">{nikkan1Info.nature}</div>
              </div>

              {/* 中央のスコア */}
              <div className="text-center px-6">
                <div className="text-4xl font-bold text-pink-500">{result.overallScore}</div>
                <div className="text-xs text-muted-foreground">点</div>
              </div>

              {/* Person 2 */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">相手</div>
                <div
                  className="size-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: `var(--gogyo-${element2})` }}
                >
                  {result.person2.nikkan}
                </div>
                <div className="text-sm mt-2 font-medium">{nikkan2Info.nature}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* タブコンテンツ */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg text-xs">
              概要
            </TabsTrigger>
            <TabsTrigger value="special" className="rounded-lg text-xs">
              特殊関係
            </TabsTrigger>
            <TabsTrigger value="gogyo" className="rounded-lg text-xs">
              五行
            </TabsTrigger>
            <TabsTrigger value="uchuban" className="rounded-lg text-xs">
              宇宙盤
            </TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="mt-4">
            <Card className="rounded-2xl border-border">
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
          <TabsContent value="special" className="mt-4">
            <Card className="rounded-2xl border-border">
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
          <TabsContent value="gogyo" className="mt-4">
            <Card className="rounded-2xl border-border">
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
          <TabsContent value="uchuban" className="mt-4">
            <Card className="rounded-2xl border-border">
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
