import { phrases } from "./phrases";
import { program } from "./runtime";
import { capitalize, clampText, esc, hash } from "./text";
import type { Blueprint } from "./types";

export type Built = {
  body: string;
  css: string;
  js: string;
};

type Row = { when: string; what: string; meta: string };
type Feature = { title: string; body: string };

function featureList(blueprint: Blueprint): Feature[] {
  const lang = blueprint.lang;
  const parts = blueprint.prompt
    .split(/,|，|、| and | 和 | 與 | 与 | と /i)
    .map((part) => part.trim())
    .filter(Boolean);
  const items: Feature[] = [];
  for (const part of parts) {
    const cleaned = part
      .replace(/^(with|including|plus|附有|包含|使用)\s+/i, "")
      .replace(/\b(palette|color|colour)\b|色調|配色/gi, "")
      .trim();
    if (cleaned.length < 6 || cleaned.length > 72) continue;
    if (/^(build|make|create|design|做|請|请)/i.test(cleaned)) continue;
    const title = lang === "en" ? capitalize(cleaned.replace(/\.$/, "")) : cleaned;
    const body =
      lang === "zh-Hans"
        ? `${blueprint.name} 把「${title}」放在访客看得到的地方。`
        : lang === "zh-Hant"
          ? `${blueprint.name} 把「${title}」放在訪客看得到的地方。`
          : lang === "ja"
            ? `${blueprint.name} は「${title}」を、来た人が読める場所に置く。`
            : `${blueprint.name} keeps ${title.charAt(0).toLowerCase()}${title.slice(1)} where a visitor can read it.`;
    items.push({ title, body });
  }
  const fallbackEn = [
    { title: "A clear first screen", body: "The name, the offer, and the next step sit together." },
    { title: "Hours and prices in the open", body: "People can decide before they write to you." },
    { title: "A way to reply", body: "An email list lives on the page, stored in this browser." },
  ];
  const fallbackZh = [
    { title: "第一屏就說清楚", body: "名稱、內容和下一步放在一起。" },
    { title: "時間和價錢公開", body: "對方可以先決定，再寫信。" },
    { title: "可以直接留下聯絡方式", body: "名單存在這個瀏覽器裡。" },
  ];
  const fallbackHans = [
    { title: "第一屏就说清楚", body: "名称、内容和下一步放在一起。" },
    { title: "时间和价钱公开", body: "对方可以先决定，再写信。" },
    { title: "可以直接留下联系方式", body: "名单存在这个浏览器里。" },
  ];
  const fallbackJa = [
    { title: "最初の画面で伝える", body: "名前と内容と次の一歩を揃える。" },
    { title: "時間と料金を出す", body: "書く前に判断できる。" },
    { title: "連絡先を残せる", body: "名簿はこのブラウザに残る。" },
  ];
  const fallback = lang === "zh-Hans" ? fallbackHans : lang === "zh-Hant" ? fallbackZh : lang === "ja" ? fallbackJa : fallbackEn;
  const merged = items.length >= 3 ? items : [...items, ...fallback];
  return merged.slice(0, 6);
}

