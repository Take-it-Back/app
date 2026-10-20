import { ANSWERS_1 } from "./answers-1";
import { ANSWERS_2 } from "./answers-2";
import { ANSWERS_3 } from "./answers-3";
import { ANSWERS_4 } from "./answers-4";
import { ANSWERS_5 } from "./answers-5";
import { LETTERS_1 } from "./letters-1";
import { LETTERS_2 } from "./letters-2";
import { LETTERS_3 } from "./letters-3";
import { LETTERS_4 } from "./letters-4";
import { LETTERS_5 } from "./letters-5";

/** A fill-in-the-blank letter shown at the bottom of a guide. Blanks are [BRACKETS]. */
export type GuideLetter = { title: string; to: string; lines: string[] };

/** One or two sentence plain answer shown at the top of a guide. Keyed by guide slug. */
export const ANSWERS: Record<string, string> = { ...ANSWERS_1, ...ANSWERS_2, ...ANSWERS_3, ...ANSWERS_4, ...ANSWERS_5 };
export const LETTERS: Record<string, GuideLetter> = { ...LETTERS_1, ...LETTERS_2, ...LETTERS_3, ...LETTERS_4, ...LETTERS_5 };
