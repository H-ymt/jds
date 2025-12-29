import { act, renderHook } from "@testing-library/react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePdfExport } from "../use-pdf-export";

// Mock html2canvas
vi.mock("html2canvas", () => ({
  default: vi.fn(),
}));

// jsPDFのモックインスタンス
const mockPdfInstance = {
  addPage: vi.fn(),
  addImage: vi.fn(),
  save: vi.fn(),
};

// Mock jsPDF as a class using function constructor
vi.mock("jspdf", () => ({
  jsPDF: vi.fn(function () {
    return mockPdfInstance;
  }),
}));

describe("usePdfExport", () => {
  const mockCanvas = {
    toDataURL: vi.fn(() => "data:image/jpeg;base64,mockdata"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPdfInstance.addPage.mockClear();
    mockPdfInstance.addImage.mockClear();
    mockPdfInstance.save.mockClear();
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas as unknown as HTMLCanvasElement);
  });

  it("初期状態ではisGeneratingがfalse、errorがnull", () => {
    const { result } = renderHook(() => usePdfExport());

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.generatePdf).toBeInstanceOf(Function);
  });

  it("デフォルトオプションで動作する", () => {
    const { result } = renderHook(() => usePdfExport());

    expect(result.current.isGenerating).toBe(false);
  });

  it("カスタムオプションを受け取る", () => {
    const options = {
      filename: "test.pdf",
      pageSize: "letter" as const,
      orientation: "landscape" as const,
      scale: 3,
    };

    const { result } = renderHook(() => usePdfExport(options));

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("要素が見つからない場合はエラーを設定する", async () => {
    const { result } = renderHook(() => usePdfExport());
    const elementRef = { current: null };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe("PDF生成対象の要素が見つかりません");
  });

  it("PDFページが見つからない場合はエラーを設定する", async () => {
    const { result } = renderHook(() => usePdfExport());

    const mockElement = document.createElement("div");
    const elementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe("PDFページが見つかりません");
  });

  it("PDF生成後はisGeneratingがfalseになる", async () => {
    const { result } = renderHook(() => usePdfExport());

    const mockElement = document.createElement("div");
    const mockPage = document.createElement("div");
    mockPage.setAttribute("data-pdf-page", "1");
    mockElement.appendChild(mockPage);
    const elementRef = { current: mockElement };

    // 初期状態
    expect(result.current.isGenerating).toBe(false);

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    // 生成完了後
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("複数ページのPDFを生成する", async () => {
    const { result } = renderHook(() => usePdfExport({ filename: "multi-page.pdf" }));

    const mockElement = document.createElement("div");
    for (let i = 0; i < 3; i++) {
      const mockPage = document.createElement("div");
      mockPage.setAttribute("data-pdf-page", String(i + 1));
      mockElement.appendChild(mockPage);
    }
    const elementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    // 3ページあるので、addPageは2回呼ばれる（最初のページは既にある）
    expect(mockPdfInstance.addPage).toHaveBeenCalledTimes(2);
    expect(mockPdfInstance.addImage).toHaveBeenCalledTimes(3);
    expect(mockPdfInstance.save).toHaveBeenCalledWith("multi-page.pdf");
  });

  it("html2canvasがエラーを投げた場合にエラーを設定する", async () => {
    vi.mocked(html2canvas).mockRejectedValueOnce(new Error("Canvas error"));

    const { result } = renderHook(() => usePdfExport());

    const mockElement = document.createElement("div");
    const mockPage = document.createElement("div");
    mockPage.setAttribute("data-pdf-page", "1");
    mockElement.appendChild(mockPage);
    const elementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe("Canvas error");
  });

  it("A4サイズ、ポートレート向きでPDFを生成する", async () => {
    const { result } = renderHook(() =>
      usePdfExport({
        pageSize: "a4",
        orientation: "portrait",
      }),
    );

    const mockElement = document.createElement("div");
    const mockPage = document.createElement("div");
    mockPage.setAttribute("data-pdf-page", "1");
    mockElement.appendChild(mockPage);
    const elementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(jsPDF).toHaveBeenCalledWith({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // A4ポートレート: width=210, height=297
    expect(mockPdfInstance.addImage).toHaveBeenCalledWith(
      "data:image/jpeg;base64,mockdata",
      "JPEG",
      0,
      0,
      210,
      297,
    );
  });

  it("レターサイズ、ランドスケープ向きでPDFを生成する", async () => {
    const { result } = renderHook(() =>
      usePdfExport({
        pageSize: "letter",
        orientation: "landscape",
      }),
    );

    const mockElement = document.createElement("div");
    const mockPage = document.createElement("div");
    mockPage.setAttribute("data-pdf-page", "1");
    mockElement.appendChild(mockPage);
    const elementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(jsPDF).toHaveBeenCalledWith({
      orientation: "landscape",
      unit: "mm",
      format: "letter",
    });

    // レターランドスケープ: width=279, height=216
    expect(mockPdfInstance.addImage).toHaveBeenCalledWith(
      "data:image/jpeg;base64,mockdata",
      "JPEG",
      0,
      0,
      279,
      216,
    );
  });

  it("デフォルトのファイル名を使用する", async () => {
    // Date.now をモック
    const mockNow = 1703836800000;
    vi.spyOn(Date, "now").mockReturnValue(mockNow);

    const { result } = renderHook(() => usePdfExport());

    const mockElement = document.createElement("div");
    const mockPage = document.createElement("div");
    mockPage.setAttribute("data-pdf-page", "1");
    mockElement.appendChild(mockPage);
    const elementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(mockPdfInstance.save).toHaveBeenCalledWith(`sanmei_kantei_${mockNow}.pdf`);

    vi.restoreAllMocks();
  });

  it("html2canvasに正しいオプションを渡す", async () => {
    const { result } = renderHook(() => usePdfExport({ scale: 3 }));

    const mockElement = document.createElement("div");
    const mockPage = document.createElement("div");
    mockPage.setAttribute("data-pdf-page", "1");
    mockElement.appendChild(mockPage);
    const elementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(html2canvas).toHaveBeenCalledWith(mockPage, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: true,
    });
  });

  it("単一ページのPDFを生成する場合はaddPageが呼ばれない", async () => {
    const { result } = renderHook(() => usePdfExport({ filename: "single-page.pdf" }));

    const mockElement = document.createElement("div");
    const mockPage = document.createElement("div");
    mockPage.setAttribute("data-pdf-page", "1");
    mockElement.appendChild(mockPage);
    const elementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(mockPdfInstance.addPage).not.toHaveBeenCalled();
    expect(mockPdfInstance.addImage).toHaveBeenCalledTimes(1);
    expect(mockPdfInstance.save).toHaveBeenCalledWith("single-page.pdf");
  });

  it("エラー発生後にerrorがリセットされる", async () => {
    const { result } = renderHook(() => usePdfExport());
    const elementRef = { current: null };

    // 最初にエラーを発生させる
    await act(async () => {
      await result.current.generatePdf(elementRef);
    });

    expect(result.current.error).not.toBeNull();

    // 正常な要素でPDFを生成
    const mockElement = document.createElement("div");
    const mockPage = document.createElement("div");
    mockPage.setAttribute("data-pdf-page", "1");
    mockElement.appendChild(mockPage);
    const validElementRef = { current: mockElement };

    await act(async () => {
      await result.current.generatePdf(validElementRef);
    });

    expect(result.current.error).toBeNull();
  });
});
