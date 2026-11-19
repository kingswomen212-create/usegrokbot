import { paletteById } from "./palettes";
import type { Blueprint } from "./types";

export function baseCss(blueprint: Blueprint): string {
  const palette = paletteById(blueprint.palette);
  const radius = blueprint.tone === "playful" ? "18px" : blueprint.tone === "formal" ? "4px" : "12px";
  const pad = blueprint.density === "compact" ? "16px" : "28px";
  return `:root {
  color-scheme: ${palette.dark ? "dark" : "light"};
  --bg: ${palette.bg};
  --bg-2: ${palette.bg2};
  --ink: ${palette.ink};
  --mute: ${palette.mute};
  --line: ${palette.line};
  --card: ${palette.card};
  --accent: ${palette.accent};
  --accent-ink: ${palette.accentInk};
  --soft: ${palette.soft};
  --pad: ${pad};
  --radius: ${radius};
  --serif: "Iowan Old Style", Palatino, "Songti TC", "PMingLiU", "Hiragino Mincho ProN", Georgia, serif;
  --sans: "Avenir Next", "Segoe UI", "PingFang TC", "Hiragino Sans", "Noto Sans TC", sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.5;
  min-height: 100vh;
}
img { max-width: 100%; }
button, input, textarea, select { font: inherit; color: inherit; }
button { cursor: pointer; }
h1, h2, h3, p { margin: 0; }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.top { padding: var(--pad) var(--pad) 0; max-width: 1080px; margin: 0 auto; }
.brand { margin: 0; font-size: 15px; color: var(--mute); }
.top h1, .hero h1 {
  font-family: var(--serif);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
  font-size: clamp(36px, 6vw, 68px);
  margin: 8px 0 0;
}
.sub { margin-top: 8px; color: var(--mute); font-size: 16px; max-width: 40rem; }
.stage { max-width: 1080px; margin: 0 auto; padding: var(--pad); display: grid; gap: 16px; }
.row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.grow { flex: 1 1 200px; min-width: 0; }
.btn, button.primary {
  appearance: none;
  border: 0;
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 16px;
  line-height: 1.3;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.ghost, button.ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line);
}
button.tiny, .tiny {
  background: transparent;
  color: var(--mute);
  border: 0;
  padding: 8px 4px;
  font-size: 15px;
}
input, textarea, select {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 10px 12px;
  font-size: 16px;
}
textarea { min-height: 140px; resize: vertical; }
.card, .list li, .idea, .dish, .person, .article, .project, .link, .note-item {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.list li { padding: 12px 14px; display: flex; gap: 10px; align-items: center; }
.list li span { flex: 1; min-width: 0; font-size: 16px; }
.done-text { text-decoration: line-through; color: var(--mute); }
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.metric { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px; }
.metric span { display: block; color: var(--mute); font-size: 13px; }
.metric strong { display: block; margin-top: 6px; font-size: 28px; font-variant-numeric: tabular-nums; letter-spacing: -0.03em; }
table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: var(--radius); overflow: hidden; }
th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid var(--line); font-size: 16px; vertical-align: top; }
th { color: var(--mute); font-size: 13px; font-weight: 600; }
.muted { color: var(--mute); font-size: 15px; }
.low { color: var(--accent); font-weight: 600; }
@media (max-width: 640px) {
  :root { --pad: 16px; }
  .top h1, .hero h1 { font-size: clamp(32px, 10vw, 48px); }
}
@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto !important; transition: none !important; }
}
`;
}
