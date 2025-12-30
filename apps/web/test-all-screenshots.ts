import { calculateSanmei } from "./src/components/sanmei/calculator";

// 3つのスクリーンショットの検証
const testCases = [
  {
    name: "1994/01/20 女性",
    birthDate: "1994-01-20",
    expected: {
      leftShoulder: "天極星", // 幼少期 (center in jusei)
      rightFoot: "天将星", // 晩年期 (right in jusei)
      leftFoot: "天印星", // 中年期 (left in jusei)
    },
  },
  {
    name: "1997/02/26 女性",
    birthDate: "1997-02-26",
    expected: {
      leftShoulder: "天庫星", // 幼少期
      rightFoot: "天報星", // 晩年期
      leftFoot: "天極星", // 中年期
    },
  },
  {
    name: "1998/07/20 男性",
    birthDate: "1998-07-20",
    expected: {
      leftShoulder: "天貴星", // 幼少期
      rightFoot: "天南星", // 晩年期
      leftFoot: "天堂星", // 中年期
    },
  },
];

console.log("=== 3つのスクリーンショット検証 ===\n");

let allPassed = true;

for (const tc of testCases) {
  const result = calculateSanmei(tc.birthDate, false);

  if (!result) {
    console.log(`【${tc.name}】計算失敗`);
    allPassed = false;
    continue;
  }

  console.log(`【${tc.name}】`);
  console.log(`  年柱: ${result.pillars.year.kan}${result.pillars.year.shi}`);
  console.log(`  月柱: ${result.pillars.month.kan}${result.pillars.month.shi}`);
  console.log(`  日柱: ${result.pillars.day.kan}${result.pillars.day.shi}`);
  console.log("");

  // 十二大従星の検証
  // jusei構造: center=左肩(幼少期), right=右足(晩年期), left=左足(中年期)
  const checks = [
    {
      name: "左肩（幼少期）",
      actual: result.stars.jusei.center,
      expected: tc.expected.leftShoulder,
    },
    { name: "右足（晩年期）", actual: result.stars.jusei.right, expected: tc.expected.rightFoot },
    { name: "左足（中年期）", actual: result.stars.jusei.left, expected: tc.expected.leftFoot },
  ];

  for (const check of checks) {
    const match = check.actual === check.expected;
    const status = match ? "✓" : "✗";
    console.log(`  ${status} ${check.name}: ${check.actual} (期待値: ${check.expected})`);
    if (!match) allPassed = false;
  }

  // 主星も表示
  console.log("");
  console.log("  [十大主星]");
  console.log(`    右肩(伴星): ${result.stars.northWest}`);
  console.log(`    頭(北): ${result.stars.north}`);
  console.log(`    左肩: ${result.stars.jusei.center}`);
  console.log(`    右手(西): ${result.stars.west}`);
  console.log(`    胸(中央): ${result.stars.center}`);
  console.log(`    左手(東): ${result.stars.east}`);
  console.log(`    右足: ${result.stars.jusei.right}`);
  console.log(`    腹(南): ${result.stars.south}`);
  console.log(`    左足: ${result.stars.jusei.left}`);
  console.log("");
  console.log("---");
}

console.log("");
console.log(allPassed ? "✓ すべてのテストに合格しました！" : "✗ 一部のテストが失敗しました");
