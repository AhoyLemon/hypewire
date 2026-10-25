import type { CSSProperties } from "satori/jsx";

import { graphemeLength } from "../lib/graphemes.js";

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

/** Font family names the renderer has to register, so the card and its fonts can't drift apart. */
export const CARD_FONTS = {
  headline: { name: "Newsreader", weight: 600 },
  label: { name: "Inter", weight: 800 },
  meta: { name: "Inter", weight: 500 },
} as const;

const INK = "#161616";
/** Softer than the masthead, so the image doesn't outshout the post text above it. */
const HEADLINE_INK = "#3b3731";
const PAPER = "#f6f3ea";
const MUTED = "#5a5a5a";
const RULE = "#d6d0c2";
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
  { upTo: 45, size: 72 },
  { upTo: 70, size: 62 },
  { upTo: 95, size: 54 },
  { upTo: 120, size: 48 },
  { upTo: Infinity, size: 44 },
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
}

/** The masthead date, in the bot's time zone: "October 24, 2026". */
export function printDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/Chicago",
  }).format(date);
}

/** The headline's font size for its length. */
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
}: HeadlineCardInput): CardNode {
  const masthead = el(
    "div",
    {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingBottom: 18,
      borderBottom: `2px solid ${RULE}`,
    },
    [
      el(
        "div",
        {
          fontFamily: CARD_FONTS.label.name,
          fontWeight: CARD_FONTS.label.weight,
          fontSize: 40,
          letterSpacing: "0.18em",
        },
        "HYPEWIRE",
      ),
      el(
        "div",
        {
          fontFamily: CARD_FONTS.meta.name,
          fontWeight: CARD_FONTS.meta.weight,
          fontSize: 26,
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
      fontSize: 30,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: RED,
    },
    [
      el("div", {
        width: 16,
        height: 16,
        marginRight: 16,
        background: RED,
      }),
      SECTIONS[structureId] ?? "News",
    ],
  );

  const title = el(
    "div",
    {
      marginTop: 20,
      fontFamily: CARD_FONTS.headline.name,
      fontWeight: CARD_FONTS.headline.weight,
      fontSize: headlineSize(headline),
      lineHeight: 1.12,
      color: HEADLINE_INK,
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
      paddingTop: 52,
      paddingRight: 72,
      paddingBottom: 60,
      paddingLeft: 72,
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
