import type { Combination } from "../solver.ts";
import { formatCombination } from "../solver.ts";

export function Results({
  remaining,
  suggested,
  solved,
}: {
  remaining: Combination[];
  suggested: Combination | null;
  solved: boolean;
}) {
  if (solved) return null;

  return (
    <div className="space-y-4">
      {suggested && remaining.length > 1 && (
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
          <h2 className="text-sm font-medium text-gray-400 mb-1">
            Suggested next guess
          </h2>
          <p className="font-mono text-xl text-teal-400">
            {formatCombination(suggested)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Minimax strategy — minimizes the worst-case remaining possibilities
          </p>
        </div>
      )}

      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <h2 className="text-sm font-medium text-gray-400 mb-2">
          Remaining possibilities{" "}
          <span className="text-gray-500">({remaining.length})</span>
        </h2>
        {remaining.length === 0 ? (
          <p className="text-gray-500 text-sm">None — something's wrong.</p>
        ) : remaining.length === 1 ? (
          <p className="font-mono text-xl text-teal-300">
            {formatCombination(remaining[0]!)} — this must be the code!
          </p>
        ) : remaining.length <= 20 ? (
          <div className="flex flex-wrap gap-2">
            {remaining.map((combo, i) => (
              <span
                key={i}
                className="font-mono text-sm bg-gray-800 text-gray-300 px-2 py-1 rounded"
              >
                {formatCombination(combo)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Too many to display. Keep guessing to narrow it down.
          </p>
        )}
      </div>
    </div>
  );
}
