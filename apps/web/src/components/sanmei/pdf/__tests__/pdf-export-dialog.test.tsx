import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SanmeiResult } from "../../constants";
import { PdfExportDialog } from "../pdf-export-dialog";

// Mock usePdfExport hook
const mockGeneratePdf = vi.fn();
vi.mock("@/hooks/use-pdf-export", () => ({
  usePdfExport: vi.fn(() => ({
    isGenerating: false,
    error: null,
    generatePdf: mockGeneratePdf,
  })),
}));

// Mock PdfDocument
vi.mock("../pdf-document", () => ({
  PdfDocument: vi.fn(() => <div data-testid="pdf-document">PDF Document</div>),
}));

// Import after mocking
import { usePdfExport } from "@/hooks/use-pdf-export";

describe("PdfExportDialog", () => {
  const mockResult: SanmeiResult = {
    pillars: {
      year: { kan: "甲", shi: "子" },
      month: { kan: "乙", shi: "丑" },
      day: { kan: "丙", shi: "寅" },
    },
    nikkan: "丙",
    kango: { exists: false },
    stars: {
      north: "貫索星",
      center: "石門星",
      south: "鳳閣星",
      east: "調舒星",
      west: "禄存星",
      jusei: {
        right: "天報星",
        left: "天印星",
        center: "天貴星",
      },
    },
    dominantElement: ["火", 3],
    allStars: ["貫索星", "石門星", "鳳閣星", "調舒星", "禄存星"],
  };

  const defaultProps = {
    result: mockResult,
    birthDate: "1990-01-15",
    gender: "male" as const,
    isTransformed: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGeneratePdf.mockResolvedValue(undefined);
    vi.mocked(usePdfExport).mockReturnValue({
      isGenerating: false,
      error: null,
      generatePdf: mockGeneratePdf,
    });
  });

  it("ダウンロードボタンがレンダリングされる", () => {
    render(<PdfExportDialog {...defaultProps} />);

    expect(screen.getByText(/鑑定書をダウンロード/)).toBeInTheDocument();
  });

  it("ダウンロードボタンが有効化されている", () => {
    render(<PdfExportDialog {...defaultProps} />);

    const button = screen.getByRole("button", { name: /鑑定書をダウンロード/ });
    expect(button).toBeEnabled();
  });

  it("PdfDocumentコンポーネントがレンダリングされる", () => {
    render(<PdfExportDialog {...defaultProps} />);

    expect(screen.getByTestId("pdf-document")).toBeInTheDocument();
  });

  it("usePdfExportが正しいオプションで呼び出される", () => {
    // 日付をモック
    const mockDate = new Date("2024-12-29T12:00:00Z");
    vi.setSystemTime(mockDate);

    render(<PdfExportDialog {...defaultProps} />);

    expect(usePdfExport).toHaveBeenCalledWith({
      filename: "算命学鑑定書_19900115_20241229.pdf",
      pageSize: "a4",
      orientation: "portrait",
      scale: 2,
    });

    vi.useRealTimers();
  });

  it("ファイル名が生年月日と鑑定日から生成される", () => {
    const mockDate = new Date("2024-12-29T12:00:00Z");
    vi.setSystemTime(mockDate);

    render(<PdfExportDialog {...defaultProps} birthDate="2000-05-20" />);

    expect(usePdfExport).toHaveBeenCalledWith(
      expect.objectContaining({
        filename: "算命学鑑定書_20000520_20241229.pdf",
      }),
    );

    vi.useRealTimers();
  });
});

describe("PdfExportDialog - formatDateForFilename", () => {
  const mockResult: SanmeiResult = {
    pillars: {
      year: { kan: "甲", shi: "子" },
      month: { kan: "乙", shi: "丑" },
      day: { kan: "丙", shi: "寅" },
    },
    nikkan: "丙",
    kango: { exists: false },
    stars: {
      north: "貫索星",
      center: "石門星",
      south: "鳳閣星",
      east: "調舒星",
      west: "禄存星",
      jusei: {
        right: "天報星",
        left: "天印星",
        center: "天貴星",
      },
    },
    dominantElement: ["火", 3],
    allStars: ["貫索星", "石門星", "鳳閣星", "調舒星", "禄存星"],
  };

  it("日付のハイフンが削除される", () => {
    const mockDate = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(mockDate);

    render(
      <PdfExportDialog
        result={mockResult}
        birthDate="1985-12-31"
        gender="female"
        isTransformed={false}
      />,
    );

    expect(usePdfExport).toHaveBeenCalledWith(
      expect.objectContaining({
        filename: "算命学鑑定書_19851231_20240101.pdf",
      }),
    );

    vi.useRealTimers();
  });
});
