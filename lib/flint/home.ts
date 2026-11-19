import type { BuildMode } from "./types";

export type Starter = {
  label: string;
  prompt: string;
  mode: BuildMode;
};

export const useCases: Starter[] = [
  { label: "AI App Builder", prompt: "A web app with a dashboard, a list people can edit, and a clear next action", mode: "app" },
  { label: "AI Website Builder", prompt: "A marketing website with a headline, three offers, pricing, and a contact form", mode: "website" },
  { label: "SaaS Dev", prompt: "A SaaS product with signup, a dashboard, and a pricing table", mode: "app" },
  { label: "Prototyping", prompt: "A clickable prototype with a headline, three steps, and a waitlist", mode: "prototype" },
];

export const businesses: Starter[] = [
  { label: "Entrepreneurs", prompt: "A launch site for a new business, with the offer, pricing, and a way to sign up", mode: "website" },
  { label: "Small Business", prompt: "A small business website with services, hours, pricing, and a contact form", mode: "website" },
  { label: "Agencies", prompt: "An agency site with selected work, services, and a project inquiry form", mode: "website" },
  { label: "Enterprise", prompt: "An enterprise product page with security notes, a feature list, and a demo request", mode: "website" },
];

export const templates: Starter[] = [
  { label: "Small business site", prompt: "A small business website with services, pricing, hours, and a contact form", mode: "website" },
  { label: "SaaS app", prompt: "A SaaS app with a dashboard, a task list, and pricing", mode: "app" },
  { label: "Clickable prototype", prompt: "A clickable prototype of a product page with three steps and a waitlist", mode: "prototype" },
  { label: "Pitch deck", prompt: "A pitch deck: the problem, who it is for, the product, and the ask", mode: "slides" },
  { label: "Campaign page", prompt: "A campaign page with an offer, three reasons, and a signup form", mode: "website" },
];

export const toolkits: { title: string; body: string; prompt: string; mode: BuildMode }[] = [
  {
    title: "Database",
    body: "Lists, boards, and ledgers that stay in this browser.",
    prompt: "An app with a database-style list: add, complete, and delete records",
    mode: "app",
  },
  {
    title: "Accounts",
    body: "A sign-in screen and a member area you can click through.",
    prompt: "A prototype of sign-in, then a member dashboard",
    mode: "prototype",
  },
  {
    title: "SEO page",
    body: "A public page with one clear title, offer, and proof.",
    prompt: "A search-friendly landing page with a title, offer, proof, and a signup form",
    mode: "website",
  },
  {
    title: "Hosting",
    body: "Download the page and open it anywhere. The preview runs here.",
    prompt: "A simple hosted-style homepage with a headline and a call to action",
    mode: "website",
  },
];
