import { useState, useMemo } from "react";
import type { Combination, Guess } from "../solver.ts";
import {
  allCombinations,
  filterCombinations,
  bestGuess,
  formatCombination,
} from "../solver.ts";
import { GuessInput } from "./GuessInput.tsx";
import { GuessHistory } from "./GuessHistory.tsx";
import { Results } from "./Results.tsx";

const ALL = allCombinations();

export function App() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [resetKey, setResetKey] = useState(0);

  const remaining = useMemo(
    () => filterCombinations(ALL, guesses),
    [guesses]
  );

  const suggested = useMemo(() => bestGuess(remaining), [remaining]);

  const solved = guesses.some((g) => g.shakes === 4);
  const impossible = remaining.length === 0 && !solved;

  function addGuess(combination: Combination, shakes: number) {
    setGuesses((prev) => [...prev, { combination, shakes }]);
  }

  function undoLast() {
    setGuesses((prev) => prev.slice(0, -1));
  }

  function reset() {
    setGuesses([]);
    setResetKey((k) => k + 1);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-teal-400">CC Claw</h1>
        <p className="text-gray-400 mt-1">
          Enter your guesses for <em>Claw. Grab. Prize!</em> to find the secret
          combination.
        </p>
      </header>

      {solved ? (
        <div className="rounded-lg bg-teal-900/40 border border-teal-500/50 p-6 mb-6 text-center">
          <p className="text-2xl font-bold text-teal-300 mb-1">Jackpot!</p>
          <p className="text-gray-300">
            The code was{" "}
            <span className="font-mono font-bold text-white">
              {formatCombination(guesses[guesses.length - 1]!.combination)}
            </span>{" "}
            — solved in {guesses.length} {guesses.length === 1 ? "try" : "tries"}.
          </p>
          <button
            onClick={reset}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-md font-medium transition-colors cursor-pointer"
          >
            Play Again
          </button>
        </div>
      ) : impossible ? (
        <div className="rounded-lg bg-red-900/40 border border-red-500/50 p-6 mb-6 text-center">
          <p className="text-xl font-bold text-red-300 mb-1">No possibilities left</p>
          <p className="text-gray-300">
            The guesses are contradictory — no combination matches all of them.
            Undo the last guess or start over.
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={undoLast}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors cursor-pointer"
            >
              Undo Last
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md font-medium transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <GuessInput onSubmit={addGuess} suggested={suggested} resetKey={resetKey} />
      )}

      <Results remaining={remaining} suggested={suggested} solved={solved} />

      {guesses.length > 0 && (
        <>
          <GuessHistory guesses={guesses} />
          {!solved && !impossible && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={undoLast}
                className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors cursor-pointer"
              >
                Undo Last
              </button>
              <button
                onClick={reset}
                className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
