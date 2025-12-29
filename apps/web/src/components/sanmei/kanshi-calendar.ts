/**
 * 干支暦データ（かんしれき）
 * 算命学で正確な干支を算出するためのデータ
 */

import type { Jikkan, Junishi } from "./constants";

// ============================================
// 六十花甲子表（ろくじっかこうし）
// 60の干支の組み合わせ
// ============================================
export const ROKUJU_KANSHI: { kan: Jikkan; shi: Junishi }[] = [
  { kan: "甲", shi: "子" }, // 1.  甲子（きのえね）
  { kan: "乙", shi: "丑" }, // 2.  乙丑（きのとうし）
  { kan: "丙", shi: "寅" }, // 3.  丙寅（ひのえとら）
  { kan: "丁", shi: "卯" }, // 4.  丁卯（ひのとう）
  { kan: "戊", shi: "辰" }, // 5.  戊辰（つちのえたつ）
  { kan: "己", shi: "巳" }, // 6.  己巳（つちのとみ）
  { kan: "庚", shi: "午" }, // 7.  庚午（かのえうま）
  { kan: "辛", shi: "未" }, // 8.  辛未（かのとひつじ）
  { kan: "壬", shi: "申" }, // 9.  壬申（みずのえさる）
  { kan: "癸", shi: "酉" }, // 10. 癸酉（みずのととり）
  { kan: "甲", shi: "戌" }, // 11. 甲戌（きのえいぬ）
  { kan: "乙", shi: "亥" }, // 12. 乙亥（きのとい）
  { kan: "丙", shi: "子" }, // 13. 丙子（ひのえね）
  { kan: "丁", shi: "丑" }, // 14. 丁丑（ひのとうし）
  { kan: "戊", shi: "寅" }, // 15. 戊寅（つちのえとら）
  { kan: "己", shi: "卯" }, // 16. 己卯（つちのとう）
  { kan: "庚", shi: "辰" }, // 17. 庚辰（かのえたつ）
  { kan: "辛", shi: "巳" }, // 18. 辛巳（かのとみ）
  { kan: "壬", shi: "午" }, // 19. 壬午（みずのえうま）
  { kan: "癸", shi: "未" }, // 20. 癸未（みずのとひつじ）
  { kan: "甲", shi: "申" }, // 21. 甲申（きのえさる）
  { kan: "乙", shi: "酉" }, // 22. 乙酉（きのととり）
  { kan: "丙", shi: "戌" }, // 23. 丙戌（ひのえいぬ）
  { kan: "丁", shi: "亥" }, // 24. 丁亥（ひのとい）
  { kan: "戊", shi: "子" }, // 25. 戊子（つちのえね）
  { kan: "己", shi: "丑" }, // 26. 己丑（つちのとうし）
  { kan: "庚", shi: "寅" }, // 27. 庚寅（かのえとら）
  { kan: "辛", shi: "卯" }, // 28. 辛卯（かのとう）
  { kan: "壬", shi: "辰" }, // 29. 壬辰（みずのえたつ）
  { kan: "癸", shi: "巳" }, // 30. 癸巳（みずのとみ）
  { kan: "甲", shi: "午" }, // 31. 甲午（きのえうま）
  { kan: "乙", shi: "未" }, // 32. 乙未（きのとひつじ）
  { kan: "丙", shi: "申" }, // 33. 丙申（ひのえさる）
  { kan: "丁", shi: "酉" }, // 34. 丁酉（ひのととり）
  { kan: "戊", shi: "戌" }, // 35. 戊戌（つちのえいぬ）
  { kan: "己", shi: "亥" }, // 36. 己亥（つちのとい）
  { kan: "庚", shi: "子" }, // 37. 庚子（かのえね）
  { kan: "辛", shi: "丑" }, // 38. 辛丑（かのとうし）
  { kan: "壬", shi: "寅" }, // 39. 壬寅（みずのえとら）
  { kan: "癸", shi: "卯" }, // 40. 癸卯（みずのとう）
  { kan: "甲", shi: "辰" }, // 41. 甲辰（きのえたつ）
  { kan: "乙", shi: "巳" }, // 42. 乙巳（きのとみ）
  { kan: "丙", shi: "午" }, // 43. 丙午（ひのえうま）
  { kan: "丁", shi: "未" }, // 44. 丁未（ひのとひつじ）
  { kan: "戊", shi: "申" }, // 45. 戊申（つちのえさる）
  { kan: "己", shi: "酉" }, // 46. 己酉（つちのととり）
  { kan: "庚", shi: "戌" }, // 47. 庚戌（かのえいぬ）
  { kan: "辛", shi: "亥" }, // 48. 辛亥（かのとい）
  { kan: "壬", shi: "子" }, // 49. 壬子（みずのえね）
  { kan: "癸", shi: "丑" }, // 50. 癸丑（みずのとうし）
  { kan: "甲", shi: "寅" }, // 51. 甲寅（きのえとら）
  { kan: "乙", shi: "卯" }, // 52. 乙卯（きのとう）
  { kan: "丙", shi: "辰" }, // 53. 丙辰（ひのえたつ）
  { kan: "丁", shi: "巳" }, // 54. 丁巳（ひのとみ）
  { kan: "戊", shi: "午" }, // 55. 戊午（つちのえうま）
  { kan: "己", shi: "未" }, // 56. 己未（つちのとひつじ）
  { kan: "庚", shi: "申" }, // 57. 庚申（かのえさる）
  { kan: "辛", shi: "酉" }, // 58. 辛酉（かのととり）
  { kan: "壬", shi: "戌" }, // 59. 壬戌（みずのえいぬ）
  { kan: "癸", shi: "亥" }, // 60. 癸亥（みずのとい）
];

