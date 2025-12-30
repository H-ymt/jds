import { SANGO_TEIO, SHIGO_MAP } from "./src/components/sanmei/constants";
import { calcJusei } from "./src/components/sanmei/calculator";

// 1994/01/20 女性を流派Aで検証
console.log("=== 1994/01/20 女性 - 流派A検証 ===");
console.log("日干=丙, 年支=酉, 日支=午\n");

const nikkan = "丙";
const yearBranch = "酉";
const dayBranch = "午";

console.log("流派Aのルール:");
console.log("  左肩（幼少期）= 日干 × 年支");
console.log("  右足（晩年期）= 日干 × 日支の三合帝旺位");
console.log("  左足（中年期）= 日干 × 年支の支合相手\n");

console.log("流派Aで計算:");
console.log(`  左肩（幼少期）: 丙×${yearBranch}(年支) = ${calcJusei(nikkan, yearBranch)}`);
console.log(
  `  右足（晩年期）: 丙×${SANGO_TEIO[dayBranch]}(日支の三合帝旺位) = ${calcJusei(nikkan, SANGO_TEIO[dayBranch])}`,
);
console.log(
  `  左足（中年期）: 丙×${SHIGO_MAP[yearBranch]}(年支の支合相手) = ${calcJusei(nikkan, SHIGO_MAP[yearBranch])}`,
);

console.log("\n期待値:");
console.log("  左肩（幼少期）: 天極星");
console.log("  右足（晩年期）: 天将星");
console.log("  左足（中年期）: 天印星");

// 天印星を得る支は「丑」
// 丑は何の関係？
console.log("\n\n=== 天印星(丑)の由来を探る ===");
console.log("天印星を得る支: 丑");
console.log("丑は金局(巳酉丑)の一員、年支(酉)も金局の一員");

// 三合の別の支を探す
const SANGO_GROUPS: Record<string, readonly string[]> = {
  火局: ["寅", "午", "戌"],
  金局: ["巳", "酉", "丑"],
  水局: ["申", "子", "辰"],
  木局: ["亥", "卯", "未"],
};

function findSangoGroup(shi: string): string[] | null {
  for (const [name, group] of Object.entries(SANGO_GROUPS)) {
    if (group.includes(shi)) {
      return [...group];
    }
  }
  return null;
}

console.log(`\n年支(酉)が属する三合局: ${findSangoGroup(yearBranch)}`);
console.log(`日支(午)が属する三合局: ${findSangoGroup(dayBranch)}`);

// 三合の「墓」位置（最後の支）
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

console.log(`\n年支(酉)の三合墓位: ${SANGO_BO[yearBranch]}`);
console.log(
  `丙×${SANGO_BO[yearBranch]}(年支の三合墓位) = ${calcJusei(nikkan, SANGO_BO[yearBranch])}`,
);

// 三合の「長生」位置（最初の支）
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

console.log(`年支(酉)の三合長生位: ${SANGO_CHOSEI[yearBranch]}`);
console.log(
  `丙×${SANGO_CHOSEI[yearBranch]}(年支の三合長生位) = ${calcJusei(nikkan, SANGO_CHOSEI[yearBranch])}`,
);

// もしかして流派Aの「左足」は「年支の三合墓位」かも？
console.log("\n\n=== 流派A 修正版 ===");
console.log("左肩（幼少期）= 日干 × 年支");
console.log("右足（晩年期）= 日干 × 日支の三合帝旺位");
console.log("左足（中年期）= 日干 × 年支の三合墓位");

console.log("\n計算結果:");
console.log(`  左肩: 丙×酉 = ${calcJusei(nikkan, yearBranch)} (期待値: 天極星)`);
console.log(`  右足: 丙×午 = ${calcJusei(nikkan, SANGO_TEIO[dayBranch])} (期待値: 天将星)`);
console.log(`  左足: 丙×丑 = ${calcJusei(nikkan, SANGO_BO[yearBranch])} (期待値: 天印星)`);
