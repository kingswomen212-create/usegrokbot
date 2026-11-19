import type { Built } from "./landing";
import { phrases, type Phrases } from "./phrases";
import { program } from "./runtime";
import { esc, jsJson } from "./text";
import type { Blueprint } from "./types";

function frame(blueprint: Blueprint, main: string): string {
  const t = phrases(blueprint.lang);
  return `<header class="top"><p class="brand">${esc(blueprint.name)}</p><h1>${esc(t.titles[blueprint.kind])}</h1></header><main class="stage">${main}</main>`;
}

function deck(blueprint: Blueprint, locale: Blueprint["lang"]): { front: string; back: string }[] {
  const pottery = /potter|clay|陶/.test(blueprint.prompt);
  if (pottery) {
    return locale.startsWith("zh")
      ? [
          { front: "拉坯", back: "把泥壓在轉盤中心，再往上拉。" },
          { front: "素燒", back: "上釉之前的第一次燒。" },
          { front: "釉", back: "燒成後會變成玻璃質的表面。" },
          { front: "修坯", back: "半乾時把底部和厚度修乾淨。" },
        ]
      : [
          { front: "Centering", back: "Press the clay into the middle of the wheel before you pull." },
          { front: "Bisque", back: "The first firing, before glaze." },
          { front: "Glaze", back: "A coat that melts into glass." },
          { front: "Trimming", back: "Cleaning the foot while the clay is leather hard." },
        ];
  }
  return locale.startsWith("zh")
    ? [
        { front: "先寫下來", back: "還沒寫下來的事，不算已經決定。" },
        { front: "一次一件", back: "把下一步縮到小到能開始。" },
        { front: "留下日期", back: "以後的自己需要知道這是什麼時候。" },
        { front: "做完就劃掉", back: "清單的價值在於它會變短。" },
      ]
    : locale === "ja"
      ? [
          { front: "書く", back: "書いていないことは、まだ決まっていない。" },
          { front: "一つずつ", back: "次の一歩を、始められる大きさにする。" },
          { front: "日付", back: "あとで読む自分のために残す。" },
          { front: "消す", back: "一覧は短くなるために使う。" },
        ]
      : [
          { front: "Write it down", back: "An unwritten task is not a decision yet." },
          { front: "One next step", back: "Shrink the work until it can start." },
          { front: "Keep the date", back: "A later reader needs to know when." },
          { front: "Cross it off", back: "A list is useful when it gets shorter." },
        ];
}

export function renderApp(blueprint: Blueprint): Built {
  const t = phrases(blueprint.lang);
  switch (blueprint.kind) {
    case "tasks":
      return tasks(blueprint, t);
    case "kanban":
      return kanban(blueprint, t);
    case "notes":
      return notes(blueprint, t);
    case "habits":
      return habits(blueprint);
    case "expenses":
      return expenses(blueprint, t);
    case "pomodoro":
      return pomodoro(blueprint, t);
    case "calculator":
      return calculator(blueprint);
    case "quiz":
      return quiz(blueprint, t);
    case "flashcards":
      return cards(blueprint, t);
    case "contacts":
      return contacts(blueprint, t);
    case "calendar":
      return calendar(blueprint, t);
    case "dashboard":
      return dashboard(blueprint, t);
    case "feedback":
      return feedback(blueprint, t);
    case "recipes":
      return recipes(blueprint, t);
    case "menu":
      return menu(blueprint, t);
    case "portfolio":
      return portfolio(blueprint, t);
    case "blog":
      return blog(blueprint, t);
    case "links":
      return links(blueprint);
    case "chat":
      return chat(blueprint, t);
    case "fitness":
      return fitness(blueprint, t);
    case "inventory":
      return inventory(blueprint, t);
    default:
      return tasks(blueprint, t);
  }
}

