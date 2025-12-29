"use client";

import { forwardRef } from "react";

import type { SanmeiResult } from "../constants";

import { PdfChartPage } from "./pdf-chart-page";
import { PdfCoverPage } from "./pdf-cover-page";
import { PdfDetailPage } from "./pdf-detail-page";

interface PdfDocumentProps {
  result: SanmeiResult;
  birthDate: string;
  gender: "male" | "female";
  isTransformed: boolean;
  kanteiDate: string;
  kanteiName?: string;
}

export const PdfDocument = forwardRef<HTMLDivElement, PdfDocumentProps>(function PdfDocument(
  { result, birthDate, gender, isTransformed, kanteiDate, kanteiName },
  ref,
) {
  const totalPages = 3;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        zIndex: -1,
      }}
    >
      <PdfCoverPage
        result={result}
        birthDate={birthDate}
        gender={gender}
        kanteiDate={kanteiDate}
        kanteiName={kanteiName}
      />
      <PdfChartPage
        result={result}
        birthDate={birthDate}
        isTransformed={isTransformed}
        kanteiDate={kanteiDate}
        kanteiName={kanteiName}
        pageNumber={2}
        totalPages={totalPages}
      />
      <PdfDetailPage
        result={result}
        birthDate={birthDate}
        kanteiDate={kanteiDate}
        kanteiName={kanteiName}
        pageNumber={3}
        totalPages={totalPages}
      />
    </div>
  );
});
