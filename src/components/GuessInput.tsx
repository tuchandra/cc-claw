import { useState, useEffect } from "react";
import type { Column, Combination } from "../solver.ts";
import { formatCombination } from "../solver.ts";

const COLUMNS: Column[] = [1, 2, 3];
const CONTROL_LABELS = ["Control 1", "Control 2", "Control 3", "Control 4"];
const DEFAULT: Combination = [1, 1, 1, 1];

export function GuessInput({
  onSubmit,
  suggested,
  resetKey,
}: {
  onSubmit: (combination: Combination, shakes: number) => void;
  suggested: Combination | null;
  resetKey: number;
}) {
  const [controls, setControls] = useState<Combination>(DEFAULT);
  const [shakes, setShakes] = useState<number>(0);

  useEffect(() => {
    setControls(DEFAULT);
    setShakes(0);
  }, [resetKey]);

  function setControl(index: number, value: Column) {
    setControls((prev) => {
      const next = [...prev] as Combination;
      next[index] = value;
      return next;
    });
  }

  function handleSubmit() {
    onSubmit(controls, shakes);
    setShakes(0);
  }

  function useSuggested() {
    if (suggested) setControls(suggested);
  }

  return (
    <div className="rounded-lg bg-gray-900 border border-gray-800 p-5 mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-3">
          Controls
        </label>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-gray-500 w-20 shrink-0">
                {CONTROL_LABELS[i]}
              </span>
              <div className="flex gap-1.5">
                {COLUMNS.map((col) => (
                  <button
                    key={col}
                    onClick={() => setControl(i, col)}
                    className={`w-10 h-10 rounded-md font-mono font-bold text-lg transition-colors cursor-pointer ${
                      controls[i] === col
                        ? "bg-teal-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Shakes
        </label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setShakes(n)}
              className={`w-10 h-10 rounded-md font-mono font-bold text-lg transition-colors cursor-pointer ${
                shakes === n
                  ? "bg-amber-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-md font-medium transition-colors cursor-pointer"
        >
          Submit Guess
        </button>
        {suggested && (
          <button
            onClick={useSuggested}
            className="px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-teal-400 rounded-md transition-colors cursor-pointer"
          >
            Use suggested: {formatCombination(suggested)}
          </button>
        )}
      </div>
    </div>
  );
}