function tasks(blueprint: Blueprint, t: Phrases): Built {
  const samples =
    blueprint.lang.startsWith("zh")
      ? ["把桌子清出來", "回一封還沒回的信", "準備明天要用的東西"]
      : blueprint.lang === "ja"
        ? ["机を空ける", "残っている手紙に返す", "明日の道具を出す"]
        : ["Clear the table", "Answer the letter still waiting", "Set out what tomorrow needs"];
  const body = frame(
    blueprint,
    `<form id="form" class="row"><label class="grow" for="task">${esc(t.add)}<input id="task" name="task" required /></label><button class="primary" type="submit">${esc(t.add)}</button></form>
    <div class="row" role="group">${["all", "open", "done"]
      .map((filter, index) => `<button type="button" class="ghost${index === 0 ? " on" : ""}" data-filter="${filter}">${esc(filter === "all" ? t.all : filter === "open" ? t.open : t.done)}</button>`)
      .join("")}</div>
    <p id="count" class="muted"></p>
    <ul id="list" class="list"></ul>
    <button type="button" class="tiny" id="clear">${esc(t.clearDone)}</button>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-tasks:${blueprint.name}`)};
    var labels = ${jsJson({ open: t.open })};
    var state = load(key, { filter: "all", items: ${jsJson(samples.map((text, index) => ({ id: `s${index}`, text, done: index === 2 })))} });
    var list = qs("#list");
    var input = qs("#task");
    function draw() {
      var shown = state.items.filter(function (item) {
        if (state.filter === "open") return !item.done;
        if (state.filter === "done") return item.done;
        return true;
      });
      list.innerHTML = "";
      shown.forEach(function (item) {
        var li = document.createElement("li");
        var box = document.createElement("input");
        box.type = "checkbox";
        box.checked = item.done;
        on(box, "change", function () { item.done = box.checked; save(key, state); draw(); });
        var span = document.createElement("span");
        span.textContent = item.text;
        if (item.done) span.className = "done-text";
        var del = document.createElement("button");
        del.type = "button";
        del.className = "tiny";
        del.textContent = ${jsJson(t.del)};
        on(del, "click", function () { state.items = state.items.filter(function (entry) { return entry.id !== item.id; }); save(key, state); draw(); });
        li.appendChild(box); li.appendChild(span); li.appendChild(del);
        list.appendChild(li);
      });
      qs("#count").textContent = state.items.filter(function (item) { return !item.done; }).length + " " + labels.open;
      qsa("[data-filter]").forEach(function (button) { button.classList.toggle("on", button.getAttribute("data-filter") === state.filter); });
    }
    on(qs("#form"), "submit", function (event) {
      event.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      state.items.unshift({ id: uid(), text: text, done: false });
      input.value = "";
      save(key, state);
      draw();
    });
    qsa("[data-filter]").forEach(function (button) {
      on(button, "click", function () { state.filter = button.getAttribute("data-filter"); save(key, state); draw(); });
    });
    on(qs("#clear"), "click", function () { state.items = state.items.filter(function (item) { return !item.done; }); save(key, state); draw(); });
    draw();
  `);
  return { body, css: `.list input { width: auto; } button.on { background: var(--ink); color: var(--bg); }`, js };
}

function kanban(blueprint: Blueprint, t: Phrases): Built {
  const pack = (lines: string[]) => lines.map((text, index) => ({ id: `k${index}`, text }));
  const seed = blueprint.lang.startsWith("zh")
    ? { todo: pack(["整理窗邊", "回信"]), doing: pack(["今天的主項"]), done: pack(["開門"]) }
    : { todo: pack(["Clear the window ledge", "Write back"]), doing: pack(["Today's main piece"]), done: pack(["Opened the room"]) };
  const body = frame(
    blueprint,
    `<div class="board" id="board"></div>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-board:${blueprint.name}`)};
    var labels = ${jsJson({ todo: t.todo, doing: t.doing, done: t.done, add: t.addCard })};
    var state = load(key, ${jsJson(seed)});
    var drag = "";
    function draw() {
      var board = qs("#board");
      board.innerHTML = "";
      ["todo", "doing", "done"].forEach(function (column) {
        var section = document.createElement("section");
        section.className = "col";
        section.dataset.column = column;
        var h = document.createElement("h2");
        h.textContent = labels[column];
        section.appendChild(h);
        state[column].forEach(function (card) {
          var article = document.createElement("article");
          article.className = "card";
          article.draggable = true;
          article.dataset.id = card.id;
          var p = document.createElement("p");
          p.textContent = card.text;
          var del = document.createElement("button");
          del.type = "button";
          del.className = "tiny";
          del.textContent = ${jsJson(t.del)};
          on(del, "click", function () {
            state[column] = state[column].filter(function (item) { return item.id !== card.id; });
            save(key, state); draw();
          });
          on(article, "dragstart", function () { drag = column + ":" + card.id; });
          article.appendChild(p); article.appendChild(del);
          section.appendChild(article);
        });
        var form = document.createElement("form");
        form.className = "row";
        var input = document.createElement("input");
        input.setAttribute("aria-label", labels.add);
        input.placeholder = labels.add;
        var button = document.createElement("button");
        button.className = "primary";
        button.type = "submit";
        button.textContent = ${jsJson(t.add)};
        form.appendChild(input); form.appendChild(button);
        on(form, "submit", function (event) {
          event.preventDefault();
          var text = input.value.trim();
          if (!text) return;
          state[column].unshift({ id: uid(), text: text });
          save(key, state); draw();
        });
        on(section, "dragover", function (event) { event.preventDefault(); });
        on(section, "drop", function (event) {
          event.preventDefault();
          var parts = drag.split(":");
          var from = parts[0];
          var id = parts[1];
          if (!from || !id || from === column) return;
          var moving = (state[from] || []).find(function (item) { return item.id === id; });
          if (!moving) return;
          state[from] = state[from].filter(function (item) { return item.id !== id; });
          state[column].unshift(moving);
          save(key, state); draw();
        });
        section.appendChild(form);
        board.appendChild(section);
      });
    }
    draw();
  `);
  return {
    body,
    css: `.board { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; align-items: start; } .col { background: var(--bg-2); border-radius: var(--radius); padding: 12px; display: grid; gap: 8px; } .col h2 { font-size: 16px; } .card { padding: 12px; display: grid; gap: 8px; } .card p { font-size: 16px; } .col input { background: var(--bg); }`,
    js,
  };
}

function notes(blueprint: Blueprint, t: Phrases): Built {
  const seed =
    blueprint.lang.startsWith("zh")
      ? [
          { id: "n1", title: "今天", body: "先做會讓房間變安靜的那一件。" },
          { id: "n2", title: "稍後", body: "把還沒回的名字寫在這裡。" },
        ]
      : [
          { id: "n1", title: "Today", body: "Start with the thing that makes the room quieter." },
          { id: "n2", title: "Later", body: "Keep the unanswered names here." },
        ];
  const body = frame(
    blueprint,
    `<div class="notes"><div><button type="button" class="primary" id="new">${esc(t.newItem)}</button><div id="index"></div></div><form id="editor"><label for="title">${esc(t.title)}<input id="title" /></label><label for="body">${esc(t.note)}<textarea id="body"></textarea></label><div class="row"><button class="primary" type="submit">${esc(t.save)}</button><button class="ghost" type="button" id="remove">${esc(t.del)}</button></div></form></div>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-notes:${blueprint.name}`)};
    var state = load(key, { current: "n1", items: ${jsJson(seed)} });
    function current() { return state.items.find(function (item) { return item.id === state.current; }) || state.items[0]; }
    function draw() {
      var index = qs("#index");
      index.innerHTML = "";
      state.items.forEach(function (item) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "note-item" + (item.id === state.current ? " on" : "");
        button.textContent = item.title || ${jsJson(t.empty)};
        on(button, "click", function () { state.current = item.id; save(key, state); draw(); });
        index.appendChild(button);
      });
      var item = current();
      if (!item) return;
      qs("#title").value = item.title;
      qs("#body").value = item.body;
    }
    on(qs("#editor"), "submit", function (event) {
      event.preventDefault();
      var item = current();
      if (!item) return;
      item.title = qs("#title").value.trim() || ${jsJson(t.title)};
      item.body = qs("#body").value;
      save(key, state); draw();
    });
    on(qs("#new"), "click", function () {
      var item = { id: uid(), title: ${jsJson(t.newItem)}, body: "" };
      state.items.unshift(item); state.current = item.id; save(key, state); draw();
    });
    on(qs("#remove"), "click", function () {
      var item = current();
      state.items = state.items.filter(function (entry) { return entry.id !== item.id; });
      state.current = state.items[0] ? state.items[0].id : "";
      save(key, state); draw();
    });
    draw();
  `);
  return {
    body,
    css: `.notes { display: grid; grid-template-columns: minmax(180px, 240px) minmax(0, 1fr); gap: 16px; } #index { display: grid; gap: 8px; margin-top: 10px; } .note-item { text-align: left; padding: 12px; width: 100%; background: var(--card); } .note-item.on { border-color: var(--accent); } #editor { display: grid; gap: 10px; } #editor label { display: grid; gap: 6px; font-size: 15px; } @media (max-width: 700px) { .notes { grid-template-columns: 1fr; } }`,
    js,
  };
}

