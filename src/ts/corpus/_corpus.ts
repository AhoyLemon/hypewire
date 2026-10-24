import type { Corpus } from "../engine/_types.js";

import { cast } from "./_castPools.js";
import { sharedExcerpt } from "./_excerpts.js";
import { subjects } from "./_subjects.js";
import { wrapperChance, wrappers } from "./_wrappers.js";

import { betteridge } from "./structures/_betteridge.js";
import { contrarian } from "./structures/_contrarian.js";
import { countdown } from "./structures/_countdown.js";
import { deathNotice } from "./structures/_deathNotice.js";
import { marketPanic } from "./structures/_marketPanic.js";
import { prodigy } from "./structures/_prodigy.js";
import { pullQuote } from "./structures/_pullQuote.js";
import { rageBait } from "./structures/_rageBait.js";
import { reframe } from "./structures/_reframe.js";
import { resurrection } from "./structures/_resurrection.js";
import { stuntPiece } from "./structures/_stuntPiece.js";
import { study } from "./structures/_study.js";
import { trendCoinage } from "./structures/_trendCoinage.js";

export const corpus: Corpus = {
  structures: [
    // Obituaries
    deathNotice,
    resurrection,
    countdown,
    // Hype machine
    prodigy,
    reframe,
    trendCoinage,
    // Journalism tropes
    betteridge,
    stuntPiece,
    study,
    marketPanic,
    // Rage and takes
    rageBait,
    contrarian,
    pullQuote,
  ],
  subjects,
  wrappers,
  wrapperChance,
  cast,
  sharedExcerpt,
};
