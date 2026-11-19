"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { bundleHtml } from "@/lib/flint/bundle";
import { renderFiles } from "@/lib/flint/generate";
import { parseBrief } from "@/lib/flint/parse";
import { revise } from "@/lib/flint/revise";
import { businesses, templates, toolkits, useCases } from "@/lib/flint/home";
import { explain, opening, studioCopy, suggestions } from "@/lib/flint/studio";
import { slug } from "@/lib/flint/text";
import type { Blueprint, BuildMode, ChatMessage, Project, UiLocale } from "@/lib/flint/types";
import { zipStore } from "@/lib/flint/zip";
import type { UrlLocale } from "@/lib/i18n/paths";
import "./flint.css";

const STORAGE_KEY = "flint.projects.v1";
const OPEN_KEY = "flint.open";

function uid(): string {
  return crypto.randomUUID();
}

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.id && item.blueprint && Array.isArray(item.files));
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  const next = JSON.stringify(projects.slice(0, 16));
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.slice(0, 8)));
    } catch {
      /* The browser refused more storage. The open page still works. */
    }
  }
}

function download(filename: string, data: BlobPart, type: string) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function touch(project: Project): Project {
  return { ...project, updatedAt: Date.now() };
}

function ModeIcon({ id }: { id: BuildMode }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true as const };
  if (id === "website") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4c2.5 2.8 2.5 13.2 0 16M12 4c-2.5 2.8-2.5 13.2 0 16" />
      </svg>
    );
  }
  if (id === "app") {
    return (
      <svg {...common}>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M11 18h2" />
      </svg>
    );
  }
  if (id === "slides") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="12" rx="2" />
        <path d="M8 20h8" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M8 5h8v4H8zM5 11h6v8H5zM13 11h6v8h-6z" />
    </svg>
  );
}

function createProject(prompt: string, mode: BuildMode): Project {
  const blueprint = parseBrief(prompt, mode);
  const now = Date.now();
  return {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    blueprint,
    files: renderFiles(blueprint),
    messages: [
      { id: uid(), role: "user", text: prompt },
      { id: uid(), role: "assistant", text: "" },
    ],
    past: [],
    diverged: false,
  };
}

