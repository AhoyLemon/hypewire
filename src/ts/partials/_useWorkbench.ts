import type { ComputedRef, Ref } from "vue";

import { corpus } from "../corpus/_corpus.js";
import { subjectFits } from "../engine/_cast.js";
import { generate, type GeneratedPost } from "../engine/_generate.js";
import { randomSeed } from "../engine/_rng.js";
import { POST_LIMIT } from "../engine/_truncate.js";
import type { Family, Structure, Subject } from "../engine/_types.js";
import { useCards, type Cards } from "./_useCards.js";

// Vue is loaded from a CDN <script> in _javascripts.pug, not bundled.
declare const Vue: typeof import("vue");

const BATCH_SIZE = 20;
const NEAR_LIMIT = 285;

interface StructureOption {
  /** "structureId", or "structureId:variantId" to force a variant. */
  value: string;
  label: string;
}

interface FamilyGroup {
  name: Family;
  options: StructureOption[];
}

interface Selection {
  structureId: string;
  subjectName: string;
}

interface BatchItem {
  seed: number;
  post: GeneratedPost;
  href: string;
}

export interface Workbench extends Omit<Cards, "renderCards"> {
  limit: number;
  families: FamilyGroup[];
  compatibleSubjects: ComputedRef<Subject[]>;
  structureId: Ref<string>;
  subjectName: Ref<string>;
  seedInput: Ref<string>;
  post: Ref<GeneratedPost | null>;
  permalink: Ref<string>;
  batch: Ref<BatchItem[]>;
  error: Ref<string>;
  meterState: ComputedRef<"ok" | "near" | "over">;
  onSubmit: (event: SubmitEvent) => void;
}

function optionsFor(structure: Structure): StructureOption[] {
  const variants = (structure.variants ?? []).map((variant) => ({
    value: `${structure.id}:${variant.id}`,
    label: `${structure.label}: ${variant.label}`,
  }));
  return [{ value: structure.id, label: structure.label }, ...variants];
}

function groupByFamily(structures: Structure[]): FamilyGroup[] {
  const groups: FamilyGroup[] = [];
  for (const structure of structures) {
    const group = groups.find((g) => g.name === structure.family);
    if (group) group.options.push(...optionsFor(structure));
    else
      groups.push({ name: structure.family, options: optionsFor(structure) });
  }
  return groups;
}

/** Splits a "structureId:variantId" select value. Empty strings mean "don't force it". */
function parseStructureValue(value: string): {
  structureId?: string;
  variantId?: string;
} {
  const [structureId, variantId] = value.split(":");
  return {
    structureId: structureId || undefined,
    variantId: variantId || undefined,
  };
}

/** ?seed=&structure=&subject= is everything needed to reproduce a post. */
function buildHref(seed: number, selection: Selection): string {
  const params = new URLSearchParams({ seed: String(seed) });
  if (selection.structureId) params.set("structure", selection.structureId);
  if (selection.subjectName) params.set("subject", selection.subjectName);
  return `?${params}`;
}

function parseSeed(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  return Number(value);
}

export function useWorkbench(): Workbench {
  const { ref, computed, watch } = Vue;

  const params = new URLSearchParams(window.location.search);
  const structureId = ref(params.get("structure") ?? "");
  const subjectName = ref(params.get("subject") ?? "");
  const seedInput = ref("");
  const post = ref<GeneratedPost | null>(null);
  const permalink = ref("");
  const batch = ref<BatchItem[]>([]);
  const error = ref("");
  const { cards, cardError, cardKey, renderCards } = useCards();

  const selection = (): Selection => ({
    structureId: structureId.value,
    subjectName: subjectName.value,
  });

  const compatibleSubjects = computed(() => {
    const forced = parseStructureValue(structureId.value).structureId;
    const structure = corpus.structures.find((s) => s.id === forced);
    return structure
      ? corpus.subjects.filter((s) => subjectFits(s, structure))
      : corpus.subjects;
  });

  watch(compatibleSubjects, (subjects) => {
    if (!subjects.some((s) => s.name === subjectName.value))
      subjectName.value = "";
  });

  const meterState = computed(() => {
    const graphemes = post.value?.debug.graphemes ?? 0;
    if (graphemes > POST_LIMIT) return "over";
    return graphemes >= NEAR_LIMIT ? "near" : "ok";
  });

  function generateWith(seed: number): GeneratedPost {
    return generate(corpus, {
      seed,
      ...parseStructureValue(structureId.value),
      subjectName: subjectName.value || undefined,
    });
  }

  function show(seed: number): void {
    try {
      const shown = generateWith(seed);
      post.value = shown;
      permalink.value = buildHref(seed, selection());
      error.value = "";
      window.history.replaceState(null, "", permalink.value);
      void renderCards("preview", [shown]);
    } catch (err) {
      post.value = null;
      error.value = err instanceof Error ? err.message : String(err);
    }
  }

  function fillBatch(): void {
    const items: BatchItem[] = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      const seed = randomSeed();
      try {
        items.push({
          seed,
          post: generateWith(seed),
          href: buildHref(seed, selection()),
        });
      } catch (err) {
        console.warn(`Seed ${seed} failed:`, err);
      }
    }
    batch.value = items;
    void renderCards(
      "batch",
      items.map((item) => item.post),
    );
  }

  function onSubmit(event: SubmitEvent): void {
    const submitter = event.submitter as HTMLButtonElement | null;
    if (submitter?.value === "batch") {
      fillBatch();
      return;
    }
    show(parseSeed(seedInput.value) ?? randomSeed());
  }

  show(parseSeed(params.get("seed")) ?? randomSeed());

  return {
    limit: POST_LIMIT,
    families: groupByFamily(corpus.structures),
    compatibleSubjects,
    structureId,
    subjectName,
    seedInput,
    post,
    permalink,
    batch,
    error,
    meterState,
    onSubmit,
    cards,
    cardError,
    cardKey,
  };
}
