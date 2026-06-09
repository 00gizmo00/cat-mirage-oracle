export type ZodiacSign = {
  slug: string;
  name: string;
  kana: string;
  english: string;
  motif: string;
  symbol: string;
  imageSrc: string;
  luckyItem: string;
  personality: string;
  catFeature: string;
  love: string;
  work: string;
  relationship: string;
};

export type DailyZodiacRank = ZodiacSign & {
  rank: number;
  luckyColor: string;
  luckyAction: string;
  catMessage: string;
};

export const zodiacSigns: ZodiacSign[] = [
  {
    slug: "aries",
    name: "おひつじ座",
    kana: "牡羊座",
    english: "ARIES",
    motif: "羊角",
    symbol: "♈",
    imageSrc: "/zodiac/aries-cat.webp",
    luckyItem: "赤い小物",
    personality: "直感が先に走り、考える前に一歩を踏み出せる星座です。熱量が高く、停滞した空気を変えるきっかけを作れます。",
    catFeature: "猫星では、金色の羊角を持つ黒猫として描きます。小さな火花を追うように、誰より早く夜道へ飛び出す猫です。",
    love: "恋愛では素直な好意が魅力になります。駆け引きよりも、短くまっすぐな言葉が相手の心に残ります。",
    work: "仕事では新規案件や初動に強さがあります。細部の詰めは後からでも、まず動くことで道を開きます。",
    relationship: "人間関係では勢いが周囲を励ましますが、相手の温度を置き去りにしないことも大切です。",
  },
  {
    slug: "taurus",
    name: "おうし座",
    kana: "牡牛座",
    english: "TAURUS",
    motif: "牛角",
    symbol: "♉",
    imageSrc: "/zodiac/taurus-cat.webp",
    luckyItem: "香りのあるもの",
    personality: "感覚が鋭く、心地よさや安心できる環境を育てる力があります。急がず、確かなものを積み重ねる星座です。",
    catFeature: "猫星では、重厚な牛角を持つ黒猫です。金の首飾りを揺らしながら、豊かな庭を静かに守ります。",
    love: "恋愛では安心感と継続が鍵です。派手な言葉より、変わらず続く態度が信頼を深めます。",
    work: "仕事では品質管理、継続作業、資産づくりに向きます。焦らず形にするほど評価されます。",
    relationship: "人間関係では聞き役として強みが出ます。ただし我慢をためすぎないよう、境界線も持ってください。",
  },
  {
    slug: "gemini",
    name: "ふたご座",
    kana: "双子座",
    english: "GEMINI",
    motif: "双子猫",
    symbol: "♊",
    imageSrc: "/zodiac/gemini-cat.webp",
    luckyItem: "メモ帳",
    personality: "言葉、情報、好奇心が軽やかに動く星座です。複数の視点を行き来し、場の空気を明るくできます。",
    catFeature: "猫星では、向かい合う双子の黒猫として描きます。一匹は月を見て、一匹は人の声を聞く、二つの感覚を持つ猫です。",
    love: "恋愛では会話のテンポが大切です。重い確認より、自然なやりとりの中に本音が出ます。",
    work: "仕事では連絡、編集、企画、情報整理に向きます。短い説明ほど力を持ちます。",
    relationship: "人間関係では橋渡し役になりやすい日があります。広く関わる一方で、疲れたら静かな時間も必要です。",
  },
  {
    slug: "cancer",
    name: "かに座",
    kana: "蟹座",
    english: "CANCER",
    motif: "蟹モチーフ",
    symbol: "♋",
    imageSrc: "/zodiac/cancer-cat.webp",
    luckyItem: "白いマグカップ",
    personality: "守る力、共感、記憶を大切にする星座です。大切な人や場所を包み込むように整えます。",
    catFeature: "猫星では、蟹の甲羅飾りを背負った黒猫です。月の波打ち際で、家へ帰る道を覚えています。",
    love: "恋愛では安心できる居場所づくりがテーマです。相手の反応を気にしすぎず、自分の安心も守ってください。",
    work: "仕事ではサポート、顧客対応、環境整備に向きます。気づかいが具体的な成果になります。",
    relationship: "人間関係では身内意識が強く出ます。守りたい人と、背負いすぎているものを分けることが大切です。",
  },
  {
    slug: "leo",
    name: "しし座",
    kana: "獅子座",
    english: "LEO",
    motif: "ライオンたてがみ",
    symbol: "♌",
    imageSrc: "/zodiac/leo-cat.webp",
    luckyItem: "金色のアクセサリー",
    personality: "表現力、誇り、祝福を受け取る力を持つ星座です。自分らしさを隠さないほど周囲を明るくします。",
    catFeature: "猫星では、金のたてがみを持つ黒猫です。夜の舞台中央で、星明かりを堂々と受け取ります。",
    love: "恋愛では好意を隠しすぎないことが魅力になります。褒め言葉や笑顔が流れを開きます。",
    work: "仕事では発表、創作、リーダー役に向きます。自分の成果をきちんと見せることが大切です。",
    relationship: "人間関係では場を明るくする力があります。一方で、注目されない時間も自分の価値を減らしません。",
  },
  {
    slug: "virgo",
    name: "おとめ座",
    kana: "乙女座",
    english: "VIRGO",
    motif: "百合",
    symbol: "♍",
    imageSrc: "/zodiac/virgo-cat.webp",
    luckyItem: "細いペン",
    personality: "観察、整理、改善の力を持つ星座です。小さな違和感を見つけ、暮らしや仕事を整えます。",
    catFeature: "猫星では、百合をそばに置く黒猫です。古い机の上で、散らばった星図を一枚ずつ整えます。",
    love: "恋愛では細やかな気づかいが伝わります。ただし完璧な返事を考えすぎず、やわらかさも残してください。",
    work: "仕事では確認、分析、修正、品質改善に向きます。小さな整備が大きな信頼になります。",
    relationship: "人間関係では相手の困りごとに気づけます。助ける前に、自分の余力も確認しましょう。",
  },
  {
    slug: "libra",
    name: "てんびん座",
    kana: "天秤座",
    english: "LIBRA",
    motif: "天秤",
    symbol: "♎",
    imageSrc: "/zodiac/libra-cat.webp",
    luckyItem: "鏡",
    personality: "調和、美意識、バランス感覚に優れた星座です。人と人の間に橋をかけ、空気を整えます。",
    catFeature: "猫星では、小さな天秤を掲げる黒猫です。金の皿に月光と言葉を乗せ、ちょうどよい重さを測ります。",
    love: "恋愛では対等さが鍵です。合わせすぎず、相手にも自分にも美しい距離を探してください。",
    work: "仕事では交渉、調整、デザイン、比較検討に向きます。見せ方を整えることで伝わりやすくなります。",
    relationship: "人間関係では仲裁役になりやすい一方、自分の本音を後回しにしすぎないことが大切です。",
  },
  {
    slug: "scorpio",
    name: "さそり座",
    kana: "蠍座",
    english: "SCORPIO",
    motif: "蠍尾",
    symbol: "♏",
    imageSrc: "/zodiac/scorpio-cat.webp",
    luckyItem: "深紫の布",
    personality: "深い集中力、洞察、変容の力を持つ星座です。表面ではなく、物事の奥にある本音へ近づきます。",
    catFeature: "猫星では、蠍尾の装飾を持つ黒猫です。静かな水辺で、光の届かない感情を見つめています。",
    love: "恋愛では強い結びつきや独占欲がテーマになります。深さを求めるほど、信頼の確認が必要です。",
    work: "仕事では調査、専門性、集中作業に向きます。一つのテーマを掘るほど成果が出ます。",
    relationship: "人間関係では本音を見抜く力があります。ただし疑いすぎると距離が固くなるので注意してください。",
  },
  {
    slug: "sagittarius",
    name: "いて座",
    kana: "射手座",
    english: "SAGITTARIUS",
    motif: "弓矢",
    symbol: "♐",
    imageSrc: "/zodiac/sagittarius-cat.webp",
    luckyItem: "旅の写真",
    personality: "冒険、学び、遠くを見る視野を持つ星座です。今いる場所を越えて、次の可能性へ矢を放ちます。",
    catFeature: "猫星では、星の弓矢を持つ黒猫です。高い丘から夜空の一点を狙い、遠い未来へ合図を送ります。",
    love: "恋愛では自由さと誠実さの両立が鍵です。楽しい予定を共有すると関係が軽やかになります。",
    work: "仕事では学習、発信、海外や遠方に関わるテーマに向きます。大きな目標を小さな一歩へ落としてください。",
    relationship: "人間関係では率直さが魅力です。ただし言葉が速くなりすぎないよう、相手の反応も見ましょう。",
  },
  {
    slug: "capricorn",
    name: "やぎ座",
    kana: "山羊座",
    english: "CAPRICORN",
    motif: "山羊角",
    symbol: "♑",
    imageSrc: "/zodiac/capricorn-cat.webp",
    luckyItem: "革の小物",
    personality: "責任、継続、現実を形にする力を持つ星座です。時間を味方にし、確かな階段を作ります。",
    catFeature: "猫星では、山羊角を持つ黒猫です。険しい石段を一段ずつ登り、頂上の月を見据えます。",
    love: "恋愛では誠実さや将来性を重視します。派手な言葉より、続けられる約束が安心を作ります。",
    work: "仕事では計画、管理、長期目標に向きます。今日の一手が数か月後の土台になります。",
    relationship: "人間関係では頼られやすい星座です。責任を引き受けすぎないよう、できる範囲を伝えましょう。",
  },
  {
    slug: "aquarius",
    name: "みずがめ座",
    kana: "水瓶座",
    english: "AQUARIUS",
    motif: "水瓶",
    symbol: "♒",
    imageSrc: "/zodiac/aquarius-cat.webp",
    luckyItem: "青いガラス",
    personality: "自由な発想、未来志向、独自の距離感を持つ星座です。常識の外側から新しい流れを注ぎます。",
    catFeature: "猫星では、水瓶から星水を注ぐ黒猫です。誰のものでもない夜空へ、静かなひらめきを流します。",
    love: "恋愛では友人のような軽やかさが魅力です。束縛より、尊重し合う距離が心を開きます。",
    work: "仕事では企画、技術、改善、新しい仕組みに向きます。違和感をアイデアへ変える力があります。",
    relationship: "人間関係では個性を尊重できます。ただし離れすぎると冷たく見えるので、短い言葉で気持ちを添えてください。",
  },
  {
    slug: "pisces",
    name: "うお座",
    kana: "魚座",
    english: "PISCES",
    motif: "魚モチーフ",
    symbol: "♓",
    imageSrc: "/zodiac/pisces-cat.webp",
    luckyItem: "小さな鈴",
    personality: "想像力、共感、境界を越える感受性を持つ星座です。言葉にならない気配を受け取ります。",
    catFeature: "猫星では、魚の尾飾りをまとった黒猫です。星の水面を歩き、夢と現実の境目を行き来します。",
    love: "恋愛では優しさと共感が魅力です。相手に溶け込みすぎず、自分の輪郭も残してください。",
    work: "仕事では創作、癒やし、サポート、イメージを扱う作業に向きます。感覚を形にする工夫が鍵です。",
    relationship: "人間関係では人の痛みに気づきやすい星座です。寄り添う前に、自分の心も守りましょう。",
  },
];

