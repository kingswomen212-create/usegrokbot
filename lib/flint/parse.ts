import { hash } from "./text";
import { titleCase } from "./text";
import {
  SECTION_ORDER,
  type Blueprint,
  type Density,
  type Kind,
  type PaletteId,
  type Section,
  type Tone,
  type UiLocale,
  type BuildMode,
} from "./types";

const SIMPLIFIED = /[这国个东门体后发经对时间网页钟历云广车长开关来过还会说请问题现实进选软设备联系复杂]/;

const KIND_RULES: { kind: Kind; re: RegExp }[] = [
  { kind: "pomodoro", re: /pomodoro|focus timer|番茄鐘|番茄钟|ポモドーロ/i },
  { kind: "calculator", re: /calculator|計算機|计算器|電卓/i },
  { kind: "kanban", re: /kanban|看板/i },
  { kind: "habits", re: /habit|streak|習慣|习惯/i },
  { kind: "expenses", re: /expense|spending|ledger|budget|帳本|账本|家計|支出|開支|开支/i },
  { kind: "inventory", re: /inventory|stock list|庫存|库存|在庫/i },
  { kind: "flashcards", re: /flash\s?cards?|字卡|単語カード|單字卡|单词卡/i },
  { kind: "quiz", re: /\bquiz\b|trivia|測驗|测验|クイズ/i },
  { kind: "fitness", re: /workout|fitness|gym log|健身|訓練記錄|训练记录|トレーニング/i },
  { kind: "notes", re: /\bnotes?\b|notebook|筆記|笔记|メモ帳|ノート/i },
  { kind: "contacts", re: /contacts?|address book|crm|通訊錄|通讯录|連絡先/i },
  { kind: "chat", re: /\bchat\b|inbox|訊息|消息|チャット/i },
  { kind: "calendar", re: /calendar|月曆|月历|カレンダー/i },
  { kind: "feedback", re: /feedback|feature request|upvote|意見|意见|フィードバック/i },
  { kind: "recipes", re: /recipes?|cookbook|食譜|食谱|レシピ/i },
  { kind: "dashboard", re: /dashboard|analytics|儀表|仪表板|ダッシュボード/i },
  { kind: "tasks", re: /to-?dos?|task list|checklist|待辦|待办|タスク/i },
  { kind: "links", re: /link in bio|linktree|連結頁|链接页|リンク集/i },
  { kind: "blog", re: /\bblog\b|magazine|網誌|博客|ブログ/i },
  { kind: "portfolio", re: /portfolio|作品集|ポートフォリオ/i },
  { kind: "menu", re: /\bmenu\b|restaurant|cafe|café|bakery|菜單|菜单|メニュー|茶餐廳|咖啡店/i },
  { kind: "slides", re: /\bslides?\b|slide deck|簡報|幻灯片|スライド/i },
];

const PALETTE_RULES: { id: PaletteId; re: RegExp }[] = [
  { id: "night", re: /\b(dark|night|black|midnight)\b|深色|夜間|夜间|黑色|ダーク|黒/i },
  { id: "sage", re: /sage|forest|\bgreen\b|橄欖|綠|绿|セージ|緑/i },
  { id: "sea", re: /\b(sea|ocean|blue|navy|teal)\b|海藍|海蓝|藍色|蓝色|ブルー|青/i },
  { id: "plum", re: /plum|purple|violet|紫色|紫/i },
  { id: "rose", re: /\b(rose|pink|blush)\b|粉紅|粉红|粉色|ピンク/i },
  { id: "citrus", re: /citrus|lemon|\byellow\b|檸檬|柠檬|黃色|黄色|レモン/i },
  { id: "sand", re: /\b(sand|cream|beige|paper|ivory)\b|米色|奶油|生成り/i },
  { id: "clay", re: /clay|terracotta|\bwarm\b|陶土|暖色|暖かい/i },
  { id: "slate", re: /slate|\bgr[ae]y\b|灰色|グレー/i },
  { id: "ink", re: /\bink\b|墨/i },
];

const PALETTE_CYCLE: PaletteId[] = ["clay", "sage", "sea", "sand", "slate", "plum"];

const STOP = new Set([
  "a",
  "an",
  "the",
  "for",
  "with",
  "and",
  "make",
  "build",
  "create",
  "design",
  "please",
  "me",
  "my",
  "our",
  "app",
  "website",
  "site",
  "page",
  "landing",
  "called",
  "named",
  "using",
  "use",
  "palette",
  "to",
  "of",
  "on",
  "in",
  "it",
]);

export function detectLang(prompt: string): UiLocale {
  if (/[\u3040-\u30ff]/.test(prompt)) return "ja";
  if (SIMPLIFIED.test(prompt)) return "zh-Hans";
  if (/[\u4e00-\u9fff]/.test(prompt)) return "zh-Hant";
  return "en";
}

function earliest<T>(prompt: string, rules: { re: RegExp; value: T }[]): T | null {
  let best: { index: number; value: T } | null = null;
  for (const rule of rules) {
    const match = rule.re.exec(prompt);
    if (!match) continue;
    if (!best || match.index < best.index) best = { index: match.index, value: rule.value };
  }
  return best ? best.value : null;
}

