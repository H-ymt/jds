import {
  GOGYO,
  GOGYO_SOJO,
  GOGYO_SOKOKU,
  KANGO_RULES,
  SHIGO_PAIRS,
  TAICHU_PAIRS,
  HANKAI_PAIRS,
  SHUSEI_INFO,
  type Jikkan,
  type GogyoType,
  type Pillars,
  type SanmeiResult,
} from "../constants";

import {
  type GogyoRelation,
  type GogyoCompatibility,
  type RelationshipType,
  type RelationshipTypeResult,
  type RitchinResult,
  type NatchinResult,
  type DaihanResult,
  type TenkokuResult,
  type ShiMatch,
  type HankaiMatch,
  type UchubanTriangle,
  type UchubanOverlap,
  type CompatibilityResult,
  UCHUBAN_POSITIONS,
  RELATIONSHIP_TYPE_INFO,
} from "./compatibility-constants";

// ===== 五行関係判定 =====

/**
 * 二つの五行の関係性を判定
 */
export function getGogyoRelation(element1: GogyoType, element2: GogyoType): GogyoRelation {
  if (element1 === element2) {
    return "比和";
  }
  if (GOGYO_SOJO[element1] === element2) {
    return "相生";
  }
  if (GOGYO_SOJO[element2] === element1) {
    return "被生";
  }
  if (GOGYO_SOKOKU[element1] === element2) {
    return "相剋";
  }
  if (GOGYO_SOKOKU[element2] === element1) {
    return "被剋";
  }
  return "比和"; // fallback
}

/**
 * 五行関係からスコアを算出
 */
function getGogyoScore(relation: GogyoRelation): number {
  switch (relation) {
    case "相生":
      return 20;
    case "被生":
      return 15;
    case "比和":
      return 10;
    case "相剋":
      return -15;
    case "被剋":
      return -20;
  }
}

/**
 * 五行関係から説明文を生成
 */
function getGogyoDescription(
  element1: GogyoType,
  element2: GogyoType,
  relation: GogyoRelation,
): string {
  switch (relation) {
    case "相生":
      return `${element1}は${element2}を生む関係（相生）。あなたが相手をサポートする傾向があります。`;
    case "被生":
      return `${element2}は${element1}を生む関係（被生）。相手があなたをサポートする傾向があります。`;
    case "比和":
      return `${element1}と${element2}は同じ五行（比和）。似た者同士で理解し合えます。`;
    case "相剋":
      return `${element1}は${element2}を剋す関係（相剋）。あなたが相手をリードする傾向があります。`;
    case "被剋":
      return `${element2}は${element1}を剋す関係（被剋）。相手があなたをリードする傾向があります。`;
  }
}

/**
 * 五行相性を計算
 */
export function calculateGogyoCompatibility(
  element1: GogyoType,
  element2: GogyoType,
): GogyoCompatibility {
  const relation = getGogyoRelation(element1, element2);
  return {
    person1Element: element1,
    person2Element: element2,
    relation,
    score: getGogyoScore(relation),
    description: getGogyoDescription(element1, element2, relation),
  };
}

// ===== 特殊関係性判定 =====

const PILLAR_KEYS: ("year" | "month" | "day")[] = ["year", "month", "day"];

/**
 * 律音チェック: 同じ干支があるか
 */
export function checkRitchin(pillars1: Pillars, pillars2: Pillars): RitchinResult {
  const positions: ("year" | "month" | "day")[] = [];

  for (const key of PILLAR_KEYS) {
    const p1 = pillars1[key];
    const p2 = pillars2[key];
    if (p1.kan === p2.kan && p1.shi === p2.shi) {
      positions.push(key);
    }
  }

  return {
    exists: positions.length > 0,
    positions: positions.length > 0 ? positions : undefined,
  };
}

/**
 * 納音チェック: 干が同じで支が対冲
 */
export function checkNatchin(pillars1: Pillars, pillars2: Pillars): NatchinResult {
  const positions: { pillar1: "year" | "month" | "day"; pillar2: "year" | "month" | "day" }[] = [];

  for (const key1 of PILLAR_KEYS) {
    for (const key2 of PILLAR_KEYS) {
      const p1 = pillars1[key1];
      const p2 = pillars2[key2];

      // 干が同じ
      if (p1.kan === p2.kan) {
        // 支が対冲
        const isTaichu = TAICHU_PAIRS.some(
          ([a, b]) => (p1.shi === a && p2.shi === b) || (p1.shi === b && p2.shi === a),
        );
        if (isTaichu) {
          positions.push({ pillar1: key1, pillar2: key2 });
        }
      }
    }
  }

  return {
    exists: positions.length > 0,
    positions: positions.length > 0 ? positions : undefined,
  };
}

