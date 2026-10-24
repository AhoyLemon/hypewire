import type { Wrapper } from "../engine/_types.js";

// {bare} is the headline form without "the", {bareInline} is the lowercased mid-sentence form.
export const wrappers: Wrapper[] = [
  { id: "economy", name: "the {bare} Economy", inline: "the {bareInline} economy" },
  { id: "big", name: "Big {bare}", inline: "Big {bare}" },
  { id: "industrialComplex", name: "the {bare}-Industrial Complex", inline: "the {bareInline}-industrial complex" },
  { id: "culture", name: "{bare} Culture", inline: "{bareInline} culture" },
  { id: "lobby", name: "the {bare} Lobby", inline: "the {bareInline} lobby", weight: 0.5 },
];

export const wrapperChance = 0.12;
