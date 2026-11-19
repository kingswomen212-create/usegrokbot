import type { Change } from "./revise";
import type { Blueprint, BuildMode, Kind, UiLocale } from "./types";

export type StudioCopy = {
  product: string;
  eyebrow: string;
  title: string;
  lede: string;
  placeholder: string;
  build: string;
  composing: string;
  examples: string;
  library: string;
  open: string;
  delete: string;
  confirmDelete: string;
  back: string;
  chat: string;
  preview: string;
  code: string;
  download: string;
  files: string;
  desktop: string;
  phone: string;
  openTab: string;
  undo: string;
  reset: string;
  send: string;
  follow: string;
  diverged: string;
  emptyCode: string;
  previewTitle: string;
  newBrief: string;
  help: string;
  youEdited: string;
  catalog: string;
  writing: string;
  samples: { label: string; prompt: string }[];
  kinds: Record<Kind, string>;
  modes: { id: BuildMode; label: string }[];
  startFrom: string;
};

const en: StudioCopy = {
  product: "Builder",
  eyebrow: "Prompt, then a running page",
  title: "What will you build today?",
  lede: "Create apps and websites from one prompt.",
  placeholder: "Let's build a prototype...",
  build: "Build now",
  composing: "Composing the page",
  examples: "or start from",
  library: "Your projects",
  open: "Open",
  delete: "Delete",
  confirmDelete: "Confirm delete",
  back: "Home",
  chat: "Brief",
  preview: "Preview",
  code: "Code",
  download: "Download",
  files: "Files",
  desktop: "Desktop",
  phone: "Phone",
  openTab: "New tab",
  undo: "Undo",
  reset: "Rebuild",
  send: "Update",
  follow: "Change the brief. Try “use a night palette” or “make it a task list”.",
  diverged: "You edited the files. This update rebuilds them from the brief.",
  emptyCode: "This file is empty.",
  previewTitle: "Running page",
  newBrief: "New",
  help: "I can change the palette, the name, the kind of page, and which sections stay. Try “use a sea palette”, “call it Harbor”, or “add pricing”.",
  youEdited: "Direct edits stay until the next brief update.",
  catalog: "UseGrokBot",
  writing: "Writing",
  samples: [],
  kinds: {
    landing: "Page",
    tasks: "Tasks",
    kanban: "Board",
    notes: "Notes",
    habits: "Habits",
    expenses: "Ledger",
    pomodoro: "Timer",
    calculator: "Calculator",
    quiz: "Quiz",
    flashcards: "Cards",
    contacts: "People",
    calendar: "Calendar",
    dashboard: "Overview",
    feedback: "Ideas",
    recipes: "Recipes",
    menu: "Menu",
    portfolio: "Portfolio",
    blog: "Journal",
    links: "Links",
    chat: "Messages",
    fitness: "Training",
    inventory: "Stock",
    slides: "Slides",
  },
  modes: [
    { id: "website", label: "Website" },
    { id: "app", label: "App" },
    { id: "prototype", label: "Prototype" },
    { id: "slides", label: "Slides" },
  ],
  startFrom: "or start from",
};

