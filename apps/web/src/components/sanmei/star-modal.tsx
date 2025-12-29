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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={props.onClose}
    >
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* モーダルコンテンツ */}
      <div
        className={cn(
          "relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl",
          "animate-in zoom-in-95 fade-in duration-200",
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
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{position}</p>
          <h3 className="text-2xl font-bold text-foreground">{star}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-8 rounded-full">
          <X className="size-4" />
        </Button>
      </div>

      {/* バッジ */}
      <div className="flex items-center gap-2 mb-4">
        <GogyoBadge element={info.element} />
        <span className="text-sm text-muted-foreground">{info.keyword}</span>
      </div>

      {/* 解説 */}
      <p className="text-sm text-foreground leading-relaxed mb-4">{info.desc}</p>

      {/* 位置の意味 */}
      {posInfo && (
        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-1">この位置の意味</p>
          <p className="text-sm text-foreground">{posInfo.desc}</p>
        </div>
      )}
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
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{position}</p>
          <h3 className="text-2xl font-bold text-foreground">{star}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-8 rounded-full">
          <X className="size-4" />
        </Button>
      </div>

      {/* エネルギー・段階 */}
      <div className="flex items-center gap-6 mb-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{info.energy}</p>
          <p className="text-xs text-muted-foreground">エネルギー</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">{info.phase}</p>
          <p className="text-xs text-muted-foreground">人生の段階</p>
        </div>
      </div>

      {/* 解説 */}
      <p className="text-sm text-foreground leading-relaxed">{info.desc}</p>
    </>
  );
}