// ============================================
// 節入り日時データ
// 各年の各月の節入り日（1900年〜2100年）
// 月は1〜12（1月=小寒、2月=立春...）
// ============================================
export interface SetsuiriData {
  month: number; // 1-12
  day: number; // 節入り日
  hour?: number; // 節入り時刻（時）
  minute?: number; // 節入り時刻（分）
}

// 年ごとの節入りデータ
// キー: 年, 値: 月ごとの節入り日配列
export const SETSUIRI_DATA: Record<number, SetsuiriData[]> = {
  1920: [
    { month: 1, day: 6, hour: 6, minute: 22 }, // 小寒
    { month: 2, day: 5, hour: 0, minute: 3 }, // 立春
    { month: 3, day: 6, hour: 0, minute: 54 }, // 啓蟄
    { month: 4, day: 5, hour: 5, minute: 47 }, // 清明
    { month: 5, day: 6, hour: 5, minute: 27 }, // 立夏
    { month: 6, day: 6, hour: 10, minute: 7 }, // 芒種
    { month: 7, day: 7, hour: 20, minute: 29 }, // 小暑
    { month: 8, day: 8, hour: 6, minute: 16 }, // 立秋
    { month: 9, day: 8, hour: 9, minute: 2 }, // 白露
    { month: 10, day: 8, hour: 12, minute: 52 }, // 寒露
    { month: 11, day: 8, hour: 3, minute: 40 }, // 立冬
    { month: 12, day: 7, hour: 20, minute: 28 }, // 大雪
  ],
  // ※ 他の年のデータは長いため、よく使う年代を優先して追加
};

// ============================================
// 日柱の基準データ
// ある基準日の干支番号（六十花甲子のインデックス0-59）
// ============================================
export interface DayPillarBase {
  year: number;
  month: number;
  day: number;
  kanshiIndex: number; // 六十花甲子のインデックス（0-59）
}

// 基準日データ（複数の基準点を用意）
// 1900年1月1日 = 甲戌（10番目、インデックス10）
// 1950年1月1日 = 癸亥（59番目、インデックス59）
// 1998年1月1日 = 丁巳（53番目、インデックス53）
// 2000年1月1日 = 戊午（54番目、インデックス54）
export const DAY_PILLAR_BASES: DayPillarBase[] = [
  { year: 1900, month: 1, day: 1, kanshiIndex: 10 },
  { year: 1950, month: 1, day: 1, kanshiIndex: 59 },
  { year: 1998, month: 1, day: 1, kanshiIndex: 53 },
  { year: 2000, month: 1, day: 1, kanshiIndex: 54 },
];

// ============================================
// 年柱・月柱の算出用データ
// ============================================

