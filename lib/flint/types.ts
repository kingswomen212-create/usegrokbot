export type UiLocale = "en" | "zh-Hant" | "zh-Hans" | "ja";

export type Kind =
  | "landing"
  | "tasks"
  | "kanban"
  | "notes"
  | "habits"
  | "expenses"
  | "pomodoro"
  | "calculator"
  | "quiz"
  | "flashcards"
  | "contacts"
  | "calendar"
  | "dashboard"
  | "feedback"
  | "recipes"
  | "menu"
  | "portfolio"
  | "blog"
  | "links"
  | "chat"
  | "fitness"
  | "inventory"
  | "slides";

export type BuildMode = "website" | "app" | "prototype" | "slides";

export type PaletteId =
  | "clay"
  | "sage"
  | "sea"
  | "sand"
  | "slate"
  | "plum"
  | "rose"
  | "citrus"
  | "ink"
  | "night";

export type Tone = "calm" | "bold" | "playful" | "formal";
export type Density = "comfy" | "compact";

export type Section =
  | "features"
  | "schedule"
  | "steps"
  | "gallery"
  | "pricing"
  | "stories"
  | "faq"
  | "waitlist";

export type Blueprint = {
  kind: Kind;
  name: string;
  prompt: string;
  lang: UiLocale;
  palette: PaletteId;
  tone: Tone;
  density: Density;
  headline: string;
  sections: Section[];
  variant: 0 | 1 | 2;
};

export type ProjectFile = {
  path: string;
  contents: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type Project = {
  id: string;
  createdAt: number;
  updatedAt: number;
  blueprint: Blueprint;
  files: ProjectFile[];
  messages: ChatMessage[];
  past: Blueprint[];
  diverged: boolean;
};

export const SECTION_ORDER: Section[] = [
  "features",
  "schedule",
  "steps",
  "gallery",
  "pricing",
  "stories",
  "faq",
  "waitlist",
];

export const KINDS: Kind[] = [
  "landing",
  "tasks",
  "kanban",
  "notes",
  "habits",
  "expenses",
  "pomodoro",
  "calculator",
  "quiz",
  "flashcards",
  "contacts",
  "calendar",
  "dashboard",
  "feedback",
  "recipes",
  "menu",
  "portfolio",
  "blog",
  "links",
  "chat",
  "fitness",
  "inventory",
  "slides",
];
