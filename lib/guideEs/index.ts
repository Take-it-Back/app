import type { GuideBlock } from "../guides";
import { ES_A } from "./a";
import { ES_B } from "./b";

/** Spanish version of an English guide. `slug` is the English guide's slug, so pages can link to each other. */
export type EsGuide = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  blocks: GuideBlock[];
  faqs: [string, string][];
  cta: string;
};
export const ES_GUIDES: EsGuide[] = [...ES_A, ...ES_B];
export const esGuideBySlug = (slug: string) => ES_GUIDES.find((g) => g.slug === slug);