const luckyColors = ["月白", "金砂", "深紫", "夜藍", "星銀", "薔薇黒", "翡翠", "薄藤"];
const luckyActions = [
  "朝いちばんに水を飲む",
  "机の左側を整える",
  "気になる人へ短い言葉を送る",
  "五分だけ外の空気を吸う",
  "今日やめることを一つ決める",
  "夜に保存した鑑定を読み返す",
  "財布の中を軽く整える",
  "月や星のモチーフを身につける",
];
const catMessages = [
  "急がなくても、足音はちゃんと未来に届いています。",
  "気になるほうへ鼻先を向けて。今日は小さな好奇心が鍵です。",
  "守りたいものを一つ選ぶと、迷いが少し静かになります。",
  "言葉にする前の違和感を、今日は無視しないでください。",
  "背伸びより、しっぽを整えるくらいの余裕が吉です。",
  "夜にもう一度読み返すと、朝とは違う意味が見えます。",
];

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededValue(seed: number) {
  return Math.imul(seed ^ 0x9e3779b9, 2654435761) >>> 0;
}

export function getZodiacSign(slug: string) {
  return zodiacSigns.find((sign) => sign.slug === slug);
}

export function getDailyZodiacRanking(dateKey: string): DailyZodiacRank[] {
  const baseSeed = hashText(`cat-mirage-zodiac-${dateKey}`);

  return [...zodiacSigns]
    .map((sign, index) => ({
      sign,
      value: seededValue(baseSeed + index * 137 + sign.slug.length * 31),
    }))
    .sort((a, b) => a.value - b.value)
    .map(({ sign }, index) => {
      const seed = seededValue(baseSeed + index * 89 + sign.english.length);
      return {
        ...sign,
        rank: index + 1,
        luckyColor: luckyColors[seed % luckyColors.length],
        luckyAction: luckyActions[(seed >>> 3) % luckyActions.length],
        catMessage: catMessages[(seed >>> 5) % catMessages.length],
      };
    });
}

export function getRelatedZodiacSigns(currentSlug: string, limit = 3) {
  return zodiacSigns
    .filter((sign) => sign.slug !== currentSlug)
    .slice(0, limit)
    .map((sign) => ({ href: `/zodiac/${sign.slug}`, label: `${sign.name} ${sign.english}` }));
}