/**
 * 大半会チェック: 干が干合し、支が半会
 */
export function checkDaihan(pillars1: Pillars, pillars2: Pillars): DaihanResult {
  for (const key1 of PILLAR_KEYS) {
    for (const key2 of PILLAR_KEYS) {
      const p1 = pillars1[key1];
      const p2 = pillars2[key2];

      // 干合チェック
      const kangoRule = KANGO_RULES[p1.kan];
      if (kangoRule.partner === p2.kan) {
        // 半会チェック
        for (const { pair, element } of HANKAI_PAIRS) {
          if (
            (p1.shi === pair[0] && p2.shi === pair[1]) ||
            (p1.shi === pair[1] && p2.shi === pair[0])
          ) {
            return {
              exists: true,
              kanPair: [p1.kan, p2.kan],
              shiPair: [p1.shi, p2.shi],
              element,
            };
          }
        }
      }
    }
  }

  return { exists: false };
}

/**
 * 天剋地冲チェック: 干が相剋、支が対冲
 */
export function checkTenkoku(pillars1: Pillars, pillars2: Pillars): TenkokuResult {
  const positions: { pillar1: "year" | "month" | "day"; pillar2: "year" | "month" | "day" }[] = [];

  for (const key1 of PILLAR_KEYS) {
    for (const key2 of PILLAR_KEYS) {
      const p1 = pillars1[key1];
      const p2 = pillars2[key2];

      const element1 = GOGYO[p1.kan] as GogyoType;
      const element2 = GOGYO[p2.kan] as GogyoType;

      // 干が相剋関係
      const isSokoku = GOGYO_SOKOKU[element1] === element2 || GOGYO_SOKOKU[element2] === element1;

      if (isSokoku) {
        // 支が対冲
        const isTaichu = TAICHU_PAIRS.some(
          ([a, b]) => (p1.shi === a && p2.shi === b) || (p1.shi === b && p2.shi === a),
        );
        if (isTaichu) {
          positions.push({ pillar1: key1, pillar2: key2 });
        }
      }
    }
  }

  return {
    exists: positions.length > 0,
    positions: positions.length > 0 ? positions : undefined,
  };
}

/**
 * 支合チェック
 */
export function checkShigo(pillars1: Pillars, pillars2: Pillars): ShiMatch[] {
  const matches: ShiMatch[] = [];

  for (const key1 of PILLAR_KEYS) {
    for (const key2 of PILLAR_KEYS) {
      const shi1 = pillars1[key1].shi;
      const shi2 = pillars2[key2].shi;

      const isShigo = SHIGO_PAIRS.some(
        ([a, b]) => (shi1 === a && shi2 === b) || (shi1 === b && shi2 === a),
      );

      if (isShigo) {
        matches.push({ p1Pillar: key1, p2Pillar: key2, shi1, shi2 });
      }
    }
  }

  return matches;
}

/**
 * 対冲チェック
 */
export function checkTaichu(pillars1: Pillars, pillars2: Pillars): ShiMatch[] {
  const matches: ShiMatch[] = [];

  for (const key1 of PILLAR_KEYS) {
    for (const key2 of PILLAR_KEYS) {
      const shi1 = pillars1[key1].shi;
      const shi2 = pillars2[key2].shi;

      const isTaichu = TAICHU_PAIRS.some(
        ([a, b]) => (shi1 === a && shi2 === b) || (shi1 === b && shi2 === a),
      );

      if (isTaichu) {
        matches.push({ p1Pillar: key1, p2Pillar: key2, shi1, shi2 });
      }
    }
  }

  return matches;
}

/**
 * 半会チェック
 */
export function checkHankai(pillars1: Pillars, pillars2: Pillars): HankaiMatch[] {
  const matches: HankaiMatch[] = [];

  for (const key1 of PILLAR_KEYS) {
    for (const key2 of PILLAR_KEYS) {
      const shi1 = pillars1[key1].shi;
      const shi2 = pillars2[key2].shi;

      for (const { pair, element } of HANKAI_PAIRS) {
        if ((shi1 === pair[0] && shi2 === pair[1]) || (shi1 === pair[1] && shi2 === pair[0])) {
          matches.push({ p1Pillar: key1, p2Pillar: key2, element });
        }
      }
    }
  }

  return matches;
}

/**
 * 日干同士の干合チェック
 */