function habits(blueprint: Blueprint): Built {
  const names =
    blueprint.lang.startsWith("zh")
      ? ["喝水", "出門走", "寫三行", "早一點睡", "把桌子收回來"]
      : blueprint.lang === "ja"
        ? ["水を飲む", "外を歩く", "三行書く", "早く寝る", "机を戻す"]
        : ["Drink water", "Walk outside", "Write three lines", "Sleep earlier", "Clear the table"];
  const days = blueprint.lang.startsWith("zh") ? ["一", "二", "三", "四", "五", "六", "日"] : blueprint.lang === "ja" ? ["月", "火", "水", "木", "金", "土", "日"] : ["M", "T", "W", "T", "F", "S", "S"];
  const body = frame(blueprint, `<div id="grid" class="week-wrap"></div><p id="score" class="muted"></p>`);
  const js = program(`
    var key = ${jsJson(`flint-habits:${blueprint.name}`)};
    var names = ${jsJson(names)};
    var days = ${jsJson(days)};
    var state = load(key, names.map(function (name) { return { name: name, days: [false, false, false, false, false, false, false] }; }));
    function draw() {
      var grid = qs("#grid");
      grid.innerHTML = "";
      var head = document.createElement("div");
      head.className = "week head";
      head.appendChild(document.createElement("span"));
      days.forEach(function (day) { var s = document.createElement("span"); s.textContent = day; head.appendChild(s); });
      grid.appendChild(head);
      var total = 0, hit = 0;
      state.forEach(function (habit, row) {
        var line = document.createElement("div");
        line.className = "week";
        var label = document.createElement("span");
        label.textContent = habit.name;
        line.appendChild(label);
        habit.days.forEach(function (onDay, col) {
          total += 1; if (onDay) hit += 1;
          var button = document.createElement("button");
          button.type = "button";
          button.className = onDay ? "mark on" : "mark";
          button.setAttribute("aria-pressed", onDay ? "true" : "false");
          button.setAttribute("aria-label", habit.name + " " + days[col]);
          button.textContent = onDay ? "●" : "○";
          on(button, "click", function () { habit.days[col] = !habit.days[col]; save(key, state); draw(); });
          line.appendChild(button);
        });
        grid.appendChild(line);
      });
      qs("#score").textContent = hit + " / " + total;
    }
    draw();
  `);
  return {
    body,
    css: `.week { display: grid; grid-template-columns: minmax(88px, 1.4fr) repeat(7, minmax(32px, 1fr)); gap: 6px; align-items: center; margin-bottom: 8px; } .head span { font-size: 13px; color: var(--mute); text-align: center; } .mark { min-height: 36px; border-radius: 10px; border: 1px solid var(--line); background: var(--card); font-size: 16px; } .mark.on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }`,
    js,
  };
}

function expenses(blueprint: Blueprint, t: Phrases): Built {
  const cats = blueprint.lang.startsWith("zh") ? ["食材", "交通", "材料", "其他"] : blueprint.lang === "ja" ? ["食材", "移動", "材料", "その他"] : ["Food", "Transit", "Materials", "Other"];
  const body = frame(
    blueprint,
    `<form id="form" class="row"><label class="grow">${esc(t.amount)}<input id="amount" inputmode="decimal" required /></label><label class="grow">${esc(t.category)}<select id="category">${cats.map((cat) => `<option>${esc(cat)}</option>`).join("")}</select></label><label class="grow">${esc(t.note)}<input id="note" /></label><button class="primary" type="submit">${esc(t.add)}</button></form><p class="metric"><span>${esc(t.total)}</span><strong id="total">0</strong></p><div id="bars"></div><ul id="list" class="list"></ul>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-expenses:${blueprint.name}`)};
    var state = load(key, ${jsJson([
      { id: "e1", amount: 86, category: cats[0], note: blueprint.name },
      { id: "e2", amount: 24, category: cats[1], note: "" },
    ])});
    function draw() {
      var total = state.reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0);
      qs("#total").textContent = ${jsJson(blueprint.lang === "ja" ? "¥" : blueprint.lang.startsWith("zh") ? "HK$" : "$")} + total;
      var list = qs("#list");
      list.innerHTML = "";
      state.forEach(function (item) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.textContent = item.category + " · " + item.amount + (item.note ? " · " + item.note : "");
        var del = document.createElement("button");
        del.type = "button"; del.className = "tiny"; del.textContent = ${jsJson(t.del)};
        on(del, "click", function () { state = state.filter(function (entry) { return entry.id !== item.id; }); save(key, state); draw(); });
        li.appendChild(span); li.appendChild(del); list.appendChild(li);
      });
      var counts = {};
      state.forEach(function (item) { counts[item.category] = (counts[item.category] || 0) + Number(item.amount); });
      var max = Math.max.apply(null, Object.keys(counts).map(function (name) { return counts[name]; }).concat([1]));
      var bars = qs("#bars");
      bars.innerHTML = "";
      Object.keys(counts).forEach(function (name) {
        var row = document.createElement("div");
        row.className = "bar";
        var label = document.createElement("span");
        label.textContent = name;
        var track = document.createElement("div");
        var fill = document.createElement("i");
        fill.style.width = Math.round((counts[name] / max) * 100) + "%";
        track.appendChild(fill);
        row.appendChild(label); row.appendChild(track);
        bars.appendChild(row);
      });
    }
    on(qs("#form"), "submit", function (event) {
      event.preventDefault();
      var amount = Number(qs("#amount").value);
      if (!amount) return;
      state.unshift({ id: uid(), amount: amount, category: qs("#category").value, note: qs("#note").value.trim() });
      qs("#amount").value = ""; qs("#note").value = "";
      save(key, state); draw();
    });
    draw();
  `);
  return {
    body,
    css: `.bar { display: grid; grid-template-columns: 110px 1fr; gap: 8px; align-items: center; margin: 6px 0; } .bar div { background: var(--bg-2); border-radius: 999px; height: 12px; } .bar i { display: block; height: 12px; background: var(--accent); border-radius: 999px; } .metric { max-width: 240px; }`,
    js,
  };
}

function pomodoro(blueprint: Blueprint, t: Phrases): Built {
  const body = frame(
    blueprint,
    `<p id="mode" class="muted">${esc(t.focus)}</p><p id="clock" class="clock">25:00</p><p id="count" class="muted"></p><div class="row"><button type="button" class="primary" id="toggle">${esc(t.start)}</button><button type="button" class="ghost" id="reset">${esc(t.reset)}</button></div>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-pomo:${blueprint.name}`)};
    var sessions = load(key, 0);
    var left = 25 * 60;
    var mode = "focus";
    var timer = 0;
    var running = false;
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function paint() {
      qs("#clock").textContent = pad(Math.floor(left / 60)) + ":" + pad(left % 60);
      qs("#mode").textContent = mode === "focus" ? ${jsJson(t.focus)} : ${jsJson(t.shortBreak)};
      qs("#count").textContent = ${jsJson(t.sessions)} + " " + sessions;
      qs("#toggle").textContent = running ? ${jsJson(t.pause)} : ${jsJson(t.start)};
    }
    function tick() {
      left -= 1;
      if (left <= 0) {
        if (mode === "focus") { sessions += 1; save(key, sessions); mode = "break"; left = 5 * 60; }
        else { mode = "focus"; left = 25 * 60; }
      }
      paint();
    }
    on(qs("#toggle"), "click", function () {
      running = !running;
      if (timer) clearInterval(timer);
      timer = running ? setInterval(tick, 1000) : 0;
      paint();
    });
    on(qs("#reset"), "click", function () {
      running = false;
      if (timer) clearInterval(timer);
      mode = "focus"; left = 25 * 60; paint();
    });
    paint();
  `);
  return {
    body,
    css: `.clock { font-family: var(--serif); font-size: clamp(72px, 16vw, 128px); line-height: 0.95; font-variant-numeric: tabular-nums; letter-spacing: -0.04em; }`,
    js,
  };
}

