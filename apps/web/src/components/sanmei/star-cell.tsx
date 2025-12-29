"use client";

import { cn } from "@/lib/utils";

import { type GogyoType, type Shusei, type Jusei, SHUSEI_INFO, JUSEI_INFO } from "./constants";

// 五行からCSSクラスへのマッピング
const gogyoStyles: Record<GogyoType, string> = {
  木: "bg-[var(--gogyo-wood)] text-[var(--gogyo-wood-foreground)]",
  火: "bg-[var(--gogyo-fire)] text-[var(--gogyo-fire-foreground)]",
  土: "bg-[var(--gogyo-earth)] text-[var(--gogyo-earth-foreground)]",
  金: "bg-[var(--gogyo-metal)] text-[var(--gogyo-metal-foreground)]",
  水: "bg-[var(--gogyo-water)] text-[var(--gogyo-water-foreground)]",
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
        "relative flex flex-col items-center justify-center rounded-xl p-3 transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        styleClass,
      )}
    >
      <span className="text-[10px] opacity-80 font-medium">{position}</span>
      <span className="text-base font-bold mt-0.5">{star}</span>
      {showKeyword && <span className="text-[10px] opacity-90 mt-1">{info?.keyword}</span>}
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
        "flex flex-col items-center justify-center rounded-xl p-2.5 transition-all duration-200",
        "bg-[var(--jusei)]/10 hover:bg-[var(--jusei)]/20",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      )}
    >
      <span className="text-[10px] text-muted-foreground font-medium">{position}</span>
      <span className="text-sm font-bold text-foreground mt-0.5">{star}</span>
      <span className="text-[10px] text-muted-foreground mt-0.5">力量 {info?.energy}</span>
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
            "flex items-center justify-center rounded-lg py-2 text-sm font-medium",
            gogyoStyles[element],
          )}
        >
          {element}
        </div>
      ))}
    </div>
  );
}
