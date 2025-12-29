# JDS - 算命学 Web アプリケーション

算命学（Sanmeigaku）の複雑な計算ロジックを自動化し、初心者にもわかりやすい解説付きのモダンな UI で提供する Web アプリケーションです。生年月日から陰占・陽占・人体星図を算出し、性格や運勢を診断します。

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Hono, TRPC, and more.

## 主な機能 (Main Features)

### コア機能
- **陰占算出** - 生年月日から年柱・月柱・日柱の干支を自動算出
- **陽占（人体星図）** - 十大主星と十二大従星による性格・才能の可視化
- **干合変化（化気法）** - 干合ペアの検知と変化後の星図再計算
- **日干解説** - 各日干の性格特徴と自然物の対応付け

### 将来の拡張予定
- **AI による運勢解説** - LLM を活用した個別化された性格・運勢の詳細解説
- **相性診断モード** - 二人の命式を比較して相性を診断
- **運気カレンダー** - 大運・年運による時系列での運気推移の可視化

詳細は [docs/202512291600_要件定義書_v1.0.0.md](docs/202512291600_要件定義書_v1.0.0.md) を参照してください。

## 技術スタック (Technology Stack)

- **TypeScript** - 型安全性と開発者体験の向上
- **Next.js 16** - App Router を使用したフルスタック React フレームワーク
- **React 19** - React Compiler 対応
- **TailwindCSS 4** - ユーティリティファースト CSS フレームワーク
- **shadcn/ui** - 再利用可能な UI コンポーネント
- **Hono** - 軽量で高性能なサーバーフレームワーク
- **tRPC** - エンドツーエンドの型安全な API
- **Drizzle ORM** - TypeScript ファーストの ORM
- **PostgreSQL** - データベースエンジン
- **Turborepo** - モノレポビルドシステム
- **Oxlint + Oxfmt** - 高速なリンティング・フォーマッティング
- **Husky** - Git フックによるコード品質管理
- **Vitest** - 高速なユニットテストフレームワーク

## はじめに (Getting Started)

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. データベースのセットアップ

このプロジェクトは PostgreSQL と Drizzle ORM を使用します。

1. PostgreSQL データベースを準備してください
2. `apps/server/.env` ファイルに PostgreSQL の接続情報を設定してください

3. データベーススキーマを適用:

```bash
pnpm run db:push
```

### 3. 開発サーバーの起動

```bash
pnpm run dev
```

Web アプリケーション: [http://localhost:3001](http://localhost:3001)  
API サーバー: [http://localhost:3000](http://localhost:3000)

## プロジェクト構成 (Project Structure)

```
jds/
├── apps/
│   ├── web/         # フロントエンド (Next.js)
│   │                # 算命学鑑定の UI・入力フォーム・結果表示
│   └── server/      # バックエンド API (Hono, tRPC)
│                    # API エンドポイント・ビジネスロジック
├── packages/
│   ├── api/         # API レイヤー・ビジネスロジック
│   ├── db/          # データベーススキーマ・クエリ (Drizzle)
│   ├── config/      # 共有設定ファイル
│   └── env/         # 環境変数の型定義・検証
├── docs/            # プロジェクトドキュメント
│   ├── 202512291600_要件定義書_v1.0.0.md
│   ├── 202512291930_AI運勢解説機能.md
│   ├── 202512291930_相性診断機能.md
│   └── 202512291930_運気カレンダー機能.md
```

## 利用可能なスクリプト (Available Scripts)

### 開発
- `pnpm run dev` - すべてのアプリケーションを開発モードで起動
- `pnpm run dev:web` - Web アプリケーションのみ起動
- `pnpm run dev:server` - API サーバーのみ起動

### ビルド・型チェック
- `pnpm run build` - すべてのアプリケーションをビルド
- `pnpm run check-types` - 全プロジェクトの TypeScript 型チェック

### データベース
- `pnpm run db:push` - データベーススキーマの変更を適用
- `pnpm run db:studio` - Drizzle Studio でデータベースを管理
- `pnpm run db:generate` - マイグレーションファイルを生成
- `pnpm run db:migrate` - マイグレーションを実行

### コード品質
- `pnpm run check` - Oxlint でリント＆フォーマット

### テスト
- `cd apps/web && pnpm run test` - Web アプリケーションのテストを実行
- `cd apps/web && pnpm run test:coverage` - カバレッジ付きでテスト実行

## 算命学について (About Sanmeigaku)

算命学は中国発祥の占術で、生年月日から個人の宿命や性格、運勢を読み解く学問です。このアプリケーションは以下の計算を自動化します:

- **陰占（いんせん）**: 年柱・月柱・日柱の干支算出
- **蔵干（ぞうかん）**: 地支から天干を取得
- **陽占（ようせん）**: 人体星図による十大主星・十二大従星の配置
- **干合変化（かんごうへんか）**: 天干の組み合わせによる五行変化

## ライセンス

このプロジェクトは個人開発プロジェクトです。
