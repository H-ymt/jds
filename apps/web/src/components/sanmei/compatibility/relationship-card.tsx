"use client";

import { type RelationshipTypeResult, RELATIONSHIP_TYPE_INFO } from "./compatibility-constants";

interface RelationshipCardProps {
  result: RelationshipTypeResult;
  overallScore: number;
}

export function RelationshipCard({ result, overallScore }: RelationshipCardProps) {
  const info = RELATIONSHIP_TYPE_INFO[result.type];

  // スコアに基づいて色を決定
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <div className="space-y-6">
      {/* スコアと関係性タイプ */}
      <div className="text-center space-y-4">
        {/* スコア表示 */}
        <div className="relative inline-flex items-center justify-center">
          <svg className="size-32" viewBox="0 0 100 100">
            {/* 背景の円 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="opacity-10"
            />
            {/* プログレス円 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${overallScore * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.637 0.237 25.331)" />
                <stop offset="100%" stopColor="oklch(0.705 0.191 47.604)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </span>
            <span className="text-xs text-muted-foreground">点</span>
          </div>
        </div>

        {/* 関係性タイプ */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">{info.emoji}</span>
            <h3 className="text-xl font-bold">{result.type}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{info.shortDesc}</p>
        </div>
      </div>

      {/* 詳細説明 */}
      <div className="space-y-4">
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm leading-relaxed">{result.description}</p>
        </div>

        {/* アドバイス */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
          <p className="text-xs font-medium text-primary mb-1">アドバイス</p>
          <p className="text-sm leading-relaxed">{result.advice}</p>
        </div>
      </div>
    </div>
  );
}

interface ScoreBreakdownProps {
  label: string;
  value: number;
  maxValue?: number;
  isPositive?: boolean;
}

export function ScoreBreakdown({
  label,
  value,
  maxValue = 30,
  isPositive = true,
}: ScoreBreakdownProps) {
  const percentage = Math.abs(value / maxValue) * 100;
  const barColor = isPositive
    ? value >= 0
      ? "bg-green-500"
      : "bg-red-500"
    : value > 0
      ? "bg-red-500"
      : "bg-green-500";

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span
        className={`w-12 text-right font-medium ${value >= 0 ? "text-green-500" : "text-red-500"}`}
      >
        {value >= 0 ? "+" : ""}
        {value}
      </span>
    </div>
  );
}
