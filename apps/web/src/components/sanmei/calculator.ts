/**
 * 算命学計算ロジック（干支暦対応版）
 */
import {
  JIKKAN,
  ZOUKAN,
  NIJUHACHIGEN,
  SHIGO_MAP,
  SANGO_TEIO,
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

import { getSetsuiriDay } from "./setsuiri-data";

// 後方互換性のために古い関数名も維持しつつ、正確なロジックを使用する関数群

// ============================================
// 年柱の計算
// ============================================

export function calcYearPillar(
  year: number,
  month: number,
  day: number,
): { kan: Jikkan; shi: Junishi } {
  let adjustedYear = year;
  const risshunDay = getSetsuiriDay(year, 2);

  if (month < 2 || (month === 2 && day < risshunDay)) {
    adjustedYear = year - 1;
  }

  const yearDiff = adjustedYear - YEAR_KANSHI_BASE.year;
  const kanshiIndex = (((YEAR_KANSHI_BASE.kanshiIndex + yearDiff) % 60) + 60) % 60;

  return getKanshiFromIndex(kanshiIndex);
}

// ============================================
// 月柱の計算
// ============================================

export function calcMonthPillar(
  year: number,
  month: number,
  day: number,
  yearKan: Jikkan,
): { kan: Jikkan; shi: Junishi } {
  const setsuiriDay = getSetsuiriDay(year, month);
  let adjustedMonth = month;
  let adjustedYear = year;

  if (day < setsuiriDay) {
    adjustedMonth = month - 1;
    if (adjustedMonth === 0) {
      adjustedMonth = 12;
      adjustedYear = year - 1;
    }
  }

  let sanmeiMonth = adjustedMonth - 1;
  if (sanmeiMonth === 0 && adjustedMonth === 1) {
    sanmeiMonth = 1;
  } else if (adjustedMonth >= 2) {
    sanmeiMonth = adjustedMonth - 1;
  } else {
    sanmeiMonth = 12;
  }

  let yearForMonthKan = yearKan;
  if (adjustedMonth === 12 && month === 1) {
    const prevYearPillar = calcYearPillar(adjustedYear, 2, 15);
    yearForMonthKan = prevYearPillar.kan;
  }

  const yearKanIndex = JIKKAN.indexOf(yearForMonthKan);
  const baseMonthKanIndex = MONTH_KAN_TABLE[yearKanIndex];
  const monthKanIndex = (baseMonthKanIndex + sanmeiMonth - 1) % 10;
  const monthShiIndex = MONTH_SHI_TABLE[sanmeiMonth] ?? 2;

  const monthShi = (
    ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as Junishi[]
  )[monthShiIndex];

  return {
    kan: JIKKAN[monthKanIndex],
    shi: monthShi,
  };
}

// ============================================
// 旧 calcKanshi と互換性を保ちつつ正確な値を返す
// ============================================

/**
 * 生年月日から干支（年柱・月柱・日柱）を算出
 */
export function calcKanshi(year: number, month: number, day: number): Pillars {
  const yearPillar = calcYearPillar(year, month, day);
  const monthPillar = calcMonthPillar(year, month, day, yearPillar.kan);

  // 日柱計算
  const kanshiIndex = calcDayKanshiIndex(year, month, day);
  const dayPillar = getKanshiFromIndex(kanshiIndex);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
  };
}

// ============================================
// 主星・従星の計算（正確版）
// ============================================

/**
 * 十大主星表（日干×対象干のルックアップテーブル）
 * 縦軸: 日干、横軸: 対象干
 * JIKKAN順: 甲、乙、丙、丁、戊、己、庚、辛、壬、癸
 */
