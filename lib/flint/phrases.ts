import type { Kind, UiLocale } from "./types";

export type Phrases = {
  add: string;
  del: string;
  save: string;
  search: string;
  all: string;
  open: string;
  done: string;
  clearDone: string;
  start: string;
  pause: string;
  reset: string;
  focus: string;
  shortBreak: string;
  sessions: string;
  newItem: string;
  empty: string;
  total: string;
  amount: string;
  note: string;
  category: string;
  week: string;
  month: string;
  name: string;
  email: string;
  send: string;
  upvote: string;
  next: string;
  flip: string;
  knew: string;
  again: string;
  ingredients: string;
  method: string;
  quantity: string;
  low: string;
  event: string;
  phone: string;
  company: string;
  remaining: string;
  features: string;
  how: string;
  pricing: string;
  stories: string;
  faq: string;
  gallery: string;
  schedule: string;
  waitlist: string;
  join: string;
  joined: string;
  monthly: string;
  yearly: string;
  getStarted: string;
  seeDetails: string;
  filter: string;
  todo: string;
  doing: string;
  addCard: string;
  today: string;
  title: string;
  read: string;
  back: string;
  visit: string;
  sets: string;
  reps: string;
  exercise: string;
  log: string;
  you: string;
  reply: string;
  localReplies: string;
  correct: string;
  check: string;
  question: string;
  of: string;
  guest: string;
  hours: string;
  fare: string;
  seats: string;
  from: string;
  planVisitor: string;
  planRegular: string;
  planStudio: string;
  perMonth: string;
  perYear: string;
  stepLook: string;
  stepChoose: string;
  stepArrive: string;
  faqQ: [string, string, string];
  titles: Record<Kind, string>;
  yearNote: string;
};

const en: Phrases = {
  add: "Add",
  del: "Delete",
  save: "Save",
  search: "Search",
  all: "All",
  open: "Open",
  done: "Done",
  clearDone: "Clear done",
  start: "Start",
  pause: "Pause",
  reset: "Reset",
  focus: "Focus",
  shortBreak: "Break",
  sessions: "Sessions",
  newItem: "New",
  empty: "Nothing here yet.",
  total: "Total",
  amount: "Amount",
  note: "Note",
  category: "Category",
  week: "Week",
  month: "Month",
  name: "Name",
  email: "Email",
  send: "Send",
  upvote: "Upvote",
  next: "Next",
  flip: "Flip",
  knew: "Knew it",
  again: "Again",
  ingredients: "Ingredients",
  method: "Method",
  quantity: "Quantity",
  low: "Low",
  event: "Event",
  phone: "Phone",
  company: "Company",
  remaining: "Remaining",
  features: "What you get",
  how: "How a visit goes",
  pricing: "Pricing",
  stories: "From the room",
  faq: "Questions",
  gallery: "A look around",
  schedule: "Schedule",
  waitlist: "Leave your email",
  join: "Join the list",
  joined: "You are on the list.",
  monthly: "Monthly",
  yearly: "Yearly",
  getStarted: "Start here",
  seeDetails: "See the details",
  filter: "Filter",
  todo: "To do",
  doing: "Doing",
  addCard: "Add a card",
  today: "Today",
  title: "Title",
  read: "Read",
  back: "Back",
  visit: "Open",
  sets: "Sets",
  reps: "Reps",
  exercise: "Exercise",
  log: "Log",
  you: "You",
  reply: "Reply",
  localReplies: "Replies stay on this page.",
  correct: "Correct",
  check: "Check",
  question: "Question",
  of: "of",
  guest: "Guest",
  hours: "Hours",
  fare: "Fare",
  seats: "Seats",
  from: "From",
  planVisitor: "Visitor",
  planRegular: "Regular",
  planStudio: "Studio",
  perMonth: "/ month",
  perYear: "/ year",
  stepLook: "Look through the page",
  stepChoose: "Choose what fits",
  stepArrive: "Show up, or write to us",
  faqQ: [
    "Do I need an account?",
    "Can I visit without booking?",
    "How do I change a plan?",
  ],
  titles: {
    landing: "Overview",
    tasks: "Open loops",
    kanban: "The board",
    notes: "Notes",
    habits: "This week",
    expenses: "The ledger",
    pomodoro: "Focus",
    calculator: "Calculator",
    quiz: "A short quiz",
    flashcards: "Cards",
    contacts: "People",
    calendar: "Month",
    dashboard: "Overview",
    feedback: "Ideas",
    recipes: "Recipes",
    menu: "Menu",
    portfolio: "Selected work",
    blog: "Journal",
    links: "Links",
    chat: "Messages",
    fitness: "Training log",
    inventory: "Stock",
  },
  yearNote: "Made to be used",
};

