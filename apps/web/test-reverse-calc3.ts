import { SANGO_TEIO, SHIGO_MAP } from "./src/components/sanmei/constants";
import { calcJusei } from "./src/components/sanmei/calculator";

// 三合の「墓」位置
const SANGO_BO: Record<string, string> = {
  寅: "戌",
  午: "戌",
  戌: "戌", // 火局の墓
  巳: "丑",
  酉: "丑",
  丑: "丑", // 金局の墓
  申: "辰",
  子: "辰",
  辰: "辰", // 水局の墓
  亥: "未",
  卯: "未",
  未: "未", // 木局の墓
};

console.log("=== 1997/02/26 女性 - 流派A修正版検証 ===");
console.log("日干=己, 年支=丑, 日支=亥\n");

const nikkan = "己";
const yearBranch = "丑";
const dayBranch = "亥";

console.log("流派A修正版のルール:");
console.log("  左肩（幼少期）= 日干 × 年支");
console.log("  右足（晩年期）= 日干 × 日支の三合帝旺位");
console.log("  左足（中年期）= 日干 × 年支の三合墓位\n");

console.log("計算結果:");
console.log(`  左肩: 己×${yearBranch}(年支) = ${calcJusei(nikkan, yearBranch)} (期待値: 天庫星)`);
console.log(
  `  右足: 己×${SANGO_TEIO[dayBranch]}(日支の三合帝旺位) = ${calcJusei(nikkan, SANGO_TEIO[dayBranch])} (期待値: 天報星)`,
);
console.log(
  `  左足: 己×${SANGO_BO[yearBranch]}(年支の三合墓位) = ${calcJusei(nikkan, SANGO_BO[yearBranch])} (期待値: 天極星)`,
);

// 年支の支合相手で計算した場合
console.log("\n元の流派Aルール（年支の支合相手）:");
console.log(
  `  左足: 己×${SHIGO_MAP[yearBranch]}(年支の支合相手) = ${calcJusei(nikkan, SHIGO_MAP[yearBranch])}`,
);

// 期待値の再確認
console.log("\n期待値:");
console.log("  左肩（幼少期）: 天庫星 ← 己×丑(年支)");
console.log("  右足（晩年期）: 天報星 ← 己×卯(日支の三合帝旺位)");
console.log("  左足（中年期）: 天極星 ← 己×子(年支の支合相手)");

console.log("\n結論:");
console.log("流派Aは「年支の支合相手」が正しい、流派A修正版は1994年のみに適用");
console.log("つまり、1994年と1997年のスクショは異なる流派...");

// もう一度1994の検証
console.log("\n\n=== 1994/01/20 - 元の流派A検証 ===");
const nikkan94 = "丙";
const yearBranch94 = "酉";
const dayBranch94 = "午";

console.log(`  左肩: 丙×${yearBranch94}(年支) = ${calcJusei(nikkan94, yearBranch94)}`);
console.log(
  `  右足: 丙×${SANGO_TEIO[dayBranch94]}(日支の三合帝旺位) = ${calcJusei(nikkan94, SANGO_TEIO[dayBranch94])}`,
);
console.log(
  `  左足: 丙×${SHIGO_MAP[yearBranch94]}(年支の支合相手) = ${calcJusei(nikkan94, SHIGO_MAP[yearBranch94])}`,
);
console.log("期待値: 天極星, 天将星, 天印星");

// 何か共通するルールがあるはず
console.log("\n\n=== 全3ケースの共通ルール探索 ===");

// 別のアプローチ：日支の三合墓位
const SANGO_CHOSEI: Record<string, string> = {
  寅: "寅",
  午: "寅",
  戌: "寅", // 火局の長生
  巳: "巳",
  酉: "巳",
  丑: "巳", // 金局の長生
  申: "申",
  子: "申",
  辰: "申", // 水局の長生
  亥: "亥",
  卯: "亥",
  未: "亥", // 木局の長生
};

console.log("\n1994/01/20:");
console.log(`  日支(午)の三合墓位: ${SANGO_BO[dayBranch94]}`);
console.log(
  `  丙×${SANGO_BO[dayBranch94]}(日支の三合墓位) = ${calcJusei(nikkan94, SANGO_BO[dayBranch94])}`,
);
console.log(`  日支(午)の支合相手: ${SHIGO_MAP[dayBranch94]}`);
console.log(
  `  丙×${SHIGO_MAP[dayBranch94]}(日支の支合相手) = ${calcJusei(nikkan94, SHIGO_MAP[dayBranch94])}`,
);

console.log("\n1997/02/26:");
console.log(`  日支(亥)の三合墓位: ${SANGO_BO[dayBranch]}`);
console.log(
  `  己×${SANGO_BO[dayBranch]}(日支の三合墓位) = ${calcJusei(nikkan, SANGO_BO[dayBranch])}`,
);
console.log(`  日支(亥)の支合相手: ${SHIGO_MAP[dayBranch]}`);
console.log(
  `  己×${SHIGO_MAP[dayBranch]}(日支の支合相手) = ${calcJusei(nikkan, SHIGO_MAP[dayBranch])}`,
);
