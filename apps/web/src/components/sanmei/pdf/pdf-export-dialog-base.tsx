"use client";

import type { ReactNode, RefObject } from "react";
import { useState } from "react";

import { Download, Loader2 } from "lucide-react";

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
            <Button variant="outline" className="gap-2 shadow-sm">
              <Download className="size-4" />
              {triggerLabel}
            </Button>
          }
        />
        <DialogContent showCloseButton={!isGenerating} className="rounded-2xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="kantei-name" className="text-xs font-medium">
                鑑定者名（任意）
              </label>
              <Input
                id="kantei-name"
                placeholder="例: 山田 太郎"
                value={kanteiName}
                onChange={(e) => setKanteiName(e.target.value)}
                disabled={isGenerating}
                className="rounded-lg"
              />
            </div>

            {error && <p className="text-xs text-destructive">エラー: {error.message}</p>}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isGenerating} className="rounded-full">
                  キャンセル
                </Button>
              }
            />
            <Button
              onClick={handleGeneratePdf}
              disabled={isGenerating}
              className="gap-2 rounded-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  PDFを生成
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF生成用の非表示コンポーネント */}
      {renderDocument(kanteiName || undefined, kanteiDate)}
    </>
  );
}
