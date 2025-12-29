// 十干
export const JIKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;

// 十二支
export const JUNISHI = [
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
] as const;

// 五行
export const GOGYO: Record<(typeof JIKKAN)[number], string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

// 五行タイプ
export type GogyoType = "木" | "火" | "土" | "金" | "水";

// 五行相生（生じる側 → 生じられる側）
export const GOGYO_SOJO: Record<GogyoType, GogyoType> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

// 五行相剋（剋す側 → 剋される側）
export const GOGYO_SOKOKU: Record<GogyoType, GogyoType> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

// 十二支の五行対応
export const JUNISHI_GOGYO: Record<(typeof JUNISHI)[number], GogyoType> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};

// 支合（六合）
export const SHIGO_PAIRS: [(typeof JUNISHI)[number], (typeof JUNISHI)[number]][] = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"],
];

// 三合会局
export const SANGO_SETS: {
  members: [(typeof JUNISHI)[number], (typeof JUNISHI)[number], (typeof JUNISHI)[number]];
  element: GogyoType;
}[] = [
  { members: ["寅", "午", "戌"], element: "火" },
  { members: ["巳", "酉", "丑"], element: "金" },
  { members: ["申", "子", "辰"], element: "水" },
  { members: ["亥", "卯", "未"], element: "木" },
];

// 半会（三合の2つが揃った状態）
export const HANKAI_PAIRS: {
  pair: [(typeof JUNISHI)[number], (typeof JUNISHI)[number]];
  element: GogyoType;
}[] = [
  { pair: ["寅", "午"], element: "火" },
  { pair: ["午", "戌"], element: "火" },
  { pair: ["寅", "戌"], element: "火" },
  { pair: ["巳", "酉"], element: "金" },
  { pair: ["酉", "丑"], element: "金" },
  { pair: ["巳", "丑"], element: "金" },
  { pair: ["申", "子"], element: "水" },
  { pair: ["子", "辰"], element: "水" },
  { pair: ["申", "辰"], element: "水" },
  { pair: ["亥", "卯"], element: "木" },
  { pair: ["卯", "未"], element: "木" },
  { pair: ["亥", "未"], element: "木" },
];

// 対冲（沖）
export const TAICHU_PAIRS: [(typeof JUNISHI)[number], (typeof JUNISHI)[number]][] = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"],
];

// 蔵干
export const ZOUKAN: Record<(typeof JUNISHI)[number], (typeof JIKKAN)[number]> = {
  子: "癸",
  丑: "己",
  寅: "甲",
  卯: "乙",
  辰: "戊",
  巳: "丙",
  午: "丁",
  未: "己",
  申: "庚",
  酉: "辛",
  戌: "戊",
  亥: "壬",
};

// 節入り日
export const SETSUIRI = [6, 4, 6, 5, 6, 6, 7, 8, 8, 9, 8, 7];

// 十大主星
export const JUDAI_SHUSEI = [
  "貫索星",
  "石門星",
  "鳳閣星",
  "調舒星",
  "禄存星",
  "司禄星",
  "車騎星",
  "牽牛星",
  "龍高星",
  "玉堂星",
] as const;

// 十二大従星
export const JUNIDAI_JUSEI = [
  "天報星",
  "天印星",
  "天貴星",
  "天恍星",
  "天南星",
  "天禄星",
  "天将星",
  "天堂星",
  "天胡星",
  "天極星",
  "天庫星",
  "天馳星",
] as const;

// 干合ルール
export const KANGO_RULES: Record<
  (typeof JIKKAN)[number],
  { partner: (typeof JIKKAN)[number]; transformed: GogyoType }
> = {
  甲: { partner: "己", transformed: "土" },
  己: { partner: "甲", transformed: "土" },
  乙: { partner: "庚", transformed: "金" },
  庚: { partner: "乙", transformed: "金" },
  丙: { partner: "辛", transformed: "水" },
  辛: { partner: "丙", transformed: "水" },
  丁: { partner: "壬", transformed: "木" },
  壬: { partner: "丁", transformed: "木" },
  戊: { partner: "癸", transformed: "火" },
  癸: { partner: "戊", transformed: "火" },
};

// 十大主星の解説
export const SHUSEI_INFO: Record<
  (typeof JUDAI_SHUSEI)[number],
  { keyword: string; element: GogyoType; desc: string }
