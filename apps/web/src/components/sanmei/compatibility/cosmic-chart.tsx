"use client";

import { JUNISHI } from "../constants";
import type { UchubanTriangle, UchubanOverlap } from "./compatibility-constants";

interface CosmicChartProps {
  person1Triangle: UchubanTriangle;
  person2Triangle: UchubanTriangle;
  overlap: UchubanOverlap;
}

export function CosmicChart({ person1Triangle, person2Triangle, overlap }: CosmicChartProps) {
  const centerX = 150;
  const centerY = 150;
  const radius = 110;
  const labelRadius = 135;

  // 12時の位置を0として時計回りに配置
  const getPosition = (index: number, r: number = radius) => {
    const angle = ((index * 30 - 90) * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  // 三角形のパスを生成
  const getTrianglePath = (points: [number, number, number]) => {
    const positions = points.map((p) => getPosition(p));
    return `M ${positions[0].x} ${positions[0].y} L ${positions[1].x} ${positions[1].y} L ${positions[2].x} ${positions[2].y} Z`;
  };

  // 共有頂点をハイライト
  const sharedPoints = person1Triangle.points.filter((p) => person2Triangle.points.includes(p));

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 300 300" className="w-full max-w-xs">
        {/* 背景の円 */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        />

        {/* 12分割の線 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const pos = getPosition(i);
          return (
            <line
              key={`line-${i}`}
              x1={centerX}
              y1={centerY}
              x2={pos.x}
              y2={pos.y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="opacity-10"
            />
          );
        })}

        {/* Person 1の三角形（青） */}
        <path
          d={getTrianglePath(person1Triangle.points)}
          fill="oklch(0.623 0.214 259.815 / 0.3)"
          stroke="oklch(0.623 0.214 259.815)"
          strokeWidth="2"
        />

        {/* Person 2の三角形（オレンジ） */}
        <path
          d={getTrianglePath(person2Triangle.points)}
          fill="oklch(0.705 0.191 47.604 / 0.3)"
          stroke="oklch(0.705 0.191 47.604)"
          strokeWidth="2"
        />

        {/* 十二支のラベル */}
        {JUNISHI.map((shi, i) => {
          const pos = getPosition(i, labelRadius);
          const isShared = sharedPoints.includes(i);
          return (
            <text
              key={shi}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs fill-current ${isShared ? "font-bold opacity-100" : "opacity-60"}`}
            >
              {shi}
            </text>
          );
        })}

        {/* Person 1の頂点マーカー */}
        {person1Triangle.points.map((p, i) => {
          const pos = getPosition(p);
          const isShared = person2Triangle.points.includes(p);
          return (
            <circle
              key={`p1-${i}`}
              cx={pos.x}
              cy={pos.y}
              r={isShared ? 6 : 5}
              fill="oklch(0.623 0.214 259.815)"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* Person 2の頂点マーカー */}
        {person2Triangle.points.map((p, i) => {
          const pos = getPosition(p);
          const isShared = person1Triangle.points.includes(p);
          if (isShared) return null; // 共有頂点は既に描画済み
          return (
            <circle
              key={`p2-${i}`}
              cx={pos.x}
              cy={pos.y}
              r={5}
              fill="oklch(0.705 0.191 47.604)"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* 中心に重なり度を表示 */}
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-current"
        >
          {overlap.overlapPercentage}%
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-current opacity-60"
        >
          重なり度
        </text>
      </svg>

      {/* 凡例 */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: "oklch(0.623 0.214 259.815)" }}
          />
          <span>あなた</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: "oklch(0.705 0.191 47.604)" }}
          />
          <span>相手</span>
        </div>
      </div>

      {/* 解釈 */}
      <p className="text-sm text-muted-foreground px-4">{overlap.interpretation}</p>
    </div>
  );
}
