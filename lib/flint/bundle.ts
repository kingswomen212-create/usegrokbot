import type { ProjectFile } from "./types";

function safeStyle(css: string): string {
  return css.replace(/<\/style/gi, "<\\/style");
}

function safeScript(js: string): string {
  return js.replace(/<\/script/gi, "<\\/script");
}

export function bundleHtml(files: ProjectFile[]): string {
  const html = files.find((file) => file.path === "index.html")?.contents ?? "";
  const css = files.find((file) => file.path === "styles.css")?.contents ?? "";
  const js = files.find((file) => file.path === "app.js")?.contents ?? "";
  const style = `<style>${safeStyle(css)}</style>`;
  const script = `<script>${safeScript(js)}</script>`;
  if (html.includes('href="styles.css"') && html.includes('src="app.js"')) {
    return html
      .replace('<link rel="stylesheet" href="styles.css" />', style)
      .replace('<script src="app.js"></script>', script);
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8" />${style}</head><body>${html}${script}</body></html>`;
}
