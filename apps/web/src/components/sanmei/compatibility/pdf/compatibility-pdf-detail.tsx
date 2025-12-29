import type { Jikkan, GogyoType } from "../../constants";
import { GOGYO, SHUSEI_INFO } from "../../constants";
import type { CompatibilityResult } from "../compatibility-constants";
import { RELATIONSHIP_TYPE_INFO } from "../compatibility-constants";

interface CompatibilityPdfDetailProps {
  result: CompatibilityResult;
  kanteiDate: string;
  kanteiName?: string;
  pageNumber: number;
  totalPages: number;
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

export function CompatibilityPdfDetail({
  result,
  kanteiDate,
  kanteiName,
  pageNumber,
  totalPages,
}: CompatibilityPdfDetailProps) {
  const nikkan1 = result.person1.nikkan as Jikkan;
  const nikkan2 = result.person2.nikkan as Jikkan;
  const gogyo1 = GOGYO[nikkan1] as GogyoType;
  const gogyo2 = GOGYO[nikkan2] as GogyoType;
  const colors1 = GOGYO_COLORS[gogyo1];
  const colors2 = GOGYO_COLORS[gogyo2];
  const relationshipInfo = RELATIONSHIP_TYPE_INFO[result.relationshipType.type];
  const center1Element = SHUSEI_INFO[result.person1.stars.center].element as GogyoType;
  const center2Element = SHUSEI_INFO[result.person2.stars.center].element as GogyoType;

  return (
    <div
      data-pdf-page="detail"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "12mm 15mm",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        fontFamily:
          '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif',
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: "3mm",
          marginBottom: "4mm",
        }}
      >
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
          相性診断 詳細レポート
        </h2>
        <div style={{ fontSize: "9pt", color: "#999999" }}>
          鑑定日: {formatDate(kanteiDate)}
          {kanteiName && ` ／ 鑑定者: ${kanteiName}`}
        </div>
      </div>