function calculator(blueprint: Blueprint): Built {
  const keys = ["C", "±", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];
  const body = frame(
    blueprint,
    `<div class="calc"><p id="display" class="display">0</p><div class="keys">${keys
      .map((key) => `<button type="button" data-key="${esc(key)}">${esc(key)}</button>`)
      .join("")}</div></div>`,
  );
  const js = program(`
    var value = "0";
    var fresh = true;
    function paint() { qs("#display").textContent = value; }
    function apply(op, a, b) {
      var x = Number(a), y = Number(b);
      if (op === "+") return String(x + y);
      if (op === "-") return String(x - y);
      if (op === "*") return String(x * y);
      if (op === "/") return y === 0 ? "0" : String(x / y);
      return b;
    }
    var acc = null, op = "";
    function input(key) {
      if (key >= "0" && key <= "9") {
        value = fresh || value === "0" ? key : value + key;
        fresh = false;
      } else if (key === ".") {
        if (fresh) { value = "0."; fresh = false; }
        else if (value.indexOf(".") < 0) value += ".";
      } else if (key === "C") { value = "0"; acc = null; op = ""; fresh = true; }
      else if (key === "±") { value = String(Number(value) * -1); }
      else if (key === "%") { value = String(Number(value) / 100); }
      else if ("+-*/".indexOf(key) >= 0) {
        if (acc != null && op && !fresh) acc = apply(op, acc, value);
        else acc = value;
        op = key; fresh = true;
      } else if (key === "=" && op && acc != null) {
        value = apply(op, acc, value);
        acc = null; op = ""; fresh = true;
      }
      if (value.length > 12) value = String(Number(value).toPrecision(8));
      paint();
    }
    qsa("[data-key]").forEach(function (button) { on(button, "click", function () { input(button.getAttribute("data-key")); }); });
    on(document, "keydown", function (event) {
      var key = event.key === "Enter" ? "=" : event.key === "Escape" ? "C" : event.key;
      if ("0123456789.+-*/=%".indexOf(key) >= 0 || key === "C") input(key);
    });
    paint();
  `);
  return {
    body,
    css: `.calc { max-width: 380px; display: grid; gap: 12px; } .display { font-size: 48px; text-align: right; font-variant-numeric: tabular-nums; background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; } .keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; } .keys button { min-height: 58px; font-size: 20px; background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); }`,
    js,
  };
}

function quiz(blueprint: Blueprint, t: Phrases): Built {
  const bank =
    blueprint.lang.startsWith("zh")
      ? [
          { q: "清單變短，代表什麼？", choices: ["事情被記住了", "事情做完了", "事情被刪掉了"], answer: 1 },
          { q: "價錢放在哪裡比較好？", choices: ["藏在信裡", "放在頁面上", "只在電話裡說"], answer: 1 },
          { q: "一次專注多久是這個計時的預設？", choices: ["10 分鐘", "25 分鐘", "90 分鐘"], answer: 1 },
          { q: "看板的中間欄通常是？", choices: ["已完成", "進行中", "已放棄"], answer: 1 },
        ]
      : [
          { q: "A list is working when it does what?", choices: ["Gets longer", "Gets shorter", "Stays secret"], answer: 1 },
          { q: "Where should a price live?", choices: ["Only in a phone call", "On the page", "In a footnote nobody sees"], answer: 1 },
          { q: "How long is one focus block here?", choices: ["10 minutes", "25 minutes", "90 minutes"], answer: 1 },
          { q: "The middle column of a board is usually…", choices: ["Done", "Doing", "Abandoned"], answer: 1 },
        ];
  const body = frame(
    blueprint,
    `<p id="progress" class="muted"></p><h2 id="question"></h2><div id="choices" class="choices"></div><p id="result" class="muted"></p><button type="button" class="primary" id="next" hidden>${esc(t.next)}</button>`,
  );
  const js = program(`
    var bank = ${jsJson(bank)};
    var index = 0, score = 0, locked = false;
    function draw() {
      var item = bank[index];
      qs("#progress").textContent = ${jsJson(t.question)} + " " + (index + 1) + " ${esc(t.of)} " + bank.length;
      qs("#question").textContent = item.q;
      qs("#result").textContent = "";
      qs("#next").hidden = true;
      var box = qs("#choices");
      box.innerHTML = "";
      item.choices.forEach(function (choice, choiceIndex) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "ghost choice";
        button.textContent = choice;
        on(button, "click", function () {
          if (locked) return;
          locked = true;
          var ok = choiceIndex === item.answer;
          if (ok) score += 1;
          button.classList.add(ok ? "good" : "bad");
          qs("#result").textContent = ok ? ${jsJson(t.correct)} : ${jsJson(t.check)};
          qs("#next").hidden = false;
          qs("#next").textContent = index === bank.length - 1 ? ${jsJson(t.done)} : ${jsJson(t.next)};
        });
        box.appendChild(button);
      });
    }
    on(qs("#next"), "click", function () {
      if (index === bank.length - 1) {
        qs("#question").textContent = score + " / " + bank.length;
        qs("#choices").innerHTML = "";
        qs("#next").hidden = true;
        return;
      }
      index += 1; locked = false; draw();
    });
    draw();
  `);
  return {
    body,
    css: `.choices { display: grid; gap: 8px; } .choice { text-align: left; padding: 12px 14px; } .good { border-color: var(--accent); background: var(--soft); } .bad { border-color: var(--line); color: var(--mute); } #question { font-size: clamp(24px, 4vw, 36px); font-family: var(--serif); font-weight: 500; }`,
    js,
  };
}

function cards(blueprint: Blueprint, t: Phrases): Built {
  const body = frame(
    blueprint,
    `<button type="button" id="card" class="flip"><span id="face"></span></button><p id="count" class="muted"></p><div class="row"><button type="button" class="ghost" id="again">${esc(t.again)}</button><button type="button" class="primary" id="knew">${esc(t.knew)}</button></div>`,
  );
  const js = program(`
    var deck = ${jsJson(deck(blueprint, blueprint.lang))};
    var index = 0, showBack = false;
    function paint() {
      var item = deck[index];
      qs("#face").textContent = showBack ? item.back : item.front;
      qs("#count").textContent = (index + 1) + " / " + deck.length;
    }
    on(qs("#card"), "click", function () { showBack = !showBack; paint(); });
    function advance() {
      index = (index + 1) % deck.length;
      showBack = false;
      paint();
    }
    on(qs("#again"), "click", advance);
    on(qs("#knew"), "click", advance);
    paint();
  `);
  return {
    body,
    css: `.flip { min-height: 220px; width: min(100%, 460px); background: var(--card); border: 1px solid var(--line); border-radius: 20px; font-size: 28px; line-height: 1.3; padding: 24px; text-align: left; }`,
    js,
  };
}