function schedule(blueprint: Blueprint): Row[] {
  const prompt = blueprint.prompt.toLowerCase();
  if (/peng chau|坪洲/.test(prompt)) {
    return [
      { when: "08:15", what: "Peng Chau → Central", meta: "HK$28" },
      { when: "09:30", what: "Central → Peng Chau", meta: "HK$28" },
      { when: "12:00", what: "Peng Chau → Central", meta: "HK$28" },
      { when: "15:40", what: "Central → Peng Chau", meta: "HK$32" },
      { when: "18:10", what: "Peng Chau → Central", meta: "HK$32" },
    ];
  }
  if (/ferry|渡輪|渡轮|船/.test(prompt)) {
    return [
      { when: "08:00", what: "Outbound", meta: "HK$24" },
      { when: "10:30", what: "Return", meta: "HK$24" },
      { when: "13:15", what: "Outbound", meta: "HK$28" },
      { when: "16:45", what: "Return", meta: "HK$28" },
    ];
  }
  if (/class|studio|potter|陶|教室|工房/.test(prompt)) {
    return blueprint.lang === "zh-Hant" || blueprint.lang === "zh-Hans"
      ? [
          { when: blueprint.lang === "zh-Hans" ? "周六 10:00" : "週六 10:00", what: blueprint.lang === "zh-Hans" ? "入门拉坯" : "入門拉坯", meta: "6" },
          { when: blueprint.lang === "zh-Hans" ? "周六 14:00" : "週六 14:00", what: blueprint.lang === "zh-Hans" ? "釉药课" : "釉藥課", meta: "8" },
          { when: blueprint.lang === "zh-Hans" ? "周日 11:00" : "週日 11:00", what: blueprint.lang === "zh-Hans" ? "开放工作室" : "開放工作室", meta: "10" },
        ]
      : [
          { when: "Sat 10:00", what: "Beginner wheel", meta: "6 seats" },
          { when: "Sat 14:00", what: "Glaze day", meta: "8 seats" },
          { when: "Sun 11:00", what: "Open studio", meta: "10 seats" },
        ];
  }
  return [
    { when: "Tue–Fri", what: "11:00–19:00", meta: blueprint.lang.startsWith("zh") ? "開放" : "Open" },
    { when: "Sat", what: "10:00–18:00", meta: blueprint.lang.startsWith("zh") ? "開放" : "Open" },
    { when: "Sun", what: "12:00–17:00", meta: blueprint.lang.startsWith("zh") ? "半天" : "Short day" },
  ];
}

function lede(blueprint: Blueprint): string {
  const stripped = blueprint.prompt
    .replace(/^(please\s+)?(build|make|create|design|generate)\s+(me\s+)?(a\s+|an\s+|the\s+)?/i, "")
    .replace(/^(請|请)?(幫我|帮我)?(做|建立|生成|設計|设计)(一個|一个)?/, "")
    .trim();
  if (stripped.length >= 16 && stripped.length <= 180) {
    if (blueprint.lang === "en") return capitalize(stripped.replace(/[.。]$/, "")) + ".";
    return stripped.replace(/[。．.]$/, "") + "。";
  }
  if (blueprint.lang === "zh-Hans") return `${blueprint.name} 把时间、价钱和联系方式放在同一页。`;
  if (blueprint.lang === "zh-Hant") return `${blueprint.name} 把時間、價錢和聯絡方式放在同一頁。`;
  if (blueprint.lang === "ja") return `${blueprint.name} は、時間と料金と連絡先を一枚にまとめる。`;
  return `${blueprint.name} puts the hours, the prices, and a way to reply on one page.`;
}

function money(locale: Blueprint["lang"], amount: number): string {
  if (locale === "ja") return `¥${amount * 150}`;
  if (locale === "zh-Hant" || locale === "zh-Hans") return `HK$${amount}`;
  return `$${amount}`;
}

