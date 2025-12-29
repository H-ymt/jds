/**
 * 干支暦に基づく正確な干支計算
 * 六十花甲子表と節入り日データを使用
 */

import {
  JIKKAN,
  ZOUKAN,
  JUDAI_SHUSEI,
  JUNIDAI_JUSEI,
  KANGO_RULES,
  GOGYO,
  SHUSEI_INFO,
  type Jikkan,
  type Junishi,
  type Shusei,
  type Jusei,
  type Pillars,
  type KangoResult,
  type Stars,
  type SanmeiResult,
  type GogyoType,
} from "./constants";

import {
  ROKUJU_KANSHI,
  getKanshiFromIndex,
  calcDayKanshiIndex,
  MONTH_KAN_TABLE,
  MONTH_SHI_TABLE,
  YEAR_KANSHI_BASE,
} from "./kanshi-calendar";

import { getSetsuiriDay, isBeforeSetsuiri } from "./setsuiri-data";

// ============================================
// 年柱の計算
// ============================================

/**
 * 年柱を計算（立春を年の始まりとする）
 * @param year 西暦年
 * @param month 月
 * @param day 日
 */
export function calcYearPillar(
  year: number,
  month: number,
  day: number,
): { kan: Jikkan; shi: Junishi } {
  // 立春前は前年として扱う
  let adjustedYear = year;

  // 2月の立春日を取得
  const risshunDay = getSetsuiriDay(year, 2);

  // 1月、または2月で立春前の場合は前年
  if (month < 2 || (month === 2 && day < risshunDay)) {
    adjustedYear = year - 1;
  }

  // 1924年（甲子年）を基準に計算
  const yearDiff = adjustedYear - YEAR_KANSHI_BASE.year;
  const kanshiIndex = (((YEAR_KANSHI_BASE.kanshiIndex + yearDiff) % 60) + 60) % 60;

  return getKanshiFromIndex(kanshiIndex);
}

// ============================================
// 月柱の計算
// ============================================

/**
 * 月柱を計算（節入り日を考慮）
 * @param year 西暦年
 * @param month 月
 * @param day 日
 * @param yearKan 年干（年柱の天干）
 */
