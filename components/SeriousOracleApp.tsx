"use client";

import { useEffect, useMemo, useState } from "react";
import { AdBanner } from "./AdBanner";
import {
  createReading,
  getDailyPrompt,
  getDateKey,
  normalizeBirthDate,
  type OracleProfile,
  type ReadingTheme,
  type SeriousReading,
  type TarotDraw,
} from "@/lib/seriousOracle";

const profileStorageKey = "serious-oracle-profile";
const readingsStorageKey = "serious-oracle-readings";
const streakStorageKey = "serious-oracle-streak";
const maxSavedReadings = 20;

type DailyStreak = {
  lastDateKey: string;
  streak: number;
};

const defaultProfile: OracleProfile = {
  birthDate: "1995/01/01",
  name: "",
  theme: "love",
};

const themeOptions: { id: ReadingTheme; label: string; caption: string }[] = [
  { id: "love", label: "恋愛", caption: "縁と選択" },
  { id: "work", label: "仕事", caption: "転機と評価" },
  { id: "money", label: "金運", caption: "循環と管理" },
  { id: "relation", label: "対人", caption: "距離と信頼" },
  { id: "self", label: "自己", caption: "本音と整理" },
];

const englishArcana: Record<string, string> = {
  教皇: "THE HIEROPHANT",
  愚者: "THE FOOL",
  魔術師: "THE MAGICIAN",
  女教皇: "THE HIGH PRIESTESS",
  女帝: "THE EMPRESS",
  皇帝: "THE EMPEROR",
  恋人: "THE LOVERS",
  戦車: "THE CHARIOT",
  力: "STRENGTH",
  隠者: "THE HERMIT",
  運命の輪: "WHEEL OF FORTUNE",
  正義: "JUSTICE",
  吊るされた猫: "THE HANGED CAT",
  死神: "DEATH",
  節制: "TEMPERANCE",
  悪魔: "THE DEVIL",
  塔: "THE TOWER",
  星: "THE STAR",
  月: "THE MOON",
  太陽: "THE SUN",
  審判: "JUDGEMENT",
  世界: "THE WORLD",
};

const tarotImageByArcana: Record<string, string> = {
  教皇: "/tarot/hierophant-cat.png",
  愚者: "/tarot/fool-cat.png",
  魔術師: "/tarot/magician-cat.png",
  女教皇: "/tarot/high-priestess-cat.png",
  女帝: "/tarot/empress-cat.png",
  皇帝: "/tarot/emperor-cat.png",
  恋人: "/tarot/lovers-cat.png",
  戦車: "/tarot/chariot-cat.png",
  力: "/tarot/strength-cat.png",
  隠者: "/tarot/hermit-cat.png",
  運命の輪: "/tarot/wheel-of-fortune-cat.png",
  正義: "/tarot/justice-cat.png",
  吊るされた猫: "/tarot/hanged-cat.png",
  死神: "/tarot/death-cat.png",
  節制: "/tarot/temperance-cat.png",
  悪魔: "/tarot/devil-cat.png",
  塔: "/tarot/tower-cat.png",
  星: "/tarot/star-cat.png",
  月: "/tarot/moon-cat.png",
  太陽: "/tarot/sun-cat.png",
  審判: "/tarot/judgement-cat.png",
  世界: "/tarot/world-cat.png",
};

type TarotMeaning = {
  essence: string;
  light: string;
  shadow: string;
  advice: string;
};