export function detectKind(prompt: string): Kind {
  return (
    earliest(
      prompt,
      KIND_RULES.map((rule) => ({ re: rule.re, value: rule.kind })),
    ) ?? "landing"
  );
}

export function detectPalette(prompt: string, name: string): PaletteId {
  return (
    earliest(
      prompt,
      PALETTE_RULES.map((rule) => ({ re: rule.re, value: rule.id })),
    ) ?? PALETTE_CYCLE[hash(name || prompt) % PALETTE_CYCLE.length]!
  );
}

function detectTone(prompt: string): Tone {
  if (/playful|fun|whimsical|俏皮|好玩|楽しい/i.test(prompt)) return "playful";
  if (/formal|luxury|elegant|正式|高級|高级|上品/i.test(prompt)) return "formal";
  if (/bold|loud|vivid|大膽|大胆/i.test(prompt)) return "bold";
  return "calm";
}

function detectDensity(prompt: string): Density {
  if (/compact|dense|tight|緊湊|紧凑|詰め/i.test(prompt)) return "compact";
  return "comfy";
}

function cleanPiece(value: string): string {
  return value.replace(/^[\s"'「『]+|[\s"'」』]+$/g, "").trim();
}

export function extractName(prompt: string, lang: UiLocale): string {
  const quoted = prompt.match(/[「『"“']([^」』"”']{1,40})[」』"”']/);
  if (quoted) return cleanPiece(quoted[1]!);

  const called = prompt.match(
    /\b(?:called|named)\s+([^,，。]{1,48}?)(?=\s+with\b|\s+and\b|,|，|。|$)/i,
  );
  if (called) return cleanPiece(called[1]!);

  const zh = prompt.match(/(?:叫做|名為|名为|稱為|称为|改名為|改名为)\s*([^\s,，。]{1,24})/);
  if (zh) return cleanPiece(zh[1]!);

  const proper = prompt.match(/\b[A-Z][\p{L}'’.-]*(?:\s+[A-Z][\p{L}'’.-]*)+\b/gu) ?? [];
  const place = proper.find((chunk) => chunk.split(/\s+/).length >= 2);
  if (place) return place;

  if (lang !== "en") {
    const head = cleanPiece((prompt.split(/[，。,]/)[0] ?? "").replace(/^(請|请)?(幫我|帮我)?(做|建立)(一個|一个)?/, ""));
    if (head.length > 0 && head.length <= 10) return head;
    if (lang === "zh-Hans") return "新页面";
    if (lang === "ja") return "新しいページ";
    return "新頁面";
  }

  const words = prompt
    .replace(/[^\p{L}\p{N}\s&'-]/gu, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 1 && !STOP.has(word.toLowerCase()) && !/palette|schedule|pricing|tracker|board|timer|list|page/i.test(word));

  const take = words.slice(0, 3).join(" ");
  if (take) return titleCase(take);
  return "New page";
}

export function detectSections(prompt: string, kind: Kind): Section[] {
  const picked = new Set<Section>();
  if (kind === "landing") {
    picked.add("features");
    picked.add("steps");
    picked.add("stories");
    picked.add("faq");
    picked.add("waitlist");
  }
  if (/pric|plan|subscription|收費|收费|價錢|价钱|價格|价格|料金/i.test(prompt)) picked.add("pricing");
  if (/faq|questions?|常見問題|常见问题|よくある/i.test(prompt)) picked.add("faq");
  if (/testimonial|reviews?|評價|评价|口コミ/i.test(prompt)) picked.add("stories");
  if (/gallery|photos?|相簿|相册|ギャラリー/i.test(prompt)) picked.add("gallery");
  if (/waitlist|sign\s?up|newsletter|登記|登记|候補|候补|登録/i.test(prompt)) picked.add("waitlist");
  if (/schedule|timetable|\bhours\b|\bfares?\b|\bclasses?\b|時間表|时刻表|時刻表|上課|上课|スケジュール/i.test(prompt)) {
    picked.add("schedule");
  }
  return SECTION_ORDER.filter((section) => picked.has(section));
}

function defaultHeadline(name: string, lang: UiLocale, kind: Kind): string {
  if (kind !== "landing") {
    if (lang === "zh-Hans") return name;
    if (lang === "zh-Hant") return name;
    if (lang === "ja") return name;
    return name;
  }
  if (lang === "zh-Hans") return `${name}，把要看的事放在同一页`;
  if (lang === "zh-Hant") return `${name}，把要看的事放在同一頁`;
  if (lang === "ja") return `${name}を、一枚のページに`;
  return `${name}, gathered on one page`;
}

export function parseBrief(prompt: string, mode: BuildMode = "website"): Blueprint {
  const text = prompt.replace(/\s+/g, " ").trim().slice(0, 2000);
  const lang = detectLang(text);
  const detected = detectKind(text);
  const kind = mode === "slides" ? "slides" : mode === "app" && detected === "landing" ? "dashboard" : detected;
  const name = extractName(text, lang).slice(0, 48);
  const palette = detectPalette(text, name);
  const sections = detectSections(text, kind);
  return {
    kind,
    name,
    prompt: text,
    lang,
    palette,
    tone: detectTone(text),
    density: detectDensity(text),
    headline: defaultHeadline(name, lang, kind),
    sections,
    variant: (hash(name + kind) % 3) as 0 | 1 | 2,
  };
}