export function checkNikkanKango(
  nikkan1: Jikkan,
  nikkan2: Jikkan,
): { exists: boolean; transformed?: GogyoType } {
  const kangoRule = KANGO_RULES[nikkan1];
  if (kangoRule.partner === nikkan2) {
    return { exists: true, transformed: kangoRule.transformed };
  }
  return { exists: false };
}

// ===== 宇宙盤計算 =====

/**
 * 宇宙盤上の三角形座標を計算
 */
export function calculateUchubanTriangle(pillars: Pillars): UchubanTriangle {
  return {
    points: [
      UCHUBAN_POSITIONS[pillars.year.shi],
      UCHUBAN_POSITIONS[pillars.month.shi],
      UCHUBAN_POSITIONS[pillars.day.shi],
    ],
    pillars: {
      year: pillars.year.shi,
      month: pillars.month.shi,
      day: pillars.day.shi,
    },
  };
}

/**
 * 二つの三角形の重なりを計算
 */
export function calculateTriangleOverlap(
  triangle1: UchubanTriangle,
  triangle2: UchubanTriangle,
): UchubanOverlap {
  // 共有頂点の数をカウント
  const sharedPoints = triangle1.points.filter((p) => triangle2.points.includes(p)).length;

  // 重なり度を計算（簡易版：共有頂点とポジションの近さで計算）
  let overlapScore = sharedPoints * 25; // 各共有頂点で25%

  // 位置の近さも考慮（隣接していればボーナス）
  for (const p1 of triangle1.points) {
    for (const p2 of triangle2.points) {
      if (p1 !== p2) {
        const distance = Math.min(Math.abs(p1 - p2), 12 - Math.abs(p1 - p2));
        if (distance === 1) overlapScore += 5; // 隣接
        if (distance === 2) overlapScore += 3; // 2つ離れ
      }
    }
  }

  const overlapPercentage = Math.min(100, overlapScore);

  let interpretation: string;
  if (sharedPoints === 3) {
    interpretation =
      "完全一致：行動パターンが非常に似ています。理解し合いやすい反面、似すぎて刺激が少ないかもしれません。";
  } else if (sharedPoints === 2) {
    interpretation =
      "高い一致：多くの行動パターンが重なります。共感しやすく、良いパートナーシップが期待できます。";
  } else if (sharedPoints === 1) {
    interpretation =
      "部分的一致：一部の行動パターンが重なります。異なる視点を持ちながらも、共通点があります。";
  } else if (overlapPercentage > 40) {
    interpretation =
      "近接関係：直接の重なりは少ないですが、行動領域が近く、互いに影響し合える関係です。";
  } else {
    interpretation =
      "異なる領域：行動パターンが大きく異なります。新しい視点を得られる反面、理解に時間がかかることも。";
  }

  return {
    overlapPercentage,
    sharedPoints,
    interpretation,
  };
}

// ===== 関係性タイプ分類 =====

/**
 * 関係性タイプを分類
 */
export function classifyRelationshipType(
  result1: SanmeiResult,
  result2: SanmeiResult,
  specialRelations: {
    ritchin: RitchinResult;
    natchin: NatchinResult;
    daihan: DaihanResult;
    tenkoku: TenkokuResult;
  },
  nikkanKango: { exists: boolean },
  shigoCount: number,
  taichuCount: number,
): RelationshipTypeResult {
  let type: RelationshipType;
  let score: number;

  // 特殊関係性による判定
  if (specialRelations.daihan.exists) {
    type = "成長型";
    score = 85;
  } else if (nikkanKango.exists) {
    type = "相互補完型";
    score = 90;
  } else if (specialRelations.ritchin.exists) {
    type = "類似型";
    score = 75;
  } else if (specialRelations.tenkoku.exists) {
    type = "挑戦型";
    score = 55;
  } else if (specialRelations.natchin.exists) {
    type = "刺激型";
    score = 70;
  } else {
    // 五行バランスによる判定
    const nikkanRelation = getGogyoRelation(
      GOGYO[result1.nikkan] as GogyoType,
      GOGYO[result2.nikkan] as GogyoType,
    );

    const centerElement1 = SHUSEI_INFO[result1.stars.center].element;
    const centerElement2 = SHUSEI_INFO[result2.stars.center].element;
    const centerRelation = getGogyoRelation(centerElement1, centerElement2);

    if (nikkanRelation === "比和" && centerRelation === "比和") {
      type = "類似型";
      score = 70;
    } else if (nikkanRelation === "相生" || nikkanRelation === "被生") {
      type = "相互補完型";
      score = 75;
    } else if (nikkanRelation === "相剋" || nikkanRelation === "被剋") {
      if (shigoCount >= 2) {
        type = "刺激型";
        score = 65;
      } else {
        type = "挑戦型";
        score = 50;
      }
    } else {
      type = "安定型";
      score = 60;
    }

    // 支合・対冲による補正
    score += shigoCount * 5;
    score -= taichuCount * 5;
  }

  // スコアを0-100の範囲に収める
  score = Math.max(0, Math.min(100, score));

  const info = RELATIONSHIP_TYPE_INFO[type];

  return {
    type,
    score,
    description: info.longDesc,
    advice: info.advice,
  };
}