export function FlintApp({ locale }: { locale: UiLocale; urlLocale: UrlLocale }) {
  const copy = studioCopy(locale);
  const [hydrated, setHydrated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [follow, setFollow] = useState("");
  const [selected, setSelected] = useState("index.html");
  const [phase, setPhase] = useState<"ready" | "composing">("ready");
  const [written, setWritten] = useState<string[]>([]);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [tab, setTab] = useState<"chat" | "preview" | "code">("preview");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [mode, setMode] = useState<BuildMode>("prototype");
  const [menu, setMenu] = useState<"solutions" | "resources" | null>(null);
  const [sheet, setSheet] = useState<
    "docs" | "templates" | "integrations" | "help" | "changelog" | "careers" | "pricing" | "signin" | "figma" | "github" | "team" | "usecases" | "solutions" | null
  >(null);
  const [sourceUrl, setSourceUrl] = useState("");

  const active = projects.find((project) => project.id === activeId) ?? null;

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-flint", "1");
    return () => document.documentElement.removeAttribute("data-flint");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loaded = loadProjects();
      setProjects(loaded);
      try {
        const open = sessionStorage.getItem(OPEN_KEY);
        if (open && loaded.some((project) => project.id === open)) setActiveId(open);
      } catch {
        /* session storage is optional */
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveProjects(projects);
  }, [hydrated, projects]);

  useEffect(() => {
    if (!active || phase !== "composing") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let step = 0;
    const tick = () => {
      step += 1;
      setWritten(active.files.slice(0, step).map((file) => file.path));
      if (reduced || step >= active.files.length) setPhase("ready");
    };
    const timer = window.setInterval(tick, reduced ? 0 : 280);
    return () => window.clearInterval(timer);
  }, [active, phase]);

  const preview = useMemo(() => (active ? bundleHtml(active.files) : ""), [active]);

  function remember(project: Project) {
    setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)].slice(0, 16));
    setActiveId(project.id);
    try {
      sessionStorage.setItem(OPEN_KEY, project.id);
    } catch {
      /* ignore */
    }
  }

  function openSheet(next: NonNullable<typeof sheet>) {
    setMenu(null);
    setSheet(next);
    setSourceUrl("");
  }

  function startFrom(starter: { prompt: string; mode: BuildMode }) {
    setSheet(null);
    setMenu(null);
    setMode(starter.mode);
    build(starter.prompt, starter.mode);
  }

  function build(text: string, chosen = mode) {
    const clean = text.trim();
    if (!clean || phase === "composing") return;
    const project = createProject(clean, chosen);
    project.messages[1] = { id: uid(), role: "assistant", text: opening(project.blueprint, locale) };
    setPrompt("");
    setSelected("index.html");
    setTab("preview");
    setDevice("desktop");
    setPhase("composing");
    remember(project);
  }

  function updateActive(next: Project) {
    remember(touch(next));
  }

  function sendFollow(raw = follow) {
    if (!active || phase === "composing") return;
    const text = raw.trim();
    if (!text) return;
    const result = revise(active.blueprint, text);
    const changed = result.changes.some((change) => change.type !== "noop");
    const files = changed ? renderFiles(result.blueprint) : active.files;
    const note = explain(result.changes, result.blueprint, locale);
    const extra = changed && active.diverged ? ` ${copy.diverged}` : "";
    const messages: ChatMessage[] = [
      ...active.messages,
      { id: uid(), role: "user" as const, text },
      { id: uid(), role: "assistant" as const, text: `${note}${extra}`.trim() },
    ].slice(-40);
    setFollow("");
    setTab("preview");
    if (changed) {
      setPhase("composing");
      setPreviewKey((value) => value + 1);
    }
    updateActive({
      ...active,
      blueprint: result.blueprint,
      files,
      messages,
      past: changed ? [...active.past, active.blueprint].slice(-20) : active.past,
      diverged: changed ? false : active.diverged,
    });
  }

  function editFile(path: string, contents: string) {
    if (!active) return;
    const files = active.files.map((file) => (file.path === path ? { ...file, contents: contents.slice(0, 200000) } : file));
    updateActive({ ...active, files, diverged: true });
    setPreviewKey((value) => value + 1);
  }

  function undo() {
    if (!active || active.past.length === 0) return;
    const past = [...active.past];
    const blueprint = past.pop() as Blueprint;
    setPhase("composing");
    updateActive({
      ...active,
      blueprint,
      past,
      files: renderFiles(blueprint),
      diverged: false,
      messages: [
        ...active.messages,
        { id: uid(), role: "assistant" as const, text: opening(blueprint, locale) },
      ].slice(-40),
    });
  }

  function rebuild() {
    if (!active) return;
    setPhase("composing");
    updateActive({ ...active, files: renderFiles(active.blueprint), diverged: false });
  }

  const file = active?.files.find((item) => item.path === selected) ?? active?.files[0];
  const ideas = active ? suggestions(active.blueprint, locale) : [];

  if (!active) {
    return (
      <div className="shell">
        <div className="home-scroll gate">
          <header className="topbar">
            <p className="word">{copy.product}</p>
            <nav className="nav-links" aria-label="Primary">
              <button type="button" className={menu === "solutions" ? "nav-btn on" : "nav-btn"} onClick={() => setMenu(menu === "solutions" ? null : "solutions")}>
                Solutions
              </button>
              <button type="button" className={menu === "resources" ? "nav-btn on" : "nav-btn"} onClick={() => setMenu(menu === "resources" ? null : "resources")}>
                Resources
              </button>
              <button type="button" className="nav-btn" onClick={() => openSheet("careers")}>
                Careers
              </button>
              <button type="button" className="nav-btn" onClick={() => openSheet("pricing")}>
                Pricing
              </button>
            </nav>
            <div className="nav-actions">
              <button type="button" className="nav-btn" onClick={() => openSheet("signin")}>
                Sign in
              </button>
              <button
                type="button"
                className="build-now"
                onClick={() => {
                  setMenu(null);
                  setSheet(null);
                  document.getElementById("flint-prompt")?.focus();
                }}
              >
                Get Started
              </button>
            </div>
          </header>
          {menu === "solutions" ? (
            <div className="menu" role="menu">
              <button type="button" className="featured" onClick={() => startFrom(businesses[1]!)}>
                <strong>AI for Small Business</strong>
                <span>A working site for a real business: services, pricing, and a way to get in touch.</span>
              </button>
              <div>
                <p className="menu-label">Top use cases</p>
                {useCases.map((item) => (
                  <button key={item.label} type="button" className="menu-link" onClick={() => startFrom(item)}>
                    {item.label}
                  </button>
                ))}
                <button type="button" className="menu-link" onClick={() => openSheet("usecases")}>
                  All Use Cases
                </button>
              </div>
              <div>
                <p className="menu-label">Business type</p>
                {businesses.map((item) => (
                  <button key={item.label} type="button" className="menu-link" onClick={() => startFrom(item)}>
                    {item.label}
                  </button>
                ))}
                <button type="button" className="menu-link" onClick={() => openSheet("solutions")}>
                  All Solutions
                </button>
              </div>
            </div>
          ) : null}
          {menu === "resources" ? (
            <div className="menu resources" role="menu">
              {(
                [
                  ["docs", "Docs"],
                  ["templates", "Templates"],
                  ["integrations", "Integrations"],
                  ["help", "Help"],
                  ["changelog", "Changelog"],
                ] as const
              ).map(([id, label]) => (
                <button key={id} type="button" className="menu-link" onClick={() => openSheet(id)}>
                  {label}
                </button>
              ))}
            </div>
          ) : null}
          {sheet ? (
            <section className="sheet">
              <button type="button" className="ghost" onClick={() => setSheet(null)}>
                Back
              </button>
              {sheet === "usecases" || sheet === "solutions" ? (
                <>
                  <h1 className="gate-title">{sheet === "usecases" ? "All use cases" : "All solutions"}</h1>
                  <div className="card-grid">
                    {(sheet === "usecases" ? useCases : businesses).map((item) => (
                      <button key={item.label} type="button" className="info-card" onClick={() => startFrom(item)}>
                        <strong>{item.label}</strong>
                        <span>{item.prompt}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
              {sheet === "templates" || sheet === "team" ? (
                <>
                  <h1 className="gate-title">Team templates</h1>
                  <div className="card-grid">
                    {templates.map((item) => (
                      <button key={item.label} type="button" className="info-card" onClick={() => startFrom(item)}>
                        <strong>{item.label}</strong>
                        <span>{item.prompt}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
              {sheet === "figma" || sheet === "github" ? (
                <form
                  className="prompt-card"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const url = sourceUrl.trim();
                    if (!url) return;
                    const source = sheet === "figma" ? "Figma file" : "GitHub repository";
                    startFrom({
                      mode: sheet === "figma" ? "website" : "app",
                      prompt: `Build from this ${source}: ${url}`,
                    });
                  }}
                >
                  <h1 className="gate-title">{sheet === "figma" ? "Start from Figma" : "Start from GitHub"}</h1>
                  <label htmlFor="source-url">{sheet === "figma" ? "Figma link" : "GitHub link"}</label>
                  <input
                    id="source-url"
                    name="source"
                    value={sourceUrl}
                    onChange={(event) => setSourceUrl(event.target.value)}
                    placeholder={sheet === "figma" ? "https://www.figma.com/file/..." : "https://github.com/owner/repo"}
                  />
                  <button className="build-now" type="submit" disabled={!sourceUrl.trim()}>
                    Build now
                  </button>
                </form>
              ) : null}
              {sheet === "docs" ? (
                <>
                  <h1 className="gate-title">Docs</h1>
                  <p className="gate-lede">Pick Website, App, Prototype, or Slides. Write what you want. Build now opens a page you can click, edit, and download.</p>
                </>
              ) : null}
              {sheet === "integrations" ? (
                <>
                  <h1 className="gate-title">Integrations</h1>
                  <div className="card-grid">
                    <button type="button" className="info-card" onClick={() => openSheet("figma")}>
                      <strong>Figma</strong>
                      <span>Start a site from a Figma link.</span>
                    </button>
                    <button type="button" className="info-card" onClick={() => openSheet("github")}>
                      <strong>GitHub</strong>
                      <span>Start an app from a repository link.</span>
                    </button>
                    <button type="button" className="info-card" onClick={() => openSheet("team")}>
                      <strong>Team template</strong>
                      <span>Start from a ready brief.</span>
                    </button>
                  </div>
                </>
              ) : null}
              {sheet === "help" ? (
                <>
                  <h1 className="gate-title">Help</h1>
                  <p className="gate-lede">After a build, ask for a change in plain words: “add pricing”, “make it a task list”, or “use a night palette”.</p>
                </>
              ) : null}
              {sheet === "changelog" ? (
                <>
                  <h1 className="gate-title">Changelog</h1>
                  <p className="gate-lede">The builder now starts from a prompt, Solutions, Resources, Figma, GitHub, or a team template.</p>
                </>
              ) : null}
              {sheet === "careers" ? (
                <>
                  <h1 className="gate-title">Careers</h1>
                  <p className="gate-lede">There are no open roles. This is a builder that runs in your browser.</p>
                </>
              ) : null}
              {sheet === "pricing" ? (
                <>
                  <h1 className="gate-title">Pricing</h1>
                  <div className="card-grid">
                    <article className="info-card">
                      <strong>Free</strong>
                      <span>Build, preview, edit, and download in this browser. No account.</span>
                    </article>
                  </div>
                </>
              ) : null}
              {sheet === "signin" ? (
                <>
                  <h1 className="gate-title">Sign in</h1>
                  <p className="gate-lede">There is no account. Projects you build stay in this browser.</p>
                </>
              ) : null}
            </section>
          ) : (
          <div className="gate-hero">
            <div className="bench">
              <div>
                <p className="eyebrow">{copy.product}</p>
                <h1 className="gate-title">{copy.title}</h1>
                <p className="gate-lede">{copy.lede}</p>
              </div>
              <form
                className="prompt-card"
                onSubmit={(event) => {
                  event.preventDefault();
                  build(prompt);
                }}
              >
                <label htmlFor="flint-prompt">{copy.build}</label>
                <textarea
                  id="flint-prompt"
                  name="prompt"
                  value={prompt}
                  placeholder={copy.placeholder}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      build(prompt);
                    }
                  }}
                />
                <div className="prompt-actions">
                  <button className="build-now" type="submit" disabled={!prompt.trim() || phase === "composing"}>
                    {copy.build}
                  </button>
                </div>
              </form>
            </div>
            <div className="modes" role="radiogroup" aria-label={copy.title}>
              {copy.modes.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={mode === item.id}
                  className={mode === item.id ? "mode on" : "mode"}
                  onClick={() => setMode(item.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <ModeIcon id={item.id} />
                  {item.label}
                </button>
              ))}
            </div>
            <p className="or">{copy.startFrom}</p>
            <div className="chips">
              <button type="button" className="chip" onClick={() => openSheet("figma")}>
                Figma
              </button>
              <button type="button" className="chip" onClick={() => openSheet("github")}>
                GitHub
              </button>
              <button type="button" className="chip" onClick={() => openSheet("team")}>
                Team template
              </button>
            </div>
            <div className="card-grid">
              {toolkits.map((item) => (
                <button key={item.title} type="button" className="info-card" onClick={() => startFrom(item)}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </button>
              ))}
            </div>
            {projects.length > 0 ? (
              <section>
                <h2 className="block-title">{copy.library}</h2>
                <div className="library">
                  {projects.map((project) => (
                    <article key={project.id} className="project">
                      <div>
                        <strong>{project.blueprint.name}</strong>
                        <span>
                          {copy.kinds[project.blueprint.kind]} · {project.blueprint.palette}
                        </span>
                      </div>
                      <div className="project-actions">
                        <button type="button" className="ghost" onClick={() => setActiveId(project.id)}>
                          {copy.open}
                        </button>
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => {
                            if (pendingDelete === project.id) {
                              setProjects((current) => current.filter((item) => item.id !== project.id));
                              setPendingDelete(null);
                              return;
                            }
                            setPendingDelete(project.id);
                          }}
                        >
                          {pendingDelete === project.id ? copy.confirmDelete : copy.delete}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="shell studio-mode">
      <header className="bar">
        <button
          type="button"
          className="ghost"
          onClick={() => {
            setPhase("ready");
            setActiveId(null);
            try {
              sessionStorage.removeItem(OPEN_KEY);
            } catch {
              /* ignore */
            }
          }}
        >
          {copy.back}
        </button>
        <div className="bar-title">
          {active.blueprint.name}
          <small>
            {copy.kinds[active.blueprint.kind]} · {active.blueprint.palette}
          </small>
        </div>
        <div className="bar-actions">
          <button type="button" className="ghost" onClick={() => setDevice(device === "desktop" ? "phone" : "desktop")}>
            {device === "desktop" ? copy.phone : copy.desktop}
          </button>
          <button type="button" className="ghost" onClick={undo} disabled={active.past.length === 0}>
            {copy.undo}
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => download(`${slug(active.blueprint.name)}.html`, preview, "text/html")}
          >
            {copy.download}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => download(`${slug(active.blueprint.name)}.zip`, zipStore(active.files) as BlobPart, "application/zip")}
          >
            {copy.files}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              const url = URL.createObjectURL(new Blob([preview], { type: "text/html" }));
              window.open(url, "_blank", "noopener");
              window.setTimeout(() => URL.revokeObjectURL(url), 10000);
            }}
          >
            {copy.openTab}
          </button>
        </div>
      </header>
      <div className="tabs" role="tablist">
        {(
          [
            ["chat", copy.chat],
            ["preview", copy.preview],
            ["code", copy.code],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? "tab on" : "tab"} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="studio">
        <section className={tab === "chat" ? "pane active" : "pane"} aria-label={copy.chat}>
          <div className="scroll">
            {active.messages.map((message) => (
              <p key={message.id} className={message.role === "user" ? "bubble user" : "bubble"}>
                {message.text}
              </p>
            ))}
            <p className="note" role="status">
              {phase === "composing"
                ? `${copy.writing} ${written[written.length - 1] ?? "index.html"}`
                : active.diverged
                  ? copy.youEdited
                  : ""}
            </p>
          </div>
          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendFollow();
            }}
          >
            <div className="suggest">
              {ideas.map((idea) => (
                <button
                  key={idea.text}
                  type="button"
                  className="chip"
                  onClick={() => sendFollow(idea.text)}
                >
                  {idea.label}
                </button>
              ))}
            </div>
            <label className="note" htmlFor="flint-follow">
              {copy.send}
            </label>
            <textarea
              id="flint-follow"
              name="follow"
              value={follow}
              placeholder={copy.follow}
              onChange={(event) => setFollow(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  sendFollow();
                }
              }}
            />
            <div className="paper-row">
              <button type="button" className="ghost" onClick={rebuild} disabled={!active.diverged}>
                {copy.reset}
              </button>
              <button className="primary" type="submit" disabled={!follow.trim() || phase === "composing"}>
                {copy.send}
              </button>
            </div>
          </form>
        </section>
        <section className={tab === "code" ? "pane active" : "pane"} aria-label={copy.code}>
          <div className="files">
            {active.files.map((item) => (
              <button
                key={item.path}
                type="button"
                className={file?.path === item.path ? "file on" : "file"}
                onClick={() => setSelected(item.path)}
              >
                {item.path}
              </button>
            ))}
          </div>
          <div className="editor">
            <textarea
              id="flint-editor"
              name="editor"
              aria-label={file?.path ?? copy.code}
              value={file?.contents ?? ""}
              spellCheck={false}
              onChange={(event) => file && editFile(file.path, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Tab" && file) {
                  event.preventDefault();
                  const target = event.currentTarget;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const next = `${file.contents.slice(0, start)}  ${file.contents.slice(end)}`;
                  editFile(file.path, next);
                  requestAnimationFrame(() => {
                    target.selectionStart = start + 2;
                    target.selectionEnd = start + 2;
                  });
                }
              }}
            />
          </div>
        </section>
        <section className={tab === "preview" ? "pane active" : "pane"} aria-label={copy.preview}>
          <div className="preview-wrap">
            {phase === "composing" ? (
              <div className="composing">
                <strong>{copy.composing}</strong>
                <p>{written.join("  ·  ") || "index.html"}</p>
              </div>
            ) : (
              <div className={device === "phone" ? "device phone" : "device"}>
                <iframe
                  key={previewKey}
                  title={copy.previewTitle}
                  sandbox="allow-scripts allow-forms allow-popups"
                  srcDoc={preview}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
