import type { PaletteId } from "./types";

export type Palette = {
  id: PaletteId;
  bg: string;
  bg2: string;
  ink: string;
  mute: string;
  line: string;
  card: string;
  accent: string;
  accentInk: string;
  soft: string;
  dark: boolean;
};

export const PALETTES: Record<PaletteId, Palette> = {
  clay: {
    id: "clay",
    bg: "#f7f1ea",
    bg2: "#efe2d4",
    ink: "#2c221c",
    mute: "#5e5148",
    line: "#e3d3c4",
    card: "#fffaf6",
    accent: "#c24e24",
    accentInk: "#fff7f3",
    soft: "#f6e4d6",
    dark: false,
  },
  sage: {
    id: "sage",
    bg: "#f3f6f1",
    bg2: "#e3eee4",
    ink: "#1d2a22",
    mute: "#4d5e54",
    line: "#d3e0d6",
    card: "#fbfffb",
    accent: "#2f6d4f",
    accentInk: "#f4fff8",
    soft: "#e5f2ea",
    dark: false,
  },
  sea: {
    id: "sea",
    bg: "#f2f6f8",
    bg2: "#e1eef3",
    ink: "#17262e",
    mute: "#465863",
    line: "#d0e0e7",
    card: "#fbfdfe",
    accent: "#1f6f8b",
    accentInk: "#f3fbfe",
    soft: "#e4f2f6",
    dark: false,
  },
  sand: {
    id: "sand",
    bg: "#f6f3ec",
    bg2: "#ece6da",
    ink: "#29251f",
    mute: "#5c564c",
    line: "#e2dacb",
    card: "#fffdf9",
    accent: "#8a5a2a",
    accentInk: "#fff8ef",
    soft: "#f3eadc",
    dark: false,
  },
  slate: {
    id: "slate",
    bg: "#f4f5f6",
    bg2: "#e6e9ed",
    ink: "#1c2128",
    mute: "#4e5762",
    line: "#d8dee5",
    card: "#ffffff",
    accent: "#2c3f5a",
    accentInk: "#f5f8fc",
    soft: "#e8eef5",
    dark: false,
  },
  plum: {
    id: "plum",
    bg: "#f7f3f8",
    bg2: "#efe4f2",
    ink: "#2a2030",
    mute: "#5c4d62",
    line: "#e4d6e8",
    card: "#fffbfe",
    accent: "#7a3e78",
    accentInk: "#fff6fe",
    soft: "#f6e8f4",
    dark: false,
  },
  rose: {
    id: "rose",
    bg: "#fbf4f4",
    bg2: "#f6e4e4",
    ink: "#2e1e22",
    mute: "#684850",
    line: "#f0d6da",
    card: "#fffafa",
    accent: "#a63d55",
    accentInk: "#fff6f8",
    soft: "#fbe8ec",
    dark: false,
  },
  citrus: {
    id: "citrus",
    bg: "#f8f6ef",
    bg2: "#f3ecd4",
    ink: "#2a2618",
    mute: "#5e5840",
    line: "#e6dcb8",
    card: "#fffdf7",
    accent: "#8a6a08",
    accentInk: "#fff9e8",
    soft: "#f8efcc",
    dark: false,
  },
  ink: {
    id: "ink",
    bg: "#f5f4f2",
    bg2: "#e8e6e1",
    ink: "#1a1a1a",
    mute: "#4f4f4d",
    line: "#ddd9d2",
    card: "#ffffff",
    accent: "#1a1a1a",
    accentInk: "#f7f6f3",
    soft: "#eceae4",
    dark: false,
  },
  night: {
    id: "night",
    bg: "#161311",
    bg2: "#241e1a",
    ink: "#f6f1ea",
    mute: "#d2c6ba",
    line: "#3c332d",
    card: "#221c18",
    accent: "#f08a45",
    accentInk: "#1c120c",
    soft: "#3a2c24",
    dark: true,
  },
};

export function paletteById(id: PaletteId): Palette {
  return PALETTES[id];
}