function contacts(blueprint: Blueprint, t: Phrases): Built {
  const seed =
    blueprint.lang.startsWith("zh")
      ? [
          { id: "c1", name: "陳可恩", company: blueprint.name, phone: "9000 1111" },
          { id: "c2", name: "林柏言", company: blueprint.name, phone: "9000 2222" },
        ]
      : [
          { id: "c1", name: "Mara Ellison", company: blueprint.name, phone: "555-0148" },
          { id: "c2", name: "Jonah Peck", company: blueprint.name, phone: "555-0172" },
        ];
  const body = frame(
    blueprint,
    `<form id="form" class="row"><label class="grow">${esc(t.name)}<input id="name" required /></label><label class="grow">${esc(t.company)}<input id="company" /></label><label class="grow">${esc(t.phone)}<input id="phone" /></label><button class="primary" type="submit">${esc(t.add)}</button></form><label>${esc(t.search)}<input id="search" /></label><ul id="list" class="list"></ul>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-people:${blueprint.name}`)};
    var state = load(key, ${jsJson(seed)});
    var query = "";
    function draw() {
      var list = qs("#list");
      list.innerHTML = "";
      state.filter(function (person) { return (person.name + person.company + person.phone).toLowerCase().indexOf(query) >= 0; }).forEach(function (person) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.textContent = person.name + " · " + person.company + " · " + person.phone;
        var del = document.createElement("button");
        del.type = "button"; del.className = "tiny"; del.textContent = ${jsJson(t.del)};
        on(del, "click", function () { state = state.filter(function (entry) { return entry.id !== person.id; }); save(key, state); draw(); });
        li.appendChild(span); li.appendChild(del); list.appendChild(li);
      });
    }
    on(qs("#form"), "submit", function (event) {
      event.preventDefault();
      state.unshift({ id: uid(), name: qs("#name").value.trim(), company: qs("#company").value.trim(), phone: qs("#phone").value.trim() });
      qs("#name").value = ""; qs("#company").value = ""; qs("#phone").value = "";
      save(key, state); draw();
    });
    on(qs("#search"), "input", function (event) { query = event.target.value.trim().toLowerCase(); draw(); });
    draw();
  `);
  return { body, css: "", js };
}

function calendar(blueprint: Blueprint, t: Phrases): Built {
  const body = frame(
    blueprint,
    `<div class="row"><button type="button" class="ghost" id="prev">‹</button><h2 id="label"></h2><button type="button" class="ghost" id="next">›</button></div><div id="grid" class="month"></div><form id="form" class="row"><label class="grow">${esc(t.event)}<input id="event" required /></label><button class="primary" type="submit">${esc(t.add)}</button></form><ul id="day" class="list"></ul>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-cal:${blueprint.name}`)};
    var events = load(key, {});
    var cursor = new Date();
    var selected = cursor.getDate();
    function stamp(year, month, day) { return year + "-" + (month + 1) + "-" + day; }
    function draw() {
      var year = cursor.getFullYear(), month = cursor.getMonth();
      qs("#label").textContent = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
      var grid = qs("#grid");
      grid.innerHTML = "";
      var first = new Date(year, month, 1).getDay();
      var count = new Date(year, month + 1, 0).getDate();
      for (var i = 0; i < first; i++) grid.appendChild(document.createElement("span"));
      for (var day = 1; day <= count; day++) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = String(day);
        var id = stamp(year, month, day);
        if (events[id] && events[id].length) button.className = "has";
        if (day === selected) button.classList.add("on");
        (function (d) { on(button, "click", function () { selected = d; draw(); }); })(day);
        grid.appendChild(button);
      }
      var list = qs("#day");
      list.innerHTML = "";
      var id = stamp(year, month, selected);
      (events[id] || []).forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
    }
    on(qs("#prev"), "click", function () { cursor.setMonth(cursor.getMonth() - 1); selected = 1; draw(); });
    on(qs("#next"), "click", function () { cursor.setMonth(cursor.getMonth() + 1); selected = 1; draw(); });
    on(qs("#form"), "submit", function (event) {
      event.preventDefault();
      var id = stamp(cursor.getFullYear(), cursor.getMonth(), selected);
      events[id] = events[id] || [];
      events[id].push(qs("#event").value.trim());
      qs("#event").value = "";
      save(key, events); draw();
    });
    draw();
  `);
  return {
    body,
    css: `.month { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; } .month button, .month span { min-height: 42px; border-radius: 10px; border: 1px solid transparent; background: transparent; font-size: 16px; } .month button { background: var(--card); border-color: var(--line); } .month button.on { background: var(--accent); color: var(--accent-ink); } .month button.has { box-shadow: inset 0 -3px 0 var(--accent); } #label { font-size: 22px; }`,
    js,
  };
}

function dashboard(blueprint: Blueprint, t: Phrases): Built {
  const body = frame(
    blueprint,
    `<div class="row"><button type="button" class="ghost on" data-range="week">${esc(t.week)}</button><button type="button" class="ghost" data-range="month">${esc(t.month)}</button></div><div id="metrics" class="metrics"></div><svg id="chart" viewBox="0 0 320 120" role="img"></svg><ul id="activity" class="list"></ul>`,
  );
  const week = [12, 18, 15, 22, 19, 28, 24];
  const month = [40, 48, 36, 52, 44, 60, 58, 63];
  const js = program(`
    var packs = { week: ${jsJson(week)}, month: ${jsJson(month)} };
    var labels = ${jsJson({ visits: t.visit, replies: t.reply, open: t.open, total: t.total })};
    function draw(range) {
      var data = packs[range];
      var total = data.reduce(function (sum, n) { return sum + n; }, 0);
      var metrics = qs("#metrics");
      metrics.innerHTML = "";
      [["total", total], ["visits", Math.round(total * 0.7)], ["replies", Math.round(total * 0.25)], ["open", Math.max(3, Math.round(total * 0.08))]].forEach(function (pair) {
        var card = document.createElement("article");
        card.className = "metric";
        var span = document.createElement("span");
        span.textContent = labels[pair[0]] || pair[0];
        var strong = document.createElement("strong");
        strong.textContent = String(pair[1]);
        card.appendChild(span); card.appendChild(strong); metrics.appendChild(card);
      });
      var max = Math.max.apply(null, data);
      var step = 320 / (data.length - 1);
      var points = data.map(function (n, i) { return (i * step) + "," + (110 - (n / max) * 90); }).join(" ");
      qs("#chart").innerHTML = '<polyline fill="none" stroke="currentColor" stroke-width="3" points="' + points + '" />';
      var list = qs("#activity");
      list.innerHTML = "";
      data.forEach(function (n, i) {
        var li = document.createElement("li");
        li.textContent = (i + 1) + " · " + n;
        list.appendChild(li);
      });
      qsa("[data-range]").forEach(function (button) { button.classList.toggle("on", button.getAttribute("data-range") === range); });
    }
    qsa("[data-range]").forEach(function (button) { on(button, "click", function () { draw(button.getAttribute("data-range")); }); });
    draw("week");
  `);
  return {
    body,
    css: `#chart { width: 100%; height: 160px; background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); color: var(--accent); } button.on { background: var(--ink); color: var(--bg); }`,
    js,
  };
}

