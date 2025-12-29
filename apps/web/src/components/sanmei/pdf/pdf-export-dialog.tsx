"use client";

import { useRef, useState } from "react";

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

import type { SanmeiResult } from "../constants";

import { PdfDocument } from "./pdf-document";

interface PdfExportDialogProps {
  result: SanmeiResult;
  birthDate: string;
  gender: "male" | "female";
  isTransformed: boolean;
}

function formatDateForFilename(dateString: string): string {
  return dateString.replace(/-/g, "");
}

export function PdfExportDialog({
  result,
  birthDate,
  gender,
  isTransformed,
}: PdfExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [kanteiName, setKanteiName] = useState("");
  const documentRef = useRef<HTMLDivElement>(null);

  const kanteiDate = new Date().toISOString().split("T")[0];
  const filename = `算命学鑑定書_${formatDateForFilename(birthDate)}_${formatDateForFilename(kanteiDate)}.pdf`;

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
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              鑑定書をダウンロード
            </Button>
          }
        />
        <DialogContent showCloseButton={!isGenerating}>
          <DialogHeader>
            <DialogTitle>PDF鑑定書を出力</DialogTitle>
            <DialogDescription>
              鑑定書をPDF形式でダウンロードします。鑑定者名を入力すると、PDFに記載されます。
            </DialogDescription>
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
              />
            </div>

            {error && <p className="text-xs text-destructive">エラー: {error.message}</p>}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isGenerating}>
                  キャンセル
                </Button>
              }
            />
            <Button onClick={handleGeneratePdf} disabled={isGenerating} className="gap-2">
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
      <PdfDocument
        ref={documentRef}
        result={result}
        birthDate={birthDate}
        gender={gender}
        isTransformed={isTransformed}
        kanteiDate={kanteiDate}
        kanteiName={kanteiName || undefined}
      />
    </>
  );
}
