import {
  JIKKAN,
  JUNISHI,
  ZOUKAN,
  SETSUIRI,
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

/**
 * 生年月日から干支（年柱・月柱・日柱）を算出
 */
export function calcKanshi(year: number, month: number, day: number): Pillars {
  // 年柱計算（立春で年が変わる）
  let adjustedYear = year;
  if (month < 2 || (month === 2 && day < SETSUIRI[1])) {
    adjustedYear -= 1;
  }
  const yearKanIndex = (((adjustedYear - 4) % 10) + 10) % 10;
  const yearShiIndex = (((adjustedYear - 4) % 12) + 12) % 12;

  // 月柱計算（節入り日で月が変わる）
  let adjustedMonth = month;
  let yearForMonth = adjustedYear;
  if (day < SETSUIRI[month - 1]) {
    adjustedMonth = month === 1 ? 12 : month - 1;
    if (month === 1) {
      yearForMonth -= 1;
    }
  }
  const monthOffset = ((((yearForMonth - 4) % 10) + 10) % 10) * 2 + 2;
  const monthKanIndex = (monthOffset + adjustedMonth - 1) % 10;
  const monthShiIndex = (adjustedMonth + 1) % 12;

  // 日柱計算（基準日からの経過日数）
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayKanIndex = ((diffDays % 10) + 10) % 10;
  const dayShiIndex = ((diffDays % 12) + 12) % 12;

  return {
    year: {
      kan: JIKKAN[yearKanIndex],
      shi: JUNISHI[yearShiIndex],
    },
    month: {
      kan: JIKKAN[monthKanIndex],
      shi: JUNISHI[monthShiIndex],
    },
    day: {
      kan: JIKKAN[dayKanIndex],
      shi: JUNISHI[dayShiIndex],
    },
  };
}

/**
 * 十大主星を算出（日干と対象干の関係から）
 */
export function calcShusei(nikkan: Jikkan, targetKan: Jikkan): Shusei {
  const nikkanIdx = JIKKAN.indexOf(nikkan);
  const targetIdx = JIKKAN.indexOf(targetKan);
  const diff = (targetIdx - nikkanIdx + 10) % 10;
  return JUDAI_SHUSEI[diff];
}

/**
 * 十二大従星を算出（日干と地支の関係から）
 */
export function calcJusei(nikkan: Jikkan, shishi: Junishi): Jusei {
  const nikkanIdx = JIKKAN.indexOf(nikkan);
  const shishiIdx = JUNISHI.indexOf(shishi);
  const offset = nikkanIdx % 2 === 0 ? shishiIdx : (12 - shishiIdx) % 12;
  return JUNIDAI_JUSEI[(offset + Math.floor(nikkanIdx / 2) * 2) % 12];
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

  // 人体星図の算出
  const stars: Stars = {
    north: calcShusei(nikkan, ZOUKAN[pillars.month.shi]),
    center: calcShusei(nikkan, nikkan),
    south: calcShusei(nikkan, ZOUKAN[pillars.day.shi]),
    east: calcShusei(nikkan, ZOUKAN[pillars.year.shi]),
    west: calcShusei(nikkan, pillars.month.kan),
    jusei: {
      right: calcJusei(nikkan, pillars.year.shi),
      left: calcJusei(nikkan, pillars.month.shi),
      center: calcJusei(nikkan, pillars.day.shi),
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
