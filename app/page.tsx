import { createPageMetadata } from "@/lib/seo";
import { AppShell } from "@/components/AppShell";

export const metadata = createPageMetadata({
  title: "猫星ミラージュ占譜",
  description: "名前と生年月日、星の暦、猫タロットを重ねて、今日の気分や行動のヒントを読むエンタメ占いWebアプリです。",
  path: "/",
});

export default function Home() {
  return <AppShell />;
}
