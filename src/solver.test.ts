import { describe, expect, test } from "bun:test";
import {
  type Combination,
  allCombinations,
  countMatches,
  filterCombinations,
  bestGuess,
  parseCombination,
  formatCombination,
} from "./solver.ts";

/** Shorthand: parse "1132" into a Combination for test readability. */
function c(s: string): Combination {
  const result = parseCombination(s);
  if (!result) throw new Error(`Invalid test combination: ${s}`);
  return result;
}

describe("allCombinations", () => {
  test("generates 81 combinations", () => {
    expect(allCombinations()).toHaveLength(81);
  });

  test("first and last", () => {
    const combos = allCombinations();
    expect(combos[0]).toEqual([1, 1, 1, 1]);
    expect(combos[combos.length - 1]).toEqual([3, 3, 3, 3]);
  });
});

describe("countMatches", () => {
  test("identical = 4", () => {
    expect(countMatches(c("1111"), c("1111"))).toBe(4);
    expect(countMatches(c("2323"), c("2323"))).toBe(4);
  });

  test("no matches = 0", () => {
    expect(countMatches(c("1111"), c("2222"))).toBe(0);
    expect(countMatches(c("1111"), c("3333"))).toBe(0);
    expect(countMatches(c("1212"), c("2121"))).toBe(0);
  });

  test("partial matches", () => {
    expect(countMatches(c("1132"), c("1111"))).toBe(2); // positions 0,1
    expect(countMatches(c("1132"), c("2222"))).toBe(1); // position 3
    expect(countMatches(c("1132"), c("1232"))).toBe(3); // positions 0,2,3
    expect(countMatches(c("1132"), c("1132"))).toBe(4);
  });
});

describe("filterCombinations", () => {
  const combos = allCombinations();

  test("no guesses returns all", () => {
    expect(filterCombinations(combos, [])).toHaveLength(81);
  });

  test("exact match narrows to one", () => {
    const result = filterCombinations(combos, [
      { combination: c("1132"), shakes: 4 },
    ]);
    expect(result).toEqual([c("1132")]);
  });

  test("0 shakes from 1111 eliminates all codes with 1 in any position", () => {
    const result = filterCombinations(combos, [
      { combination: c("1111"), shakes: 0 },
    ]);
    for (const combo of result) {
      expect(combo).not.toContain(1);
    }
    expect(result).toHaveLength(16); // 2^4
  });

  test("user example: 1111→1, 2222→2", () => {
    const result = filterCombinations(combos, [
      { combination: c("1111"), shakes: 1 },
      { combination: c("2222"), shakes: 2 },
    ]);
    for (const combo of result) {
      expect(countMatches(combo, c("1111"))).toBe(1);
      expect(countMatches(combo, c("2222"))).toBe(2);
    }
    expect(result.length).toBeGreaterThan(0);
  });

  test("user full example narrows significantly", () => {
    const result = filterCombinations(combos, [
      { combination: c("1111"), shakes: 1 },
      { combination: c("2222"), shakes: 2 },
      { combination: c("1223"), shakes: 2 },
      { combination: c("1232"), shakes: 2 },
    ]);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(10);
    for (const combo of result) {
      expect(countMatches(combo, c("1111"))).toBe(1);
      expect(countMatches(combo, c("2222"))).toBe(2);
      expect(countMatches(combo, c("1223"))).toBe(2);
      expect(countMatches(combo, c("1232"))).toBe(2);
    }
  });

  test("contradictory guesses yield empty", () => {
    const result = filterCombinations(combos, [
      { combination: c("1111"), shakes: 4 },
      { combination: c("2222"), shakes: 4 },
    ]);
    expect(result).toHaveLength(0);
  });
});

describe("bestGuess", () => {
  test("returns null for empty remaining", () => {
    expect(bestGuess([])).toBeNull();
  });

  test("returns the combination when only one remains", () => {
    expect(bestGuess([c("1132")])).toEqual(c("1132"));
  });

  test("returns a valid combination", () => {
    const remaining = filterCombinations(allCombinations(), [
      { combination: c("1111"), shakes: 1 },
      { combination: c("2222"), shakes: 2 },
    ]);
    const guess = bestGuess(remaining);
    expect(guess).not.toBeNull();
    expect(guess!.length).toBe(4);
    for (const col of guess!) {
      expect(col).toBeGreaterThanOrEqual(1);
      expect(col).toBeLessThanOrEqual(3);
    }
  });

  test("prefers guess from remaining set when possible", () => {
    const remaining = filterCombinations(allCombinations(), [
      { combination: c("1111"), shakes: 1 },
      { combination: c("2222"), shakes: 2 },
      { combination: c("1223"), shakes: 2 },
      { combination: c("1232"), shakes: 2 },
    ]);
    const guess = bestGuess(remaining);
    expect(guess).not.toBeNull();
    const inRemaining = remaining.some(
      (r) => r[0] === guess![0] && r[1] === guess![1] && r[2] === guess![2] && r[3] === guess![3]
    );
    expect(inRemaining).toBe(true);
  });
});

describe("parseCombination", () => {
  test("valid strings", () => {
    expect(parseCombination("1111")).toEqual([1, 1, 1, 1]);
    expect(parseCombination("1232")).toEqual([1, 2, 3, 2]);
    expect(parseCombination("3333")).toEqual([3, 3, 3, 3]);
  });

  test("invalid strings return null", () => {
    expect(parseCombination("")).toBeNull();
    expect(parseCombination("111")).toBeNull();
    expect(parseCombination("11111")).toBeNull();
    expect(parseCombination("1140")).toBeNull();
    expect(parseCombination("0111")).toBeNull();
    expect(parseCombination("abcd")).toBeNull();
  });
});

describe("formatCombination", () => {
  test("formats with dashes", () => {
    expect(formatCombination(c("1132"))).toBe("1-1-3-2");
    expect(formatCombination(c("3333"))).toBe("3-3-3-3");
  });
});