// 年柱の干支（1924年=甲子を基準）
// 1924年は甲子年（インデックス0）
export const YEAR_KANSHI_BASE = {
  year: 1924,
  kanshiIndex: 0, // 甲子
};

// 月柱の干支算出テーブル
// 年干から月干を求めるための対応表
// 年干のインデックス（0-9）に対する、寅月（1月節入り後）の月干インデックス
export const MONTH_KAN_TABLE: Record<number, number> = {
  0: 2, // 甲・己年 → 寅月は丙（インデックス2）
  1: 4, // 乙・庚年 → 寅月は戊（インデックス4）
  2: 6, // 丙・辛年 → 寅月は庚（インデックス6）
  3: 8, // 丁・壬年 → 寅月は壬（インデックス8）
  4: 0, // 戊・癸年 → 寅月は甲（インデックス0）
  5: 2, // 甲・己年（5=己）
  6: 4, // 乙・庚年（6=庚）
  7: 6, // 丙・辛年（7=辛）
  8: 8, // 丁・壬年（8=壬）
  9: 0, // 戊・癸年（9=癸）
};

// 月支は固定（節入り後の月 → 地支）
// 1月節入り後=寅、2月節入り後=卯、...
export const MONTH_SHI_TABLE: Record<number, number> = {
  1: 2, // 1月（立春後）→ 寅
  2: 3, // 2月（啓蟄後）→ 卯
  3: 4, // 3月（清明後）→ 辰
  4: 5, // 4月（立夏後）→ 巳
  5: 6, // 5月（芒種後）→ 午
  6: 7, // 6月（小暑後）→ 未
  7: 8, // 7月（立秋後）→ 申
  8: 9, // 8月（白露後）→ 酉
  9: 10, // 9月（寒露後）→ 戌
  10: 11, // 10月（立冬後）→ 亥
  11: 0, // 11月（大雪後）→ 子
  12: 1, // 12月（小寒後）→ 丑
};

// ============================================
// 節気名
// ============================================
export const SEKKI_NAMES = [
  "小寒", // 1月
  "立春", // 2月
  "啓蟄", // 3月
  "清明", // 4月
  "立夏", // 5月
  "芒種", // 6月
  "小暑", // 7月
  "立秋", // 8月
  "白露", // 9月
  "寒露", // 10月
  "立冬", // 11月
  "大雪", // 12月
] as const;

// ============================================
// ヘルパー関数
// ============================================

/**
 * 六十花甲子のインデックスから干支を取得
 */
export function getKanshiFromIndex(index: number): { kan: Jikkan; shi: Junishi } {
  const normalizedIndex = ((index % 60) + 60) % 60;
  return ROKUJU_KANSHI[normalizedIndex];
}

/**
 * 干と支から六十花甲子のインデックスを取得
 */
export function getIndexFromKanshi(kan: Jikkan, shi: Junishi): number {
  const kanIndex = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"].indexOf(kan);
  const shiIndex = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"].indexOf(
    shi,
  );

  // 干と支の組み合わせが有効かチェック（陽干は陽支、陰干は陰支のみ）
  if (kanIndex % 2 !== shiIndex % 2) {
    throw new Error(`Invalid kanshi combination: ${kan}${shi}`);
  }

  // 60干支の中での位置を計算
  for (let i = 0; i < 60; i++) {
    if (ROKUJU_KANSHI[i].kan === kan && ROKUJU_KANSHI[i].shi === shi) {
      return i;
    }
  }

  throw new Error(`Kanshi not found: ${kan}${shi}`);
}

/**
 * 2つの日付間の日数を計算
 */
export function daysBetween(
  year1: number,
  month1: number,
  day1: number,
  year2: number,
  month2: number,
  day2: number,
): number {
  const date1 = new Date(year1, month1 - 1, day1);
  const date2 = new Date(year2, month2 - 1, day2);
  return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 指定された年月日の日柱インデックスを計算
 */
export function calcDayKanshiIndex(year: number, month: number, day: number): number {
  const base = DAY_PILLAR_BASES[0]; // 1900年1月1日 = 甲戌（index 10）
  const days = daysBetween(base.year, base.month, base.day, year, month, day);
  return (((base.kanshiIndex + days) % 60) + 60) % 60;
}
