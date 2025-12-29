"use client";

import { cn } from "@/lib/utils";

import { type GogyoType, type Shusei, type Jusei, SHUSEI_INFO, JUSEI_INFO } from "./constants";

// 五行からCSSクラスへのマッピング（グラデーションとシャドウを追加）
const gogyoStyles: Record<GogyoType, string> = {
  木: "bg-linear-to-br from-(--gogyo-wood) to-[oklch(0.55_0.12_160)] text-(--gogyo-wood-foreground) shadow-[inset_0_1px_rgba(255,255,255,0.2)]",
  火: "bg-linear-to-br from-(--gogyo-fire) to-[oklch(0.5_0.16_28)] text-(--gogyo-fire-foreground) shadow-[inset_0_1px_rgba(255,255,255,0.2)]",
  土: "bg-linear-to-br from-(--gogyo-earth) to-[oklch(0.65_0.1_82)] text-(--gogyo-earth-foreground) shadow-[inset_0_1px_rgba(255,255,255,0.3)]",
  金: "bg-linear-to-br from-(--gogyo-metal) to-[oklch(0.75_0.02_250)] text-(--gogyo-metal-foreground) shadow-[inset_0_1px_rgba(255,255,255,0.5)] border border-(--gogyo-metal-foreground)/10",
  水: "bg-linear-to-br from-(--gogyo-water) to-[oklch(0.38_0.14_275)] text-(--gogyo-water-foreground) shadow-[inset_0_1px_rgba(255,255,255,0.15)]",
};

interface StarCellProps {
  star: Shusei;
  position: string;
  showKeyword?: boolean;
  onClick?: () => void;
}

export function StarCell({ star, position, showKeyword = true, onClick }: StarCellProps) {
  const info = SHUSEI_INFO[star];
  const styleClass = gogyoStyles[info?.element] || gogyoStyles["木"];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl p-4 transition-all duration-300",
        "hover:scale-[1.03] hover:shadow-xl active:scale-[0.97]",
        "border border-white/10 overflow-hidden group",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        styleClass,
      )}
    >
      {/* 光沢アニメーション */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      <span className="text-[10px] opacity-70 font-semibold tracking-wider uppercase mb-1">
        {position}
      </span>
      <span className="text-lg font-extrabold tracking-tight mb-0.5">{star}</span>
      {showKeyword && (
        <span className="text-[10px] font-medium opacity-90 px-1.5 py-0.5 rounded-full bg-black/10">
          {info?.keyword}
        </span>
      )}
    </button>
  );
}

interface JuseiCellProps {
  star: Jusei;
  position: string;
  onClick?: () => void;
}

export function JuseiCell({ star, position, onClick }: JuseiCellProps) {
  const info = JUSEI_INFO[star];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl p-3.5 transition-all duration-300",
        "bg-(--jusei-light)/40 dark:bg-(--jusei)/20",
        "border border-(--jusei)/10 dark:border-(--jusei)/30",
        "hover:scale-[1.03] hover:bg-(--jusei-light)/60 dark:hover:bg-(--jusei)/30",
        "hover:shadow-lg active:scale-[0.97]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      )}
    >
      <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mb-1">
        {position}
      </span>
      <span className="text-base font-bold text-foreground mb-1">{star}</span>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[9px] text-muted-foreground font-medium">力量</span>
        <span className="text-[10px] font-bold text-(--jusei) dark:text-(--jusei-light)">
          {info?.energy}
        </span>
      </div>
    </button>
  );
}

// 五行バッジ
interface GogyoBadgeProps {
  element: GogyoType;
  className?: string;
}

export function GogyoBadge({ element, className }: GogyoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium",
        gogyoStyles[element],
        className,
      )}
    >
      {element}
    </span>
  );
}

// 五行カラー凡例
export function GogyoLegend() {
  const elements: GogyoType[] = ["木", "火", "土", "金", "水"];

  return (
    <div className="grid grid-cols-5 gap-2">
      {elements.map((element) => (
        <div
          key={element}
          className={cn(
            "flex items-center justify-center rounded-xl py-2.5 text-sm font-bold shadow-sm",
            gogyoStyles[element],
          )}
        >
          {element}
        </div>
      ))}
    </div>
  );
}