const zhHant: StudioCopy = {
  ...en,
  eyebrow: "一句話，接著就能使用",
  title: "今天要做什麼？",
  lede: "用一句話做出網站或應用。結果就在這個瀏覽器裡，你還可以繼續改。",
  placeholder: "做一個可以點的原型…",
  build: "開始做",
  composing: "正在組成頁面",
  examples: "或從這裡開始",
  library: "這部裝置上",
  open: "打開",
  delete: "刪除",
  confirmDelete: "確認刪除",
  back: "列表",
  chat: "說明",
  preview: "預覽",
  code: "程式",
  download: "下載",
  files: "檔案",
  desktop: "電腦",
  phone: "手機",
  openTab: "新分頁",
  undo: "還原",
  reset: "重建",
  send: "更新",
  follow: "改說明。可以試「改成深色」或「改成待辦」。",
  diverged: "你改過檔案。這次更新會依說明重新組成。",
  emptyCode: "這個檔案是空的。",
  previewTitle: "正在運行的頁面",
  newBrief: "新的",
  help: "可以改配色、名稱、頁面種類，以及要留下哪些部分。試「改成海藍」、「改名為 Harbor」或「加上價錢」。",
  youEdited: "直接改過的程式會留到下一次更新說明。",
  writing: "正在寫",
  samples: [],
  kinds: {
    landing: "頁面",
    tasks: "待辦",
    kanban: "看板",
    notes: "筆記",
    habits: "習慣",
    expenses: "帳本",
    pomodoro: "計時",
    calculator: "計算機",
    quiz: "測驗",
    flashcards: "卡片",
    contacts: "聯絡人",
    calendar: "月曆",
    dashboard: "概覽",
    feedback: "想法",
    recipes: "食譜",
    menu: "菜單",
    portfolio: "作品",
    blog: "日誌",
    links: "連結",
    chat: "訊息",
    fitness: "訓練",
    inventory: "庫存",
    slides: "簡報",
  },
  modes: [
    { id: "website", label: "網站" },
    { id: "app", label: "應用" },
    { id: "prototype", label: "原型" },
    { id: "slides", label: "簡報" },
  ],
  startFrom: "或從這裡開始",
};

const zhHans: StudioCopy = {
  ...zhHant,
  eyebrow: "一句话，接着就能使用",
  title: "今天要做什么？",
  lede: "用一句话做出网站或应用。结果就在这个浏览器里，你还可以继续改。",
  placeholder: "做一个可以点的原型…",
  build: "开始做",
  composing: "正在组成页面",
  examples: "或从这里开始",
  library: "这部装置上",
  open: "打开",
  delete: "删除",
  confirmDelete: "确认删除",
  back: "列表",
  chat: "说明",
  preview: "预览",
  code: "代码",
  download: "下载",
  follow: "改说明。可以试「改成深色」或「改成待办」。",
  diverged: "你改过文件。这次更新会依说明重新组成。",
  emptyCode: "这个文件是空的。",
  previewTitle: "正在运行的页面",
  newBrief: "新的",
  help: "可以改配色、名称、页面种类，以及要留下哪些部分。试「改成海蓝」、「改名为 Harbor」或「加上价钱」。",
  youEdited: "直接改过的代码会留到下一次更新说明。",
  writing: "正在写",
  samples: [],
  kinds: {
    ...zhHant.kinds,
    landing: "页面",
    tasks: "待办",
    notes: "笔记",
    habits: "习惯",
    expenses: "账本",
    quiz: "测验",
    contacts: "联系人",
    calendar: "月历",
    feedback: "想法",
    recipes: "食谱",
    blog: "日志",
    links: "链接",
    chat: "消息",
    inventory: "库存",
    slides: "幻灯片",
  },
  modes: [
    { id: "website", label: "网站" },
    { id: "app", label: "应用" },
    { id: "prototype", label: "原型" },
    { id: "slides", label: "幻灯片" },
  ],
  startFrom: "或从这里开始",
};

