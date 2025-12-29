import type { GogyoType, SanmeiResult } from "../constants";

import { JUSEI_INFO, POSITION_INFO, SHUSEI_INFO } from "../constants";

interface PdfDetailPageProps {
  result: SanmeiResult;
  birthDate: string;
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

export function PdfDetailPage({
  result,
  birthDate,
  kanteiDate,
  kanteiName,
  pageNumber,
  totalPages,
}: PdfDetailPageProps) {
  const { stars, dominantElement } = result;
  const centerStar = stars.center;
  const centerStarInfo = SHUSEI_INFO[centerStar];

  // 全ての主星を位置順に表示
  const mainStars = [
    { position: "頭", positionKey: "北", star: stars.north },
    { position: "胸", positionKey: "中央", star: stars.center },
    { position: "腹", positionKey: "南", star: stars.south },
    { position: "左肩", positionKey: "東", star: stars.east },
    { position: "右肩", positionKey: "西", star: stars.west },
  ];

  // 従星
  const juseiStars = [
    { position: "右手", phase: "初年運", star: stars.jusei.right },
    { position: "左手", phase: "中年運", star: stars.jusei.left },
    { position: "左足", phase: "晩年運", star: stars.jusei.center },
  ];

  return (
    <div
      data-pdf-page="detail"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "15mm 20mm",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        fontFamily:
          '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif',
        position: "relative",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "5mm",
          borderBottom: "0.5mm solid #e5e5e5",
          marginBottom: "6mm",
        }}
      >
        <span style={{ fontSize: "12pt", fontWeight: "bold", color: "#1a1a1a" }}>
          算命学 鑑定書
        </span>
        <span style={{ fontSize: "9pt", color: "#666666" }}>生年月日: {formatDate(birthDate)}</span>
      </div>