function feedback(blueprint: Blueprint, t: Phrases): Built {
  const seed =
    blueprint.lang.startsWith("zh")
      ? [
          { id: "f1", text: "晚上也開門", votes: 4 },
          { id: "f2", text: "把價錢印在門口", votes: 2 },
        ]
      : [
          { id: "f1", text: "Stay open one evening", votes: 4 },
          { id: "f2", text: "Print the prices by the door", votes: 2 },
        ];
  const body = frame(
    blueprint,
    `<form id="form" class="row"><label class="grow">${esc(t.title)}<input id="idea" required /></label><button class="primary" type="submit">${esc(t.add)}</button></form><ul id="list" class="list"></ul>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-ideas:${blueprint.name}`)};
    var state = load(key, ${jsJson(seed)});
    function draw() {
      var list = qs("#list");
      list.innerHTML = "";
      state.slice().sort(function (a, b) { return b.votes - a.votes; }).forEach(function (idea) {
        var li = document.createElement("li");
        var vote = document.createElement("button");
        vote.type = "button"; vote.className = "primary"; vote.textContent = idea.votes + " " + ${jsJson(t.upvote)};
        on(vote, "click", function () { idea.votes += 1; save(key, state); draw(); });
        var span = document.createElement("span");
        span.textContent = idea.text;
        li.appendChild(vote); li.appendChild(span); list.appendChild(li);
      });
    }
    on(qs("#form"), "submit", function (event) {
      event.preventDefault();
      state.unshift({ id: uid(), text: qs("#idea").value.trim(), votes: 1 });
      qs("#idea").value = "";
      save(key, state); draw();
    });
    draw();
  `);
  return { body, css: `.list button.primary { width: auto; }`, js };
}

function recipes(blueprint: Blueprint, t: Phrases): Built {
  const cantonese = /cantonese|粵|粤|茶餐廳|茶餐厅/.test(blueprint.prompt);
  const items = cantonese
    ? [
        { name: blueprint.lang.startsWith("zh") ? "薑蔥蒸魚" : "Steamed fish with ginger", ingredients: ["fish", "ginger", "scallion", "soy"], steps: ["Steam the fish", "Pour hot oil over the scallion", "Finish with soy"] },
        { name: blueprint.lang.startsWith("zh") ? "番茄炒蛋" : "Tomato and egg", ingredients: ["egg", "tomato", "salt"], steps: ["Scramble the eggs", "Cook the tomato", "Fold them together"] },
      ]
    : [
        { name: blueprint.lang.startsWith("zh") ? "烤蔬菜" : "Roasted vegetables", ingredients: ["vegetables", "oil", "salt"], steps: ["Heat the oven", "Toss and roast", "Salt at the end"] },
        { name: blueprint.lang.startsWith("zh") ? "豆湯" : "Bean soup", ingredients: ["beans", "onion", "water"], steps: ["Soften the onion", "Add beans and water", "Simmer"] },
      ];
  const body = frame(blueprint, `<div class="split"><ul id="list" class="list"></ul><article id="detail" class="card pad"></article></div>`);
  const js = program(`
    var items = ${jsJson(items)};
    var current = 0;
    function draw() {
      var list = qs("#list");
      list.innerHTML = "";
      items.forEach(function (item, index) {
        var li = document.createElement("li");
        var button = document.createElement("button");
        button.type = "button"; button.className = "tiny"; button.textContent = item.name;
        on(button, "click", function () { current = index; draw(); });
        li.appendChild(button); list.appendChild(li);
      });
      var item = items[current];
      var detail = qs("#detail");
      detail.innerHTML = "";
      var h = document.createElement("h2"); h.textContent = item.name; detail.appendChild(h);
      var a = document.createElement("h3"); a.textContent = ${jsJson(t.ingredients)}; detail.appendChild(a);
      var ul = document.createElement("ul");
      item.ingredients.forEach(function (line) { var li = document.createElement("li"); li.textContent = line; ul.appendChild(li); });
      detail.appendChild(ul);
      var b = document.createElement("h3"); b.textContent = ${jsJson(t.method)}; detail.appendChild(b);
      var ol = document.createElement("ol");
      item.steps.forEach(function (line) { var li = document.createElement("li"); li.textContent = line; ol.appendChild(li); });
      detail.appendChild(ol);
    }
    draw();
  `);
  return {
    body,
    css: `.split { display: grid; grid-template-columns: minmax(180px, 260px) minmax(0, 1fr); gap: 16px; } .pad { padding: 16px; } .pad h2 { font-size: 28px; margin-bottom: 10px; } .pad h3 { font-size: 16px; margin: 12px 0 6px; } @media (max-width: 700px) { .split { grid-template-columns: 1fr; } }`,
    js,
  };
}

function menu(blueprint: Blueprint, t: Phrases): Built {
  const dishes = /coffee|咖啡/.test(blueprint.prompt)
    ? [
        { cat: "Coffee", name: "Espresso", price: 28 },
        { cat: "Coffee", name: "Oat latte", price: 42 },
        { cat: "Kitchen", name: "Butter toast", price: 36 },
      ]
    : [
        { cat: "Bowl", name: "Day bowl", price: 88 },
        { cat: "Bowl", name: "Evening noodles", price: 78 },
        { cat: "Small", name: "Greens", price: 48 },
        { cat: "Sweet", name: "Fruit and cream", price: 52 },
      ];
  const body = frame(blueprint, `<div id="filters" class="row"></div><div id="dishes" class="features"></div>`);
  const js = program(`
    var dishes = ${jsJson(dishes)};
    var current = "All";
    function draw() {
      var cats = ["All"].concat(dishes.map(function (dish) { return dish.cat; }).filter(function (cat, index, all) { return all.indexOf(cat) === index; }));
      var filters = qs("#filters");
      filters.innerHTML = "";
      cats.forEach(function (cat) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "ghost" + (cat === current ? " on" : "");
        button.textContent = cat === "All" ? ${jsJson(t.all)} : cat;
        on(button, "click", function () { current = cat; draw(); });
        filters.appendChild(button);
      });
      var box = qs("#dishes");
      box.innerHTML = "";
      dishes.filter(function (dish) { return current === "All" || dish.cat === current; }).forEach(function (dish) {
        var card = document.createElement("article");
        card.className = "feature";
        var h = document.createElement("h3"); h.textContent = dish.name;
        var p = document.createElement("p"); p.textContent = ${jsJson(blueprint.lang === "ja" ? "¥" : blueprint.lang.startsWith("zh") ? "HK$" : "$")} + dish.price;
        card.appendChild(h); card.appendChild(p); box.appendChild(card);
      });
    }
    draw();
  `);
  return { body, css: `.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; } .feature { padding: 16px; background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); } .feature h3 { font-size: 20px; } button.on { background: var(--ink); color: var(--bg); }`, js };
}

function portfolio(blueprint: Blueprint, t: Phrases): Built {
  const works = [1, 2, 3, 4].map((n) => ({
    title: `${blueprint.name} ${n}`,
    text:
      blueprint.lang.startsWith("zh")
        ? `第 ${n} 件作品，保留材料原來的顏色。`
        : `Piece ${n} keeps the color of the material.`,
  }));
  const body = frame(blueprint, `<div id="grid" class="features"></div><article id="detail" class="card pad" hidden></article>`);
  const js = program(`
    var works = ${jsJson(works)};
    function draw(open) {
      var grid = qs("#grid");
      var detail = qs("#detail");
      if (open != null) {
        grid.hidden = true; detail.hidden = false; detail.innerHTML = "";
        var item = works[open];
        var back = document.createElement("button");
        back.type = "button"; back.className = "tiny"; back.textContent = ${jsJson(t.back)};
        on(back, "click", function () { draw(null); });
        var h = document.createElement("h2"); h.textContent = item.title;
        var p = document.createElement("p"); p.textContent = item.text;
        detail.appendChild(back); detail.appendChild(h); detail.appendChild(p);
        return;
      }
      grid.hidden = false; detail.hidden = true; grid.innerHTML = "";
      works.forEach(function (item, index) {
        var card = document.createElement("button");
        card.type = "button"; card.className = "project";
        var h = document.createElement("strong"); h.textContent = item.title;
        var p = document.createElement("span"); p.textContent = item.text;
        card.appendChild(h); card.appendChild(p);
        on(card, "click", function () { draw(index); });
        grid.appendChild(card);
      });
    }
    draw(null);
  `);
  return {
    body,
    css: `.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; } .project { text-align: left; min-height: 160px; padding: 16px; display: grid; align-content: end; gap: 8px; background: var(--bg-2); } .project strong { font-size: 20px; } .pad { padding: 16px; display: grid; gap: 10px; } .pad h2 { font-size: 32px; }`,
    js,
  };
}

function blog(blueprint: Blueprint, t: Phrases): Built {
  const posts = [0, 1, 2].map((n) => ({
    title: blueprint.lang.startsWith("zh") ? `${blueprint.name} 筆記 ${n + 1}` : `${blueprint.name}, note ${n + 1}`,
    body:
      blueprint.lang.startsWith("zh")
        ? "把一天裡真正發生的事寫短。留下時間、人和下一步。"
        : "Write the day shorter than it felt. Keep the time, the person, and the next step.",
  }));
  const body = frame(blueprint, `<div id="posts"></div><article id="reader" class="card pad" hidden></article>`);
  const js = program(`
    var posts = ${jsJson(posts)};
    function list() {
      qs("#reader").hidden = true;
      var box = qs("#posts");
      box.hidden = false; box.innerHTML = "";
      posts.forEach(function (post, index) {
        var article = document.createElement("article");
        article.className = "article";
        var h = document.createElement("h2"); h.textContent = post.title;
        var p = document.createElement("p"); p.textContent = post.body;
        var button = document.createElement("button");
        button.type = "button"; button.className = "tiny"; button.textContent = ${jsJson(t.read)};
        on(button, "click", function () { open(index); });
        article.appendChild(h); article.appendChild(p); article.appendChild(button);
        box.appendChild(article);
      });
    }
    function open(index) {
      qs("#posts").hidden = true;
      var reader = qs("#reader");
      reader.hidden = false; reader.innerHTML = "";
      var back = document.createElement("button");
      back.type = "button"; back.className = "tiny"; back.textContent = ${jsJson(t.back)};
      on(back, "click", list);
      var h = document.createElement("h2"); h.textContent = posts[index].title;
      var p = document.createElement("p"); p.textContent = posts[index].body;
      reader.appendChild(back); reader.appendChild(h); reader.appendChild(p);
    }
    list();
  `);
  return {
    body,
    css: `#posts { display: grid; gap: 12px; } .article, .pad { padding: 16px; display: grid; gap: 8px; } .article h2, .pad h2 { font-size: 24px; }`,
    js,
  };
}

