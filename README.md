# 猫星ミラージュ占譜

姓名判断、星の暦、猫タロットを重ねて今日の流れを読む、スマホ縦画面向けのエンタメ占いWebアプリです。

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vercel deployment ready

## Local Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run lint
npm run build
npm run start
```

## Environment Variables

VercelのProject Settings > Environment Variablesで以下を設定します。

```bash
NEXT_PUBLIC_SITE_URL=https://cat-mirage-oracle.vercel.app
```

アフィリエイトリンクを差し替える場合は、ASPで承認されたURLを以下に設定します。未設定の場合は、サイト内のガイド・読み物ページへ誘導します。

```bash
NEXT_PUBLIC_AFFILIATE_TOP_URL=
NEXT_PUBLIC_AFFILIATE_RESULT_URL=
NEXT_PUBLIC_AFFILIATE_ARCHIVE_URL=
```

## Current Features

- 姓名判断、星の暦、猫タロットによる複合鑑定
- 生年月日の手入力
- 今日の一枚
- 今日の猫星ランキング
- 鑑定結果の保存
- 占い帳・お気に入り
- SNS共有文・共有画像生成
- 猫タロット図鑑
- 12星座猫図鑑
- 読み物・ガイドページ
- privacy / terms / contact
- robots.txt / sitemap.xml

## Affiliate Integration Points

PR・推薦枠は `components/AdBanner.tsx` で管理しています。既存の呼び出しを壊さないためコンポーネント名は `AdBanner` のままですが、内部表示はアフィリエイト向けの推薦枠です。

現在のvariant:

- `top-sticky`: 画面上部の推薦枠
- `result-inline`: 鑑定結果下の推薦枠
- `archive-inline`: 占い帳・履歴付近の推薦枠

ASPリンクを設定した場合、リンクには `rel="sponsored nofollow noopener noreferrer"` が付きます。未設定の場合は内部ページへ誘導します。

## Affiliate Disclosure

PR開示文は `components/AffiliateDisclosure.tsx` で管理しています。トップページ下部と共通フッター、privacy / terms にもアフィリエイトリンク利用の説明を記載しています。

## Vercel Deploy Settings

- Framework Preset: Next.js
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: 未設定のまま
- Root Directory: `package.json` があるディレクトリ

## Pre-Release Checklist

- [ ] `npm install` が通る
- [ ] `npm run lint` が通る
- [ ] `npm run build` が通る
- [ ] Vercelに `NEXT_PUBLIC_SITE_URL` を設定する
- [ ] ASPリンクを入れる場合は承認済みURLだけを使う
- [ ] PR表記が表示されていることを確認する
- [ ] `/privacy` `/terms` `/contact` を確認する
- [ ] `/robots.txt` `/sitemap.xml` を確認する

## Legal Notes

占い結果はエンタメ用途です。医療、法律、投資、契約、進路など重大な判断の根拠にしないでください。鑑定履歴はブラウザのlocalStorageに保存されます。一部ページにはPR・アフィリエイトリンクを掲載する場合があります。
