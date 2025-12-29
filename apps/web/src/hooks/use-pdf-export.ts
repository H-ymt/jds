"use client";

import { useCallback, useState } from "react";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface UsePdfExportOptions {
  filename?: string;
  pageSize?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
  scale?: number;
}

interface UsePdfExportReturn {
  isGenerating: boolean;
  error: Error | null;
  generatePdf: (elementRef: React.RefObject<HTMLElement | null>) => Promise<void>;
}

const PAGE_SIZES = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
} as const;

export function usePdfExport(options: UsePdfExportOptions = {}): UsePdfExportReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePdf = useCallback(
    async (elementRef: React.RefObject<HTMLElement | null>) => {
      if (!elementRef.current) {
        setError(new Error("PDF生成対象の要素が見つかりません"));
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        // フォントのロード完了を待機
        await document.fonts.ready;

        // ページ要素を取得
        const pages = elementRef.current.querySelectorAll("[data-pdf-page]");
        if (pages.length === 0) {
          throw new Error("PDFページが見つかりません");
        }

        // ページサイズを取得
        const pageSize = PAGE_SIZES[options.pageSize || "a4"];
        const isPortrait = options.orientation !== "landscape";
        const width = isPortrait ? pageSize.width : pageSize.height;
        const height = isPortrait ? pageSize.height : pageSize.width;

        // jsPDFインスタンスを作成
        const pdf = new jsPDF({
          orientation: options.orientation || "portrait",
          unit: "mm",
          format: options.pageSize || "a4",
        });

        // 各ページをキャプチャしてPDFに追加
        for (let i = 0; i < pages.length; i++) {
          const pageElement = pages[i] as HTMLElement;

          // html2canvasでキャプチャ
          const canvas = await html2canvas(pageElement, {
            scale: options.scale || 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            allowTaint: true,
          });

          // 2ページ目以降は新しいページを追加
          if (i > 0) {
            pdf.addPage();
          }

          // 画像をPDFに追加
          const imgData = canvas.toDataURL("image/jpeg", 0.95);
          pdf.addImage(imgData, "JPEG", 0, 0, width, height);
        }

        // ファイル名を生成
        const filename = options.filename || `sanmei_kantei_${Date.now()}.pdf`;
        pdf.save(filename);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "PDF生成に失敗しました";
        setError(new Error(errorMessage));
        console.error("PDF generation error:", err);
      } finally {
        setIsGenerating(false);
      }
    },
    [options],
  );

  return { isGenerating, error, generatePdf };
}