      {/* 関係性タイプ */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "3mm",
          padding: "4mm",
          marginBottom: "4mm",
        }}
      >
        <h3 style={{ fontSize: "11pt", fontWeight: "bold", marginBottom: "2mm", color: "#1a1a1a" }}>
          {relationshipInfo.emoji} {result.relationshipType.type}
        </h3>
        <p style={{ fontSize: "9pt", color: "#666666", margin: 0, lineHeight: 1.5 }}>
          {relationshipInfo.longDesc}
        </p>
      </div>

      {/* 五行相性 */}
      <div
        style={{
          display: "flex",
          gap: "4mm",
          marginBottom: "4mm",
        }}
      >
        {/* 日干の相性 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f8fafc",
            borderRadius: "3mm",
            padding: "4mm",
          }}
        >
          <h4
            style={{ fontSize: "10pt", fontWeight: "bold", marginBottom: "3mm", color: "#1a1a1a" }}
          >
            日干（本質）の相性
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "3mm", marginBottom: "2mm" }}>
            <div
              style={{
                width: "8mm",
                height: "8mm",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors1.bg,
                color: colors1.text,
                fontSize: "8pt",
                fontWeight: "bold",
              }}
            >
              {gogyo1}
            </div>
            <span style={{ fontSize: "9pt", color: "#666666" }}>→</span>
            <div
              style={{
                width: "8mm",
                height: "8mm",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors2.bg,
                color: colors2.text,
                fontSize: "8pt",
                fontWeight: "bold",
              }}
            >
              {gogyo2}
            </div>
            <span
              style={{
                fontSize: "10pt",
                fontWeight: "bold",
                color: result.nikkanCompatibility.score >= 0 ? "#10b981" : "#ef4444",
              }}
            >
              {result.nikkanCompatibility.relation}
            </span>
            <span style={{ fontSize: "9pt", color: "#666666" }}>
              ({result.nikkanCompatibility.score >= 0 ? "+" : ""}
              {result.nikkanCompatibility.score}点)
            </span>
          </div>
          <p style={{ fontSize: "8pt", color: "#666666", margin: 0, lineHeight: 1.4 }}>
            {result.nikkanCompatibility.description}
          </p>
        </div>

        {/* 中心星の相性 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f8fafc",
            borderRadius: "3mm",
            padding: "4mm",
          }}
        >
          <h4
            style={{ fontSize: "10pt", fontWeight: "bold", marginBottom: "3mm", color: "#1a1a1a" }}
          >
            中心星の相性
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "3mm", marginBottom: "2mm" }}>
            <div
              style={{
                width: "8mm",
                height: "8mm",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: GOGYO_COLORS[center1Element].bg,
                color: GOGYO_COLORS[center1Element].text,
                fontSize: "8pt",
                fontWeight: "bold",
              }}
            >
              {center1Element}
            </div>
            <span style={{ fontSize: "9pt", color: "#666666" }}>→</span>
            <div
              style={{
                width: "8mm",
                height: "8mm",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: GOGYO_COLORS[center2Element].bg,
                color: GOGYO_COLORS[center2Element].text,
                fontSize: "8pt",
                fontWeight: "bold",
              }}
            >
              {center2Element}
            </div>
            <span
              style={{
                fontSize: "10pt",
                fontWeight: "bold",
                color: result.centerStarCompatibility.score >= 0 ? "#10b981" : "#ef4444",
              }}
            >
              {result.centerStarCompatibility.relation}
            </span>
            <span style={{ fontSize: "9pt", color: "#666666" }}>
              ({result.centerStarCompatibility.score >= 0 ? "+" : ""}
              {result.centerStarCompatibility.score}点)
            </span>
          </div>
          <p style={{ fontSize: "8pt", color: "#666666", margin: 0, lineHeight: 1.4 }}>
            {result.centerStarCompatibility.description}
          </p>
        </div>
      </div>

      {/* 特殊関係性 */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "3mm",
          padding: "4mm",
          marginBottom: "4mm",
        }}
      >
        <h4 style={{ fontSize: "10pt", fontWeight: "bold", marginBottom: "3mm", color: "#1a1a1a" }}>
          特殊な関係性
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2mm" }}>
          <SpecialRelationBadge name="日干干合" exists={result.nikkanKango.exists} isPositive />
          <SpecialRelationBadge name="大半会" exists={result.daihan.exists} isPositive />
          <SpecialRelationBadge name="律音" exists={result.ritchin.exists} isPositive />
          <SpecialRelationBadge name="納音" exists={result.natchin.exists} isPositive />
          <SpecialRelationBadge name="支合" exists={result.shigoMatches.length > 0} isPositive />
          <SpecialRelationBadge name="天剋地冲" exists={result.tenkoku.exists} isPositive={false} />
          <SpecialRelationBadge
            name="対冲"
            exists={result.taichuMatches.length > 0}
            isPositive={false}
          />
        </div>
      </div>

      {/* 強み・課題 */}
      <div
        style={{
          display: "flex",
          gap: "4mm",
          marginBottom: "4mm",
          flex: 1,
        }}
      >
        {/* 強み */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f0fdf4",
            borderRadius: "3mm",
            padding: "4mm",
            border: "1px solid #bbf7d0",
          }}
        >
          <h4
            style={{
              fontSize: "10pt",
              fontWeight: "bold",
              marginBottom: "3mm",
              color: "#166534",
              display: "flex",
              alignItems: "center",
              gap: "2mm",
            }}
          >
            ✓ この関係の強み
          </h4>
          <ul style={{ margin: 0, paddingLeft: "4mm" }}>
            {result.strengths.map((s, i) => (
              <li
                key={i}
                style={{
                  fontSize: "8pt",
                  color: "#166534",
                  marginBottom: "1.5mm",
                  lineHeight: 1.4,
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* 課題 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fef3c7",
            borderRadius: "3mm",
            padding: "4mm",
            border: "1px solid #fcd34d",
          }}
        >
          <h4
            style={{
              fontSize: "10pt",
              fontWeight: "bold",
              marginBottom: "3mm",
              color: "#92400e",
              display: "flex",
              alignItems: "center",
              gap: "2mm",
            }}
          >
            ! 気をつけるポイント
          </h4>
          <ul style={{ margin: 0, paddingLeft: "4mm" }}>
            {result.challenges.map((c, i) => (
              <li
                key={i}
                style={{
                  fontSize: "8pt",
                  color: "#92400e",
                  marginBottom: "1.5mm",
                  lineHeight: 1.4,
                }}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* アドバイス */}
      <div
        style={{
          backgroundColor: "#eff6ff",
          borderRadius: "3mm",
          padding: "4mm",
          border: "1px solid #bfdbfe",
        }}
      >
        <h4
          style={{
            fontSize: "10pt",
            fontWeight: "bold",
            marginBottom: "2mm",
            color: "#1e40af",
          }}
        >
          アドバイス
        </h4>
        <p style={{ fontSize: "9pt", color: "#1e40af", margin: 0, lineHeight: 1.5 }}>
          {result.advice}
        </p>
      </div>

      {/* フッター */}
      <div
        style={{
          position: "absolute",
          bottom: "10mm",
          left: "15mm",
          right: "15mm",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #e5e5e5",
          paddingTop: "3mm",
        }}
      >
        <span style={{ fontSize: "8pt", color: "#999999" }}>算命学 相性診断書</span>
        <span style={{ fontSize: "8pt", color: "#999999" }}>
          {pageNumber} / {totalPages}
        </span>
      </div>
    </div>
  );
}

function SpecialRelationBadge({
  name,
  exists,
  isPositive,
}: {
  name: string;
  exists: boolean;
  isPositive: boolean;
}) {
  const bgColor = exists ? (isPositive ? "#dcfce7" : "#fee2e2") : "#f3f4f6";
  const textColor = exists ? (isPositive ? "#166534" : "#991b1b") : "#9ca3af";
  const borderColor = exists ? (isPositive ? "#86efac" : "#fca5a5") : "#e5e7eb";

  return (
    <div
      style={{
        padding: "1.5mm 3mm",
        borderRadius: "2mm",
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        fontSize: "8pt",
        fontWeight: exists ? "bold" : "normal",
      }}
    >
      {name}: {exists ? "あり" : "なし"}
    </div>
  );
}