> = {
  貫索星: {
    keyword: "独立・自我",
    element: "木",
    desc: "自分の信念を貫く強い意志を持ちます。独立心が強く、人に頼らず自力で道を切り開くタイプ。頑固な面もありますが、それは芯の強さの表れです。",
  },
  石門星: {
    keyword: "協調・社交",
    element: "木",
    desc: "人との和を大切にし、グループの中で力を発揮します。協調性に優れ、人間関係を円滑にする才能があります。政治力や交渉力も持ち合わせています。",
  },
  鳳閣星: {
    keyword: "楽観・表現",
    element: "火",
    desc: "明るく楽観的で、人生を楽しむ才能があります。食や芸術を愛し、自然体で生きることを好みます。周囲を和ませるムードメーカー的存在です。",
  },
  調舒星: {
    keyword: "感性・孤高",
    element: "火",
    desc: "繊細な感性と独自の美意識を持ちます。芸術的センスに優れ、一人の時間を大切にします。完璧主義で、妥協を嫌う傾向があります。",
  },
  禄存星: {
    keyword: "魅力・奉仕",
    element: "土",
    desc: "人を惹きつける魅力と愛情深さを持ちます。面倒見が良く、人のために尽くすことに喜びを感じます。経済的な才能も秘めています。",
  },
  司禄星: {
    keyword: "堅実・蓄積",
    element: "土",
    desc: "堅実で計画的な性格です。コツコツと積み重ねることが得意で、家庭や財産を大切にします。安定を求め、地道な努力を惜しみません。",
  },
  車騎星: {
    keyword: "行動・闘争",
    element: "金",
    desc: "行動力と実行力に優れています。目標に向かって突き進む推進力があり、困難にも立ち向かう勇気を持ちます。スピード感を大切にします。",
  },
  牽牛星: {
    keyword: "名誉・責任",
    element: "金",
    desc: "責任感が強く、名誉を重んじます。リーダーシップがあり、人から頼られる存在です。礼儀正しく、社会的な成功を目指します。",
  },
  龍高星: {
    keyword: "冒険・改革",
    element: "水",
    desc: "好奇心旺盛で、未知の世界への冒険心を持ちます。既存の枠にとらわれず、改革を求める革新的な精神の持ち主です。海外との縁も深いです。",
  },
  玉堂星: {
    keyword: "知性・伝統",
    element: "水",
    desc: "知的好奇心が強く、学問や研究に適性があります。伝統や歴史を重んじ、深い教養を身につけます。母性的な優しさも持ち合わせています。",
  },
};

// 十二大従星の解説
export const JUSEI_INFO: Record<
  (typeof JUNIDAI_JUSEI)[number],
  { energy: number; phase: string; desc: string }
> = {
  天報星: {
    energy: 1,
    phase: "胎児",
    desc: "多芸多才で変化を好む。器用さと適応力に優れています。",
  },
  天印星: {
    energy: 3,
    phase: "赤ちゃん",
    desc: "愛される才能を持ち、目上からの引き立てに恵まれます。",
  },
  天貴星: {
    energy: 5,
    phase: "幼児",
    desc: "プライドが高く、品位を大切にします。上昇志向が強いです。",
  },
  天恍星: {
    energy: 7,
    phase: "少年少女",
    desc: "ロマンチストで夢見がち。感受性が豊かで芸術的才能があります。",
  },
  天南星: {
    energy: 10,
    phase: "青年",
    desc: "情熱的で反骨精神旺盛。改革者としての素質があります。",
  },
  天禄星: {
    energy: 11,
    phase: "壮年",
    desc: "現実的で堅実。社会的成功を収める力を持っています。",
  },
  天将星: {
    energy: 12,
    phase: "頂点",
    desc: "最強のエネルギー。リーダーとして大きな影響力を持ちます。",
  },
  天堂星: {
    energy: 9,
    phase: "老人",
    desc: "落ち着きと安定感があります。晩年運に恵まれています。",
  },
  天胡星: {
    energy: 6,
    phase: "病人",
    desc: "霊感やインスピレーションに優れ、神秘的な才能があります。",
  },
  天極星: {
    energy: 2,
    phase: "死人",
    desc: "純粋で無欲。精神世界への関心が強く、悟りの境地を持ちます。",
  },
  天庫星: {
    energy: 4,
    phase: "入墓",
    desc: "探究心が強く、先祖や歴史との縁が深いです。忍耐力があります。",
  },
  天馳星: {
    energy: 8,
    phase: "転生",
    desc: "直感力と瞬発力に優れています。多動でじっとしていられません。",
  },
};