const JUDAI_SHUSEI_TABLE: Record<Jikkan, Record<Jikkan, Shusei>> = {
  甲: {
    甲: "貫索星",
    乙: "石門星",
    丙: "鳳閣星",
    丁: "調舒星",
    戊: "禄存星",
    己: "司禄星",
    庚: "車騎星",
    辛: "牽牛星",
    壬: "龍高星",
    癸: "玉堂星",
  },
  乙: {
    甲: "石門星",
    乙: "貫索星",
    丙: "調舒星",
    丁: "鳳閣星",
    戊: "司禄星",
    己: "禄存星",
    庚: "牽牛星",
    辛: "車騎星",
    壬: "玉堂星",
    癸: "龍高星",
  },
  丙: {
    甲: "龍高星",
    乙: "玉堂星",
    丙: "貫索星",
    丁: "石門星",
    戊: "鳳閣星",
    己: "調舒星",
    庚: "禄存星",
    辛: "司禄星",
    壬: "車騎星",
    癸: "牽牛星",
  },
  丁: {
    甲: "玉堂星",
    乙: "龍高星",
    丙: "石門星",
    丁: "貫索星",
    戊: "調舒星",
    己: "鳳閣星",
    庚: "司禄星",
    辛: "禄存星",
    壬: "牽牛星",
    癸: "車騎星",
  },
  戊: {
    甲: "車騎星",
    乙: "牽牛星",
    丙: "龍高星",
    丁: "玉堂星",
    戊: "貫索星",
    己: "石門星",
    庚: "鳳閣星",
    辛: "調舒星",
    壬: "禄存星",
    癸: "司禄星",
  },
  己: {
    甲: "牽牛星",
    乙: "車騎星",
    丙: "玉堂星",
    丁: "龍高星",
    戊: "石門星",
    己: "貫索星",
    庚: "調舒星",
    辛: "鳳閣星",
    壬: "司禄星",
    癸: "禄存星",
  },
  庚: {
    甲: "禄存星",
    乙: "司禄星",
    丙: "車騎星",
    丁: "牽牛星",
    戊: "龍高星",
    己: "玉堂星",
    庚: "貫索星",
    辛: "石門星",
    壬: "鳳閣星",
    癸: "調舒星",
  },
  辛: {
    甲: "司禄星",
    乙: "禄存星",
    丙: "牽牛星",
    丁: "車騎星",
    戊: "玉堂星",
    己: "龍高星",
    庚: "石門星",
    辛: "貫索星",
    壬: "調舒星",
    癸: "鳳閣星",
  },
  壬: {
    甲: "鳳閣星",
    乙: "調舒星",
    丙: "禄存星",
    丁: "司禄星",
    戊: "車騎星",
    己: "牽牛星",
    庚: "龍高星",
    辛: "玉堂星",
    壬: "貫索星",
    癸: "石門星",
  },
  癸: {
    甲: "調舒星",
    乙: "鳳閣星",
    丙: "司禄星",
    丁: "禄存星",
    戊: "牽牛星",
    己: "車騎星",
    庚: "玉堂星",
    辛: "龍高星",
    壬: "石門星",
    癸: "貫索星",
  },
};

/**
 * 十大主星を算出（テーブル参照方式）
 */
export function calcShusei(nikkan: Jikkan, targetKan: Jikkan): Shusei {
  return JUDAI_SHUSEI_TABLE[nikkan][targetKan];
}

/**
 * 十二大従星表（日干×十二支のルックアップテーブル）
 * 縦軸: 十二支、横軸: 日干
 * 画像の表から直接転記
 */
const JUNIDAI_JUSEI_TABLE: Record<Jikkan, Record<Junishi, Jusei>> = {
  甲: {
    子: "天貴星",
    丑: "天恍星",
    寅: "天南星",
    卯: "天禄星",
    辰: "天将星",
    巳: "天堂星",
    午: "天胡星",
    未: "天極星",
    申: "天庫星",
    酉: "天馳星",
    戌: "天報星",
    亥: "天印星",
  },
  乙: {
    子: "天印星",
    丑: "天貴星",
    寅: "天恍星",
    卯: "天南星",
    辰: "天禄星",
    巳: "天将星",
    午: "天堂星",
    未: "天胡星",
    申: "天極星",
    酉: "天庫星",
    戌: "天馳星",
    亥: "天報星",
  },
  丙: {
    子: "天報星",
    丑: "天印星",
    寅: "天貴星",
    卯: "天恍星",
    辰: "天南星",
    巳: "天禄星",
    午: "天将星",
    未: "天堂星",
    申: "天胡星",
    酉: "天極星",
    戌: "天庫星",
    亥: "天馳星",
  },
  丁: {
    子: "天馳星",
    丑: "天報星",
    寅: "天印星",
    卯: "天貴星",
    辰: "天恍星",
    巳: "天南星",
    午: "天禄星",
    未: "天将星",
    申: "天堂星",
    酉: "天胡星",
    戌: "天極星",
    亥: "天庫星",
  },
  戊: {
    子: "天庫星",
    丑: "天馳星",
    寅: "天報星",
    卯: "天印星",
    辰: "天貴星",
    巳: "天恍星",
    午: "天南星",
    未: "天禄星",
    申: "天将星",
    酉: "天堂星",
    戌: "天胡星",
    亥: "天極星",
  },
  己: {
    子: "天極星",
    丑: "天庫星",
    寅: "天馳星",
    卯: "天報星",
    辰: "天印星",
    巳: "天貴星",
    午: "天恍星",
    未: "天南星",
    申: "天禄星",
    酉: "天将星",
    戌: "天堂星",
    亥: "天胡星",
  },
  庚: {
    子: "天胡星",
    丑: "天極星",
    寅: "天庫星",
    卯: "天馳星",
    辰: "天報星",
    巳: "天印星",
    午: "天貴星",
    未: "天恍星",
    申: "天南星",
    酉: "天禄星",
    戌: "天将星",
    亥: "天堂星",
  },
  辛: {
    子: "天堂星",
    丑: "天胡星",
    寅: "天極星",
    卯: "天庫星",
    辰: "天馳星",
    巳: "天報星",
    午: "天印星",
    未: "天貴星",
    申: "天恍星",
    酉: "天南星",
    戌: "天禄星",
    亥: "天将星",
  },
  壬: {
    子: "天将星",
    丑: "天堂星",
    寅: "天胡星",
    卯: "天極星",
    辰: "天庫星",
    巳: "天馳星",
    午: "天報星",
    未: "天印星",
    申: "天貴星",
    酉: "天恍星",
    戌: "天南星",
    亥: "天禄星",
  },
  癸: {
    子: "天禄星",
    丑: "天将星",
    寅: "天堂星",
    卯: "天胡星",
    辰: "天極星",
    巳: "天庫星",
    午: "天馳星",
    未: "天報星",
    申: "天印星",
    酉: "天貴星",
    戌: "天恍星",
    亥: "天南星",
  },
};

