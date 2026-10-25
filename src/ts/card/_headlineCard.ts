import type { CSSProperties } from "satori/jsx";

import { graphemeLength } from "../lib/graphemes.js";

/** Image shapes to compare. Wide matches a link card; square takes more of the feed, so the type can run bigger. */
export const CARD_FORMATS = {
  wide: { width: 1200, height: 630, scale: 1 },
  square: { width: 1200, height: 1200, scale: 1.6 },
} as const;
export type CardFormat = keyof typeof CARD_FORMATS;

/** Font family names the renderer has to register, so the card and its fonts can't drift apart. */
export const CARD_FONTS = {
  headline: { name: "Newsreader", weight: 700 },
  label: { name: "Inter", weight: 800 },
  meta: { name: "Inter", weight: 500 },
} as const;

const INK = "#161616";
const PAPER = "#f6f3ea";
const MUTED = "#5a5a5a";
const RED = "#b3121f";

/** The newspaper section each structure runs in. */
export const SECTIONS: Record<string, string> = {
  countdown: "Developing",
  deathNotice: "Obituaries",
  resurrection: "Culture",
  contrarian: "Opinion",
  pullQuote: "Q&A",
  rageBait: "Viral",
  marketPanic: "Markets",
  stuntPiece: "First Person",
  study: "Science",
  prodigy: "Startups",
  reframe: "Analysis",
  trendCoinage: "Trends",
};

/** Headline sizes, largest first. The first step whose limit fits the headline wins. */
const HEADLINE_STEPS = [
  { upTo: 45, size: 88 },
  { upTo: 70, size: 76 },
  { upTo: 95, size: 66 },
  { upTo: 120, size: 58 },
  { upTo: Infinity, size: 50 },
];

/** A satori element: the same shape as a React element, built without React. */
export interface CardNode {
  type: string;
  props: { style?: CSSProperties; children?: CardChild | CardChild[] };
}
type CardChild = CardNode | string;

function el(
  type: string,
  style: CSSProperties,
  children?: CardChild | CardChild[],
): CardNode {
  return { type, props: { style, children } };
}

export interface HeadlineCardInput {
  headline: string;
  structureId: string;
  /** Already formatted for print, like "October 24, 2026". */
  date: string;
  format?: CardFormat;
}

/** The masthead date, in the bot's time zone: "October 24, 2026". */
export function printDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/Chicago",
  }).format(date);
}

/** The headline's font size at a scale of 1. */
export function headlineSize(headline: string): number {
  const length = graphemeLength(headline);
  const step = HEADLINE_STEPS.find(({ upTo }) => length <= upTo);
  return step?.size ?? HEADLINE_STEPS[HEADLINE_STEPS.length - 1].size;
}

/** The headline image as a satori element tree: masthead and date, then the section and headline centered below. */
export function headlineCard({
  headline,
  structureId,
  date,
  format = "wide",
}: HeadlineCardInput): CardNode {
  const { scale } = CARD_FORMATS[format];
  const px = (size: number): number => Math.round(size * scale);

  const masthead = el(
    "div",
    {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingBottom: px(18),
      borderBottom: `${px(3)}px solid ${INK}`,
    },
    [
      el(
        "div",
        {
          fontFamily: CARD_FONTS.label.name,
          fontWeight: CARD_FONTS.label.weight,
          fontSize: px(40),
          letterSpacing: "0.18em",
        },
        "HYPEWIRE",
      ),
      el(
        "div",
        {
          fontFamily: CARD_FONTS.meta.name,
          fontWeight: CARD_FONTS.meta.weight,
          fontSize: px(26),
          color: MUTED,
        },
        date,
      ),
    ],
  );

  const section = el(
    "div",
    {
      display: "flex",
      alignItems: "center",
      fontFamily: CARD_FONTS.label.name,
      fontWeight: CARD_FONTS.label.weight,
      fontSize: px(30),
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: RED,
    },
    [
      el("div", {
        width: px(16),
        height: px(16),
        marginRight: px(16),
        background: RED,
      }),
      SECTIONS[structureId] ?? "News",
    ],
  );

  const title = el(
    "div",
    {
      marginTop: px(20),
      fontFamily: CARD_FONTS.headline.name,
      fontWeight: CARD_FONTS.headline.weight,
      fontSize: px(headlineSize(headline)),
      lineHeight: 1.08,
      letterSpacing: "-0.01em",
      textWrap: "balance",
    },
    // The corpus uses straight apostrophes, but print headlines set them curly.
    headline.replace(/'/g, "’"),
  );

  return el(
    "div",
    {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      paddingTop: px(52),
      paddingRight: px(72),
      paddingBottom: px(60),
      paddingLeft: px(72),
      background: PAPER,
      color: INK,
    },
    [
      masthead,
      el(
        "div",
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexGrow: 1,
        },
        [section, title],
      ),
    ],
  );
}