const zhHant: Phrases = {
  add: "新增",
  del: "刪除",
  save: "儲存",
  search: "搜尋",
  all: "全部",
  open: "未完成",
  done: "已完成",
  clearDone: "清除已完成",
  start: "開始",
  pause: "暫停",
  reset: "重設",
  focus: "專注",
  shortBreak: "休息",
  sessions: "回合",
  newItem: "新增",
  empty: "這裡還沒有內容。",
  total: "合計",
  amount: "金額",
  note: "備註",
  category: "分類",
  week: "本週",
  month: "本月",
  name: "名稱",
  email: "電郵",
  send: "送出",
  upvote: "支持",
  next: "下一題",
  flip: "翻面",
  knew: "記得",
  again: "再看",
  ingredients: "材料",
  method: "做法",
  quantity: "數量",
  low: "偏低",
  event: "事項",
  phone: "電話",
  company: "機構",
  remaining: "剩餘",
  features: "你可以做的事",
  how: "一次到訪",
  pricing: "收費",
  stories: "用過的人",
  faq: "常見問題",
  gallery: "環境",
  schedule: "時間",
  waitlist: "留下電郵",
  join: "加入名單",
  joined: "你已在名單上。",
  monthly: "按月",
  yearly: "按年",
  getStarted: "從這裡開始",
  seeDetails: "看細節",
  filter: "篩選",
  todo: "待做",
  doing: "進行中",
  addCard: "新增卡片",
  today: "今天",
  title: "標題",
  read: "閱讀",
  back: "返回",
  visit: "打開",
  sets: "組數",
  reps: "次數",
  exercise: "動作",
  log: "記錄",
  you: "你",
  reply: "回覆",
  localReplies: "回覆只留在這個頁面。",
  correct: "答對",
  check: "核對",
  question: "題目",
  of: "/",
  guest: "客人",
  hours: "營業",
  fare: "票價",
  seats: "名額",
  from: "由",
  planVisitor: "訪客",
  planRegular: "常客",
  planStudio: "工作室",
  perMonth: "/ 月",
  perYear: "/ 年",
  stepLook: "先看清楚這一頁",
  stepChoose: "選適合的安排",
  stepArrive: "到場，或先寫信給我們",
  faqQ: ["需要帳戶嗎？", "可以不預約就來嗎？", "之後可以改方案嗎？"],
  titles: {
    landing: "概覽",
    tasks: "未完成的事",
    kanban: "看板",
    notes: "筆記",
    habits: "這一週",
    expenses: "帳本",
    pomodoro: "專注",
    calculator: "計算機",
    quiz: "小測驗",
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
    fitness: "訓練記錄",
    inventory: "庫存",
  },
  yearNote: "做好就能用",
};

