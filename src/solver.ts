export type Column = 1 | 2 | 3;
export type Combination = [Column, Column, Column, Column];
export type Guess = { combination: Combination; shakes: number };

const COLUMNS: Column[] = [1, 2, 3];

/** Generate all 81 possible combinations. */
export function allCombinations(): Combination[] {
  const result: Combination[] = [];
  for (const a of COLUMNS)
    for (const b of COLUMNS)
      for (const c of COLUMNS)
        for (const d of COLUMNS) result.push([a, b, c, d]);
  return result;
}

/** Count how many controls are set to the same column in both combinations. */
export function countMatches(a: Combination, b: Combination): number {
  let count = 0;
  for (let i = 0; i < 4; i++) if (a[i] === b[i]) count++;
  return count;
}

/** Filter combinations to only those consistent with all guesses. */
export function filterCombinations(
  combinations: Combination[],
  guesses: Guess[]
): Combination[] {
  return combinations.filter((combo) =>
    guesses.every((g) => countMatches(combo, g.combination) === g.shakes)
  );
}

/**
 * Score a candidate by worst-case elimination (minimax).
 * For each possible shake response (0–4), count how many remaining
 * combinations would survive. The score is the largest surviving group.
 * Lower is better.
 */
function worstCaseScore(candidate: Combination, remaining: Combination[]): number {
  const buckets = [0, 0, 0, 0, 0];
  for (const combo of remaining) {
    buckets[countMatches(candidate, combo)]!++;
  }
  return Math.max(...buckets);
}

/** Check if two combinations are equal. */
function combinationsEqual(a: Combination, b: Combination): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Find the best next guess from all 81 combinations.
 * Prefers guesses that are in the remaining set (could win outright).
 */
export function bestGuess(remaining: Combination[]): Combination | null {
  if (remaining.length === 0) return null;
  if (remaining.length === 1) return remaining[0]!;

  const candidates = allCombinations();
  let bestScore = Infinity;
  let best: Combination | null = null;
  let bestInRemaining = false;

  for (const candidate of candidates) {
    const score = worstCaseScore(candidate, remaining);
    const inRemaining = remaining.some((r) => combinationsEqual(r, candidate));

    if (
      score < bestScore ||
      (score === bestScore && inRemaining && !bestInRemaining)
    ) {
      bestScore = score;
      best = candidate;
      bestInRemaining = inRemaining;
    }
  }

  return best;
}

/** Parse a 4-digit string like "1132" into a Combination, or null if invalid. */
export function parseCombination(s: string): Combination | null {
  if (s.length !== 4) return null;
  const digits = [...s].map(Number);
  if (digits.some((d) => !Number.isInteger(d) || d < 1 || d > 3)) return null;
  return digits as unknown as Combination;
}

/** Format a combination as a display string like "1-1-3-2". */
export function formatCombination(c: Combination): string {
  return c.join("-");
}
