import type { Jikkan, SanmeiResult } from "../constants";

import { GOGYO, NIKKAN_INFO } from "../constants";

interface PdfCoverPageProps {
  result: SanmeiResult;
  birthDate: string;
  gender: "male" | "female";
  kanteiDate: string;
  kanteiName?: string;
}

const NIKKAN_SYMBOLS: Record<Jikkan, string> = {
  甲: "甲",
  乙: "乙",
  丙: "丙",
  丁: "丁",
  戊: "戊",
  己: "己",
  庚: "庚",
  辛: "辛",
  壬: "壬",
  癸: "癸",
};

const GOGYO_COLORS: Record<string, { bg: string; text: string }> = {
  木: { bg: "#10b981", text: "#ffffff" },
  火: { bg: "#ef4444", text: "#ffffff" },
  土: { bg: "#f59e0b", text: "#1a1a1a" },
  金: { bg: "#94a3b8", text: "#1a1a1a" },
  水: { bg: "#6366f1", text: "#ffffff" },
};

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${year}年${parseInt(month, 10)}月${parseInt(day, 10)}日`;
}

export function PdfCoverPage({
  result,
  birthDate,
  gender,
  kanteiDate,
  kanteiName,
}: PdfCoverPageProps) {
  const nikkan = result.nikkan;
  const nikkanInfo = NIKKAN_INFO[nikkan];
  const gogyo = GOGYO[nikkan];
  const colors = GOGYO_COLORS[gogyo];

  return (
    <div
      data-pdf-page="cover"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "20mm",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        fontFamily:
          '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* タイトル */}
      <h1
        style={{
          fontSize: "32pt",
          fontWeight: "bold",
          marginBottom: "20mm",
          letterSpacing: "0.3em",
          color: "#1a1a1a",
        }}
      >
        算命学 鑑定書
      </h1>

      {/* 日干シンボル */}
      <div
        style={{
          width: "60mm",
          height: "60mm",
          borderRadius: "8mm",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.bg,
          color: colors.text,
          marginBottom: "10mm",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
        }}
      >
        <span style={{ fontSize: "48pt", fontWeight: "bold" }}>{NIKKAN_SYMBOLS[nikkan]}</span>
      </div>

      {/* 日干情報 */}
      <div style={{ textAlign: "center", marginBottom: "15mm" }}>
        <p
          style={{
            fontSize: "12pt",
            color: "#666666",
            marginBottom: "3mm",
          }}
        >
          あなたの日干（本質）
        </p>
        <p
          style={{
            fontSize: "20pt",
            fontWeight: "bold",
            color: "#1a1a1a",
            marginBottom: "2mm",
          }}
        >
          {nikkanInfo.name}
        </p>
        <p
          style={{
            fontSize: "14pt",
            color: "#666666",
          }}
        >
          「{nikkanInfo.nature}」の性質
        </p>
      </div>

      {/* 区切り線 */}
      <div
        style={{
          width: "80mm",
          height: "1px",
          backgroundColor: "#e5e5e5",
          marginBottom: "15mm",
        }}
      />

      {/* 鑑定対象者情報 */}
      <div style={{ textAlign: "center", marginBottom: "10mm" }}>
        <p style={{ fontSize: "12pt", color: "#1a1a1a", marginBottom: "3mm" }}>
          生年月日: {formatDate(birthDate)}
        </p>
        <p style={{ fontSize: "12pt", color: "#1a1a1a", marginBottom: "3mm" }}>
          性別: {gender === "male" ? "男性" : "女性"}
        </p>
        <p style={{ fontSize: "12pt", color: "#1a1a1a" }}>鑑定日: {formatDate(kanteiDate)}</p>
      </div>

      {/* 区切り線 */}
      <div
        style={{
          width: "80mm",
          height: "1px",
          backgroundColor: "#e5e5e5",
          marginBottom: "10mm",
        }}
      />

      {/* 鑑定者名 */}
      {kanteiName && (
        <p
          style={{
            fontSize: "14pt",
            color: "#1a1a1a",
            fontWeight: "500",
          }}
        >
          鑑定者: {kanteiName}
        </p>
      )}
    </div>
  );
}
