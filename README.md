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

VercelのProject Settings > Environment Variablesで以下を設定してください。

```bash
NEXT_PUBLIC_SITE_URL=https://cat-mirage-oracle.vercel.app
```

独自ドメインを設定した後は、値を本番ドメインに変更してください。

## Vercel Deploy Settings

- Framework Preset: Next.js
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: 未設定のまま
- Node.js Version: VercelのNext.js推奨バージョン

## Current Features

- 姓名判断、星の暦、猫タロットの複合鑑定
- 生年月日の手入力
- 鑑定結果の保存
- 今日の鑑定履歴
- 保存履歴の詳細モーダル
- SNS共有文の生成
- 猫タロットカード画像表示
- ダミー広告枠
- プライバシーポリシー、利用規約、免責事項、お問い合わせページ
- robots.txt / sitemap.xml

## Ad Integration Points

広告コンポーネントは `components/AdBanner.tsx` です。

現在のvariant:

- `top-sticky`: 画面上部の常時広告枠
- `result-inline`: 鑑定結果下のインライン広告枠
- `archive-inline`: 鑑定履歴付近のインライン広告枠

現時点では本広告IDは入れていません。AdSense/AdMob等の審査後に、`AdBanner` 内のダミー表示を広告タグへ差し替えてください。

広告非表示の将来対応用として、以下のlocalStorageフラグを参照しています。

```js
localStorage.setItem("cat_mirage_ad_free", "true")
```

## Legal Notes

占い結果はエンタメ用途です。医療、法律、投資、人生上の重大判断の根拠にしないでください。鑑定履歴はブラウザのlocalStorageに保存されます。将来広告配信を導入した場合、Cookieや広告識別情報が使われる可能性があります。

## Pre-Release Checklist

- [ ] `npm install` が通る
- [ ] `npm run lint` が通る
- [ ] `npm run build` が通る
- [ ] Vercelに `NEXT_PUBLIC_SITE_URL` を設定する
- [ ] `/privacy` を確認する
- [ ] `/terms` を確認する
- [ ] `/disclaimer` を確認する
- [ ] `/contact` を確認する
- [ ] `/robots.txt` が本番URLを参照していることを確認する
- [ ] `/sitemap.xml` に本番URLのページ一覧が出ることを確認する
- [ ] 問い合わせ先を公開前に必要に応じて差し替える
- [ ] 本広告IDを入れない状態で公開審査に出す

## Post-Release Check URLs

- `https://cat-mirage-oracle.vercel.app/`
- `https://cat-mirage-oracle.vercel.app/privacy`
- `https://cat-mirage-oracle.vercel.app/terms`
- `https://cat-mirage-oracle.vercel.app/disclaimer`
- `https://cat-mirage-oracle.vercel.app/contact`
- `https://cat-mirage-oracle.vercel.app/robots.txt`
- `https://cat-mirage-oracle.vercel.app/sitemap.xml`
