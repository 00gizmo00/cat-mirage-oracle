export type ReadingTheme = "love" | "work" | "money" | "relation" | "self";

export type OracleProfile = {
  birthDate: string;
  name: string;
  theme: ReadingTheme;
};

export type TarotDraw = {
  arcana: string;
  keyword: string;
  position: string;
  text: string;
  imageSeed: number;
  imageSrc: string;
};

export type SeriousReading = {
  id: string;
  createdAt: string;
  dateKey: string;
  profile: OracleProfile;
  themeLabel: string;
  score: number;
  zodiac: string;
  nameNumber: number;
  nameCore: string;
  moonPhase: string;
  tarot: TarotDraw[];
  headline: string;
  summary: string;
  sections: { title: string; body: string }[];
  lucky: { color: string; item: string; action: string; time: string };
  affirmation: string;
};

const themeLabels: Record<ReadingTheme, string> = {
  love: "恋愛と縁",
  work: "仕事と転機",
  money: "金運と循環",
  relation: "人間関係",
  self: "自己理解",
};

const themeSeeds: Record<ReadingTheme, string[]> = {
  love: ["近づきたい気持ちほど、少しだけ余白を持たせると相手に届きやすくなります。", "言葉にする前の沈黙に、今日は本音の輪郭が出ます。", "曖昧な関係には、小さな約束をひとつ置くと流れが変わります。"],
  work: ["評価は遅れて届きます。今は見えない場所の積み重ねが力になります。", "頼まれごとの裏に、次の役割への入口があります。", "急ぎの判断ほど、目的を一文で言えるか確認してください。"],
  money: ["出ていくお金を責めるより、戻ってくる流れを設計する日です。", "小さな固定費の見直しが、気持ちの自由度を上げます。", "欲しいものの前に、なぜ欲しいのかを一度だけ問い直すと吉です。"],
  relation: ["距離を詰めるより、相手が安心して戻れる場所を作るとうまくいきます。", "誤解は説明量ではなく、最初の一言の柔らかさでほどけます。", "誰かの機嫌を背負いすぎているなら、今日は半分だけ下ろしてください。"],
  self: ["迷いは弱さではなく、選択肢が増えた合図です。", "昔の自分が欲しかった言葉を、今日は今の自分に渡してください。", "整えるほどに、次の欲望がきれいに見えてきます。"],
};

const arcana = [
  ["教皇", "導き"],
  ["愚者", "はじまり"],
  ["魔術師", "発動"],
  ["女教皇", "直感"],
  ["女帝", "受容"],
  ["皇帝", "秩序"],
  ["恋人", "選択"],
  ["戦車", "突破"],
  ["力", "しなやかさ"],
  ["隠者", "内省"],
  ["運命の輪", "転回"],
  ["正義", "均衡"],
  ["吊るされた猫", "見方を変える"],
  ["死神", "手放し"],
  ["節制", "調律"],
  ["悪魔", "執着"],
  ["塔", "目覚め"],
  ["星", "希望"],
  ["月", "揺らぎ"],
  ["太陽", "祝福"],
  ["審判", "呼び声"],
  ["世界", "完成"],
] as const;

const colors = ["深紫", "月白", "電脳青", "金砂", "薔薇黒", "翡翠", "星銀"];
const items = ["黒いペン", "温かい飲み物", "小さな鏡", "月モチーフ", "紙のメモ", "香りのあるもの", "古い写真"];
const actions = ["一件だけ先延ばしを終わらせる", "朝に窓を開ける", "名前を丁寧に書く", "通知を一時間だけ切る", "机の左側を整える", "短い散歩をする"];
const times = ["7:10", "10:40", "13:20", "16:30", "21:15", "23:00"];

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(list: readonly T[], seed: number, offset = 0) {
  return list[(seed + offset) % list.length];
}