export function calcMonthPillar(
  year: number,
  month: number,
  day: number,
  yearKan: Jikkan,
): { kan: Jikkan; shi: Junishi } {
  // 節入りを考慮した月の決定
  let adjustedMonth = month;
  let adjustedYear = year;

  // その月の節入り日を取得
  const setsuiriDay = getSetsuiriDay(year, month);

  // 節入り前は前月として扱う
  if (day < setsuiriDay) {
    adjustedMonth = month - 1;
    if (adjustedMonth === 0) {
      adjustedMonth = 12;
      adjustedYear = year - 1;
    }
  }

  // 立春（2月節入り）を1月として、順番に数える
  // 算命学の月: 1月=寅月(立春後)、2月=卯月(啓蟄後)...
  let sanmeiMonth = adjustedMonth - 1; // 0-indexed (0=1月=寅月)
  if (sanmeiMonth === 0 && adjustedMonth === 1) {
    // 1月で節入り後 → 寅月（1月）
    sanmeiMonth = 1;
  } else if (adjustedMonth >= 2) {
    // 2月以降
    sanmeiMonth = adjustedMonth - 1;
  } else {
    // 1月で節入り前 → 前年12月 → 丑月（12月）
    sanmeiMonth = 12;
  }

  // 年干に基づいて月干を決定
  // 年干が使用する年（節入り考慮済み）
  let yearForMonthKan = yearKan;
  if (adjustedMonth === 12 && month === 1) {
    // 1月の節入り前は前年なので、前年の年干を使う
    const prevYearPillar = calcYearPillar(adjustedYear, 2, 15); // 前年の年柱
    yearForMonthKan = prevYearPillar.kan;
  }

  const yearKanIndex = JIKKAN.indexOf(yearForMonthKan);

  // 年干から寅月の月干を求める
  // 甲・己年 → 丙寅月、乙・庚年 → 戊寅月、丙・辛年 → 庚寅月、丁・壬年 → 壬寅月、戊・癸年 → 甲寅月
  const baseMonthKanIndex = MONTH_KAN_TABLE[yearKanIndex];

  // 寅月（1）から数えてsanmeiMonth月目の月干
  const monthKanIndex = (baseMonthKanIndex + sanmeiMonth - 1) % 10;

  // 月支は固定
  const monthShiIndex = MONTH_SHI_TABLE[sanmeiMonth] ?? 2; // デフォルトは寅

  return {
    kan: JIKKAN[monthKanIndex],
    shi:
      ROKUJU_KANSHI[0].shi === "子"
        ? (["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as Junishi[])[
            monthShiIndex
          ]
        : (["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as Junishi[])[
            monthShiIndex
          ],
  };
}

// ============================================
// 日柱の計算
// ============================================

/**
 * 日柱を計算
 * @param year 西暦年
 * @param month 月
 * @param day 日
 */
export function calcDayPillar(
  year: number,
  month: number,
  day: number,
): { kan: Jikkan; shi: Junishi } {
  const kanshiIndex = calcDayKanshiIndex(year, month, day);
  return getKanshiFromIndex(kanshiIndex);
}

// ============================================
// 三柱（年柱・月柱・日柱）の一括計算
// ============================================

/**
 * 年柱・月柱・日柱を計算
 */
export function calcKanshiAccurate(year: number, month: number, day: number): Pillars {
  const yearPillar = calcYearPillar(year, month, day);
  const monthPillar = calcMonthPillar(year, month, day, yearPillar.kan);
  const dayPillar = calcDayPillar(year, month, day);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
  };
}

// ============================================
// 十大主星の計算（陽占）
// ============================================

/**
 * 十大主星を算出（日干と対象干の五行関係から）
 */
export function calcShuseiAccurate(nikkan: Jikkan, targetKan: Jikkan): Shusei {
  const nikkanIdx = JIKKAN.indexOf(nikkan);
  const targetIdx = JIKKAN.indexOf(targetKan);

  const nikkanGogyo = GOGYO[nikkan] as GogyoType;
  const targetGogyo = GOGYO[targetKan] as GogyoType;

  // 陰陽が同じ（同性）か異なる（異性）かを判定
  const isSamePolarity = nikkanIdx % 2 === targetIdx % 2;

  // 五行の相生相剋関係を定義
  const gogyoOrder: GogyoType[] = ["木", "火", "土", "金", "水"];
  const nikkanGogyoIdx = gogyoOrder.indexOf(nikkanGogyo);
  const targetGogyoIdx = gogyoOrder.indexOf(targetGogyo);

  // 関係を判定
  const diff = (targetGogyoIdx - nikkanGogyoIdx + 5) % 5;

  let starPair: [Shusei, Shusei];

  switch (diff) {
    case 0: // 比和（同じ五行）
      starPair = ["貫索星", "石門星"];
      break;
    case 1: // 私が生じる（木→火など）
      starPair = ["鳳閣星", "調舒星"];
      break;
    case 2: // 私が剋す（木→土など）
      starPair = ["禄存星", "司禄星"];
      break;
    case 3: // 私を剋す（木←金など）
      starPair = ["車騎星", "牽牛星"];
      break;
    case 4: // 私を生じる（木←水など）
      starPair = ["龍高星", "玉堂星"];
      break;
    default:
      starPair = ["貫索星", "石門星"];
  }

  // 同性なら[0]（陽の星）、異性なら[1]（陰の星）
  return isSamePolarity ? starPair[0] : starPair[1];
}

// ============================================
// 十二大従星の計算
// ============================================

/**
 * 十二大従星を算出（日干と地支の関係から）
 * 十二運の順序で計算
 */
export function calcJuseiAccurate(nikkan: Jikkan, shishi: Junishi): Jusei {
  const nikkanIdx = JIKKAN.indexOf(nikkan);
  const shishiIdx = [
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
    "申",
    "酉",
    "戌",
    "亥",
  ].indexOf(shishi);

  // 十二運の開始位置（各日干の長生の位置）
  const choseiPositions: Record<Jikkan, number> = {
    甲: 11, // 亥
    乙: 6, // 午
    丙: 2, // 寅
    丁: 9, // 酉
    戊: 2, // 寅
    己: 9, // 酉
    庚: 5, // 巳
    辛: 0, // 子
    壬: 8, // 申
    癸: 3, // 卯
  };

  const choseiPos = choseiPositions[nikkan];

  // 陽干は順行、陰干は逆行
  const isYang = nikkanIdx % 2 === 0;

  let offset: number;
  if (isYang) {
    offset = (shishiIdx - choseiPos + 12) % 12;
  } else {
    offset = (choseiPos - shishiIdx + 12) % 12;
  }

  // 十二運の順序（長生から始まる）
  const juniun: Jusei[] = [
    "天禄星", // 長生
    "天恍星", // 沐浴
    "天南星", // 冠帯
    "天将星", // 建禄・帝旺
    "天堂星", // 衰
    "天胡星", // 病
    "天極星", // 死
    "天庫星", // 墓
    "天馳星", // 絶
    "天報星", // 胎
    "天印星", // 養
    "天貴星", // 胎
  ];

  return juniun[offset];
}

// ============================================
// 干合チェック
// ============================================

/**
 * 干合をチェック
 */
export function checkKangoAccurate(pillars: Pillars): KangoResult {
  const kans = [pillars.year.kan, pillars.month.kan, pillars.day.kan];

  for (let i = 0; i < kans.length; i++) {
    for (let j = i + 1; j < kans.length; j++) {
      const rule = KANGO_RULES[kans[i]];
      if (rule && rule.partner === kans[j]) {
        return {
          exists: true,
          pair: [kans[i], kans[j]],
          transformed: rule.transformed,
        };
      }
    }
  }

  return { exists: false };
}

// ============================================
// 算命学の完全な結果算出
// ============================================

/**
 * 算命学の完全な結果を算出（干支暦ベース）
 */
export function calculateSanmeiAccurate(
  birthDate: string,
  isTransformed: boolean,
): SanmeiResult | null {
  if (!birthDate) return null;

  const [year, month, day] = birthDate.split("-").map(Number);
  const pillars = calcKanshiAccurate(year, month, day);
  const kango = checkKangoAccurate(pillars);

  // 日干の決定（干合変化を考慮）
  let nikkan = pillars.day.kan;
  if (isTransformed && kango.exists && kango.transformed) {
    const transformedGogyo = kango.transformed;
    const candidate = JIKKAN.find(
      (k) =>
        GOGYO[k] === transformedGogyo &&
        JIKKAN.indexOf(k) % 2 === JIKKAN.indexOf(pillars.day.kan) % 2,
    );
    if (candidate) {
      nikkan = candidate;
    }
  }

  // 人体星図の算出（陽占）
  const stars: Stars = {
    north: calcShuseiAccurate(nikkan, ZOUKAN[pillars.month.shi]), // 頭: 月支蔵干
    center: calcShuseiAccurate(nikkan, nikkan), // 胸: 日干自身
    south: calcShuseiAccurate(nikkan, ZOUKAN[pillars.day.shi]), // 腹: 日支蔵干
    east: calcShuseiAccurate(nikkan, ZOUKAN[pillars.year.shi]), // 左肩: 年支蔵干
    west: calcShuseiAccurate(nikkan, pillars.month.kan), // 右肩: 月干
    jusei: {
      right: calcJuseiAccurate(nikkan, pillars.year.shi), // 右足: 年支
      left: calcJuseiAccurate(nikkan, pillars.month.shi), // 左足: 月支
      center: calcJuseiAccurate(nikkan, pillars.day.shi), // 中央下: 日支
    },
  };

  // 全体の傾向を分析
  const allStars: Shusei[] = [stars.north, stars.center, stars.south, stars.east, stars.west];
  const elements = allStars.map((s) => SHUSEI_INFO[s]?.element);
  const elementCount = elements.reduce(
    (acc, e) => {
      if (e) {
        acc[e] = (acc[e] || 0) + 1;
      }
      return acc;
    },
    {} as Record<GogyoType, number>,
  );
  const dominantElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0] as [
    GogyoType,
    number,
  ];

  return {
    pillars,
    nikkan,
    kango,
    stars,
    dominantElement,
    allStars,
  };
}
