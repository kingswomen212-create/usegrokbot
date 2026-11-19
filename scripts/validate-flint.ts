import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { bundleHtml } from "../lib/flint/bundle";
import { renderFiles } from "../lib/flint/generate";
import { parseBrief } from "../lib/flint/parse";
import { revise } from "../lib/flint/revise";
import { KINDS, type Blueprint } from "../lib/flint/types";
import { zipStore } from "../lib/flint/zip";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const clay = parseBrief(
  "A pottery studio site called Clay & Co, with a class schedule, pricing, and a warm clay palette",
);
assert(clay.kind === "landing", `clay kind ${clay.kind}`);
assert(clay.name === "Clay & Co", `clay name ${clay.name}`);
assert(clay.palette === "clay", `clay palette ${clay.palette}`);
assert(clay.sections.includes("pricing") && clay.sections.includes("schedule"), "clay sections");

const board = parseBrief("Kanban board for a small bookshop named Harbor Shelf");
assert(board.kind === "kanban", board.kind);
assert(board.name === "Harbor Shelf", board.name);

const habits = parseBrief("Habit tracker for quiet morning routines, sage and cream");
assert(habits.kind === "habits", habits.kind);
assert(habits.palette === "sage", habits.palette);

const ledger = parseBrief("Expense ledger for a weekend food truck, with categories and a weekly total");
assert(ledger.kind === "expenses", ledger.kind);

const timer = parseBrief("Pomodoro timer with a large remaining time and a night palette");
assert(timer.kind === "pomodoro" && timer.palette === "night", "timer");

const ferry = parseBrief("Ferry timetable and fares for a weekend boat to Peng Chau");
assert(ferry.kind === "landing", ferry.kind);
assert(ferry.name === "Peng Chau", ferry.name);
assert(ferry.sections.includes("schedule"), "ferry schedule");

const deck = parseBrief("A short pitch for a neighborhood bookshop", "slides");
assert(deck.kind === "slides", deck.kind);
const appMode = parseBrief("A neighborhood bookshop", "app");
assert(appMode.kind === "dashboard", appMode.kind);

const morning = parseBrief("待辦清單叫做「晨間」");
assert(morning.kind === "tasks", morning.kind);
assert(morning.name === "晨間", morning.name);
assert(morning.lang === "zh-Hant", morning.lang);

const evil = parseBrief('A site called "<b>Bold</b>"');
const evilFiles = renderFiles(evil);
assert(evilFiles[0]!.contents.includes("&lt;b&gt;"), "escaped name");
assert(!evilFiles[0]!.contents.includes("<b>Bold</b>"), "raw name leaked");

for (const kind of KINDS) {
  const blueprint: Blueprint = { ...clay, kind, name: "Sample", prompt: "Sample", headline: "Sample" };
  const files = renderFiles(blueprint);
  assert(files.length === 3, `${kind} files`);
  new Function(files[2]!.contents);
  const bundled = bundleHtml(files);
  assert(bundled.includes("<style>") && bundled.includes("<script>"), `${kind} bundle`);
  assert(!bundled.includes('src="app.js"'), `${kind} still linked`);
  assert(files[0]!.contents.includes("Sample"), `${kind} name`);
}

const night = revise(clay, "use a night palette");
assert(night.blueprint.palette === "night", "night");
const tasks = revise(clay, "make it a task list");
assert(tasks.blueprint.kind === "tasks", tasks.blueprint.kind);
const renamed = revise(clay, "call it Harbor");
assert(renamed.blueprint.name === "Harbor", renamed.blueprint.name);
const removed = revise(clay, "remove the faq");
assert(!removed.blueprint.sections.includes("faq"), "faq");
const added = revise(clay, "加上價錢");
assert(added.blueprint.sections.includes("pricing"), "pricing zh");
const quiet = revise(clay, "hello");
assert(quiet.changes[0]?.type === "noop", "noop");

const zip = zipStore(renderFiles(clay));
writeFileSync("/tmp/flint-test.zip", zip);
execFileSync("unzip", ["-t", "/tmp/flint-test.zip"], { stdio: "inherit" });

const ferryFiles = renderFiles(ferry);
assert(ferryFiles[0]!.contents.includes("Peng Chau"), "ferry title");
assert(ferryFiles[0]!.contents.includes("08:15"), "ferry time");

console.log("flint ok");