export function renderLanding(blueprint: Blueprint): Built {
  const t = phrases(blueprint.lang);
  const features = featureList(blueprint);
  const rows = schedule(blueprint);
  const sections = new Set(blueprint.sections);
  const names =
    blueprint.lang === "ja"
      ? ["青木 蓮", "森下 圭"]
      : blueprint.lang === "zh-Hans"
        ? ["陈可恩", "林柏言"]
        : blueprint.lang === "zh-Hant"
          ? ["陳可恩", "林柏言"]
          : ["Mara Ellison", "Jonah Peck"];
  const quotes =
    blueprint.lang === "ja"
      ? [`${blueprint.name} は、必要なことだけが残っている。`, "値段と時間が先に見えるので、聞きやすい。"]
      : blueprint.lang === "zh-Hans"
        ? [`${blueprint.name} 只留下需要看的东西。`, "价钱和时间先出现，问起来比较容易。"]
        : blueprint.lang === "zh-Hant"
          ? [`${blueprint.name} 只留下需要看的東西。`, "價錢和時間先出現，問起來比較容易。"]
          : [`${blueprint.name} leaves only what I needed to see.`, "The price and the time show up before I have to ask."];
  const answers =
    blueprint.lang === "zh-Hans"
      ? ["不用。这一页自己就够用。", "可以。时间写在页面上。", "写邮件，或在名单里留一句。"]
      : blueprint.lang === "zh-Hant"
        ? ["不用。這一頁自己就夠用。", "可以。時間寫在頁面上。", "寫電郵，或在名單裡留一句。"]
        : blueprint.lang === "ja"
          ? ["要りません。このページだけで足ります。", "できます。時間はページにあります。", "メールを書くか、名簿に一行残してください。"]
          : ["No. This page is enough.", "Yes. The hours are on the page.", "Send an email, or leave a line on the list."];
  const prices = [48, 96, 160].map((base) => base + (hash(blueprint.name) % 7) * 4);
  const nav = [
    sections.has("features") ? ["#features", t.features] : null,
    sections.has("schedule") ? ["#schedule", t.schedule] : null,
    sections.has("pricing") ? ["#pricing", t.pricing] : null,
    sections.has("faq") ? ["#faq", t.faq] : null,
  ].filter((item): item is [string, string] => Boolean(item));

  const ticket = rows
    .slice(0, 4)
    .map(
      (row) =>
        `<li><span>${esc(row.when)}</span><span>${esc(row.what)}</span><b>${esc(row.meta)}</b></li>`,
    )
    .join("");

  const featureHtml = features
    .map(
      (item) =>
        `<article class="feature"><h3>${esc(clampText(item.title, 72))}</h3><p>${esc(item.body)}</p></article>`,
    )
    .join("");

  const scheduleHtml = sections.has("schedule")
    ? `<section id="schedule"><h2>${esc(t.schedule)}</h2><table><thead><tr><th>${esc(t.hours)}</th><th>${esc(t.title)}</th><th>${esc(t.fare)}</th></tr></thead><tbody>${rows
        .map((row) => `<tr><td>${esc(row.when)}</td><td>${esc(row.what)}</td><td>${esc(row.meta)}</td></tr>`)
        .join("")}</tbody></table></section>`
    : "";

  const stepsHtml = sections.has("steps")
    ? `<section id="steps"><h2>${esc(t.how)}</h2><ol class="steps">${[t.stepLook, t.stepChoose, t.stepArrive]
        .map((step, index) => `<li><span>${index + 1}</span><p>${esc(step)}</p></li>`)
        .join("")}</ol></section>`
    : "";

  const galleryHtml = sections.has("gallery")
    ? `<section id="gallery"><h2>${esc(t.gallery)}</h2><div class="gallery">${features
        .slice(0, 3)
        .map((item, index) => `<figure class="g${index + 1}"><figcaption>${esc(clampText(item.title, 42))}</figcaption></figure>`)
        .join("")}</div></section>`
    : "";

  const pricingHtml = sections.has("pricing")
    ? `<section id="pricing"><div class="section-head"><h2>${esc(t.pricing)}</h2><div class="row" role="group" aria-label="${esc(t.pricing)}"><button type="button" class="ghost on" data-bill="month">${esc(t.monthly)}</button><button type="button" class="ghost" data-bill="year">${esc(t.yearly)}</button></div></div><div class="plans">${[t.planVisitor, t.planRegular, t.planStudio]
        .map((plan, index) => {
          const month = prices[index]!;
          const year = Math.round(month * 10);
          return `<article class="plan${index === 1 ? " featured" : ""}"><h3>${esc(plan)}</h3><p class="price" data-month="${esc(money(blueprint.lang, month))}" data-year="${esc(money(blueprint.lang, year))}"><strong>${esc(money(blueprint.lang, month))}</strong> <span>${esc(t.perMonth)}</span></p><p>${esc(features[index]?.title ?? plan)}</p></article>`;
        })
        .join("")}</div></section>`
    : "";

  const storiesHtml = sections.has("stories")
    ? `<section id="stories"><h2>${esc(t.stories)}</h2><div class="stories">${quotes
        .map((quote, index) => `<blockquote><p>${esc(quote)}</p><footer>${esc(names[index]!)}</footer></blockquote>`)
        .join("")}</div></section>`
    : "";

  const faqHtml = sections.has("faq")
    ? `<section id="faq"><h2>${esc(t.faq)}</h2><div class="faq">${t.faqQ
        .map((question, index) => `<details><summary>${esc(question)}</summary><p>${esc(answers[index]!)}</p></details>`)
        .join("")}</div></section>`
    : "";

  const waitHtml = sections.has("waitlist")
    ? `<section id="waitlist" class="wait"><h2>${esc(t.waitlist)}</h2><form id="join"><label class="grow" for="email">${esc(t.email)}<input id="email" name="email" type="email" required autocomplete="email" /></label><button class="primary" type="submit">${esc(t.join)}</button></form><p id="joined" class="muted" hidden></p><ul id="people" class="list"></ul></section>`
    : "";

  const heroClass = blueprint.variant === 1 ? "hero hero-center" : blueprint.variant === 2 ? "hero hero-band" : "hero hero-split";
  const showTicket = blueprint.variant !== 1;
  const body = `<header class="nav"><a class="logo" href="#top">${esc(blueprint.name)}</a><nav>${nav
    .map(([href, label]) => `<a href="${href}">${esc(label)}</a>`)
    .join("")}</nav><a class="btn" href="${sections.has("waitlist") ? "#waitlist" : "#features"}">${esc(t.getStarted)}</a></header>
<main id="top">
  <section class="${heroClass}">
    <div>
      <p class="eyebrow">${esc(blueprint.name)}</p>
      <h1>${esc(blueprint.headline)}</h1>
      <p class="lede">${esc(lede(blueprint))}</p>
      <div class="row">
        <a class="btn" href="${sections.has("waitlist") ? "#waitlist" : "#features"}">${esc(t.getStarted)}</a>
        <a class="btn ghost" href="#features">${esc(t.seeDetails)}</a>
      </div>
    </div>
    ${showTicket ? `<aside class="ticket"><p>${esc(t.schedule)}</p><ol>${ticket}</ol></aside>` : ""}
  </section>
  ${sections.has("features") ? `<section id="features"><h2>${esc(t.features)}</h2><div class="features">${featureHtml}</div></section>` : ""}
  ${scheduleHtml}
  ${stepsHtml}
  ${galleryHtml}
  ${pricingHtml}
  ${storiesHtml}
  ${faqHtml}
  ${waitHtml}
</main>
<footer class="foot"><span>${esc(blueprint.name)}</span><span>${esc(t.yearNote)}</span></footer>`;

  const css = `
.nav, main, .foot { max-width: 1120px; margin: 0 auto; }
.nav { display: flex; flex-wrap: wrap; gap: 12px 18px; align-items: center; padding: 18px var(--pad); position: sticky; top: 0; background: color-mix(in srgb, var(--bg) 88%, transparent); }
.logo { font-size: 16px; font-weight: 600; text-decoration: none; }
.nav nav { display: flex; flex-wrap: wrap; gap: 10px 16px; }
.nav nav a { font-size: 15px; text-decoration: none; color: var(--mute); }
.nav .btn { margin-left: auto; }
.hero { display: grid; gap: 28px; padding: 28px var(--pad) 12px; align-items: center; }
.hero-split { grid-template-columns: minmax(0, 1.2fr) minmax(240px, 0.8fr); }
.hero-center { text-align: center; justify-items: center; }
.hero-center .lede, .hero-center .row { justify-content: center; }
.hero-band { background: var(--accent); color: var(--accent-ink); border-radius: 28px; margin: 8px var(--pad) 0; padding: 36px 28px; }
.hero-band .lede, .hero-band .eyebrow { color: var(--accent-ink); }
.hero-band .ghost { color: var(--accent-ink); border-color: color-mix(in srgb, var(--accent-ink) 40%, transparent); }
.eyebrow { font-size: 15px; color: var(--mute); }
.lede { margin-top: 14px; font-size: 18px; line-height: 1.5; max-width: 38rem; color: var(--mute); }
.hero .row { margin-top: 18px; }
.ticket { background: var(--card); color: var(--ink); border: 1px solid var(--line); border-radius: 20px; padding: 16px; }
.hero-band .ticket { background: var(--card); }
.ticket p { font-size: 13px; color: var(--mute); margin-bottom: 8px; }
.ticket ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.ticket li { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; font-size: 15px; padding-top: 8px; border-top: 1px solid var(--line); }
.ticket li:first-child { border-top: 0; padding-top: 0; }
section { padding: 28px var(--pad); }
section h2 { font-family: var(--serif); font-size: clamp(28px, 4vw, 40px); font-weight: 500; letter-spacing: -0.03em; margin-bottom: 16px; }
.features, .plans, .stories { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.feature, .plan, blockquote, details { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; }
.feature h3, .plan h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.feature p, .plan p, blockquote p, details p { color: var(--mute); font-size: 16px; }
.steps { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.steps li { display: flex; gap: 12px; align-items: center; background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 12px 14px; }
.steps span { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--accent); color: var(--accent-ink); font-size: 16px; flex: none; }
.gallery { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 12px; }
.gallery figure { min-height: 180px; margin: 0; border-radius: 18px; display: flex; align-items: flex-end; padding: 16px; color: var(--accent-ink); }
.g1 { background: linear-gradient(160deg, var(--accent), var(--bg-2)); grid-row: span 2; }
.g2 { background: var(--bg-2); color: var(--ink); }
.g3 { background: var(--soft); color: var(--ink); }
.section-head { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: end; }
.plan.featured { background: var(--ink); color: var(--bg); }
.plan.featured p { color: color-mix(in srgb, var(--bg) 78%, var(--ink)); }
.price strong { font-size: 32px; letter-spacing: -0.03em; color: inherit; }
button.on { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.faq { display: grid; gap: 8px; }
details summary { cursor: pointer; font-size: 16px; font-weight: 600; }
details p { margin-top: 8px; }
.wait form, #join { display: flex; flex-wrap: wrap; gap: 8px; align-items: end; }
#join label { display: grid; gap: 6px; font-size: 15px; min-width: min(100%, 260px); }
blockquote footer { margin-top: 12px; font-size: 15px; color: var(--ink); }
.foot { display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between; padding: 28px var(--pad) 40px; color: var(--mute); font-size: 15px; }
@media (max-width: 800px) {
  .hero-split, .gallery { grid-template-columns: 1fr; }
  .g1 { grid-row: auto; min-height: 140px; }
  .nav .btn { margin-left: 0; }
}
`;

  const js = program(`
    var monthLabel = ${JSON.stringify(t.perMonth)};
    var yearLabel = ${JSON.stringify(t.perYear)};
    var joinedLabel = ${JSON.stringify(t.joined)};
    var key = ${JSON.stringify(`flint-wait:${blueprint.name}`)};
    qsa("[data-bill]").forEach(function (button) {
      on(button, "click", function () {
        var mode = button.getAttribute("data-bill");
        qsa("[data-bill]").forEach(function (item) { item.classList.toggle("on", item === button); });
        qsa(".price").forEach(function (price) {
          var strong = price.querySelector("strong");
          var span = price.querySelector("span");
          if (strong) strong.textContent = price.getAttribute(mode === "year" ? "data-year" : "data-month") || "";
          if (span) span.textContent = mode === "year" ? yearLabel : monthLabel;
        });
      });
    });
    var form = qs("#join");
    var list = qs("#people");
    var note = qs("#joined");
    function draw(people) {
      if (!list) return;
      list.innerHTML = "";
      people.forEach(function (person) {
        var li = document.createElement("li");
        li.textContent = person;
        list.appendChild(li);
      });
    }
    var people = load(key, []);
    draw(people);
    on(form, "submit", function (event) {
      event.preventDefault();
      var input = qs("#email");
      var value = input && input.value.trim();
      if (!value) return;
      people = [value].concat(people.filter(function (item) { return item !== value; })).slice(0, 8);
      save(key, people);
      if (input) input.value = "";
      if (note) { note.hidden = false; note.textContent = joinedLabel; }
      draw(people);
    });
  `);

  return { body, css, js };
}