export function getDateKey(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function normalizeBirthDate(value: string) {
  const match = value.trim().match(/^(\d{4})[\/\-.年\s]*(\d{1,2})[\/\-.月\s]*(\d{1,2})日?$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!valid) return null;

  return {
    year,
    month,
    day,
    label: `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`,
  };
}

function getZodiac(birthDate: string) {
  const normalized = normalizeBirthDate(birthDate);
  if (!normalized) return "星座未確定";
  const md = normalized.month * 100 + normalized.day;
  if (md >= 321 && md <= 419) return "牡羊座";
  if (md >= 420 && md <= 520) return "牡牛座";
  if (md >= 521 && md <= 621) return "双子座";
  if (md >= 622 && md <= 722) return "蟹座";
  if (md >= 723 && md <= 822) return "獅子座";
  if (md >= 823 && md <= 922) return "乙女座";
  if (md >= 923 && md <= 1023) return "天秤座";
  if (md >= 1024 && md <= 1122) return "蠍座";
  if (md >= 1123 && md <= 1221) return "射手座";
  if (md >= 1222 || md <= 119) return "山羊座";
  if (md >= 120 && md <= 218) return "水瓶座";
  return "魚座";
}

function getMoonPhase(seed: number) {
  return pick(["新月前夜", "三日月", "上弦", "十三夜", "満月", "欠けゆく月", "暁の月"], seed);
}

function getNameNumber(name: string, birthDate: string) {
  const normalized = normalizeBirthDate(birthDate);
  const dateValue = normalized ? normalized.year + normalized.month + normalized.day : 0;
  const base = [...name.trim()].reduce((sum, char) => sum + char.charCodeAt(0), dateValue);
  return (base % 9) + 1;
}

function getTarotImageSrc(arcanaName: string) {
  const imageMap: Record<string, string> = {
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

  const key = Object.keys(imageMap).find((name) => arcanaName.includes(name));
  return key ? imageMap[key] : "";
}

function createTarot(seed: number, theme: ReadingTheme): TarotDraw[] {
  const positions = ["過去", "現在", "近未来"];
  return positions.map((position, index) => {
    const card = pick(arcana, seed, index * 7 + theme.length);
    const text = pick(themeSeeds[theme], seed, index);
    return {
      arcana: card[0],
      keyword: card[1],
      position,
      text,
      imageSeed: seed + index * 139,
      imageSrc: getTarotImageSrc(card[0]),
    };
  });
}

export function getDailyPrompt(dateKey = getDateKey()) {
  const seed = hashText(dateKey);
  return pick(
    [
      "今日、いちばん守りたい気持ちは何ですか。",
      "最近くり返し目に入る言葉や数字はありますか。",
      "本当はもう答えが出ているのに、保留していることは何ですか。",
      "誰に見せるためでもなく、整えたい場所はどこですか。",
      "今のあなたが受け取り直してよい褒め言葉は何ですか。",
    ],
    seed,
  );
}

export function createReading(profile: OracleProfile, dateKey = getDateKey()): SeriousReading {
  const normalized = normalizeBirthDate(profile.birthDate);
  const cleanProfile = {
    ...profile,
    birthDate: normalized?.label ?? profile.birthDate.trim(),
    name: profile.name.trim(),
  };
  const seed = hashText(`${cleanProfile.name}-${cleanProfile.birthDate}-${cleanProfile.theme}-${dateKey}`);
  const zodiac = getZodiac(cleanProfile.birthDate);
  const nameNumber = getNameNumber(cleanProfile.name, cleanProfile.birthDate);
  const tarot = createTarot(seed, cleanProfile.theme);
  const moonPhase = getMoonPhase(seed);
  const score = 62 + (seed % 34);
  const themeLabel = themeLabels[cleanProfile.theme];
  const nameCore = pick(["灯", "鏡", "鍵", "泉", "塔", "羽", "星", "針", "庭"], seed + nameNumber);
  const mainMessage = pick(themeSeeds[cleanProfile.theme], seed + nameNumber);
  const tarotLine = tarot.map((card) => `${card.position}の${card.arcana}`).join("、");

  return {
    id: `${dateKey}-${seed}`,
    createdAt: new Date().toISOString(),
    dateKey,
    profile: cleanProfile,
    themeLabel,
    score,
    zodiac,
    nameNumber,
    nameCore,
    moonPhase,
    tarot,
    headline: `${themeLabel}に「${nameCore}」の兆し`,
    summary: `${cleanProfile.name || "あなた"}さんの姓名数${nameNumber}、${zodiac}の星回り、そして${tarotLine}が重なっています。${mainMessage} 読んでいる間に浮かんだ人や場所は、今日の判断材料として扱ってください。`,
    sections: [
      {
        title: "姓名判断から見る今日の軸",
        body: `名前に宿る数は${nameNumber}。今日は「${nameCore}」を象徴にして動くと、散らばっていた考えがまとまりやすくなります。強く押すより、何を残して何を減らすかを選ぶほど運気が安定します。`,
      },
      {
        title: "星の暦から見る流れ",
        body: `${zodiac}と${moonPhase}の組み合わせは、急な答えよりも静かな確信を育てる配置です。生年月日は手書きで受け取った情報として扱い、細かい出生時刻には依存せず、今日の暦との響きで読んでいます。`,
      },
      {
        title: "猫タロットの三枚読み",
        body: `${tarot[0].text} ${tarot[1].text} ${tarot[2].text} 三枚はすべて、結論を急がずに視点を変えることを示しています。特に${tarot[2].arcana}は、近いうちに小さな偶然が合図になる暗示です。`,
      },
      {
        title: "今日の具体策",
        body: `${themeLabel}については、まず一つだけ行動を小さくしてください。大きな決断を完璧にこなすより、${pick(actions, seed, 2)}ことで流れが開きます。迷ったら、違和感が少ない方ではなく、後で自分に説明しやすい方を選ぶと吉です。`,
      },
    ],
    lucky: {
      color: pick(colors, seed),
      item: pick(items, seed, 3),
      action: pick(actions, seed, 5),
      time: pick(times, seed, 1),
    },
    affirmation: `今日の一言: まだ形になっていない直感にも、席をひとつ用意しておく。`,
  };
}
