import type { Jikkan, GogyoType } from "../../constants";
import { GOGYO, NIKKAN_INFO } from "../../constants";
import type { CompatibilityResult } from "../compatibility-constants";
import { RELATIONSHIP_TYPE_INFO } from "../compatibility-constants";

interface CompatibilityPdfCoverProps {
  result: CompatibilityResult;
  person1BirthDate: string;
  person2BirthDate: string;
  kanteiDate: string;
  kanteiName?: string;
}

const GOGYO_COLORS: Record<GogyoType, { bg: string; text: string }> = {
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

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function CompatibilityPdfCover({
  result,
  person1BirthDate,
  person2BirthDate,
  kanteiDate,
  kanteiName,
}: CompatibilityPdfCoverProps) {
  const nikkan1 = result.person1.nikkan as Jikkan;
  const nikkan2 = result.person2.nikkan as Jikkan;
  const gogyo1 = GOGYO[nikkan1] as GogyoType;
  const gogyo2 = GOGYO[nikkan2] as GogyoType;
  const colors1 = GOGYO_COLORS[gogyo1];
  const colors2 = GOGYO_COLORS[gogyo2];
  const nikkan1Info = NIKKAN_INFO[nikkan1];
  const nikkan2Info = NIKKAN_INFO[nikkan2];
  const relationshipInfo = RELATIONSHIP_TYPE_INFO[result.relationshipType.type];

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
          fontSize: "28pt",
          fontWeight: "bold",
          marginBottom: "15mm",
          letterSpacing: "0.3em",
          color: "#1a1a1a",
        }}
      >
        相性診断書
      </h1>

      {/* 二人の日干表示 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15mm",
          marginBottom: "10mm",
        }}
      >
        {/* Person 1 */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40mm",
              height: "40mm",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors1.bg,
              color: colors1.text,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            }}
          >
            <span style={{ fontSize: "32pt", fontWeight: "bold" }}>{nikkan1}</span>
          </div>
          <p style={{ fontSize: "11pt", color: "#666666", marginTop: "4mm" }}>
            {nikkan1Info.nature}
          </p>
        </div>

        {/* スコア表示 */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "42pt",
              fontWeight: "bold",
              color: getScoreColor(result.overallScore),
            }}
          >
            {result.overallScore}
          </div>
          <div style={{ fontSize: "14pt", color: "#666666" }}>点</div>
        </div>

        {/* Person 2 */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40mm",
              height: "40mm",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors2.bg,
              color: colors2.text,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            }}
          >
            <span style={{ fontSize: "32pt", fontWeight: "bold" }}>{nikkan2}</span>
          </div>
          <p style={{ fontSize: "11pt", color: "#666666", marginTop: "4mm" }}>
            {nikkan2Info.nature}
          </p>
        </div>
      </div>

      {/* 関係性タイプ */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "4mm",
          padding: "8mm 16mm",
          marginBottom: "10mm",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "12pt", color: "#666666", marginBottom: "2mm" }}>関係性タイプ</div>
        <div style={{ fontSize: "20pt", fontWeight: "bold", color: "#1a1a1a" }}>
          {relationshipInfo.emoji} {result.relationshipType.type}
        </div>
        <div style={{ fontSize: "11pt", color: "#666666", marginTop: "2mm" }}>
          {relationshipInfo.shortDesc}
        </div>
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

      {/* 二人の情報 */}
      <div
        style={{
          display: "flex",
          gap: "20mm",
          marginBottom: "10mm",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "10pt", color: "#999999", marginBottom: "2mm" }}>あなた</p>
          <p style={{ fontSize: "12pt", color: "#1a1a1a" }}>{formatDate(person1BirthDate)}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "10pt", color: "#999999", marginBottom: "2mm" }}>相手</p>
          <p style={{ fontSize: "12pt", color: "#1a1a1a" }}>{formatDate(person2BirthDate)}</p>
        </div>
      </div>

      <p style={{ fontSize: "12pt", color: "#1a1a1a", marginBottom: "8mm" }}>
        鑑定日: {formatDate(kanteiDate)}
      </p>

      {/* 区切り線 */}
      <div
        style={{
          width: "80mm",
          height: "1px",
          backgroundColor: "#e5e5e5",
          marginBottom: "8mm",
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
