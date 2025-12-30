import { SANGO_TEIO, SHIGO_MAP, JUNISHI } from "./src/components/sanmei/constants";
import { calcJusei } from "./src/components/sanmei/calculator";

// 1994/01/20 女性
// 日干=丙, 年支=酉, 日支=午
// 期待値: 左肩=天極星, 右足=天将星, 左足=天印星
// 天印星 = 丙×丑

console.log("=== 1994/01/20 - 丑との関係を探る ===\n");

// 丑に関連する全ての支を列挙
console.log("丑に関連する支:");
console.log("  丑の支合相手: 子");
console.log("  丑が属する三合局(金局): 巳酉丑");
console.log("  丑が三合墓の三合局(金局): 巳酉丑");

// 年支(酉)と丑の関係
console.log("\n年支(酉)と丑の関係:");
console.log("  酉も金局(巳酉丑)の一員");
console.log("  丑は金局の「墓」位置");

// 日支(午)と丑の関係
console.log("\n日支(午)と丑の関係:");
console.log("  午は火局(寅午戌)の一員");
console.log("  丑は午とは三合の関係にない");

// 冲（衝突）の関係
const CHUU: Record<string, string> = {
  子: "午",
  午: "子",
  丑: "未",
  未: "丑",
  寅: "申",
  申: "寅",
  卯: "酉",
  酉: "卯",
  辰: "戌",
  戌: "辰",
  巳: "亥",
  亥: "巳",
};

console.log("\n冲の関係:");
console.log(`  年支(酉)の冲: ${CHUU["酉"]}`);
console.log(`  日支(午)の冲: ${CHUU["午"]}`);
console.log(`  丙×${CHUU["午"]}(日支の冲) = ${calcJusei("丙", CHUU["午"])}`);

// 刑の関係
console.log("\n刑の関係（複雑なので省略）");

// 害の関係
const GAI: Record<string, string> = {
  子: "未",
  未: "子",
  丑: "午",
  午: "丑", // ここ！
  寅: "巳",
  巳: "寅",
  卯: "辰",
  辰: "卯",
  申: "亥",
  亥: "申",
  酉: "戌",
  戌: "酉",
};

console.log("\n害の関係:");
console.log(`  年支(酉)の害: ${GAI["酉"]}`);
console.log(`  日支(午)の害: ${GAI["午"]}`);
console.log(`  丙×${GAI["午"]}(日支の害) = ${calcJusei("丙", GAI["午"])}`);

// ビンゴ！日支(午)の害が丑、そして丙×丑=天印星！

console.log("\n\n=== 新しい流派の発見 ===");
console.log("1994/01/20では:");
console.log("  左肩（幼少期）= 日干 × 年支");
console.log("  右足（晩年期）= 日干 × 日支の三合帝旺位");
console.log("  左足（中年期）= 日干 × 日支の害\n");

// 1997/02/26で検証
console.log("1997/02/26で検証:");
const nikkan1997 = "己";
const yearBranch1997 = "丑";
const dayBranch1997 = "亥";

console.log(
  `  左肩: 己×${yearBranch1997}(年支) = ${calcJusei(nikkan1997, yearBranch1997)} (期待値: 天庫星)`,
);
console.log(
  `  右足: 己×${SANGO_TEIO[dayBranch1997]}(日支の三合帝旺位) = ${calcJusei(nikkan1997, SANGO_TEIO[dayBranch1997])} (期待値: 天報星)`,
);
console.log(
  `  左足: 己×${GAI[dayBranch1997]}(日支の害) = ${calcJusei(nikkan1997, GAI[dayBranch1997])} (期待値: 天極星)`,
);

// うーん、1997は流派Aで合っている（年支の支合相手）
// 1994と1997で異なるルールが使われている？

console.log("\n\n=== 3つのスクリーンショットの流派をまとめる ===");
console.log("");
console.log("1994/01/20:");
console.log("  左肩 = 年支 → OK");
console.log("  右足 = 日支の三合帝旺位 → OK");
console.log("  左足 = 日支の害 → OK");
console.log("");
console.log("1997/02/26:");
console.log("  左肩 = 年支 → OK");
console.log("  右足 = 日支の三合帝旺位 → OK");
console.log("  左足 = 年支の支合相手 → OK");
console.log("");
console.log("1998/07/20:");
console.log("  左肩 = 日支 → OK");
console.log("  右足 = 年支の三合帝旺位 → OK");
console.log("  左足 = 日支の支合相手 → OK");
