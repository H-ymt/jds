"use client";

import { useRef } from "react";

import type { SanmeiResult } from "../constants";

import { PdfDocument } from "./pdf-document";
import { PdfExportDialogBase } from "./pdf-export-dialog-base";

interface PdfExportDialogProps {
  result: SanmeiResult;
  birthDate: string;
  gender: "male" | "female";
  isTransformed: boolean;
  hideLabelOnMobile?: boolean;
}

function formatDateForFilename(dateString: string): string {
  return dateString.replace(/-/g, "");
}

export function PdfExportDialog({
  result,
  birthDate,
  gender,
  isTransformed,
  hideLabelOnMobile,
}: PdfExportDialogProps) {
  const documentRef = useRef<HTMLDivElement>(null);
  const kanteiDate = new Date().toISOString().split("T")[0];
  const filename = `算命学鑑定書_${formatDateForFilename(birthDate)}_${formatDateForFilename(kanteiDate)}.pdf`;

  return (
    <PdfExportDialogBase
      triggerLabel="鑑定書をダウンロード"
      dialogTitle="PDF鑑定書を出力"
      dialogDescription="鑑定書をPDF形式でダウンロードします。鑑定者名を入力すると、PDFに記載されます。（一部表記が崩れることがあります）"
      filename={filename}
      kanteiDate={kanteiDate}
      documentRef={documentRef}
      hideLabelOnMobile={hideLabelOnMobile}
      renderDocument={(kanteiName, date) => (
        <PdfDocument
          ref={documentRef}
          result={result}
          birthDate={birthDate}
          gender={gender}
          isTransformed={isTransformed}
          kanteiDate={date}
          kanteiName={kanteiName}
        />
      )}
    />
  );
}
