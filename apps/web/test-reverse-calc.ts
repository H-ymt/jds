import {
  JUSEI_TABLE,
  SANGO_TEIO,
  SHIGO_MAP,
  JUNISHI,
  JIKKAN,
} from "./src/components/sanmei/constants";
import { calcJusei } from "./src/components/sanmei/calculator";

// 逆算: 日干と従星から、使用された十二支を特定する
function findBranchForJusei(
  nikkan: (typeof JIKKAN)[number],
  targetJusei: string,
): (typeof JUNISHI)[number][] {
  const results: (typeof JUNISHI)[number][] = [];
  for (const shi of JUNISHI) {
    const jusei = calcJusei(nikkan, shi);
    if (jusei === targetJusei) {
      results.push(shi);
    }
  }
  return results;
}

console.log("=== 1994/01/20 女性 逆算 ===");
console.log("年柱: 癸酉, 月柱: 甲寅, 日柱: 丙午");
console.log("日干=丙, 年支=酉, 日支=午\n");

const nikkan1994 = "丙";
const yearBranch1994 = "酉";
const dayBranch1994 = "午";

console.log("期待値:");
console.log("  左肩（幼少期）: 天極星");
console.log("  右足（晩年期）: 天将星");
console.log("  左足（中年期）: 天印星\n");

console.log("天極星を得る支: ", findBranchForJusei(nikkan1994, "天極星"));
console.log("天将星を得る支: ", findBranchForJusei(nikkan1994, "天将星"));
console.log("天印星を得る支: ", findBranchForJusei(nikkan1994, "天印星"));

console.log("\n各支の関連情報:");
console.log(`  年支(酉)の三合帝旺位: ${SANGO_TEIO[yearBranch1994]}`);
console.log(`  年支(酉)の支合相手: ${SHIGO_MAP[yearBranch1994]}`);
console.log(`  日支(午)の三合帝旺位: ${SANGO_TEIO[dayBranch1994]}`);
console.log(`  日支(午)の支合相手: ${SHIGO_MAP[dayBranch1994]}`);

console.log("\n丙×各支の従星:");
console.log(`  丙×酉(年支): ${calcJusei(nikkan1994, yearBranch1994)}`);
console.log(`  丙×午(日支): ${calcJusei(nikkan1994, dayBranch1994)}`);
console.log(
  `  丙×${SANGO_TEIO[yearBranch1994]}(年支の三合帝旺位): ${calcJusei(nikkan1994, SANGO_TEIO[yearBranch1994])}`,
);
console.log(
  `  丙×${SHIGO_MAP[yearBranch1994]}(年支の支合相手): ${calcJusei(nikkan1994, SHIGO_MAP[yearBranch1994])}`,
);
console.log(
  `  丙×${SANGO_TEIO[dayBranch1994]}(日支の三合帝旺位): ${calcJusei(nikkan1994, SANGO_TEIO[dayBranch1994])}`,
);
console.log(
  `  丙×${SHIGO_MAP[dayBranch1994]}(日支の支合相手): ${calcJusei(nikkan1994, SHIGO_MAP[dayBranch1994])}`,
);

console.log("\n\n=== 1997/02/26 女性 逆算 ===");
console.log("年柱: 丁丑, 月柱: 壬寅, 日柱: 己亥");
console.log("日干=己, 年支=丑, 日支=亥\n");

const nikkan1997 = "己";
const yearBranch1997 = "丑";
const dayBranch1997 = "亥";

console.log("期待値:");
console.log("  左肩（幼少期）: 天庫星");
console.log("  右足（晩年期）: 天報星");
console.log("  左足（中年期）: 天極星\n");

console.log("天庫星を得る支: ", findBranchForJusei(nikkan1997, "天庫星"));
console.log("天報星を得る支: ", findBranchForJusei(nikkan1997, "天報星"));
console.log("天極星を得る支: ", findBranchForJusei(nikkan1997, "天極星"));

console.log("\n各支の関連情報:");
console.log(`  年支(丑)の三合帝旺位: ${SANGO_TEIO[yearBranch1997]}`);
console.log(`  年支(丑)の支合相手: ${SHIGO_MAP[yearBranch1997]}`);
console.log(`  日支(亥)の三合帝旺位: ${SANGO_TEIO[dayBranch1997]}`);
console.log(`  日支(亥)の支合相手: ${SHIGO_MAP[dayBranch1997]}`);

console.log("\n己×各支の従星:");
console.log(`  己×丑(年支): ${calcJusei(nikkan1997, yearBranch1997)}`);
console.log(`  己×亥(日支): ${calcJusei(nikkan1997, dayBranch1997)}`);
console.log(
  `  己×${SANGO_TEIO[yearBranch1997]}(年支の三合帝旺位): ${calcJusei(nikkan1997, SANGO_TEIO[yearBranch1997])}`,
);
console.log(
  `  己×${SHIGO_MAP[yearBranch1997]}(年支の支合相手): ${calcJusei(nikkan1997, SHIGO_MAP[yearBranch1997])}`,
);
console.log(
  `  己×${SANGO_TEIO[dayBranch1997]}(日支の三合帝旺位): ${calcJusei(nikkan1997, SANGO_TEIO[dayBranch1997])}`,
);
console.log(
  `  己×${SHIGO_MAP[dayBranch1997]}(日支の支合相手): ${calcJusei(nikkan1997, SHIGO_MAP[dayBranch1997])}`,
);

console.log("\n\n=== 1998/07/20 男性 (流派B・現在の実装で正解) ===");
console.log("年柱: 戊寅, 月柱: 己未, 日柱: 戊辰");
console.log("日干=戊, 年支=寅, 日支=辰\n");

const nikkan1998 = "戊";
const yearBranch1998 = "寅";
const dayBranch1998 = "辰";

console.log("期待値（正解）:");
console.log("  左肩（幼少期）: 天貴星");
console.log("  右足（晩年期）: 天南星");
console.log("  左足（中年期）: 天堂星\n");

console.log("\n戊×各支の従星:");
console.log(`  戊×辰(日支): ${calcJusei(nikkan1998, dayBranch1998)}`);
console.log(`  戊×寅(年支): ${calcJusei(nikkan1998, yearBranch1998)}`);
console.log(
  `  戊×${SANGO_TEIO[yearBranch1998]}(年支の三合帝旺位): ${calcJusei(nikkan1998, SANGO_TEIO[yearBranch1998])}`,
);
console.log(
  `  戊×${SHIGO_MAP[dayBranch1998]}(日支の支合相手): ${calcJusei(nikkan1998, SHIGO_MAP[dayBranch1998])}`,
);

console.log("\n現在の実装（流派B）:");
console.log("  左肩（幼少期）= 日干 × 日支");
console.log("  右足（晩年期）= 日干 × 年支の三合帝旺位");
console.log("  左足（中年期）= 日干 × 日支の支合相手");