      {/* あなたの主な傾向 */}
      <div style={{ marginBottom: "5mm" }}>
        <h2
          style={{
            fontSize: "10pt",
            fontWeight: "bold",
            marginBottom: "2mm",
            paddingLeft: "3mm",
            borderLeft: "2mm solid #333333",
            color: "#1a1a1a",
          }}
        >
          あなたの主な傾向
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3mm",
            padding: "3mm",
            backgroundColor: "#f5f5f5",
            borderRadius: "2mm",
          }}
        >
          <span style={{ fontSize: "9pt", color: "#666666" }}>最も強い五行:</span>
          <span
            style={{
              fontSize: "10pt",
              fontWeight: "bold",
              backgroundColor: GOGYO_COLORS[dominantElement[0]].bg,
              color: GOGYO_COLORS[dominantElement[0]].text,
              padding: "1mm 3mm",
              borderRadius: "2mm",
            }}
          >
            {dominantElement[0]}性
          </span>
          <span style={{ fontSize: "9pt", color: "#666666" }}>が {dominantElement[1]} つ</span>
        </div>
      </div>

      {/* 中心星の特徴 */}
      <div style={{ marginBottom: "5mm" }}>
        <h2
          style={{
            fontSize: "10pt",
            fontWeight: "bold",
            marginBottom: "2mm",
            paddingLeft: "3mm",
            borderLeft: "2mm solid #333333",
            color: "#1a1a1a",
          }}
        >
          中心星（胸）の特徴
        </h2>
        <div
          style={{
            padding: "3mm",
            backgroundColor: "#fafafa",
            borderRadius: "2mm",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "3mm", marginBottom: "2mm" }}>
            <span
              style={{
                fontSize: "11pt",
                fontWeight: "bold",
                backgroundColor: GOGYO_COLORS[centerStarInfo.element].bg,
                color: GOGYO_COLORS[centerStarInfo.element].text,
                padding: "1mm 3mm",
                borderRadius: "2mm",
              }}
            >
              {centerStar}
            </span>
            <span style={{ fontSize: "9pt", color: "#666666" }}>{centerStarInfo.keyword}</span>
          </div>
          <p style={{ fontSize: "8pt", lineHeight: "1.5", color: "#333333" }}>
            {centerStarInfo.desc}
          </p>
        </div>
      </div>

      {/* エネルギーバランス */}
      <div style={{ marginBottom: "5mm" }}>
        <h2
          style={{
            fontSize: "10pt",
            fontWeight: "bold",
            marginBottom: "2mm",
            paddingLeft: "3mm",
            borderLeft: "2mm solid #333333",
            color: "#1a1a1a",
          }}
        >
          エネルギーバランス
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "3mm",
          }}
        >
          {juseiStars.map(({ position, phase, star }) => {
            const info = JUSEI_INFO[star];
            const percentage = Math.round((info.energy / 12) * 100);
            return (
              <div
                key={position}
                style={{
                  padding: "3mm",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "2mm",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "8pt", color: "#666666", marginBottom: "1mm" }}>{phase}</p>
                <p style={{ fontSize: "10pt", fontWeight: "bold", color: "#1a1a1a" }}>{star}</p>
                <div
                  style={{
                    marginTop: "2mm",
                    height: "3mm",
                    backgroundColor: "#e5e5e5",
                    borderRadius: "1mm",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${percentage}%`,
                      backgroundColor: "#6366f1",
                      borderRadius: "1mm",
                    }}
                  />
                </div>
                <p style={{ fontSize: "7pt", color: "#888888", marginTop: "1mm" }}>
                  {info.energy}/12
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 全ての星の解説 */}
      <div style={{ marginBottom: "5mm" }}>
        <h2
          style={{
            fontSize: "10pt",
            fontWeight: "bold",
            marginBottom: "2mm",
            paddingLeft: "3mm",
            borderLeft: "2mm solid #333333",
            color: "#1a1a1a",
          }}
        >
          主星の解説
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2mm" }}>
          {mainStars.map(({ position, star }) => {
            const info = SHUSEI_INFO[star];
            const posInfo = POSITION_INFO[position];
            return (
              <div
                key={position}
                style={{
                  padding: "2mm 3mm",
                  backgroundColor: "#fafafa",
                  borderRadius: "2mm",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2mm", marginBottom: "1mm" }}
                >
                  <span
                    style={{
                      fontSize: "8pt",
                      backgroundColor: GOGYO_COLORS[info.element].bg,
                      color: GOGYO_COLORS[info.element].text,
                      padding: "0.5mm 2mm",
                      borderRadius: "1mm",
                    }}
                  >
                    {star}
                  </span>
                  <span style={{ fontSize: "8pt", color: "#666666" }}>
                    {posInfo?.title || position}
                  </span>
                  <span style={{ fontSize: "7pt", color: "#888888" }}>- {info.keyword}</span>
                </div>
                <p style={{ fontSize: "7pt", lineHeight: "1.4", color: "#444444" }}>{info.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 十二大従星の解説 */}
      <div>
        <h2
          style={{
            fontSize: "10pt",
            fontWeight: "bold",
            marginBottom: "2mm",
            paddingLeft: "3mm",
            borderLeft: "2mm solid #333333",
            color: "#1a1a1a",
          }}
        >
          十二大従星の解説
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2mm" }}>
          {juseiStars.map(({ position, phase, star }) => {
            const info = JUSEI_INFO[star];
            return (
              <div
                key={position}
                style={{
                  padding: "2mm 3mm",
                  backgroundColor: "#fafafa",
                  borderRadius: "2mm",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2mm", marginBottom: "1mm" }}
                >
                  <span
                    style={{
                      fontSize: "8pt",
                      backgroundColor: "#6366f1",
                      color: "#ffffff",
                      padding: "0.5mm 2mm",
                      borderRadius: "1mm",
                    }}
                  >
                    {star}
                  </span>
                  <span style={{ fontSize: "8pt", color: "#666666" }}>
                    {position}（{phase}）
                  </span>
                  <span style={{ fontSize: "7pt", color: "#888888" }}>- {info.phase}の時期</span>
                </div>
                <p style={{ fontSize: "7pt", lineHeight: "1.4", color: "#444444" }}>{info.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          position: "absolute",
          bottom: "15mm",
          left: "20mm",
          right: "20mm",
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "5mm",
          borderTop: "0.5mm solid #e5e5e5",
          fontSize: "8pt",
          color: "#666666",
        }}
      >
        <span>
          鑑定日: {formatDate(kanteiDate)}
          {kanteiName && ` / 鑑定者: ${kanteiName}`}
        </span>
        <span>
          Page {pageNumber} / {totalPages}
        </span>
      </div>
    </div>
  );
}