const zhHans: Phrases = {
  ...zhHant,
  add: "新增",
  del: "删除",
  save: "保存",
  search: "搜索",
  open: "未完成",
  done: "已完成",
  clearDone: "清除已完成",
  reset: "重置",
  shortBreak: "休息",
  sessions: "回合",
  empty: "这里还没有内容。",
  total: "合计",
  amount: "金额",
  note: "备注",
  category: "分类",
  week: "本周",
  month: "本月",
  email: "邮箱",
  send: "发送",
  upvote: "支持",
  knew: "记得",
  again: "再看",
  ingredients: "材料",
  method: "做法",
  quantity: "数量",
  low: "偏低",
  event: "事项",
  phone: "电话",
  company: "机构",
  remaining: "剩余",
  features: "你可以做的事",
  how: "一次到访",
  pricing: "收费",
  stories: "用过的人",
  faq: "常见问题",
  gallery: "环境",
  schedule: "时间",
  waitlist: "留下邮箱",
  join: "加入名单",
  joined: "你已在名单上。",
  monthly: "按月",
  yearly: "按年",
  getStarted: "从这里开始",
  seeDetails: "看细节",
  filter: "筛选",
  todo: "待做",
  doing: "进行中",
  addCard: "新增卡片",
  today: "今天",
  read: "阅读",
  back: "返回",
  visit: "打开",
  sets: "组数",
  reps: "次数",
  exercise: "动作",
  log: "记录",
  reply: "回复",
  localReplies: "回复只留在这个页面。",
  correct: "答对",
  check: "核对",
  question: "题目",
  guest: "客人",
  hours: "营业",
  fare: "票价",
  seats: "名额",
  from: "从",
  planVisitor: "访客",
  planRegular: "常客",
  planStudio: "工作室",
  perMonth: "/ 月",
  perYear: "/ 年",
  stepLook: "先看清楚这一页",
  stepChoose: "选适合的安排",
  stepArrive: "到场，或先写信给我们",
  faqQ: ["需要账户吗？", "可以不预约就来吗？", "之后可以改方案吗？"],
  titles: {
    ...zhHant.titles,
    tasks: "未完成的事",
    habits: "这一周",
    expenses: "账本",
    calendar: "月历",
    feedback: "想法",
    blog: "日志",
    links: "链接",
    chat: "消息",
    fitness: "训练记录",
    inventory: "库存",
  },
  yearNote: "做好就能用",
};

const ja: Phrases = {
  add: "追加",
  del: "削除",
  save: "保存",
  search: "検索",
  all: "すべて",
  open: "未了",
  done: "完了",
  clearDone: "完了を消す",
  start: "開始",
  pause: "一時停止",
  reset: "リセット",
  focus: "集中",
  shortBreak: "休憩",
  sessions: "回数",
  newItem: "新規",
  empty: "まだ何もありません。",
  total: "合計",
  amount: "金額",
  note: "メモ",
  category: "分類",
  week: "今週",
  month: "今月",
  name: "名前",
  email: "メール",
  send: "送信",
  upvote: "賛成",
  next: "次へ",
  flip: "裏返す",
  knew: "覚えた",
  again: "もう一度",
  ingredients: "材料",
  method: "手順",
  quantity: "数量",
  low: "残り少",
  event: "予定",
  phone: "電話",
  company: "組織",
  remaining: "残り",
  features: "できること",
  how: "訪れ方",
  pricing: "料金",
  stories: "使った人",
  faq: "質問",
  gallery: "様子",
  schedule: "時間",
  waitlist: "メールを残す",
  join: "名簿に入る",
  joined: "名簿に入りました。",
  monthly: "月額",
  yearly: "年額",
  getStarted: "ここから",
  seeDetails: "詳細を見る",
  filter: "絞り込み",
  todo: "これから",
  doing: "進行中",
  addCard: "カードを追加",
  today: "今日",
  title: "題名",
  read: "読む",
  back: "戻る",
  visit: "開く",
  sets: "セット",
  reps: "回数",
  exercise: "種目",
  log: "記録",
  you: "あなた",
  reply: "返信",
  localReplies: "返信はこのページに残ります。",
  correct: "正解",
  check: "確認",
  question: "問題",
  of: "/",
  guest: "ゲスト",
  hours: "営業",
  fare: "運賃",
  seats: "席",
  from: "発",
  planVisitor: "見学",
  planRegular: "常連",
  planStudio: "工房",
  perMonth: "/ 月",
  perYear: "/ 年",
  stepLook: "ページを見る",
  stepChoose: "合うものを選ぶ",
  stepArrive: "来る、または手紙を書く",
  faqQ: ["口座は要りますか？", "予約なしで来られますか？", "後からプランを変えられますか？"],
  titles: {
    landing: "概要",
    tasks: "未了のこと",
    kanban: "ボード",
    notes: "ノート",
    habits: "今週",
    expenses: "家計",
    pomodoro: "集中",
    calculator: "電卓",
    quiz: "小テスト",
    flashcards: "カード",
    contacts: "連絡先",
    calendar: "月間",
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
  },
  yearNote: "すぐ使えるように",
};

const ALL: Record<UiLocale, Phrases> = {
  en,
  "zh-Hant": zhHant,
  "zh-Hans": zhHans,
  ja,
};

export function phrases(locale: UiLocale): Phrases {
  return ALL[locale];
}