/**
 * 十二大従星を算出（テーブル参照方式）
 */
export function calcJusei(nikkan: Jikkan, shishi: Junishi): Jusei {
  return JUNIDAI_JUSEI_TABLE[nikkan][shishi];
}

/**
 * 二十八元を使用して蔵干を取得
 * @param shi 十二支
 * @param daysFromSetsuiri 節入りからの日数（1から始まる）
 * @returns 該当する蔵干
 */
export function getZoukanByNijuhachigen(shi: Junishi, daysFromSetsuiri: number): Jikkan {
  const nijuhachi = NIJUHACHIGEN[shi];

  // 初気の期間内か
  if (daysFromSetsuiri <= nijuhachi.shoki[1]) {
    return nijuhachi.shoki[0];
  }

  // 中気の期間内か
  if (daysFromSetsuiri <= nijuhachi.shoki[1] + nijuhachi.chuki[1]) {
    return nijuhachi.chuki[0];
  }

  // 本気
  return nijuhachi.honki;
}

/**
 * 干合をチェック
 */
export function checkKango(pillars: Pillars): KangoResult {
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

/**
 * 算命学の完全な結果を算出
 */
export function calculateSanmei(birthDate: string, isTransformed: boolean): SanmeiResult | null {
  if (!birthDate) return null;

  const [year, month, day] = birthDate.split("-").map(Number);
  const pillars = calcKanshi(year, month, day);
  const kango = checkKango(pillars);

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
  // PDF流派の配置ルール（半代 大和様.pdf より）
  //
  // 【十大主星】
  // 北(頭): 日干 × 年干 → 目上運（北方星）
  // 中央(胸): 日干 × 月支蔵干（本気）→ 基本性格（中心星）
  // 南(腹): 日干 × 月干 → 目下運（南方星）
  // 東(左手): 日干 × 年支蔵干（二十八元による中気）→ 社会・友人運（東方星）
  // 西(右手): 日干 × 日支蔵干（本気）→ パートナー運（西方星）
  // 右肩（伴星）: 日干 × 年干 → ご先祖様
  //
  // 【十二大従星】
  // 左肩: 日干 × 日支 → 初年期（幼少期）
  // 右足: 日干 × 年支の三合帝旺位 → 晩年期
  // 左足: 日干 × 日支の支合相手 → 中年期

  // 節入りからの日数を計算（左手の二十八元計算用）
  const setsuiriDay = getSetsuiriDay(year, month);
  let daysFromSetsuiri = day - setsuiriDay + 1;
  // 節入り前の場合は前月からの継続とみなす
  if (daysFromSetsuiri <= 0) {
    // 前月の節入り日を基準に計算（簡易的に30日で計算）
    daysFromSetsuiri = day + (30 - setsuiriDay) + 1;
  }

  // 年支蔵干を二十八元で取得（東方星用）
  const yearShiZoukan = getZoukanByNijuhachigen(pillars.year.shi, daysFromSetsuiri);

  const stars: Stars = {
    north: calcShusei(nikkan, pillars.year.kan), // 頭: 年干 → 目上運
    center: calcShusei(nikkan, ZOUKAN[pillars.month.shi]), // 胸: 月支蔵干（本気）→ 基本性格
    south: calcShusei(nikkan, pillars.month.kan), // 腹: 月干 → 目下運
    east: calcShusei(nikkan, yearShiZoukan), // 左手: 年支蔵干（二十八元）→ 社会・友人運
    west: calcShusei(nikkan, ZOUKAN[pillars.day.shi]), // 右手: 日支蔵干（本気）→ パートナー運
    northWest: calcShusei(nikkan, pillars.year.kan), // 右肩: 日干×年干 → 伴星
    jusei: {
      center: calcJusei(nikkan, pillars.day.shi), // 左肩: 日支 → 初年期（幼少期）
      right: calcJusei(nikkan, SANGO_TEIO[pillars.year.shi]), // 右足: 年支の三合帝旺位 → 晩年期
      left: calcJusei(nikkan, SHIGO_MAP[pillars.day.shi]), // 左足: 日支の支合相手 → 中年期
    },
  };

  // 全体の傾向を分析
  const allStars: Shusei[] = [
    stars.north,
    stars.center,
    stars.south,
    stars.east,
    stars.west,
    stars.northWest,
  ];
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
