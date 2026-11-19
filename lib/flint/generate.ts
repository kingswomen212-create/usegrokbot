import { renderApp } from "./apps";
import { baseCss } from "./css";
import { renderLanding } from "./landing";
import { esc } from "./text";
import type { Blueprint, ProjectFile } from "./types";

export function renderParts(blueprint: Blueprint): { body: string; css: string; js: string } {
  const built = blueprint.kind === "landing" ? renderLanding(blueprint) : renderApp(blueprint);
  return { body: built.body, css: baseCss(blueprint) + built.css, js: built.js };
}

export function renderFiles(blueprint: Blueprint): ProjectFile[] {
  const built = renderParts(blueprint);
  const html = `<!DOCTYPE html>
<html lang="${esc(blueprint.lang)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(blueprint.name)}</title>
<link rel="stylesheet" href="styles.css" />
</head>
<body>
${built.body}
<script src="app.js"></script>
</body>
</html>
`;
  return [
    { path: "index.html", contents: html },
    { path: "styles.css", contents: built.css },
    { path: "app.js", contents: built.js },
  ];
}