function links(blueprint: Blueprint): Built {
  const items =
    blueprint.lang.startsWith("zh")
      ? [
          ["寫信", "mailto:hello@example.com"],
          ["時間", "#schedule"],
          ["作品", "#work"],
        ]
      : [
          ["Write", "mailto:hello@example.com"],
          ["Hours", "#schedule"],
          ["Work", "#work"],
        ];
  const body = frame(
    blueprint,
    `<section class="profile"><p class="avatar">${esc(blueprint.name.slice(0, 1))}</p><h2>${esc(blueprint.name)}</h2><p class="muted">${esc(blueprint.headline)}</p></section><div class="links">${items
      .map(([label, href]) => `<a class="link" href="${esc(href)}">${esc(label)}</a>`)
      .join("")}</div>`,
  );
  return {
    body,
    css: `.profile { display: grid; justify-items: center; text-align: center; gap: 8px; } .avatar { width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); font-size: 32px; } .links { display: grid; gap: 10px; max-width: 420px; margin: 0 auto; } .link { padding: 14px 16px; text-align: center; text-decoration: none; font-size: 16px; }`,
    js: program(""),
  };
}

function chat(blueprint: Blueprint, t: Phrases): Built {
  const body = frame(
    blueprint,
    `<p class="muted">${esc(t.localReplies)}</p><ol id="log" class="log"></ol><form id="form" class="row"><label class="grow">${esc(t.send)}<input id="text" required /></label><button class="primary" type="submit">${esc(t.send)}</button></form>`,
  );
  const js = program(`
    var log = qs("#log");
    function bubble(text, mine) {
      var li = document.createElement("li");
      li.className = mine ? "mine" : "theirs";
      var who = document.createElement("span");
      who.textContent = mine ? ${jsJson(t.you)} : blueprintName();
      var p = document.createElement("p");
      p.textContent = text;
      li.appendChild(who); li.appendChild(p); log.appendChild(li);
      log.scrollTop = log.scrollHeight;
    }
    function blueprintName() { return ${jsJson(blueprint.name)}; }
    function reply(text) {
      var lower = text.toLowerCase();
      if (lower.indexOf("price") >= 0 || text.indexOf("價") >= 0 || text.indexOf("价") >= 0) return ${jsJson(blueprint.lang.startsWith("zh") ? "價錢寫在頁面上，不在這段對話裡。" : "The price lives on the page, not in this thread.")};
      if (lower.indexOf("hour") >= 0 || text.indexOf("時間") >= 0 || text.indexOf("时间") >= 0) return ${jsJson(blueprint.lang.startsWith("zh") ? "時間以頁面上的表為準。" : "Use the hours printed on the page.")};
      return ${jsJson(blueprint.lang.startsWith("zh") ? "收到。這則回覆只留在這個頁面。" : "Noted. This reply stays on this page.")};
    }
    bubble(${jsJson(blueprint.lang.startsWith("zh") ? "可以問時間或價錢。" : "You can ask about hours or price.")}, false);
    on(qs("#form"), "submit", function (event) {
      event.preventDefault();
      var text = qs("#text").value.trim();
      if (!text) return;
      bubble(text, true);
      qs("#text").value = "";
      bubble(reply(text), false);
    });
  `);
  return {
    body,
    css: `.log { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; max-height: 420px; overflow: auto; } .log li { max-width: 80%; padding: 10px 12px; border-radius: var(--radius); background: var(--card); border: 1px solid var(--line); } .log .mine { margin-left: auto; background: var(--accent); color: var(--accent-ink); } .log span { display: block; font-size: 13px; margin-bottom: 4px; } .log p { font-size: 16px; }`,
    js,
  };
}

