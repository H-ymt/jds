import type { GogyoType, Jusei, SanmeiResult, Shusei } from "../constants";

import { GOGYO, JUSEI_INFO, SHUSEI_INFO } from "../constants";

interface PdfChartPageProps {
  result: SanmeiResult;
  birthDate: string;
  isTransformed: boolean;
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

function StarCell({ star, label, position }: { star: Shusei; label: string; position: string }) {
  const info = SHUSEI_INFO[star];
  const colors = GOGYO_COLORS[info.element];

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: "3mm",
        borderRadius: "2mm",
        textAlign: "center",
        minHeight: "18mm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <p style={{ fontSize: "8pt", opacity: 0.8, marginBottom: "1mm" }}>{label}</p>
      <p style={{ fontSize: "12pt", fontWeight: "bold" }}>{star}</p>
      <p style={{ fontSize: "7pt", opacity: 0.9, marginTop: "1mm" }}>{position}</p>
    </div>
  );
}

function JuseiCell({ star, label, position }: { star: Jusei; label: string; position: string }) {
  const info = JUSEI_INFO[star];

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "3mm",
        borderRadius: "2mm",
        textAlign: "center",
        minHeight: "18mm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <p style={{ fontSize: "8pt", color: "#666666", marginBottom: "1mm" }}>{label}</p>
      <p style={{ fontSize: "11pt", fontWeight: "bold", color: "#1a1a1a" }}>{star}</p>
      <p style={{ fontSize: "7pt", color: "#888888", marginTop: "1mm" }}>{position}</p>
      <p style={{ fontSize: "7pt", color: "#666666", marginTop: "1mm" }}>({info.energy}/12)</p>
    </div>
  );
}

export function PdfChartPage({
  result,
  birthDate,
  isTransformed,
  kanteiDate,
  kanteiName,
  pageNumber,
  totalPages,
}: PdfChartPageProps) {
  const { pillars, kango, stars } = result;

  // 干合後の五行を取得
  const getGogyo = (kan: string): GogyoType => {
    if (isTransformed && kango.exists && kango.pair && kango.transformed) {
      if (kango.pair.includes(kan as never)) {
        return kango.transformed;
      }
    }
    return GOGYO[kan as keyof typeof GOGYO] as GogyoType;
  };

  return (
    <div
      data-pdf-page="chart"
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
          marginBottom: "8mm",
        }}
      >
        <span style={{ fontSize: "12pt", fontWeight: "bold", color: "#1a1a1a" }}>
          算命学 鑑定書
        </span>
        <span style={{ fontSize: "9pt", color: "#666666" }}>生年月日: {formatDate(birthDate)}</span>
      </div>

      {/* 陰占セクション */}
      <div style={{ marginBottom: "8mm" }}>
        <h2
          style={{
            fontSize: "11pt",
            fontWeight: "bold",
            marginBottom: "4mm",
            paddingLeft: "3mm",
            borderLeft: "2mm solid #333333",
            color: "#1a1a1a",
          }}
        >
          陰占（いんせん）
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "3mm",
          }}
        >
          {[
            { pillar: pillars.year, label: "年柱" },
            { pillar: pillars.month, label: "月柱" },
            { pillar: pillars.day, label: "日柱" },
          ].map(({ pillar, label }) => {
            const gogyo = getGogyo(pillar.kan);
            const colors = GOGYO_COLORS[gogyo];
            return (
              <div
                key={label}
                style={{
                  textAlign: "center",
                  padding: "4mm",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "2mm",
                }}
              >
                <p style={{ fontSize: "9pt", color: "#666666", marginBottom: "2mm" }}>{label}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "2mm" }}>
                  <span
                    style={{
                      fontSize: "18pt",
                      fontWeight: "bold",
                      backgroundColor: colors.bg,
                      color: colors.text,
                      padding: "2mm 4mm",
                      borderRadius: "2mm",
                    }}
                  >
                    {pillar.kan}
                  </span>
                  <span
                    style={{
                      fontSize: "18pt",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                    }}
                  >
                    {pillar.shi}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 干合セクション */}
      {kango.exists && kango.pair && kango.transformed && (
        <div style={{ marginBottom: "8mm" }}>
          <h2
            style={{
              fontSize: "11pt",
              fontWeight: "bold",
              marginBottom: "4mm",
              paddingLeft: "3mm",
              borderLeft: "2mm solid #333333",
              color: "#1a1a1a",
            }}
          >
            干合（かんごう）
          </h2>
          <div
            style={{
              backgroundColor: "#fef3c7",
              padding: "4mm",
              borderRadius: "2mm",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3mm",
            }}
          >
            <span style={{ fontSize: "14pt", fontWeight: "bold" }}>{kango.pair[0]}</span>
            <span style={{ fontSize: "10pt", color: "#666666" }}>と</span>
            <span style={{ fontSize: "14pt", fontWeight: "bold" }}>{kango.pair[1]}</span>
            <span style={{ fontSize: "10pt", color: "#666666" }}>が結びつき</span>
            <span style={{ fontSize: "10pt" }}>→</span>
            <span
              style={{
                fontSize: "14pt",
                fontWeight: "bold",
                backgroundColor: GOGYO_COLORS[kango.transformed].bg,
                color: GOGYO_COLORS[kango.transformed].text,
                padding: "1mm 3mm",
                borderRadius: "2mm",
              }}
            >
              {kango.transformed}性
            </span>
            <span style={{ fontSize: "10pt", color: "#666666" }}>に変化</span>
          </div>
        </div>
      )}

      {/* 人体星図セクション */}
      <div style={{ marginBottom: "8mm" }}>
        <h2
          style={{
            fontSize: "11pt",
            fontWeight: "bold",
            marginBottom: "4mm",
            paddingLeft: "3mm",
            borderLeft: "2mm solid #333333",
            color: "#1a1a1a",
          }}
        >
          陽占（ようせん）人体星図
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "3mm",
            maxWidth: "140mm",
            margin: "0 auto",
          }}
        >
          {/* 1行目 */}
          <JuseiCell star={stars.jusei.right} label="右手" position="初年運" />
          <StarCell star={stars.north} label="頭" position="北" />
          <JuseiCell star={stars.jusei.left} label="左手" position="中年運" />

          {/* 2行目 */}
          <StarCell star={stars.east} label="左肩" position="東" />
          <StarCell star={stars.center} label="胸" position="中央" />
          <StarCell star={stars.west} label="右肩" position="西" />

          {/* 3行目 */}
          <div />
          <StarCell star={stars.south} label="腹" position="南" />
          <JuseiCell star={stars.jusei.center} label="左足" position="晩年運" />
        </div>
      </div>

      {/* 五行凡例 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "4mm",
          marginTop: "6mm",
        }}
      >
        {(Object.entries(GOGYO_COLORS) as [GogyoType, { bg: string; text: string }][]).map(
          ([element, colors]) => (
            <div
              key={element}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2mm",
              }}
            >
              <div
                style={{
                  width: "5mm",
                  height: "5mm",
                  backgroundColor: colors.bg,
                  borderRadius: "1mm",
                }}
              />
              <span style={{ fontSize: "9pt", color: "#666666" }}>{element}</span>
            </div>
          ),
        )}
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
