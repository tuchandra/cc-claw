import { useMemo, useState } from "react";
import type { Combination } from "../solver.ts";
import { formatCombination, shakeBreakdown } from "../solver.ts";

export function Results({
  remaining,
  suggested,
  solved,
}: {
  remaining: Combination[];
  suggested: Combination | null;
  solved: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const breakdown = useMemo(
    () =>
      suggested && remaining.length > 1
        ? shakeBreakdown(suggested, remaining)
        : null,
    [suggested, remaining]
  );

  if (solved) return null;

  return (
    <div className="space-y-4">
      {suggested && remaining.length > 1 && breakdown && (
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
          <h2 className="text-sm font-medium text-gray-400 mb-1">
            Suggested next guess
          </h2>
          <p className="font-mono text-xl text-teal-400">
            {formatCombination(suggested)}
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-xs text-gray-500">
              Minimax strategy — minimizes the worst-case remaining possibilities
            </p>
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="text-xs font-bold text-gray-400 hover:text-gray-300 cursor-pointer transition-colors shrink-0 ml-4"
            >
              {showDetails ? "Hide details" : "Show details"}{" "}
              <span className={`inline-block transition-transform ${showDetails ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
          </div>

          {showDetails && (
            <div className="mt-3">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xs font-medium text-gray-500 w-16 shrink-0 text-right">
                  # shakes
                </span>
                <span className="text-xs font-medium text-gray-500">
                  Remaining combinations
                </span>
              </div>
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map((shakes) => {
                  const combos = breakdown[shakes]!;
                  return (
                    <div key={shakes} className="flex items-baseline gap-3">
                      <span className="text-sm font-medium text-amber-500 w-16 shrink-0 text-right">
                        {shakes}
                      </span>
                      {combos.length === 0 ? (
                        <span className="text-xs text-gray-600 italic">
                          Not possible
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {combos.map((combo, i) => (
                            <span
                              key={i}
                              className="font-mono text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded"
                            >
                              {formatCombination(combo)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
        ) : remaining.length === 81 ? (
          <p className="text-gray-500 text-sm">
            Anything is possible! Take a guess to get started.
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