// ===== 総合スコア算出 =====

/**
 * 総合相性スコアを算出（0〜100）
 */
export function calculateOverallScore(
  nikkanCompatibility: GogyoCompatibility,
  centerStarCompatibility: GogyoCompatibility,
  specialRelations: {
    ritchin: RitchinResult;
    natchin: NatchinResult;
    daihan: DaihanResult;
    tenkoku: TenkokuResult;
  },
  nikkanKango: { exists: boolean },
  shigoCount: number,
  taichuCount: number,
): number {
  // 基本スコア 50点からスタート
  let score = 50;

  // 日干同士の五行関係（最大±30点）
  const nikkanScore = nikkanCompatibility.score * 1.5;
  score += nikkanScore;

  // 中心星同士の五行関係（最大±25点）
  const centerScore = centerStarCompatibility.score * 1.25;
  score += centerScore;

  // 特殊関係性ボーナス/ペナルティ
  if (specialRelations.daihan.exists) score += 15;
  if (nikkanKango.exists) score += 12;
  if (specialRelations.ritchin.exists) score += 10;
  if (specialRelations.natchin.exists) score += 8;
  if (specialRelations.tenkoku.exists) score -= 15;

  // 支合ボーナス（1つあたり+5点、最大+15点）
  score += Math.min(shigoCount * 5, 15);

  // 対冲ペナルティ（1つあたり-5点、最大-15点）
  score -= Math.min(taichuCount * 5, 15);

  // 0〜100の範囲に収める
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ===== サマリー生成 =====

function generateSummary(
  overallScore: number,
  relationshipType: RelationshipType,
  specialRelations: {
    ritchin: RitchinResult;
    natchin: NatchinResult;
    daihan: DaihanResult;
    tenkoku: TenkokuResult;
  },
  nikkanKango: { exists: boolean },
): string {
  const scoreComment =
    overallScore >= 80
      ? "非常に良い相性"
      : overallScore >= 60
        ? "良い相性"
        : overallScore >= 40
          ? "まずまずの相性"
          : "課題のある相性";

  let summary = `${scoreComment}です（${overallScore}点）。`;
  summary += `関係性タイプは「${relationshipType}」です。`;

  if (nikkanKango.exists) {
    summary += "日干同士が干合しており、強い結びつきがあります。";
  }
  if (specialRelations.daihan.exists) {
    summary += "大半会の関係があり、非常に強い縁があります。";
  }
  if (specialRelations.ritchin.exists) {
    summary += "律音の関係があり、深い縁で結ばれています。";
  }

  return summary;
}

function generateStrengths(
  specialRelations: {
    ritchin: RitchinResult;
    natchin: NatchinResult;
    daihan: DaihanResult;
    tenkoku: TenkokuResult;
  },
  nikkanKango: { exists: boolean },
  shigoCount: number,
  nikkanCompatibility: GogyoCompatibility,
): string[] {
  const strengths: string[] = [];

  if (nikkanKango.exists) {
    strengths.push("日干が干合し、深い絆で結ばれています");
  }
  if (specialRelations.daihan.exists) {
    strengths.push("大半会の関係があり、お互いを高め合えます");
  }
  if (specialRelations.ritchin.exists) {
    strengths.push("律音の関係があり、魂レベルでの繋がりがあります");
  }
  if (specialRelations.natchin.exists) {
    strengths.push("納音の関係があり、補完し合える関係です");
  }
  if (shigoCount > 0) {
    strengths.push(`支合が${shigoCount}つあり、自然と惹かれ合う関係です`);
  }
  if (nikkanCompatibility.relation === "相生" || nikkanCompatibility.relation === "被生") {
    strengths.push(nikkanCompatibility.description);
  }
  if (nikkanCompatibility.relation === "比和") {
    strengths.push("同じ五行を持ち、価値観が近いです");
  }

  if (strengths.length === 0) {
    strengths.push("お互いの違いを認め合うことで成長できます");
  }

  return strengths;
}

function generateChallenges(
  specialRelations: {
    tenkoku: TenkokuResult;
  },
  taichuCount: number,
  nikkanCompatibility: GogyoCompatibility,
): string[] {
  const challenges: string[] = [];

  if (specialRelations.tenkoku.exists) {
    challenges.push("天剋地冲の関係があり、意見の衝突が起きやすいかもしれません");
  }
  if (taichuCount > 0) {
    challenges.push(`対冲が${taichuCount}つあり、価値観の違いを感じることがあるかもしれません`);
  }
  if (nikkanCompatibility.relation === "相剋" || nikkanCompatibility.relation === "被剋") {
    challenges.push("五行の相剋関係があり、時に緊張関係が生まれることがあります");
  }

  if (challenges.length === 0) {
    challenges.push("大きな課題は見当たりません");
  }

  return challenges;
}

function generateAdvice(relationshipType: RelationshipType, overallScore: number): string {
  const baseAdvice = RELATIONSHIP_TYPE_INFO[relationshipType].advice;

  if (overallScore >= 80) {
    return `${baseAdvice} この関係を大切に育ててください。`;
  } else if (overallScore >= 60) {
    return `${baseAdvice} お互いの良さを認め合うことで、さらに良い関係を築けます。`;
  } else if (overallScore >= 40) {
    return `${baseAdvice} 違いを受け入れる心の余裕を持つことが大切です。`;
  } else {
    return `${baseAdvice} 無理をせず、自分らしさを大切にしながら関係を築いてください。`;
  }
}

// ===== メイン関数 =====

/**
 * 二人の相性を総合診断
 */
export function calculateCompatibility(
  result1: SanmeiResult,
  result2: SanmeiResult,
): CompatibilityResult {
  // 特殊関係性をチェック
  const ritchin = checkRitchin(result1.pillars, result2.pillars);
  const natchin = checkNatchin(result1.pillars, result2.pillars);
  const daihan = checkDaihan(result1.pillars, result2.pillars);
  const tenkoku = checkTenkoku(result1.pillars, result2.pillars);

  // 支の関係性をチェック
  const shigoMatches = checkShigo(result1.pillars, result2.pillars);
  const taichuMatches = checkTaichu(result1.pillars, result2.pillars);
  const hankaiMatches = checkHankai(result1.pillars, result2.pillars);

  // 日干同士の干合をチェック
  const nikkanKango = checkNikkanKango(result1.nikkan, result2.nikkan);

  // 五行相性を計算
  const nikkanCompatibility = calculateGogyoCompatibility(
    GOGYO[result1.nikkan] as GogyoType,
    GOGYO[result2.nikkan] as GogyoType,
  );

  const centerElement1 = SHUSEI_INFO[result1.stars.center].element;
  const centerElement2 = SHUSEI_INFO[result2.stars.center].element;
  const centerStarCompatibility = calculateGogyoCompatibility(centerElement1, centerElement2);

  // 特殊関係性オブジェクト
  const specialRelations = { ritchin, natchin, daihan, tenkoku };

  // 総合スコアを算出
  const overallScore = calculateOverallScore(
    nikkanCompatibility,
    centerStarCompatibility,
    specialRelations,
    nikkanKango,
    shigoMatches.length,
    taichuMatches.length,
  );

  // 関係性タイプを分類
  const relationshipType = classifyRelationshipType(
    result1,
    result2,
    specialRelations,
    nikkanKango,
    shigoMatches.length,
    taichuMatches.length,
  );

  // 宇宙盤を計算
  const uchubanPerson1 = calculateUchubanTriangle(result1.pillars);
  const uchubanPerson2 = calculateUchubanTriangle(result2.pillars);
  const uchubanOverlap = calculateTriangleOverlap(uchubanPerson1, uchubanPerson2);

  // サマリーを生成
  const summary = generateSummary(
    overallScore,
    relationshipType.type,
    specialRelations,
    nikkanKango,
  );
  const strengths = generateStrengths(
    specialRelations,
    nikkanKango,
    shigoMatches.length,
    nikkanCompatibility,
  );
  const challenges = generateChallenges({ tenkoku }, taichuMatches.length, nikkanCompatibility);
  const advice = generateAdvice(relationshipType.type, overallScore);

  return {
    person1: result1,
    person2: result2,
    ritchin,
    natchin,
    daihan,
    tenkoku,
    shigoMatches,
    taichuMatches,
    hankaiMatches,
    nikkanKango,
    nikkanCompatibility,
    centerStarCompatibility,
    overallScore,
    relationshipType,
    uchuban: {
      person1: uchubanPerson1,
      person2: uchubanPerson2,
      overlap: uchubanOverlap,
    },
    summary,
    strengths,
    challenges,
    advice,
  };
}
