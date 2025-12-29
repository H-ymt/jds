"use client";

import { forwardRef } from "react";

import type { CompatibilityResult } from "../compatibility-constants";

import { CompatibilityPdfCover } from "./compatibility-pdf-cover";
import { CompatibilityPdfDetail } from "./compatibility-pdf-detail";

interface CompatibilityPdfDocumentProps {
  result: CompatibilityResult;
  person1BirthDate: string;
  person2BirthDate: string;
  kanteiDate: string;
  kanteiName?: string;
}

export const CompatibilityPdfDocument = forwardRef<HTMLDivElement, CompatibilityPdfDocumentProps>(
  function CompatibilityPdfDocument(
    { result, person1BirthDate, person2BirthDate, kanteiDate, kanteiName },
    ref,
  ) {
    const totalPages = 2;

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
        <CompatibilityPdfCover
          result={result}
          person1BirthDate={person1BirthDate}
          person2BirthDate={person2BirthDate}
          kanteiDate={kanteiDate}
          kanteiName={kanteiName}
        />
        <CompatibilityPdfDetail
          result={result}
          kanteiDate={kanteiDate}
          kanteiName={kanteiName}
          pageNumber={2}
          totalPages={totalPages}
        />
      </div>
    );
  },
);