const ja: StudioCopy = {
  ...en,
  eyebrow: "一文を、そのまま使えるページに",
  title: "今日は何を作りますか？",
  lede: "一文から、サイトかアプリを作ります。このブラウザで動いて、そのあと直せます。",
  placeholder: "動くプロトタイプを作る…",
  build: "今すぐ作る",
  composing: "ページを組んでいます",
  examples: "またはここから",
  library: "この装置",
  open: "開く",
  delete: "削除",
  confirmDelete: "削除を確定",
  back: "一覧",
  chat: "説明",
  preview: "プレビュー",
  code: "コード",
  download: "ダウンロード",
  files: "ファイル",
  desktop: "画面",
  phone: "携帯",
  openTab: "新しいタブ",
  undo: "戻す",
  reset: "組み直す",
  send: "更新",
  follow: "説明を変える。「ダークにする」や「タスクにする」。",
  diverged: "ファイルを編集しています。更新すると説明から組み直します。",
  emptyCode: "このファイルは空です。",
  previewTitle: "動いているページ",
  newBrief: "新規",
  help: "色、名前、種類、残す部分を変えられます。「海の色」「Harbor にする」「料金を足す」を試してください。",
  youEdited: "直接の編集は、次の更新まで残ります。",
  writing: "記述中",
  samples: [],
  kinds: {
    landing: "ページ",
    tasks: "タスク",
    kanban: "ボード",
    notes: "ノート",
    habits: "習慣",
    expenses: "家計",
    pomodoro: "タイマー",
    calculator: "電卓",
    quiz: "クイズ",
    flashcards: "カード",
    contacts: "連絡先",
    calendar: "暦",
    dashboard: "概要",
    feedback: "アイデア",
    recipes: "レシピ",
    menu: "メニュー",
    portfolio: "作品",
    blog: "日誌",
    links: "リンク",
    chat: "メッセージ",
    fitness: "トレーニング",
    inventory: "在庫",
    slides: "スライド",
  },
  modes: [
    { id: "website", label: "サイト" },
    { id: "app", label: "アプリ" },
    { id: "prototype", label: "プロトタイプ" },
    { id: "slides", label: "スライド" },
  ],
  startFrom: "またはここから",
};

const COPY: Record<UiLocale, StudioCopy> = {
  en,
  "zh-Hant": zhHant,
  "zh-Hans": zhHans,
  ja,
};

export function studioCopy(locale: UiLocale): StudioCopy {
  return COPY[locale];
}

export function explain(changes: Change[], blueprint: Blueprint, locale: UiLocale): string {
  const copy = studioCopy(locale);
  if (changes.length === 1 && changes[0]?.type === "noop") return copy.help;
  const lines = changes.map((change) => line(change, blueprint, locale, copy));
  return lines.join(" ");
}

function line(change: Change, blueprint: Blueprint, locale: UiLocale, copy: StudioCopy): string {
  const zh = locale.startsWith("zh");
  const hans = locale === "zh-Hans";
  if (change.type === "rebuild") {
    return zh
      ? hans
        ? `已按新说明重做「${blueprint.name}」。`
        : `已按新說明重做「${blueprint.name}」。`
      : locale === "ja"
        ? `新しい説明で「${blueprint.name}」を組み直しました。`
        : `Rebuilt “${blueprint.name}” from the new brief.`;
  }
  if (change.type === "palette") {
    return zh
      ? hans
        ? `配色改为${change.palette}。`
        : `配色改為${change.palette}。`
      : locale === "ja"
        ? `配色を ${change.palette} にしました。`
        : `Palette is now ${change.palette}.`;
  }
  if (change.type === "kind") {
    const label = copy.kinds[change.kind];
    return zh
      ? hans
        ? `页面改为${label}。`
        : `頁面改為${label}。`
      : locale === "ja"
        ? `${label}に変えました。`
        : `This is now a ${label.toLowerCase()}.`;
  }
  if (change.type === "rename") {
    return zh
      ? hans
        ? `名称改为「${change.name}」。`
        : `名稱改為「${change.name}」。`
      : locale === "ja"
        ? `名前を「${change.name}」にしました。`
        : `Name is now “${change.name}”.`;
  }
  if (change.type === "density") {
    return change.density === "compact"
      ? zh
        ? hans
          ? "排得更紧。"
          : "排得更緊。"
        : locale === "ja"
          ? "余白を詰めました。"
          : "Spacing is tighter."
      : zh
        ? hans
          ? "留白更多。"
          : "留白更多。"
        : locale === "ja"
          ? "余白を広げました。"
          : "Spacing is more open.";
  }
  if (change.type === "tone") {
    return zh
      ? hans
        ? `语气改为${change.tone}。`
        : `語氣改為${change.tone}。`
      : locale === "ja"
        ? `調子を ${change.tone} にしました。`
        : `Tone is now ${change.tone}.`;
  }
  if (change.type === "headline") {
    return zh
      ? hans
        ? `标题改为「${change.headline}」。`
        : `標題改為「${change.headline}」。`
      : locale === "ja"
        ? `見出しを「${change.headline}」にしました。`
        : `Headline is now “${change.headline}”.`;
  }
  if (change.type === "add") {
    return zh
      ? hans
        ? `加上了${change.section}。`
        : `加上了${change.section}。`
      : locale === "ja"
        ? `${change.section} を足しました。`
        : `Added ${change.section}.`;
  }
  if (change.type === "remove") {
    return zh
      ? hans
        ? `拿掉了${change.section}。`
        : `拿掉了${change.section}。`
      : locale === "ja"
        ? `${change.section} を外しました。`
        : `Removed ${change.section}.`;
  }
  return copy.help;
}

