import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { SanmeiResult } from "../../constants";
import { PdfDocument } from "../pdf-document";

// Mock child components
vi.mock("../pdf-cover-page", () => ({
  PdfCoverPage: ({ birthDate, gender }: { birthDate: string; gender: string }) => (
    <div data-testid="pdf-cover-page" data-birthdate={birthDate} data-gender={gender}>
      Cover Page
    </div>
  ),
}));

vi.mock("../pdf-chart-page", () => ({
  PdfChartPage: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
    <div data-testid="pdf-chart-page" data-page={pageNumber} data-total={totalPages}>
      Chart Page
    </div>
  ),
}));

vi.mock("../pdf-detail-page", () => ({
  PdfDetailPage: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
    <div data-testid="pdf-detail-page" data-page={pageNumber} data-total={totalPages}>
      Detail Page
    </div>
  ),
}));

describe("PdfDocument", () => {
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
    kanteiDate: "2024-12-29",
    kanteiName: "山田太郎",
  };

  it("3ページ構成でレンダリングされる", () => {
    render(<PdfDocument {...defaultProps} />);

    expect(screen.getByTestId("pdf-cover-page")).toBeInTheDocument();
    expect(screen.getByTestId("pdf-chart-page")).toBeInTheDocument();
    expect(screen.getByTestId("pdf-detail-page")).toBeInTheDocument();
  });

  it("非表示のためのスタイルが適用される", () => {
    const { container } = render(<PdfDocument {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({
      position: "fixed",
      left: "-9999px",
      top: "0px",
      zIndex: "-1",
    });
  });

  it("refが正しく転送される", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<PdfDocument {...defaultProps} ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("PdfCoverPageに正しいpropsが渡される", () => {
    render(<PdfDocument {...defaultProps} />);

    const coverPage = screen.getByTestId("pdf-cover-page");
    expect(coverPage).toHaveAttribute("data-birthdate", "1990-01-15");
    expect(coverPage).toHaveAttribute("data-gender", "male");
  });

  it("PdfChartPageに正しいページ番号が渡される", () => {
    render(<PdfDocument {...defaultProps} />);

    const chartPage = screen.getByTestId("pdf-chart-page");
    expect(chartPage).toHaveAttribute("data-page", "2");
    expect(chartPage).toHaveAttribute("data-total", "3");
  });

  it("PdfDetailPageに正しいページ番号が渡される", () => {
    render(<PdfDocument {...defaultProps} />);

    const detailPage = screen.getByTestId("pdf-detail-page");
    expect(detailPage).toHaveAttribute("data-page", "3");
    expect(detailPage).toHaveAttribute("data-total", "3");
  });

  it("鑑定者名がundefinedでも正常にレンダリングされる", () => {
    render(<PdfDocument {...defaultProps} kanteiName={undefined} />);

    expect(screen.getByTestId("pdf-cover-page")).toBeInTheDocument();
    expect(screen.getByTestId("pdf-chart-page")).toBeInTheDocument();
    expect(screen.getByTestId("pdf-detail-page")).toBeInTheDocument();
  });

  it("女性の場合もレンダリングされる", () => {
    render(<PdfDocument {...defaultProps} gender="female" />);

    const coverPage = screen.getByTestId("pdf-cover-page");
    expect(coverPage).toHaveAttribute("data-gender", "female");
  });

  it("変換後（isTransformed=true）でもレンダリングされる", () => {
    render(<PdfDocument {...defaultProps} isTransformed={true} />);

    expect(screen.getByTestId("pdf-chart-page")).toBeInTheDocument();
  });
});
