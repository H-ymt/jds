"use client";

import type { ReactNode, RefObject } from "react";
import { useState } from "react";

import { Download, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePdfExport } from "@/hooks/use-pdf-export";
import { cn } from "@/lib/utils";

interface PdfExportDialogBaseProps {
  /** トリガーボタンのラベル */
  triggerLabel: string;
  /** ダイアログのタイトル */
  dialogTitle: string;
  /** ダイアログの説明文 */
  dialogDescription: string;
  /** PDFファイル名 */
  filename: string;
  /** 現在の鑑定日 */
  kanteiDate: string;
  /** PDF生成用のref */
  documentRef: RefObject<HTMLDivElement | null>;
  /** PDFドキュメントコンポーネント（kanteiNameを受け取るrender prop） */
  renderDocument: (kanteiName: string | undefined, kanteiDate: string) => ReactNode;
}

export function PdfExportDialogBase({
  triggerLabel,
  dialogTitle,
  dialogDescription,
  filename,
  kanteiDate,
  documentRef,
  renderDocument,
}: PdfExportDialogBaseProps) {
  const [open, setOpen] = useState(false);
  const [kanteiName, setKanteiName] = useState("");

  const { isGenerating, error, generatePdf } = usePdfExport({
    filename,
    pageSize: "a4",
    orientation: "portrait",
    scale: 2,
  });

  const handleGeneratePdf = async () => {
    await generatePdf(documentRef);
    if (!error) {
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button variant="glass" size="pill" className="group">
              <Download className="size-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-semibold">{triggerLabel}</span>
            </Button>
          }
        />
        <DialogContent
          showCloseButton={!isGenerating}
          className="max-w-md p-0 overflow-hidden border-none shadow-2xl"
        >
          {/* プレミアム・ヘッダー装飾 */}
          <div className="h-1.5 w-full bg-linear-to-r from-(--gogyo-wood) via-(--gogyo-water) to-(--gogyo-fire)" />

          <div className="p-8 space-y-8">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-(--gogyo-wood-light) text-(--gogyo-wood)">
                  <Download className="size-5" />
                </div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {dialogTitle}
                </DialogTitle>
              </div>
              <DialogDescription className="text-[13px] leading-relaxed text-muted-foreground/80">
                {dialogDescription}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2.5">
                <label
                  htmlFor="kantei-name"
                  className="text-xs font-bold text-foreground/70 ml-1 flex items-center gap-1.5"
                >
                  <span className="size-1 rounded-full bg-(--gogyo-wood)" />
                  鑑定者名（任意）
                </label>
                <Input
                  id="kantei-name"
                  placeholder="例: 山田 太郎"
                  value={kanteiName}
                  onChange={(e) => setKanteiName(e.target.value)}
                  disabled={isGenerating}
                  className="h-12 px-4 rounded-xl border-border/60 bg-muted/30 focus-visible:ring-(--gogyo-wood) focus-visible:border-(--gogyo-wood)/50 transition-all"
                />
                <p className="text-[10px] text-muted-foreground ml-1">
                  ※入力すると鑑定書の右下に記載されます
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex gap-2">
                  <span className="font-bold">!</span>
                  {error.message}
                </div>
              )}
            </div>

            <DialogFooter className="flex-row gap-3 pt-2">
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    disabled={isGenerating}
                    className="flex-1 rounded-xl h-12 font-medium hover:bg-muted"
                  >
                    キャンセル
                  </Button>
                }
              />
              <Button
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className={cn(
                  "flex-[1.5] h-12 rounded-xl font-bold gap-2 shadow-lg transition-all duration-500",
                  "bg-linear-to-r from-(--gogyo-wood) to-[oklch(0.5_0.15_160)] text-white hover:opacity-90 hover:shadow-emerald-500/20",
                  "disabled:opacity-50 disabled:shadow-none",
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>PDFを生成</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF生成用の非表示コンポーネント */}
      {renderDocument(kanteiName || undefined, kanteiDate)}
    </>
  );
}