export function opening(blueprint: Blueprint, locale: UiLocale): string {
  const copy = studioCopy(locale);
  const kind = copy.kinds[blueprint.kind];
  if (locale === "zh-Hans") {
    return `「${blueprint.name}」是一个${kind}，配色是 ${blueprint.palette}。可以直接使用，也可以改说明。`;
  }
  if (locale === "zh-Hant") {
    return `「${blueprint.name}」是一個${kind}，配色是 ${blueprint.palette}。可以直接使用，也可以改說明。`;
  }
  if (locale === "ja") {
    return `「${blueprint.name}」は${kind}です。配色は ${blueprint.palette}。このまま使っても、説明を変えてもいい。`;
  }
  return `“${blueprint.name}” is a ${kind.toLowerCase()} in the ${blueprint.palette} palette. Use it, or change the brief.`;
}

export function suggestions(blueprint: Blueprint, locale: UiLocale): { label: string; text: string }[] {
  const zh = locale === "zh-Hant";
  const hans = locale === "zh-Hans";
  const ja = locale === "ja";
  const night = blueprint.palette === "night";
  const items = [
    night
      ? { label: zh ? "改成淺色" : hans ? "改成浅色" : ja ? "明るく" : "Use a sand palette", text: zh || hans ? "改成淺色" : ja ? "明るくする" : "use a sand palette" }
      : { label: zh ? "改成深色" : hans ? "改成深色" : ja ? "ダーク" : "Use a night palette", text: zh || hans ? "改成深色" : ja ? "ダークにする" : "use a night palette" },
    blueprint.density === "compact"
      ? { label: zh ? "留白多一點" : hans ? "留白多一点" : ja ? "余白" : "More space", text: zh ? "寬鬆一點" : hans ? "宽松一点" : ja ? "ゆったり" : "make it more spacious" }
      : { label: zh ? "排緊一點" : hans ? "排紧一点" : ja ? "詰める" : "Tighter", text: zh ? "緊湊一點" : hans ? "紧凑一点" : ja ? "詰め" : "make it more compact" },
  ];
  if (blueprint.kind === "landing") {
    items.push(
      blueprint.sections.includes("pricing")
        ? { label: zh ? "改成待辦" : hans ? "改成待办" : ja ? "タスク" : "Make it tasks", text: zh || hans ? "改成待辦" : ja ? "タスクにする" : "make it a task list" }
        : { label: zh ? "加上價錢" : hans ? "加上价钱" : ja ? "料金" : "Add pricing", text: zh || hans ? "加上價錢" : ja ? "料金を足す" : "add pricing" },
    );
  } else {
    items.push({
      label: zh ? "改成頁面" : hans ? "改成页面" : ja ? "ページ" : "Make it a page",
      text: zh || hans ? "改成網站" : ja ? "サイトにする" : "make it a website",
    });
  }
  if (hans) {
    return items.map((item) => ({
      ...item,
      text: item.text.replace("淺", "浅").replace("緊", "紧").replace("寬", "宽").replace("價", "价").replace("辦", "办").replace("網", "网").replace("頁", "页"),
    }));
  }
  return items;
}
