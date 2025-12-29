import type { SanmeiResult, Jikkan, Junishi, GogyoType } from "../constants";

// ===== 特殊関係性の結果型 =====

/** 律音（りっちん）: 同じ干支 */
export interface RitchinResult {
  exists: boolean;
  positions?: ("year" | "month" | "day")[];
}

/** 納音（なっちん）: 干が同じで支が対冲 */
export interface NatchinResult {
  exists: boolean;
  positions?: { pillar1: "year" | "month" | "day"; pillar2: "year" | "month" | "day" }[];
}

/** 大半会（だいはんかい）: 干が干合し、支が半会 */
export interface DaihanResult {
  exists: boolean;
  kanPair?: [Jikkan, Jikkan];
  shiPair?: [Junishi, Junishi];
  element?: GogyoType;
}

/** 天剋地冲（てんこくちちゅう）: 干が相剋、支が対冲 */
export interface TenkokuResult {
  exists: boolean;
  positions?: { pillar1: "year" | "month" | "day"; pillar2: "year" | "month" | "day" }[];
}

// ===== 五行相性 =====

export type GogyoRelation = "相生" | "被生" | "相剋" | "被剋" | "比和";

export interface GogyoCompatibility {
  person1Element: GogyoType;
  person2Element: GogyoType;
  relation: GogyoRelation;
  score: number; // -100 〜 +100
  description: string;
}

// ===== 関係性タイプ =====

export type RelationshipType =
  | "相互補完型" // 異なる強みを持ち補い合う
  | "類似型" // 似た傾向を持つ
  | "刺激型" // 互いに刺激を与え合う
  | "安定型" // 穏やかで安定した関係
  | "成長型" // 互いを成長させる
  | "挑戦型"; // 課題を与え合う

export interface RelationshipTypeResult {
  type: RelationshipType;
  score: number; // 0〜100
  description: string;
  advice: string;
}

// ===== 宇宙盤データ =====

/** 十二支の宇宙盤上の位置（0〜11、時計の12時を0として時計回り） */
export const UCHUBAN_POSITIONS: Record<Junishi, number> = {
  子: 0,
  丑: 1,
  寅: 2,
  卯: 3,
  辰: 4,
  巳: 5,
  午: 6,
  未: 7,
  申: 8,
  酉: 9,
  戌: 10,
  亥: 11,
};

export interface UchubanTriangle {
  points: [number, number, number]; // 宇宙盤上の位置インデックス（0〜11）
  pillars: {
    year: Junishi;
    month: Junishi;
    day: Junishi;
  };
}

export interface UchubanOverlap {
  overlapPercentage: number; // 0〜100
  sharedPoints: number; // 共有している頂点の数（0〜3）
  interpretation: string;
}

// ===== 支の関係性マッチ =====

export interface ShiMatch {
  p1Pillar: "year" | "month" | "day";
  p2Pillar: "year" | "month" | "day";
  shi1: Junishi;
  shi2: Junishi;
}

export interface HankaiMatch {
  p1Pillar: "year" | "month" | "day";
  p2Pillar: "year" | "month" | "day";
  element: GogyoType;
}

// ===== 総合結果 =====

export interface CompatibilityResult {
  // 入力データ
  person1: SanmeiResult;
  person2: SanmeiResult;

  // 特殊関係性
  ritchin: RitchinResult;
  natchin: NatchinResult;
  daihan: DaihanResult;
  tenkoku: TenkokuResult;

  // 支の関係性
  shigoMatches: ShiMatch[];
  taichuMatches: ShiMatch[];
  hankaiMatches: HankaiMatch[];

  // 干合（日干同士）
  nikkanKango: {
    exists: boolean;
    transformed?: GogyoType;
  };

  // 五行相性
  nikkanCompatibility: GogyoCompatibility;
  centerStarCompatibility: GogyoCompatibility;

  // 総合スコア・タイプ
  overallScore: number; // 0〜100
  relationshipType: RelationshipTypeResult;

  // 宇宙盤データ
  uchuban: {
    person1: UchubanTriangle;
    person2: UchubanTriangle;
    overlap: UchubanOverlap;
  };

  // 詳細メッセージ
  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}

// ===== 関係性タイプの詳細情報 =====

export const RELATIONSHIP_TYPE_INFO: Record<
  RelationshipType,
  { emoji: string; shortDesc: string; longDesc: string; advice: string }
> = {
  相互補完型: {
    emoji: "🤝",
    shortDesc: "異なる強みで補い合う関係",
    longDesc:
      "お互いの持つ強みが異なり、足りない部分を補い合える理想的な関係です。一人では難しいことも二人なら乗り越えられます。",
    advice:
      "相手の強みを認め、自分にないものを持っていることに感謝しましょう。役割分担を明確にすると、より良い関係を築けます。",
  },
  類似型: {
    emoji: "🪞",
    shortDesc: "似た価値観を共有する関係",
    longDesc:
      "考え方や価値観が似ているため、お互いの気持ちを理解しやすい関係です。共感し合えることが多く、居心地の良さを感じられます。",
    advice:
      "似ているからこそ、意見がぶつかることもあります。違いを認め合い、時には新しい視点を取り入れることも大切です。",
  },
  刺激型: {
    emoji: "⚡",
    shortDesc: "互いに刺激を与え合う関係",
    longDesc:
      "お互いに良い刺激を与え合える関係です。マンネリになりにくく、常に新鮮な気持ちで向き合えます。",
    advice: "刺激が強すぎると疲れることも。適度な距離感を保ち、休息の時間も大切にしましょう。",
  },
  安定型: {
    emoji: "🏠",
    shortDesc: "穏やかで安定した関係",
    longDesc:
      "穏やかで安定した関係を築けます。大きな波風は立ちにくく、長く続く関係になりやすいです。",
    advice:
      "安定しすぎるとマンネリ化することも。時には新しいことに二人でチャレンジしてみましょう。",
  },
  成長型: {
    emoji: "🌱",
    shortDesc: "互いを成長させる関係",
    longDesc:
      "お互いの存在が成長の糧となる関係です。一緒にいることで、より良い自分になれる可能性を秘めています。",
    advice:
      "成長には痛みも伴います。相手を変えようとするのではなく、自分自身の成長に集中しましょう。",
  },
  挑戦型: {
    emoji: "🔥",
    shortDesc: "課題を与え合う関係",
    longDesc:
      "お互いに課題を与え合う関係です。困難を乗り越えることで、絆が深まる可能性があります。",
    advice:
      "課題を避けずに向き合うことが大切です。ただし、無理はせず、時には専門家の助けを借りることも検討しましょう。",
  },
};
