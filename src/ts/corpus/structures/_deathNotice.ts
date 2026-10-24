import { w, type Structure } from "../../engine/_types.js";

export const deathNotice: Structure = {
  id: "deathNotice",
  label: "The Death Notice",
  family: "Obituaries",
  weight: 3,
  headline: [
    w("AI Could Mean The End of {subject}", 3),
    "Is AI Quietly Killing {subject}?",
    "{Subject} Had a Good Run. Then Came the Chatbots.",
    "{Subject} {subject.Is} Dead, and AI Is Holding the Shovel",
    "Experts Warn AI Could Spell Doom for {subject}",
  ],
};
