import { detectSections, extractName, parseBrief } from "./parse";
import { SECTION_ORDER, type Blueprint, type Density, type Kind, type PaletteId, type Section, type Tone } from "./types";

export type Change =
  | { type: "palette"; palette: PaletteId }
  | { type: "kind"; kind: Kind }
  | { type: "rename"; name: string }
  | { type: "density"; density: Density }
  | { type: "tone"; tone: Tone }
  | { type: "headline"; headline: string }
  | { type: "add"; section: Section }
  | { type: "remove"; section: Section }
  | { type: "rebuild" }
  | { type: "noop" };

const KIND_WORDS: { kind: Kind; re: RegExp }[] = [
  { kind: "pomodoro", re: /pomodoro|番茄鐘|番茄钟|ポモドーロ/i },
  { kind: "calculator", re: /calculator|計算機|计算器|電卓/i },
  { kind: "kanban", re: /kanban|看板/i },
  { kind: "habits", re: /habit|習慣|习惯/i },
  { kind: "expenses", re: /expense|ledger|帳本|账本|家計/i },
  { kind: "inventory", re: /inventory|庫存|库存|在庫/i },
  { kind: "flashcards", re: /flash\s?cards?|字卡/i },
  { kind: "quiz", re: /quiz|測驗|测验|クイズ/i },
  { kind: "fitness", re: /workout|fitness|健身/i },
  { kind: "notes", re: /notes?|筆記|笔记/i },
  { kind: "contacts", re: /contacts?|通訊錄|通讯录|連絡先/i },
  { kind: "chat", re: /chat|訊息頁|消息页/i },
  { kind: "calendar", re: /calendar|月曆|月历/i },
  { kind: "feedback", re: /feedback|意見板|意见/i },
  { kind: "recipes", re: /recipes?|食譜|食谱/i },
  { kind: "dashboard", re: /dashboard|儀表|仪表/i },
  { kind: "tasks", re: /tasks?|to-?dos?|待辦|待办|タスク/i },
  { kind: "links", re: /links?|連結頁|链接页/i },
  { kind: "blog", re: /blog|網誌|博客/i },
  { kind: "portfolio", re: /portfolio|作品集/i },
  { kind: "menu", re: /menu|菜單|菜单|メニュー/i },
  { kind: "slides", re: /\bslides?\b|slide deck|簡報|幻灯片|スライド/i },
  { kind: "landing", re: /landing|website|home\s?page|網站|网站|首頁|首页|サイト/i },
];

const PALETTES: { palette: PaletteId; re: RegExp }[] = [
  { palette: "night", re: /\b(dark|darker|night|black)\b|深色|夜間|夜间|黑色|ダーク/i },
  { palette: "sage", re: /sage|\bgreen\b|橄欖|綠|绿/i },
  { palette: "sea", re: /\b(sea|ocean|blue|teal)\b|海藍|海蓝|藍|蓝/i },
  { palette: "sand", re: /\b(sand|cream|beige|paper|light|lighter)\b|米色|淺色|浅色|紙色|纸色|明る/i },
  { palette: "clay", re: /clay|terracotta|\bwarm\b|陶土/i },
  { palette: "plum", re: /plum|purple|violet|紫/i },
  { palette: "rose", re: /\b(rose|pink)\b|粉/i },
  { palette: "citrus", re: /citrus|lemon|\byellow\b|黃|黄/i },
  { palette: "slate", re: /slate|\bgr[ae]y\b|灰/i },
  { palette: "ink", re: /\bink\b|墨/i },
];

const SECTIONS: { section: Section; re: RegExp }[] = [
  { section: "pricing", re: /pric|收費|收费|價錢|价钱|價格|价格|料金/i },
  { section: "faq", re: /faq|questions?|常見問題|常见问题/i },
  { section: "stories", re: /testimonial|stories|reviews?|評價|评价|口コミ/i },
  { section: "gallery", re: /gallery|photos?|相簿|相册/i },
  { section: "waitlist", re: /waitlist|sign\s?up|newsletter|名單|名单|登記|登记|signup form|表單|表单/i },
  { section: "schedule", re: /schedule|timetable|時間表|时刻|時刻/i },
  { section: "steps", re: /steps|how it works|流程|步驟|步骤/i },
  { section: "features", re: /features|功能/i },
];

function clone(blueprint: Blueprint): Blueprint {
  return { ...blueprint, sections: [...blueprint.sections] };
}

