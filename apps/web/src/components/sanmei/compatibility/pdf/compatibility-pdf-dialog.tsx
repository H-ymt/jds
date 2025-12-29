"use client";

import { useRef } from "react";

import { PdfExportDialogBase } from "../../pdf/pdf-export-dialog-base";
import type { CompatibilityResult } from "../compatibility-constants";

import { CompatibilityPdfDocument } from "./compatibility-pdf-document";

interface CompatibilityPdfDialogProps {
  result: CompatibilityResult;
  person1BirthDate: string;
  person2BirthDate: string;
  hideLabelOnMobile?: boolean;
}

function formatDateForFilename(dateString: string): string {
  return dateString.replace(/-/g, "");
}

export function CompatibilityPdfDialog({
  result,
  person1BirthDate,
  person2BirthDate,
  hideLabelOnMobile,
}: CompatibilityPdfDialogProps) {
  const documentRef = useRef<HTMLDivElement>(null);
  const kanteiDate = new Date().toISOString().split("T")[0];
  const filename = `相性診断書_${formatDateForFilename(person1BirthDate)}_${formatDateForFilename(
    person2BirthDate,
  )}_${formatDateForFilename(kanteiDate)}.pdf`;

  return (
    <PdfExportDialogBase
      triggerLabel="診断書をダウンロード"
      dialogTitle="PDF診断書を出力"
      dialogDescription="相性診断書をPDF形式でダウンロードします。鑑定者名を入力すると、PDFに記載されます。"
      filename={filename}
      kanteiDate={kanteiDate}
      documentRef={documentRef}
      hideLabelOnMobile={hideLabelOnMobile}
      renderDocument={(kanteiName, date) => (
        <CompatibilityPdfDocument
          ref={documentRef}
          result={result}
          person1BirthDate={person1BirthDate}
          person2BirthDate={person2BirthDate}
          kanteiDate={date}
          kanteiName={kanteiName}
        />
      )}
    />
  );
}
