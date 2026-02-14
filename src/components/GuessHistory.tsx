import type { Guess } from "../solver.ts";
import { formatCombination } from "../solver.ts";

export function GuessHistory({ guesses }: { guesses: Guess[] }) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-medium text-gray-400 mb-2">History</h2>
      <div className="rounded-lg bg-gray-900 border border-gray-800 divide-y divide-gray-800">
        {guesses.map((g, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-5">#{i + 1}</span>
              <span className="font-mono text-gray-200">
                {formatCombination(g.combination)}
              </span>
            </div>
            <span className="text-amber-400 font-mono">
              {g.shakes} {g.shakes === 1 ? "shake" : "shakes"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