function matchKind(clause: string): Kind | null {
  const hit = KIND_WORDS.find((item) => item.re.test(clause));
  if (!hit) return null;
  if (/make it|switch|turn it|改成|變成|变成|にして/i.test(clause) || clause.trim().length < 24) return hit.kind;
  return null;
}

function matchClause(clause: string): Change | null {
  const rename = clause.match(
    /(?:call it|rename(?: it)? to|name it|改名(?:為|为)?|叫做)\s+["“「『]?(.+?)["”」』]?$/i,
  );
  if (rename?.[1]) return { type: "rename", name: rename[1].trim().slice(0, 48) };

  const headline = clause.match(/(?:headline|tagline|title|標題|标题)\s*(?:is|to|:|改成|改為|改为)\s+(.+)$/i);
  if (headline?.[1]) return { type: "headline", headline: headline[1].trim().slice(0, 80) };

  if (/compact|dense|tight|緊湊|紧凑/i.test(clause)) return { type: "density", density: "compact" };
  if (/spacious|roomier|more room|寬鬆|宽松|ゆったり/i.test(clause)) return { type: "density", density: "comfy" };

  if (/playful|俏皮|楽しい/i.test(clause)) return { type: "tone", tone: "playful" };
  if (/formal|luxury|正式|高級|高级/i.test(clause)) return { type: "tone", tone: "formal" };
  if (/bold|大膽|大胆/i.test(clause)) return { type: "tone", tone: "bold" };
  if (/\bcalm\b|quiet|安靜|安静/i.test(clause)) return { type: "tone", tone: "calm" };

  const removing = /remove|drop|without|不要|去掉|刪掉|删掉|刪除|删除|なし/i.test(clause);
  const section = SECTIONS.find((item) => item.re.test(clause));
  if (section) return { type: removing ? "remove" : "add", section: section.section };

  const palette = PALETTES.find((item) => item.re.test(clause));
  if (palette && /palette|color|colour|theme|色|配色|調|调|use|make|改|にして/i.test(clause)) {
    return { type: "palette", palette: palette.palette };
  }
  if (palette && clause.trim().length < 28) return { type: "palette", palette: palette.palette };

  const kind = matchKind(clause);
  if (kind) return { type: "kind", kind };
  return null;
}

function apply(blueprint: Blueprint, change: Change): Blueprint {
  const next = clone(blueprint);
  if (change.type === "palette") next.palette = change.palette;
  if (change.type === "kind") {
    next.kind = change.kind;
    if (change.kind === "landing" && next.sections.length === 0) {
      next.sections = detectSections(next.prompt, "landing");
    }
  }
  if (change.type === "rename") {
    if (next.headline.includes(next.name)) next.headline = next.headline.replace(next.name, change.name);
    next.name = change.name;
  }
  if (change.type === "density") next.density = change.density;
  if (change.type === "tone") next.tone = change.tone;
  if (change.type === "headline") next.headline = change.headline;
  if (change.type === "add" && !next.sections.includes(change.section)) {
    next.sections = SECTION_ORDER.filter((section) => next.sections.includes(section) || section === change.section);
  }
  if (change.type === "remove") next.sections = next.sections.filter((section) => section !== change.section);
  return next;
}

export function revise(blueprint: Blueprint, instruction: string): { blueprint: Blueprint; changes: Change[] } {
  const text = instruction.replace(/\s+/g, " ").trim().slice(0, 2000);
  if (!text) return { blueprint, changes: [{ type: "noop" }] };
  if (text.length > 110) {
    const rebuilt = parseBrief(text);
    return { blueprint: rebuilt, changes: [{ type: "rebuild" }] };
  }
  const clauses = text
    .split(/\s+and\s+|，|、|然後|然后|そして/i)
    .map((clause) => clause.trim())
    .filter(Boolean);
  const changes: Change[] = [];
  let next = clone(blueprint);
  for (const clause of clauses) {
    const change = matchClause(clause);
    if (!change) continue;
    changes.push(change);
    next = apply(next, change);
  }
  if (changes.length > 0) return { blueprint: next, changes };
  if (text.length > 48) {
    const rebuilt = parseBrief(text);
    rebuilt.name = extractName(text, rebuilt.lang) || rebuilt.name;
    return { blueprint: rebuilt, changes: [{ type: "rebuild" }] };
  }
  return { blueprint, changes: [{ type: "noop" }] };
}