// 日干の性格解説
export const NIKKAN_INFO: Record<
  (typeof JIKKAN)[number],
  { name: string; nature: string; desc: string }
> = {
  甲: {
    name: "甲木（こうぼく）",
    nature: "大木",
    desc: "真っ直ぐに伸びる大木のような性格。向上心が強く、リーダーシップがあります。正義感が強く、曲がったことが嫌いです。",
  },
  乙: {
    name: "乙木（おつぼく）",
    nature: "草花",
    desc: "しなやかな草花のような性格。柔軟性があり、環境に適応する力があります。優しく協調性がありますが、芯は強いです。",
  },
  丙: {
    name: "丙火（へいか）",
    nature: "太陽",
    desc: "太陽のように明るく情熱的。周囲を照らし、人を惹きつける魅力があります。行動力があり、積極的にチャレンジします。",
  },
  丁: {
    name: "丁火（ていか）",
    nature: "灯火",
    desc: "ろうそくの炎のように繊細で温かい。知性と感性を併せ持ち、人の心を癒す力があります。内面は情熱的です。",
  },
  戊: {
    name: "戊土（ぼど）",
    nature: "山岳",
    desc: "山のようにどっしりと構える性格。信頼感があり、包容力に優れています。頼りがいがあり、安定感を与えます。",
  },
  己: {
    name: "己土（きど）",
    nature: "田畑",
    desc: "田畑のように豊かで育む力がある性格。面倒見が良く、人を育てる才能があります。謙虚で控えめですが、粘り強いです。",
  },
  庚: {
    name: "庚金（こうきん）",
    nature: "鉄鋼",
    desc: "鋼のように強く鋭い性格。決断力があり、困難に立ち向かう勇気があります。正直で裏表がなく、信念を貫きます。",
  },
  辛: {
    name: "辛金（しんきん）",
    nature: "宝石",
    desc: "宝石のように繊細で美しい感性。完璧主義で、美意識が高いです。プライドが高く、自分の価値を大切にします。",
  },
  壬: {
    name: "壬水（じんすい）",
    nature: "大海",
    desc: "大海のように広くスケールの大きい性格。自由を愛し、束縛を嫌います。知恵があり、物事を大きな視点で捉えます。",
  },
  癸: {
    name: "癸水（きすい）",
    nature: "雨露",
    desc: "雨露のように静かで深い性格。繊細な感受性と洞察力があります。控えめですが、忍耐強く、着実に目標に向かいます。",
  },
};

// 人体星図の位置の説明
export const POSITION_INFO: Record<string, { title: string; desc: string }> = {
  頭: {
    title: "北（頭）",
    desc: "目上・親・精神性を表します。社会での理想や精神的な価値観に関係します。",
  },
  左肩: {
    title: "東（左肩）",
    desc: "初年期・父親との関係を表します。幼少期の環境や人格形成に影響します。",
  },
  胸: {
    title: "中央（胸）",
    desc: "あなた自身の本質を表す最も重要な星です。人生の中心的なテーマを示します。",
  },
  右肩: {
    title: "西（右肩）",
    desc: "晩年期・友人や仲間を表します。社会での人間関係のあり方を示します。",
  },
  腹: {
    title: "南（腹）",
    desc: "子供・部下・現実性を表します。実行力や現実的な行動パターンを示します。",
  },
};

// 型定義
export type Jikkan = (typeof JIKKAN)[number];
export type Junishi = (typeof JUNISHI)[number];
export type Shusei = (typeof JUDAI_SHUSEI)[number];
export type Jusei = (typeof JUNIDAI_JUSEI)[number];

export interface Pillar {
  kan: Jikkan;
  shi: Junishi;
}

export interface Pillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
}

export interface KangoResult {
  exists: boolean;
  pair?: [Jikkan, Jikkan];
  transformed?: GogyoType;
}

export interface Stars {
  north: Shusei;
  center: Shusei;
  south: Shusei;
  east: Shusei;
  west: Shusei;
  jusei: {
    right: Jusei;
    left: Jusei;
    center: Jusei;
  };
}

export interface SanmeiResult {
  pillars: Pillars;
  nikkan: Jikkan;
  kango: KangoResult;
  stars: Stars;
  dominantElement: [GogyoType, number];
  allStars: Shusei[];
}
