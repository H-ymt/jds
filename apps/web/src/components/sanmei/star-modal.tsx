"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { type Shusei, type Jusei, SHUSEI_INFO, JUSEI_INFO, POSITION_INFO } from "./constants";
import { GogyoBadge } from "./star-cell";

interface StarModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShuseiModalProps extends StarModalBaseProps {
  type: "shusei";
  star: Shusei;
  position: string;
}

interface JuseiModalProps extends StarModalBaseProps {
  type: "jusei";
  star: Jusei;
  position: string;
}

type StarModalProps = ShuseiModalProps | JuseiModalProps;

export function StarModal(props: StarModalProps) {
  if (!props.isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300"
      onClick={props.onClose}
    >
      {/* モーダルコンテンツ */}
      <div
        className={cn(
          "relative w-full max-w-sm rounded-[2rem] border-none bg-white/95 dark:bg-zinc-900/95 shadow-2xl overflow-hidden",
          "animate-in zoom-in-95 fade-in duration-300",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {props.type === "shusei" ? (
          <ShuseiContent star={props.star} position={props.position} onClose={props.onClose} />
        ) : (
          <JuseiContent star={props.star} position={props.position} onClose={props.onClose} />
        )}
      </div>
    </div>
  );
}

interface ShuseiContentProps {
  star: Shusei;
  position: string;
  onClose: () => void;
}

function ShuseiContent({ star, position, onClose }: ShuseiContentProps) {
  const info = SHUSEI_INFO[star];
  const positionKey = position.replace("（中心）", "");
  const posInfo = POSITION_INFO[positionKey];

  return (
    <>
      {/* 五行カラーの装飾ライン */}
      <div
        className={cn(
          "h-1.5 w-full",
          `bg-(--gogyo-${
            info.element === "木"
              ? "wood"
              : info.element === "火"
                ? "fire"
                : info.element === "土"
                  ? "earth"
                  : info.element === "金"
                    ? "metal"
                    : "water"
          })`,
        )}
      />

      <div className="p-8">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
              {position}
            </p>
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{star}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-full hover:bg-muted transition-colors"
          >
            <X className="size-5 text-muted-foreground" />
          </Button>
        </div>

        {/* バッジ & キーワード */}
        <div className="flex items-center gap-3 mb-6">
          <GogyoBadge
            element={info.element}
            className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
          />
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-bold text-foreground opacity-80">{info.keyword}</span>
        </div>

        {/* 解説 */}
        <div className="relative mb-8 pt-4 border-t border-border">
          <p className="text-sm text-foreground/90 leading-relaxed font-medium">{info.desc}</p>
        </div>

        {/* 位置の意味 */}
        {posInfo && (
          <div className="rounded-2xl bg-muted/40 p-5 border border-border/40">
            <p className="text-[10px] font-extrabold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="size-1 rounded-full bg-muted-foreground/40" />
              この位置の意味
            </p>
            <p className="text-[13px] text-foreground/80 leading-normal font-medium">
              {posInfo.desc}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

interface JuseiContentProps {
  star: Jusei;
  position: string;
  onClose: () => void;
}

function JuseiContent({ star, position, onClose }: JuseiContentProps) {
  const info = JUSEI_INFO[star];

  return (
    <>
      {/* 従星用の装飾ライン（紫/藤色） */}
      <div className="h-1.5 w-full bg-(--jusei)" />

      <div className="p-8">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
              {position}
            </p>
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{star}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-full hover:bg-muted transition-colors"
          >
            <X className="size-5 text-muted-foreground" />
          </Button>
        </div>

        {/* エネルギー・段階 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl bg-muted/40 p-4 border border-border/40 text-center">
            <p className="text-3xl font-black text-(--jusei) mb-0.5">{info.energy}</p>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              力量 (Energy)
            </p>
          </div>
          <div className="rounded-2xl bg-muted/40 p-4 border border-border/40 text-center">
            <p className="text-xl font-black text-foreground mb-1 mt-1.5">{info.phase}</p>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              象徴 (Phase)
            </p>
          </div>
        </div>

        {/* 解説 */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-foreground/90 leading-relaxed font-medium">{info.desc}</p>
        </div>
      </div>
    </>
  );
}