function fitness(blueprint: Blueprint, t: Phrases): Built {
  const seed =
    blueprint.lang.startsWith("zh")
      ? [
          { id: "w1", name: "深蹲", sets: 3, reps: 8 },
          { id: "w2", name: "划船", sets: 3, reps: 10 },
        ]
      : [
          { id: "w1", name: "Squat", sets: 3, reps: 8 },
          { id: "w2", name: "Row", sets: 3, reps: 10 },
        ];
  const body = frame(
    blueprint,
    `<form id="form" class="row"><label class="grow">${esc(t.exercise)}<input id="name" required /></label><label>${esc(t.sets)}<input id="sets" inputmode="numeric" value="3" /></label><label>${esc(t.reps)}<input id="reps" inputmode="numeric" value="8" /></label><button class="primary" type="submit">${esc(t.log)}</button></form><p class="metric"><span>${esc(t.total)}</span><strong id="total">0</strong></p><ul id="list" class="list"></ul>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-fit:${blueprint.name}`)};
    var state = load(key, ${jsJson(seed)});
    function draw() {
      qs("#total").textContent = String(state.reduce(function (sum, item) { return sum + Number(item.sets || 0); }, 0));
      var list = qs("#list");
      list.innerHTML = "";
      state.forEach(function (item) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.textContent = item.name + " · " + item.sets + " × " + item.reps;
        var del = document.createElement("button");
        del.type = "button"; del.className = "tiny"; del.textContent = ${jsJson(t.del)};
        on(del, "click", function () { state = state.filter(function (entry) { return entry.id !== item.id; }); save(key, state); draw(); });
        li.appendChild(span); li.appendChild(del); list.appendChild(li);
      });
    }
    on(qs("#form"), "submit", function (event) {
      event.preventDefault();
      state.unshift({ id: uid(), name: qs("#name").value.trim(), sets: Number(qs("#sets").value || 0), reps: Number(qs("#reps").value || 0) });
      qs("#name").value = "";
      save(key, state); draw();
    });
    draw();
  `);
  return { body, css: `label { display: grid; gap: 6px; font-size: 15px; } #sets, #reps { width: 88px; }`, js };
}

function inventory(blueprint: Blueprint, t: Phrases): Built {
  const seed =
    blueprint.lang.startsWith("zh")
      ? [
          { id: "i1", name: "黏土", qty: 12 },
          { id: "i2", name: "釉藥", qty: 2 },
          { id: "i3", name: "紙", qty: 40 },
        ]
      : [
          { id: "i1", name: "Clay", qty: 12 },
          { id: "i2", name: "Glaze", qty: 2 },
          { id: "i3", name: "Paper", qty: 40 },
        ];
  const body = frame(
    blueprint,
    `<form id="form" class="row"><label class="grow">${esc(t.name)}<input id="name" required /></label><label>${esc(t.quantity)}<input id="qty" inputmode="numeric" value="1" /></label><button class="primary" type="submit">${esc(t.add)}</button></form><table><thead><tr><th>${esc(t.name)}</th><th>${esc(t.quantity)}</th><th></th></tr></thead><tbody id="rows"></tbody></table>`,
  );
  const js = program(`
    var key = ${jsJson(`flint-stock:${blueprint.name}`)};
    var state = load(key, ${jsJson(seed)});
    function draw() {
      var rows = qs("#rows");
      rows.innerHTML = "";
      state.forEach(function (item) {
        var tr = document.createElement("tr");
        var name = document.createElement("td");
        name.textContent = item.name;
        var qty = document.createElement("td");
        var minus = document.createElement("button"); minus.type = "button"; minus.className = "ghost"; minus.textContent = "−";
        var plus = document.createElement("button"); plus.type = "button"; plus.className = "ghost"; plus.textContent = "+";
        var count = document.createElement("strong");
        count.textContent = String(item.qty);
        if (item.qty < 3) count.className = "low";
        on(minus, "click", function () { item.qty = Math.max(0, item.qty - 1); save(key, state); draw(); });
        on(plus, "click", function () { item.qty += 1; save(key, state); draw(); });
        qty.appendChild(minus); qty.appendChild(count); qty.appendChild(plus);
        var del = document.createElement("td");
        var remove = document.createElement("button");
        remove.type = "button"; remove.className = "tiny"; remove.textContent = ${jsJson(t.del)};
        on(remove, "click", function () { state = state.filter(function (entry) { return entry.id !== item.id; }); save(key, state); draw(); });
        del.appendChild(remove);
        tr.appendChild(name); tr.appendChild(qty); tr.appendChild(del); rows.appendChild(tr);
      });
    }
    on(qs("#form"), "submit", function (event) {
      event.preventDefault();
      state.unshift({ id: uid(), name: qs("#name").value.trim(), qty: Number(qs("#qty").value || 0) });
      qs("#name").value = "";
      save(key, state); draw();
    });
    draw();
  `);
  return { body, css: `td .ghost, td strong { margin-right: 6px; } td .ghost { width: auto; min-width: 36px; }`, js };
}