const tarotMeanings: Record<string, TarotMeaning> = {
  "THE HIEROPHANT": {
    essence: "受け継がれてきた知恵と、信頼できる導きのカードです。ひとりで答えを抱え込まず、先人の言葉や基本に戻ることで道が見えてきます。",
    light: "迷っていたことに、経験者の助言や昔からの型が安心感を与えてくれます。礼儀や約束を大切にすると、周囲との信頼も整いやすい日です。",
    shadow: "正しさや常識に寄りすぎると、自分の本音を小さく扱ってしまうかもしれません。守るべき型と、変えてよい型を分けて考えてください。",
    advice: "今日は信頼できる人の意見をひとつ聞き、すぐに結論を出さず、自分の感覚と照らし合わせてから選んでください。",
  },
  "THE FOOL": {
    essence: "まだ名前のついていない始まり。根拠よりも直感が先に道を知っています。",
    light: "予定外の誘いや小さな寄り道が、停滞していた気分をほどいてくれます。",
    shadow: "自由さが強く出るほど、約束や時間の扱いが少し雑になりやすい日です。",
    advice: "最初の一歩だけ決めて、完璧な計画は明日に回しても大丈夫です。",
  },
  "THE MAGICIAN": {
    essence: "言葉・道具・タイミングがそろうカード。思っているより準備は整っています。",
    light: "ひとつの連絡、ひとつの提案が場の空気を動かすきっかけになります。",
    shadow: "器用に見せようとしすぎると、本音が少し伝わりにくくなります。",
    advice: "今日の勝ち筋は説明力です。短く、はっきり、あなたの望みを言葉にしてください。",
  },
  "THE HIGH PRIESTESS": {
    essence: "静かな直感と観察のカード。表に出ていない情報が、すでにあなたへ届いています。",
    light: "急がず見守ることで、相手の本心や状況の輪郭が自然に見えてきます。",
    shadow: "考えすぎると、ただの沈黙まで意味深に読みすぎてしまいそうです。",
    advice: "返事を急がず、一晩置く選択が運を守ります。",
  },
  "THE EMPRESS": {
    essence: "育つもの、満ちるもの、美しさを受け取るカードです。",
    light: "あなたが手をかけてきたものに、やわらかい反応や成果が返ってきます。",
    shadow: "与えすぎや抱え込みすぎには注意。優しさにも余白が必要です。",
    advice: "部屋、服、言葉のどれかを少し整えると、流れが上向きます。",
  },
  "THE EMPEROR": {
    essence: "境界線と決断のカード。曖昧だったものに形を与える力があります。",
    light: "ルールや優先順位を決めるほど、周囲も安心して動きやすくなります。",
    shadow: "正しさを急ぐと、近くにいる人の小さな不安を見落としやすくなります。",
    advice: "今日はひとつだけ、守る基準を決めてください。",
  },
  "THE LOVERS": {
    essence: "選択と響き合いのカード。心が向くものには、ちゃんと理由があります。",
    light: "素直な好意や共感が、関係を自然に近づけてくれます。",
    shadow: "相手に合わせすぎると、自分の望みが薄くなりそうです。",
    advice: "迷ったら、失いたくない感覚のほうを選んでください。",
  },
  "THE CHARIOT": {
    essence: "前進と突破のカード。まだ不安があっても、動きながら整える日です。",
    light: "勢いをつけることで、考えていたより早く状況が進みます。",
    shadow: "勝ち負けに意識が寄ると、目的そのものを忘れやすくなります。",
    advice: "午前中に一件だけ片づけると、その後の流れが加速します。",
  },
  STRENGTH: {
    essence: "強さを優しさで扱うカード。無理に押さえ込むより、なだめる力が効きます。",
    light: "焦らず接することで、相手や自分の頑なさが少し緩みます。",
    shadow: "我慢を美徳にしすぎると、あとで疲れが出やすくなります。",
    advice: "深呼吸してから返す。その数秒が今日の守護になります。",
  },
  "THE HERMIT": {
    essence: "内側の灯りを探すカード。静かな時間に、次の答えが浮かびます。",
    light: "ひとりで考える時間が、不要な迷いを減らしてくれます。",
    shadow: "距離を置きすぎると、助けてくれる人の声まで遠ざけてしまいそうです。",
    advice: "通知を切る時間を短く作り、自分の本音をメモしてください。",
  },
  "WHEEL OF FORTUNE": {
    essence: "流れの反転と巡り合わせのカード。偶然が少し濃くなる日です。",
    light: "止まっていた話や出会いが、別の形で動き直す可能性があります。",
    shadow: "流れ任せにしすぎると、選べる場面まで見送ってしまいます。",
    advice: "来た話には一度だけ乗ってみる。判断はそのあとで十分です。",
  },
  JUSTICE: {
    essence: "均衡と真実のカード。感情と事実を分けるほど答えが澄みます。",
    light: "誠実な確認や条件の見直しが、関係や仕事を安定させます。",
    shadow: "正論だけで押すと、やわらかい部分が置き去りになりそうです。",
    advice: "今日の判断は、紙に書いて比べるとぶれません。",
  },
  "THE HANGED CAT": {
    essence: "視点を反転させるカード。止まって見える時間にも意味があります。",
    light: "急がないことで、今まで気づかなかった抜け道が見つかります。",
    shadow: "待つことと諦めることを混同しやすいので、期限だけは決めてください。",
    advice: "いつもと逆の順番で行動すると、発見があります。",
  },
  DEATH: {
    essence: "終わりと再生のカード。古い役割を脱ぐことで、次の姿が始まります。",
    light: "手放したあとに、軽さと新しい余白が戻ってきます。",
    shadow: "変化を怖がるほど、不要なものまで守りたくなります。",
    advice: "ひとつ削る、ひとつ捨てる。それが今日の開運行動です。",
  },
  TEMPERANCE: {
    essence: "調和と回復のカード。違うものを混ぜるほど、ちょうどよさが生まれます。",
    light: "対立していた気持ちや予定が、無理なくひとつの形にまとまります。",
    shadow: "合わせすぎると、自分のペースが薄くなります。",
    advice: "白黒を急がず、第三案を探してください。",
  },
  "THE DEVIL": {
    essence: "執着と魅力のカード。強く惹かれるものほど、扱い方が鍵になります。",
    light: "本音の欲望を認めることで、隠れていたエネルギーが戻ります。",
    shadow: "やめたい習慣や関係に、今日だけと理由をつけやすい日です。",
    advice: "欲しいものを書き出し、代わりに失うものも隣に書いてください。",
  },
  "THE TOWER": {
    essence: "目覚めと刷新のカード。壊れるものは、もともと窮屈だった構造かもしれません。",
    light: "はっきりした出来事によって、迷いが一気に整理されます。",
    shadow: "驚きで反射的に動くと、余計な言葉が出やすくなります。",
    advice: "反応する前に水を飲む。今日の衝動は少し寝かせてください。",
  },
  "THE STAR": {
    essence: "希望と浄化のカード。遠くの光が、今のあなたを静かに導きます。",
    light: "素直な願いを口にすると、応援やヒントが集まりやすくなります。",
    shadow: "理想が高すぎると、すでにある回復を見落とします。",
    advice: "小さな願いをひとつだけ、現実の予定に入れてください。",
  },
  "THE MOON": {
    essence: "夢、揺らぎ、見えない感情のカード。曖昧さの中に大事なサインがあります。",
    light: "直感や夢の断片が、言葉になる前の答えを教えてくれます。",
    shadow: "不安が強いと、相手の沈黙を悪い方向へ読んでしまいそうです。",
    advice: "夜の判断は保留。朝の自分にもう一度聞いてください。",
  },
  "THE SUN": {
    essence: "祝福と開放のカード。隠さない明るさが運を押し上げます。",
    light: "素直な表現や笑顔が、人との距離を一気に近づけます。",
    shadow: "楽観しすぎて細部の確認を飛ばしやすい点だけ注意です。",
    advice: "今日は褒め言葉を出し惜しみしないでください。",
  },
  JUDGEMENT: {
    essence: "呼び戻しと再評価のカード。過去の選択に新しい意味が戻ってきます。",
    light: "一度途切れた話、昔の努力、眠っていた才能が再び動きます。",
    shadow: "過去の後悔を責め始めると、今のチャンスを見落とします。",
    advice: "やり直したいことに、短い連絡か小さな再開を。",
  },
  "THE WORLD": {
    essence: "完成と統合のカード。ばらばらだった経験が、ひとつの景色になります。",
    light: "一区切りを迎え、次の段階へ進む準備が整っています。",
    shadow: "完成にこだわりすぎると、祝うタイミングを逃しそうです。",
    advice: "終わったことをきちんと認め、自分に小さなご褒美を。",
  },
};

const fallbackMeaning: TarotMeaning = {
  essence: "まだ輪郭の薄いカードです。いまは意味を決めつけず、心に残った言葉を拾ってください。",
  light: "小さな違和感や偶然の一致が、今日の流れを教えてくれます。",
  shadow: "深読みしすぎると、本来の軽さが失われやすくなります。",
  advice: "一番気になった一文だけを、今日の合図として持ち歩いてください。",
};

const positionReadings: Record<string, { label: string; lead: string }> = {
  過去: {
    label: "過去からの影響",
    lead: "このカードは、最近まであなたの選択を静かに形づくっていた記憶や癖を示します。",
  },
  現在: {
    label: "現在の核心",
    lead: "このカードは、いま目の前で起きている出来事の中心にあるテーマを示します。",
  },
  近未来: {
    label: "近未来の兆し",
    lead: "このカードは、数日から数週間のあいだに表面化しやすい流れを示します。",
  },
};

function getTarotMeaning(english: string) {
  return tarotMeanings[english] ?? fallbackMeaning;
}

function getPositionReading(position: string) {
  if (position.includes("過去")) return positionReadings.過去;
  if (position.includes("現在")) return positionReadings.現在;
  if (position.includes("近未来")) return positionReadings.近未来;
  return { label: position, lead: "この位置に出たカードは、今日のあなたに必要な視点を示します。" };
}

function formatReadingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getDateKeyFromValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getDateKey();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function normalizeSavedReadings(value: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is SeriousReading => Boolean(item && typeof item === "object"))
      .map((item) => ({
        ...item,
        id: item.id || `saved-${item.createdAt || Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: item.createdAt || new Date().toISOString(),
        dateKey: item.dateKey || getDateKeyFromValue(item.createdAt || new Date().toISOString()),
        tarot: Array.isArray(item.tarot) ? item.tarot : [],
      }))
      .slice(0, maxSavedReadings);
  } catch {
    return [];
  }
}

function getCardLine(reading: SeriousReading) {
  const cards = Array.isArray(reading.tarot) ? reading.tarot : [];
  return cards.length > 0 ? cards.map((card) => card.arcana).join(" / ") : "カード記録なし";
}

function buildShareText(reading: SeriousReading) {
  return [
    "猫星ミラージュ占譜",
    `${reading.themeLabel} ${reading.score}点`,
    reading.headline,
    `猫タロット: ${getCardLine(reading)}`,
    reading.affirmation,
  ].join("\n");
}

function buildXShareUrl(reading: SeriousReading) {
  const url = typeof window !== "undefined" ? window.location.origin : "https://cat-mirage-oracle.vercel.app";
  const text = [
    buildShareText(reading),
    "",
    "#猫星ミラージュ占譜 #猫タロット #占い",
  ].join("\n");
  const params = new URLSearchParams({
    text,
    url,
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

function openXShare(reading: SeriousReading) {
  const shareWindow = window.open(buildXShareUrl(reading), "_blank", "noopener,noreferrer");
  if (shareWindow) {
    shareWindow.opener = null;
    return true;
  }
  return false;
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = new URL(src, window.location.origin).toString();
  });
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function drawCoverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const imageRatio = image.width / image.height;
  const targetRatio = width / height;
  const drawWidth = imageRatio > targetRatio ? height * imageRatio : width;
  const drawHeight = imageRatio > targetRatio ? height : width / imageRatio;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  let line = "";
  let lines = 0;
  const chars = Array.from(text);
  let consumed = 0;

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    const nextLine = line + char;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      lines += 1;
      line = char;
      consumed = index;
      if (lines >= maxLines - 1) {
        consumed = index;
        break;
      }
    } else {
      line = nextLine;
      consumed = index + 1;
    }
  }

  if (line && lines < maxLines) {
    const remaining = chars.length - consumed;
    ctx.fillText(remaining > 0 ? `${line.slice(0, Math.max(0, line.length - 1))}…` : line, x, y);
    y += lineHeight;
  }

  return y;
}

async function createShareCardBlob(reading: SeriousReading) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");

  const mainCard = reading.tarot[1] ?? reading.tarot[0];
  const logoPromise = loadCanvasImage("/brand/cat-mirage-logo.png");
  const mainCardPromise = mainCard ? loadCanvasImage(mainCard.imageSrc || tarotImageByArcana[arcanaKey(mainCard.arcana)] || "") : null;
  const [logo, mainImage] = await Promise.all([logoPromise, mainCardPromise]);

  const background = ctx.createLinearGradient(0, 0, 0, canvas.height);
  background.addColorStop(0, "#03040d");
  background.addColorStop(0.46, "#10102b");
  background.addColorStop(1, "#05030a");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(540, 260, 20, 540, 260, 620);
  glow.addColorStop(0, "rgba(235, 195, 92, 0.34)");
  glow.addColorStop(0.45, "rgba(88, 28, 135, 0.22)");
  glow.addColorStop(1, "rgba(3, 4, 13, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(237, 201, 117, 0.54)";
  ctx.lineWidth = 4;
  roundedRect(ctx, 42, 42, 996, 1266, 42);
  ctx.stroke();
  ctx.strokeStyle = "rgba(237, 201, 117, 0.2)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 68, 68, 944, 1214, 30);
  ctx.stroke();

  ctx.fillStyle = "rgba(250, 226, 154, 0.8)";
  for (let index = 0; index < 90; index += 1) {
    const x = 80 + ((index * 97) % 920);
    const y = 90 + ((index * 173) % 1120);
    const radius = 1.2 + (index % 4) * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  roundedRect(ctx, 434, 72, 212, 212, 106);
  ctx.clip();
  drawCoverImage(ctx, logo, 434, 72, 212, 212);
  ctx.restore();
  ctx.strokeStyle = "rgba(237, 201, 117, 0.62)";
  ctx.lineWidth = 4;
  roundedRect(ctx, 434, 72, 212, 212, 106);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#f8e7b0";
  ctx.font = "700 34px serif";
  ctx.fillText("猫星ミラージュ占譜", 540, 336);
  ctx.fillStyle = "rgba(248, 231, 176, 0.62)";
  ctx.font = "700 18px serif";
  ctx.fillText("NEKOSEI MIRAGE ORACLE", 540, 370);

  ctx.save();
  roundedRect(ctx, 340, 414, 400, 600, 24);
  ctx.clip();
  if (mainImage) drawCoverImage(ctx, mainImage, 340, 414, 400, 600);
  ctx.restore();
  ctx.strokeStyle = "rgba(237, 201, 117, 0.7)";
  ctx.lineWidth = 5;
  roundedRect(ctx, 340, 414, 400, 600, 24);
  ctx.stroke();

  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  roundedRect(ctx, 104, 1038, 872, 182, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(237, 201, 117, 0.28)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 104, 1038, 872, 182, 28);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(248, 231, 176, 0.72)";
  ctx.font = "700 24px serif";
  ctx.fillText(`${reading.themeLabel} / SCORE ${reading.score}`, 540, 1088);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 34px sans-serif";
  drawWrappedText(ctx, reading.headline, 540, 1138, 760, 44, 2);

  ctx.fillStyle = "rgba(238, 230, 255, 0.76)";
  ctx.font = "700 24px sans-serif";
  ctx.textAlign = "left";
  drawWrappedText(ctx, reading.affirmation, 164, 1236, 752, 34, 2);

  ctx.fillStyle = "rgba(248, 231, 176, 0.58)";
  ctx.font = "700 20px serif";
  ctx.textAlign = "center";
  ctx.fillText("#猫星ミラージュ占譜  #猫タロット", 540, 1272);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create PNG"));
    }, "image/png");
  });
}

async function shareReadingImage(reading: SeriousReading) {
  const blob = await createShareCardBlob(reading);
  const file = new File([blob], `cat-mirage-oracle-${reading.id}.png`, { type: "image/png" });

  if ("canShare" in navigator && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "猫星ミラージュ占譜",
      text: "今日の猫タロット鑑定カードです。",
    });
    return "shared";
  }

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  return "downloaded";
}

async function shareReadingText(reading: SeriousReading) {
  const text = buildShareText(reading);
  if ("share" in window.navigator && typeof window.navigator.share === "function") {
    await window.navigator.share({
      title: "猫星ミラージュ占譜",
      text,
    });
    return "shared";
  }

  await window.navigator.clipboard.writeText(text);
  return "copied";
}

function nextStreak(previous: DailyStreak | null, todayKey: string): DailyStreak {
  if (!previous) return { lastDateKey: todayKey, streak: 1 };
  if (previous.lastDateKey === todayKey) return previous;
  return {
    lastDateKey: todayKey,
    streak: previous.lastDateKey === getDateKey(-1) ? previous.streak + 1 : 1,
  };
}

function arcanaKey(arcana: string) {
  return Object.keys(englishArcana).find((key) => arcana.includes(key)) ?? arcana;
}

function TarotCard({ card }: { card: TarotDraw }) {
  const [imageFailed, setImageFailed] = useState(false);
  const key = arcanaKey(card.arcana);
  const english = englishArcana[key] ?? key.toUpperCase();
  const imageSrc = card.imageSrc || tarotImageByArcana[key] || "";
  const hasImage = Boolean(imageSrc) && !imageFailed;

  return (
    <div className="cat-tarot-card tarot-image-card group relative aspect-[2/3] w-full overflow-hidden rounded-[10px] bg-[#070612]">
      {hasImage ? (
        <img
          alt={`${english} ${card.arcana}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onError={() => setImageFailed(true)}
          src={imageSrc}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_34%,rgba(217,190,119,0.17),transparent_34%),linear-gradient(145deg,#18152c,#070612_55%,#20131e)]">
          <div className="px-3 text-center font-serif">
            <p className="text-[9px] font-bold tracking-[0.26em] text-amber-100/58">ARTWORK</p>
            <p className="mt-1 text-[10px] font-bold tracking-[0.14em] text-white/70">IMAGE PENDING</p>
            <p className="mt-2 text-[9px] leading-4 text-white/38">{imageSrc || "/tarot/*.png"}</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,244,202,0.2),transparent_23%),linear-gradient(180deg,rgba(3,2,10,0.48),transparent_24%,transparent_72%,rgba(3,2,10,0.72))]" />
      <div className="pointer-events-none absolute inset-[6px] rounded-[7px] border border-amber-100/45 shadow-[inset_0_0_0_1px_rgba(90,62,24,0.55),inset_0_0_28px_rgba(0,0,0,0.45)]" />
      <div className="pointer-events-none absolute inset-[11px] rounded-[5px] border border-amber-100/18" />

      <div className="pointer-events-none absolute left-3 right-3 top-3 rounded-full border border-amber-100/22 bg-black/38 px-2 py-1 text-center backdrop-blur-sm">
        <p className="font-serif text-[7px] font-bold tracking-[0.2em] text-amber-50/86">{english}</p>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md border border-amber-100/24 bg-black/52 px-2 py-1.5 text-center backdrop-blur-sm">
        <p className="font-serif text-[13px] font-bold text-amber-50">{card.arcana}</p>
        <p className="mt-0.5 font-serif text-[7px] font-bold tracking-[0.18em] text-amber-100/62">{card.keyword}</p>
      </div>

      <div className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-amber-100/62" />
      <div className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-amber-100/62" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-amber-100/62" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-amber-100/62" />

      <div className="pointer-events-none absolute inset-0 opacity-35 mix-blend-screen [background-image:radial-gradient(circle_at_22%_28%,rgba(255,239,184,0.55)_0_1px,transparent_2px),radial-gradient(circle_at_78%_42%,rgba(255,239,184,0.45)_0_1px,transparent_2px),radial-gradient(circle_at_48%_74%,rgba(255,239,184,0.35)_0_1px,transparent_2px)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-1.5 flex justify-center gap-1.5 opacity-60">
        {[-2, -1, 0, 1, 2].map((phase) => (
          <span className="relative h-1.5 w-1.5 rounded-full bg-amber-100/80" key={phase}>
            {phase !== 0 ? (
              <span className={`absolute top-0 h-1.5 w-1.5 rounded-full bg-[#070612] ${phase > 0 ? "-left-0.5" : "left-0.5"}`} />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function LegacyTarotCardModal({ card, onClose }: { card: TarotDraw; onClose: () => void }) {
  const key = arcanaKey(card.arcana);
  const english = englishArcana[key] ?? key.toUpperCase();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/82 px-5 py-7 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`${card.arcana}の拡大表示`}>
      <button className="absolute inset-0 cursor-default" onClick={onClose} type="button" aria-label="閉じる" />
      <div className="tarot-modal-card relative z-10 w-full max-w-[330px]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-serif text-[10px] font-bold tracking-[0.32em] text-amber-100/54">{english}</p>
            <h3 className="font-serif text-2xl font-bold text-white">{card.arcana}</h3>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-amber-100/25 bg-black/50 text-xl leading-none text-amber-50 shadow-[0_0_22px_rgba(217,190,119,0.18)]"
            onClick={onClose}
            type="button"
            aria-label="カードを閉じる"
          >
            ×
          </button>
        </div>
        <TarotCard card={card} />
        <div className="mt-3 rounded-2xl border border-amber-100/15 bg-black/50 p-3 backdrop-blur-md">
          <p className="font-serif text-[10px] font-bold tracking-[0.22em] text-amber-100/54">{card.position}</p>
          <p className="mt-1 text-sm font-bold leading-6 text-violet-50/82">{card.text}</p>
        </div>
      </div>
    </div>
  );
}

function TarotCardModal({ card, onClose }: { card: TarotDraw; onClose: () => void }) {
  const key = arcanaKey(card.arcana);
  const english = englishArcana[key] ?? key.toUpperCase();
  const meaning = getTarotMeaning(english);
  const position = getPositionReading(card.position);
  const detailItems = [
    { title: "カードの本質", body: meaning.essence },
    { title: "明るい兆し", body: meaning.light },
    { title: "気をつける影", body: meaning.shadow },
    { title: "今日の行動", body: meaning.advice },
  ];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/82 px-5 py-7 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`${card.arcana}の詳細鑑定`}>
      <button className="fixed inset-0 cursor-default" onClick={onClose} type="button" aria-label="閉じる" />
      <div className="tarot-modal-card relative z-10 mx-auto w-full max-w-[340px] pb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-serif text-[10px] font-bold tracking-[0.32em] text-amber-100/54">{english}</p>
            <h3 className="font-serif text-2xl font-bold text-white">{card.arcana}</h3>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-amber-100/25 bg-black/50 text-xl leading-none text-amber-50 shadow-[0_0_22px_rgba(217,190,119,0.18)]"
            onClick={onClose}
            type="button"
            aria-label="カードを閉じる"
          >
            ×
          </button>
        </div>

        <TarotCard card={card} />

        <div className="mt-4 rounded-2xl border border-amber-100/18 bg-black/58 p-4 shadow-[0_18px_44px_rgba(0,0,0,0.36)] backdrop-blur-md">
          <p className="font-serif text-[10px] font-bold tracking-[0.24em] text-amber-100/54">{position.label}</p>
          <p className="mt-2 text-sm font-bold leading-7 text-violet-50/86">{card.text}</p>
          <p className="mt-3 border-t border-amber-100/12 pt-3 text-xs leading-6 text-violet-100/64">{position.lead}</p>
        </div>

        <div className="mt-3 grid gap-2">
          {detailItems.map((item) => (
            <section className="rounded-2xl border border-white/10 bg-[#090714]/82 p-3 backdrop-blur-md" key={item.title}>
              <p className="font-serif text-[10px] font-bold tracking-[0.18em] text-amber-100/58">{item.title}</p>
              <p className="mt-1 text-xs font-medium leading-6 text-violet-50/76">{item.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegacySharePreview({ reading }: { reading: SeriousReading }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-amber-100/25 bg-[#060511] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,190,119,0.2),transparent_34%),radial-gradient(circle_at_18%_82%,rgba(147,51,234,0.22),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-[9px] rounded-[18px] border border-amber-100/22" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <img
              alt=""
              className="h-14 w-14 shrink-0 rounded-full border border-amber-100/28 object-cover shadow-[0_0_24px_rgba(217,190,119,0.16)]"
              draggable={false}
              src="/brand/cat-mirage-logo.png"
            />
            <div className="min-w-0">
            <p className="font-serif text-[10px] font-bold tracking-[0.34em] text-amber-100/58">SHARE ORACLE</p>
            <h3 className="mt-1 font-serif text-xl font-bold leading-tight text-white">猫星ミラージュ占譜</h3>
            </div>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-amber-100/30 bg-amber-100/10">
            <span className="text-xl font-black text-amber-100">{reading.score}</span>
          </div>
        </div>
        <div className="my-4 grid grid-cols-3 gap-2">
          {reading.tarot.map((card) => (
            <div className="rounded-xl border border-amber-100/18 bg-black/35 p-1" key={`${reading.id}-${card.position}`}>
              <TarotCard card={card} />
            </div>
          ))}
        </div>
        <p className="font-serif text-[10px] font-bold tracking-[0.2em] text-amber-100/54">{reading.themeLabel}</p>
        <p className="mt-1 text-lg font-black leading-7 text-white">{reading.headline}</p>
        <p className="mt-2 line-clamp-3 text-xs font-bold leading-6 text-violet-50/70">{reading.affirmation}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-amber-100/12 pt-3">
          <p className="text-[10px] font-bold text-white/40">{formatReadingDate(reading.createdAt)}</p>
          <p className="font-serif text-[10px] font-bold tracking-[0.2em] text-amber-100/54">MOON / STARS / CAT TAROT</p>
        </div>
      </div>
    </section>
  );
}

function SharePreview({ reading }: { reading: SeriousReading }) {
  const mainCard = reading.tarot[1] ?? reading.tarot[0];

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-amber-100/30 bg-[#05040d] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.48)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-8%,rgba(250,204,21,0.24),transparent_35%),radial-gradient(circle_at_16%_84%,rgba(147,51,234,0.26),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_36%,rgba(0,0,0,0.34))]" />
      <div className="pointer-events-none absolute inset-[8px] rounded-[22px] border border-amber-100/24" />
      <div className="pointer-events-none absolute inset-[14px] rounded-[17px] border border-amber-100/10" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <img
              alt=""
              className="h-14 w-14 shrink-0 rounded-full border border-amber-100/28 object-cover shadow-[0_0_24px_rgba(217,190,119,0.16)]"
              draggable={false}
              src="/brand/cat-mirage-logo.png"
            />
            <div className="min-w-0">
            <p className="font-serif text-[10px] font-bold tracking-[0.36em] text-amber-100/58">SHARE ORACLE CARD</p>
            <h3 className="mt-1 font-serif text-2xl font-bold leading-tight text-white">猫星ミラージュ占譜</h3>
            <p className="mt-1 text-[11px] font-bold text-violet-50/48">今日の鑑定証</p>
            </div>
          </div>
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-amber-100/35 bg-amber-100/10 shadow-[0_0_34px_rgba(217,190,119,0.18)]">
            <div className="text-center">
              <p className="text-[9px] font-bold tracking-[0.16em] text-amber-100/50">SCORE</p>
              <p className="text-2xl font-black text-amber-100">{reading.score}</p>
            </div>
          </div>
        </div>

        {mainCard ? (
          <div className="mx-auto mt-4 w-[56%] max-w-[180px] rounded-[18px] border border-amber-100/20 bg-black/38 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <TarotCard card={mainCard} />
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/28 p-3 text-center">
          <p className="font-serif text-[10px] font-bold tracking-[0.22em] text-amber-100/54">{reading.themeLabel}</p>
          <p className="mt-1 text-xl font-black leading-7 text-white">{reading.headline}</p>
          <p className="mt-2 text-xs font-bold leading-6 text-violet-50/68">{reading.affirmation}</p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {reading.tarot.map((card) => (
            <div className="rounded-2xl border border-amber-100/14 bg-white/[0.045] p-2 text-center" key={`${reading.id}-share-${card.position}`}>
              <p className="font-serif text-[9px] font-bold tracking-[0.12em] text-amber-100/45">{card.position}</p>
              <p className="mt-1 truncate text-[11px] font-black text-white/82">{card.arcana}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-amber-100/12 pt-3">
          <p className="text-[10px] font-bold text-white/40">{formatReadingDate(reading.createdAt)}</p>
          <p className="font-serif text-[10px] font-bold tracking-[0.2em] text-amber-100/54">MOON / STARS / CAT TAROT</p>
        </div>
      </div>
    </section>
  );
}

function HistoryReadingModal({ reading, onClose }: { reading: SeriousReading; onClose: () => void }) {
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const shareSavedReading = async () => {
    try {
      const result = await shareReadingText(reading);
      setShareStatus(result === "shared" ? "共有を開きました" : "共有文をコピーしました");
    } catch {
      setShareStatus("共有をキャンセルしました");
    }
    window.setTimeout(() => setShareStatus(""), 2200);
  };

  const shareSavedReadingToX = () => {
    setShareStatus(openXShare(reading) ? "Xの投稿画面を開きました" : "X投稿画面を開けませんでした");
    window.setTimeout(() => setShareStatus(""), 2200);
  };

  const shareSavedReadingImage = async () => {
    try {
      const result = await shareReadingImage(reading);
      setShareStatus(result === "shared" ? "画像共有を開きました" : "PNG画像を保存しました");
    } catch {
      setShareStatus("画像を作成できませんでした");
    }
    window.setTimeout(() => setShareStatus(""), 2600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/84 px-4 py-6 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="保存した鑑定記録">
      <button className="fixed inset-0 cursor-default" onClick={onClose} type="button" aria-label="閉じる" />
      <div className="tarot-modal-card relative z-10 mx-auto w-full max-w-[380px] pb-8">
        <div className="relative overflow-hidden rounded-[28px] border border-amber-100/24 bg-[#080611]/96 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.58)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,190,119,0.18),transparent_34%),radial-gradient(circle_at_18%_86%,rgba(88,28,135,0.22),transparent_40%)]" />
          <div className="pointer-events-none absolute inset-[9px] rounded-[21px] border border-amber-100/18" />
          <div className="relative">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-[10px] font-bold tracking-[0.34em] text-amber-100/54">SAVED ORACLE BOOK</p>
                <h3 className="mt-1 font-serif text-2xl font-bold leading-tight text-white">保存した鑑定記録</h3>
                <p className="mt-1 text-[11px] font-bold text-white/42">{formatReadingDate(reading.createdAt)} ・ {reading.themeLabel}</p>
              </div>
              <button
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amber-100/25 bg-black/50 text-xl leading-none text-amber-50 shadow-[0_0_22px_rgba(217,190,119,0.18)]"
                onClick={onClose}
                type="button"
                aria-label="履歴を閉じる"
              >
                ×
              </button>
            </div>

            <section className="rounded-2xl border border-amber-100/16 bg-black/28 p-3">
              <p className="font-serif text-[10px] font-bold tracking-[0.24em] text-amber-100/58">TOTAL MESSAGE</p>
              <p className="mt-2 text-sm font-black leading-7 text-white">{reading.headline}</p>
              <p className="mt-2 text-xs leading-6 text-violet-50/72">{reading.summary}</p>
            </section>

            <div className="mt-3 grid gap-3">
              {(Array.isArray(reading.tarot) ? reading.tarot : []).map((card) => {
                const key = arcanaKey(card.arcana);
                const english = englishArcana[key] ?? key.toUpperCase();
                const meaning = getTarotMeaning(english);

                return (
                  <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-3" key={`${reading.id}-${card.position}`}>
                    <div className="grid grid-cols-[78px_1fr] gap-3">
                      <div className="rounded-xl border border-amber-100/18 bg-black/35 p-1">
                        <TarotCard card={card} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-[10px] font-bold tracking-[0.2em] text-amber-100/52">{card.position}</p>
                        <h4 className="mt-1 truncate font-serif text-lg font-bold text-white">{card.arcana}</h4>
                        <p className="mt-1 text-[11px] font-bold leading-5 text-violet-50/68">{meaning.essence}</p>
                      </div>
                    </div>
                    <p className="mt-2 rounded-xl border border-amber-100/10 bg-black/24 p-2 text-xs font-medium leading-6 text-violet-50/72">{meaning.advice}</p>
                  </section>
                );
              })}
            </div>

            <section className="mt-3 rounded-2xl border border-amber-100/18 bg-amber-100/[0.07] p-3">
              <p className="font-serif text-[10px] font-bold tracking-[0.24em] text-amber-100/58">TODAY'S ACTION</p>
              <p className="mt-2 text-sm font-black leading-6 text-amber-50">{reading.lucky?.action ?? "今日は急がず、心に残った言葉をひとつだけ行動に移してください。"}</p>
              <p className="mt-2 text-xs leading-6 text-violet-50/62">{reading.affirmation}</p>
            </section>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="rounded-2xl border border-cyan-100/25 bg-cyan-100/[0.08] px-3 py-3 text-sm font-black text-cyan-50 shadow-[0_0_22px_rgba(125,211,252,0.1)] transition active:scale-[0.98]"
                onClick={shareSavedReading}
                type="button"
              >
                SNS用に共有
              </button>
              <button
                className="rounded-2xl border border-white/20 bg-white/[0.08] px-2 py-3 text-xs font-black text-white shadow-[0_0_22px_rgba(255,255,255,0.08)] transition active:scale-[0.98]"
                onClick={shareSavedReadingToX}
                type="button"
              >
                Xで投稿
              </button>
              <button
                className="rounded-2xl border border-amber-100/30 bg-amber-100/[0.09] px-2 py-3 text-xs font-black text-amber-50 shadow-[0_0_22px_rgba(217,190,119,0.1)] transition active:scale-[0.98]"
                onClick={shareSavedReadingImage}
                type="button"
              >
                画像保存
              </button>
              <button
                className="rounded-2xl border border-amber-100/25 bg-black/34 px-3 py-3 text-sm font-black text-amber-50 transition active:scale-[0.98]"
                onClick={onClose}
                type="button"
              >
                閉じる
              </button>
            </div>
            {shareStatus ? <p className="mt-3 rounded-2xl border border-white/10 bg-black/24 p-3 text-center text-xs font-bold text-white/62">{shareStatus}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function OracleBook({ items, todayKey }: { items: SeriousReading[]; todayKey: string }) {
  const [selectedHistory, setSelectedHistory] = useState<SeriousReading | null>(null);

  if (items.length === 0) {
    return (
      <section className="px-4 pb-8">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4 text-center">
          <p className="font-serif text-[10px] font-bold tracking-[0.28em] text-cyan-100/55">ORACLE BOOK</p>
          <h2 className="mt-1 text-lg font-black text-white">猫星占い帳</h2>
          <p className="mt-2 text-sm font-bold text-white/50">保存した鑑定はまだありません。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-8">
      <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-serif text-[10px] font-bold tracking-[0.28em] text-cyan-100/55">ORACLE BOOK</p>
            <h2 className="mt-1 text-lg font-black text-white">猫星占い帳</h2>
            <p className="mt-1 text-[11px] font-bold text-white/42">保存した鑑定をあとから読み返せます</p>
          </div>
          <p className="rounded-full border border-cyan-100/15 bg-cyan-100/[0.06] px-3 py-1 text-[10px] font-black text-cyan-50/70">{items.length}件</p>
        </div>
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <button
              className="w-full rounded-2xl border border-white/10 bg-black/24 p-3 text-left transition active:scale-[0.99]"
              key={item.id}
              onClick={() => setSelectedHistory(item)}
              type="button"
              aria-label={`保存した鑑定を開く ${item.themeLabel}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-black text-white">{item.themeLabel}</p>
                <div className="flex shrink-0 items-center gap-1.5">
                  {item.dateKey === todayKey ? (
                    <span className="rounded-full border border-amber-100/20 bg-amber-100/[0.08] px-2 py-0.5 text-[9px] font-black text-amber-50/70">今日</span>
                  ) : null}
                  <p className="text-[10px] font-bold text-white/38">{formatReadingDate(item.createdAt)}</p>
                </div>
              </div>
              <p className="mt-1 line-clamp-1 text-[11px] font-bold text-amber-100/58">{getCardLine(item)}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/50">{item.summary}</p>
            </button>
          ))}
        </div>
      </div>
      {selectedHistory ? <HistoryReadingModal reading={selectedHistory} onClose={() => setSelectedHistory(null)} /> : null}
    </section>
  );
}

function ReadingResult({ reading, onSave }: { reading: SeriousReading; onSave: (reading: SeriousReading) => void }) {
  const [selectedCard, setSelectedCard] = useState<TarotDraw | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  const saveReading = () => {
    onSave(reading);
    setSaveStatus("鑑定を保存しました");
    window.setTimeout(() => setSaveStatus(""), 2200);
  };

  const shareReading = async () => {
    const text = buildShareText(reading);
    try {
      if ("share" in window.navigator && typeof window.navigator.share === "function") {
        await window.navigator.share({
          title: "猫星ミラージュ占譜",
          text,
        });
        setShareStatus("共有を開きました");
      } else {
        await window.navigator.clipboard.writeText(text);
        setShareStatus("共有文をコピーしました");
      }
    } catch {
      setShareStatus("共有をキャンセルしました");
    }
    window.setTimeout(() => setShareStatus(""), 2200);
  };

  const shareReadingToX = () => {
    setShareStatus(openXShare(reading) ? "Xの投稿画面を開きました" : "X投稿画面を開けませんでした");
    window.setTimeout(() => setShareStatus(""), 2200);
  };

  const shareReadingAsImage = async () => {
    try {
      const result = await shareReadingImage(reading);
      setShareStatus(result === "shared" ? "画像共有を開きました" : "PNG画像を保存しました");
    } catch {
      setShareStatus("画像を作成できませんでした");
    }
    window.setTimeout(() => setShareStatus(""), 2600);
  };

  return (
    <article className="space-y-4 px-4 pb-8">
      <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0918]/88 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.36)]">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-300/12 blur-3xl" />
        <div className="absolute -left-16 top-20 h-32 w-32 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-serif text-[10px] font-bold tracking-[0.32em] text-amber-100/55">TODAY'S READING</p>
              <h2 className="mt-1 text-2xl font-black leading-tight text-white">{reading.headline}</h2>
            </div>
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-amber-100/25 bg-amber-200/10">
              <span className="text-2xl font-black text-amber-100">{reading.score}</span>
            </div>
          </div>
          <p className="text-sm leading-7 text-violet-50/82">{reading.summary}</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] font-bold text-white/38">星座</p>
              <p className="mt-1 text-sm font-black text-white">{reading.zodiac}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] font-bold text-white/38">姓名数</p>
              <p className="mt-1 text-sm font-black text-white">{reading.nameNumber}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] font-bold text-white/38">月相</p>
              <p className="mt-1 text-sm font-black text-white">{reading.moonPhase}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[24px] border border-amber-100/15 bg-[#080713]/92 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.38)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(217,190,119,0.12),transparent_34%),radial-gradient(circle_at_20%_88%,rgba(88,28,135,0.18),transparent_34%)]" />
        <div className="relative mb-4 flex items-center justify-between">
          <div>
            <p className="font-serif text-[10px] font-bold tracking-[0.36em] text-amber-100/58">CAT TAROT</p>
            <h3 className="font-serif text-xl font-bold text-white">猫タロット三枚読み</h3>
          </div>
          <span className="rounded-full border border-amber-100/15 bg-amber-100/[0.06] px-3 py-1 font-serif text-[10px] font-bold text-amber-50/62">
            {reading.themeLabel}
          </span>
        </div>
        <div className="relative grid grid-cols-3 gap-2.5">
          {reading.tarot.map((card) => (
            <div className="cat-tarot-shell group rounded-[14px] border border-amber-100/20 bg-[#05040d]/70 p-1.5 text-center" key={card.position}>
              <p className="mb-1 font-serif text-[10px] font-bold tracking-[0.12em] text-amber-100/58">{card.position}</p>
              <button
                className="block w-full rounded-[10px] text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-100/60"
                onClick={() => setSelectedCard(card)}
                type="button"
                aria-label={`${card.arcana}を拡大表示`}
              >
                <TarotCard card={card} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {reading.sections.map((section) => (
        <section className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4" key={section.title}>
          <h3 className="text-base font-black text-white">{section.title}</h3>
          <p className="mt-2 text-sm leading-7 text-violet-50/82">{section.body}</p>
        </section>
      ))}

      <section className="rounded-[22px] border border-amber-100/20 bg-amber-100/[0.07] p-4">
        <p className="font-serif text-[10px] font-bold tracking-[0.28em] text-amber-100/60">LUCKY GUIDE</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-white/42">色</p>
            <p className="mt-1 font-black text-white">{reading.lucky.color}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-white/42">時間</p>
            <p className="mt-1 font-black text-white">{reading.lucky.time}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-white/42">持ち物</p>
            <p className="mt-1 font-black text-white">{reading.lucky.item}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-white/42">行動</p>
            <p className="mt-1 font-black text-white">{reading.lucky.action}</p>
          </div>
        </div>
        <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm font-bold leading-6 text-amber-50">
          {reading.affirmation}
        </p>
      </section>

      <SharePreview reading={reading} />

      <AdBanner variant="result-inline" />

      <section className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            className="rounded-2xl border border-amber-100/35 bg-amber-100/12 px-3 py-3 text-sm font-black text-amber-50 shadow-[0_0_22px_rgba(217,190,119,0.12)] transition active:scale-[0.98]"
            onClick={saveReading}
            type="button"
          >
            今日の鑑定を保存
          </button>
          <button
            className="rounded-2xl border border-cyan-100/25 bg-cyan-100/[0.08] px-3 py-3 text-sm font-black text-cyan-50 shadow-[0_0_22px_rgba(125,211,252,0.1)] transition active:scale-[0.98]"
            onClick={shareReading}
            type="button"
          >
            SNS用に共有
          </button>
          <button
            className="rounded-2xl border border-white/20 bg-white/[0.08] px-2 py-3 text-xs font-black text-white shadow-[0_0_22px_rgba(255,255,255,0.08)] transition active:scale-[0.98]"
            onClick={shareReadingToX}
            type="button"
          >
            Xで投稿
          </button>
          <button
            className="rounded-2xl border border-amber-100/30 bg-amber-100/[0.09] px-2 py-3 text-xs font-black text-amber-50 shadow-[0_0_22px_rgba(217,190,119,0.1)] transition active:scale-[0.98]"
            onClick={shareReadingAsImage}
            type="button"
          >
            画像保存
          </button>
        </div>
        {saveStatus || shareStatus ? (
          <p className="mt-3 rounded-2xl border border-white/10 bg-black/22 p-3 text-center text-xs font-bold text-white/62">{saveStatus || shareStatus}</p>
        ) : null}
      </section>
      {selectedCard ? <TarotCardModal card={selectedCard} onClose={() => setSelectedCard(null)} /> : null}
    </article>
  );
}

export function SeriousOracleApp() {
  const todayKey = getDateKey();
  const [profile, setProfile] = useState<OracleProfile>(defaultProfile);
  const [history, setHistory] = useState<SeriousReading[]>([]);
  const [reading, setReading] = useState<SeriousReading | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [streak, setStreak] = useState<DailyStreak>({ lastDateKey: todayKey, streak: 1 });
  const dailyPrompt = useMemo(() => getDailyPrompt(todayKey), [todayKey]);
  const todayDone = history.some((item) => item.dateKey === todayKey);
  const birthDateValid = Boolean(normalizeBirthDate(profile.birthDate));

  useEffect(() => {
    const storage = window.localStorage;

    try {
      const savedProfile = storage.getItem(profileStorageKey);
      const parsed = savedProfile ? (JSON.parse(savedProfile) as Partial<OracleProfile>) : null;
      if (parsed) {
        setProfile({
          birthDate: parsed.birthDate ?? defaultProfile.birthDate,
          name: parsed.name ?? "",
          theme: parsed.theme ?? "love",
        });
      }
    } catch {
      setProfile(defaultProfile);
    }

    const limited = normalizeSavedReadings(storage.getItem(readingsStorageKey));
    setHistory(limited);
    setReading((current) => current ?? limited[0] ?? null);
    if (limited.length > 0) storage.setItem(readingsStorageKey, JSON.stringify(limited));

    try {
      const savedStreak = storage.getItem(streakStorageKey);
      const parsedStreak = savedStreak ? (JSON.parse(savedStreak) as DailyStreak) : null;
      const updated = nextStreak(parsedStreak, todayKey);
      setStreak(updated);
      storage.setItem(streakStorageKey, JSON.stringify(updated));
    } catch {
      const updated = nextStreak(null, todayKey);
      setStreak(updated);
      storage.setItem(streakStorageKey, JSON.stringify(updated));
    }
  }, [todayKey]);

  const updateProfile = (next: OracleProfile) => {
    setProfile(next);
    window.localStorage.setItem(profileStorageKey, JSON.stringify(next));
  };

  const runReading = () => {
    if (!profile.name.trim() || !birthDateValid || isReading) return;
    setIsReading(true);
    window.navigator.vibrate?.([18, 34, 18]);

    window.setTimeout(() => {
      const nextReading = createReading(profile, todayKey);
      setReading(nextReading);
      setIsReading(false);
    }, 1250);
  };

  const saveReading = (item: SeriousReading) => {
    const savedReading = {
      ...item,
      id: `${item.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      dateKey: todayKey,
    };
    setHistory((current) => {
      const next = [savedReading, ...current].slice(0, maxSavedReadings);
      window.localStorage.setItem(readingsStorageKey, JSON.stringify(next));
      return next;
    });
    setReading(savedReading);
  };

  return (
    <main className="phone-safe flex justify-center bg-black text-white">
      <div className="relative min-h-svh w-full max-w-[430px] bg-[#050514] shadow-[0_0_80px_rgba(0,0,0,0.65)] sm:my-6 sm:min-h-[880px] sm:overflow-hidden sm:rounded-[36px] sm:border sm:border-white/10">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_6%,rgba(109,40,217,0.18),transparent_30rem),radial-gradient(circle_at_50%_74%,rgba(217,190,119,0.08),transparent_19rem),#03030b]" />
        <div className="relative z-10">
          <div className="sticky top-0 z-30">
            <AdBanner variant="top-sticky" />
          </div>

          <header className="px-5 pb-4 pt-4 text-center">
            <div className="mx-auto mb-3 w-[min(68vw,230px)] overflow-hidden rounded-full border border-amber-100/24 bg-black/35 p-1.5 shadow-[0_0_42px_rgba(217,190,119,0.16)]">
              <img
                alt="猫星ミラージュ占譜のロゴ"
                className="aspect-square w-full rounded-full object-cover"
                draggable={false}
                src="/brand/cat-mirage-logo.png"
              />
            </div>
            <p className="font-serif text-[10px] font-bold tracking-[0.42em] text-amber-100/50">NAME / STARS / CAT TAROT</p>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-[0.03em] text-white drop-shadow-[0_0_22px_rgba(217,190,119,0.22)]">
              猫星ミラージュ占譜
            </h1>
            <p className="mx-auto mt-2 max-w-[20rem] text-xs leading-5 text-white/50">
              姓名判断、星の暦、猫タロットを重ねて今日の流れを読む複合鑑定。
            </p>
          </header>

          <section className="px-4">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
              <div className="mb-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-black/22 p-3 text-center">
                  <p className="text-[10px] font-bold text-white/38">連続鑑定</p>
                  <p className="mt-1 text-xl font-black text-amber-100">{streak.streak}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/22 p-3 text-center">
                  <p className="text-[10px] font-bold text-white/38">鑑定履歴</p>
                  <p className="mt-1 text-xl font-black text-cyan-100">{history.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/22 p-3 text-center">
                  <p className="text-[10px] font-bold text-white/38">今日</p>
                  <p className="mt-1 text-sm font-black text-fuchsia-100">{todayDone ? "済" : "未"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-100/18 bg-amber-100/[0.07] p-3">
                <p className="font-serif text-[10px] font-bold tracking-[0.24em] text-amber-100/60">DAILY QUESTION</p>
                <p className="mt-1 text-sm font-bold leading-6 text-amber-50">{dailyPrompt}</p>
              </div>
            </div>
          </section>

          <section className="mt-4 px-4">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
              <div className="grid gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-white/55">名前</span>
                  <input
                    className="rounded-2xl border border-white/10 bg-black/28 px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-100/45"
                    onChange={(event) => updateProfile({ ...profile, name: event.target.value })}
                    placeholder="例: 星野 月"
                    value={profile.name}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-bold text-white/55">生年月日</span>
                  <input
                    className="rounded-2xl border border-white/10 bg-black/28 px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-100/45"
                    inputMode="numeric"
                    onChange={(event) => updateProfile({ ...profile, birthDate: event.target.value })}
                    placeholder="1995/01/01"
                    value={profile.birthDate}
                  />
                  <span className={`text-[11px] font-bold ${birthDateValid ? "text-white/34" : "text-rose-200/80"}`}>
                    例: 1995/01/01、1995-1-1、1995年1月1日
                  </span>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-1.5">
                {themeOptions.map((theme) => {
                  const active = theme.id === profile.theme;
                  return (
                    <button
                      className={`rounded-2xl border px-1 py-2 text-center transition active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${
                        active
                          ? "border-amber-100/45 bg-amber-100/12 text-white shadow-[0_0_20px_rgba(217,190,119,0.16)]"
                          : "border-white/10 bg-black/20 text-white/48"
                      }`}
                      disabled={isReading}
                      key={theme.id}
                      onClick={() => updateProfile({ ...profile, theme: theme.id })}
                      type="button"
                    >
                      <span className="block text-[11px] font-black">{theme.label}</span>
                      <span className="mt-0.5 block text-[9px] font-bold opacity-60">{theme.caption}</span>
                    </button>
                  );
                })}
              </div>

              <button
                className="mt-4 w-full rounded-2xl border border-amber-100/35 bg-gradient-to-r from-[#3b1f5f] via-[#6e3565] to-[#c59b4d] px-5 py-4 text-base font-black tracking-[0.12em] text-white shadow-[0_0_30px_rgba(217,190,119,0.22)] transition active:scale-[0.98] disabled:opacity-45"
                disabled={isReading || !profile.name.trim() || !birthDateValid}
                onClick={runReading}
                type="button"
              >
                {isReading ? "猫星盤を展開中..." : todayDone ? "今日の占譜を読み直す" : "今日の占譜を開く"}
              </button>
            </div>
          </section>

          {isReading ? (
            <section className="px-4 py-8">
              <div className="grid min-h-64 place-items-center rounded-[24px] border border-white/10 bg-white/[0.045]">
                <div className="text-center">
                  <div className="relative mx-auto h-32 w-32">
                    <div className="absolute inset-0 animate-spinSlow rounded-full border border-dashed border-amber-100/50" />
                    <div className="absolute inset-5 rounded-full border border-amber-100/30 bg-amber-100/10 shadow-[0_0_34px_rgba(217,190,119,0.22)]" />
                    <div className="absolute left-1/2 top-1/2 h-12 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/50 bg-black/50">
                      <div className="absolute -top-5 left-2 h-8 w-8 rotate-[-18deg] border-l border-t border-amber-100/50 bg-black/50" />
                      <div className="absolute -top-5 right-2 h-8 w-8 rotate-[18deg] border-r border-t border-amber-100/50 bg-black/50" />
                    </div>
                  </div>
                  <p className="mt-5 text-sm font-black tracking-[0.16em] text-white">猫タロットをめくっています</p>
                  <p className="mt-2 text-xs text-white/45">姓名数、星の暦、三枚のカードを統合中</p>
                </div>
              </div>
            </section>
          ) : reading ? (
            <ReadingResult reading={reading} onSave={saveReading} />
          ) : null}

          <AdBanner variant="archive-inline" />
          <OracleBook items={history} todayKey={todayKey} />

          <section className="px-4 pb-8">
            <div className="relative overflow-hidden rounded-[24px] border border-amber-100/16 bg-white/[0.045] p-5 shadow-[0_18px_52px_rgba(0,0,0,0.32)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,190,119,0.12),transparent_32%),radial-gradient(circle_at_85%_86%,rgba(88,28,135,0.2),transparent_38%)]" />
              <div className="relative">
                <p className="font-serif text-[10px] font-bold tracking-[0.32em] text-amber-100/58">ABOUT CAT MIRAGE ORACLE</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-white">猫星ミラージュ占譜とは</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-violet-50/76">
                  <p>
                    猫星ミラージュ占譜は、姓名判断の数字、星の暦、猫をモチーフにしたタロットカードを組み合わせて、今日の気分や行動のヒントを読み解くエンタメ占いです。名前や生年月日から導いた象徴と、その日に開かれた三枚のカードを重ねることで、恋愛、仕事、人間関係、自分自身の整え方を少し違う角度から眺められるように作っています。
                  </p>
                  <p>
                    結果は未来を断定するものではなく、朝の気分整理、迷った時のメモ、行動を始めるきっかけとして楽しむためのものです。読んでいて心に残った言葉があれば、今日の小さな合図として受け取ってください。ただし、医療、法律、投資、契約、進路など人生上の重大な判断は、この占いだけを根拠にせず、必要に応じて専門家へ相談してください。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pb-8">
            <div className="grid gap-3">
              {[
                {
                  title: "姓名判断の見方",
                  body: "名前から導く数は、性格を決めつけるものではなく、言葉の響きや印象を整理するための象徴として扱っています。自分らしい選び方、無理をしやすい場面、気持ちが整いやすい方向を知るための小さな地図として読んでください。",
                },
                {
                  title: "星の暦の使い方",
                  body: "星の暦は、その日の空気感を読むための背景です。強く進めたい日、少し整えたい日、人との距離を見直したい日など、日々のリズムを意識することで、予定や気分に余白を作りやすくなります。",
                },
                {
                  title: "猫タロットの読み方",
                  body: "三枚の猫タロットは、過去・現在・近未来の流れを物語のようにつなげて表示します。カードの意味を正解として受け取るより、今の自分に引っかかる言葉や絵柄を見つけることを大切にしています。",
                },
                {
                  title: "毎日の気分整理に",
                  body: "朝に一度引いて今日の合図を決めたり、夜に保存した鑑定を読み返して一日を振り返ったりできます。迷いが大きい時ほど、占いだけで決めず、現実の情報や信頼できる人の意見と合わせて使ってください。",
                },
              ].map((item) => (
                <article className="rounded-[22px] border border-white/10 bg-white/[0.045] p-4" key={item.title}>
                  <h3 className="font-serif text-lg font-bold text-amber-50">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-violet-50/72">{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          {false && history.length > 1 ? (
            <section className="px-4 pb-8">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
                <p className="font-serif text-[10px] font-bold tracking-[0.28em] text-cyan-100/55">READING ARCHIVE</p>
                <h2 className="mt-1 text-lg font-black text-white">過去の占譜</h2>
                <div className="mt-3 space-y-2">
                  {history.slice(1, 8).map((item) => (
                    <button
                      className="w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-left active:scale-[0.99]"
                      key={item.id}
                      onClick={() => setReading(item)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-black text-white">{item.themeLabel}</p>
                        <p className="text-[10px] font-bold text-white/38">{item.dateKey}</p>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-white/48">{item.headline}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <footer className="px-5 pb-8 text-center text-[11px] leading-5 text-white/34">
            <p>この鑑定はエンタメ用途の占いコンテンツです。医療・法律・金融などの重要な判断は専門家へご相談ください。</p>
            <p className="mt-2">広告枠は将来のAdSense/AdMob/リワード広告差し替えを想定したダミー表示です。</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
