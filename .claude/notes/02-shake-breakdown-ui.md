# 02 - Shake Breakdown UI

## What we built

### Shake breakdown for suggested guess
- Added `shakeBreakdown(candidate, remaining)` to `src/solver.ts` — groups remaining combinations into 5 buckets (index = shake count 0–4)
- "Show details" toggle on the suggested guess card reveals a table: shake count on the left, matching combinations on the right, "Not possible" for empty buckets
- Collapsible with bold "Show/Hide details ▼" button (arrow rotates on expand)
- Headers: "# shakes" / "Remaining combinations"

### Interactive breakdown on remaining possibilities
- Remaining combination chips are now clickable buttons with hover state (`hover:bg-gray-700`)
- Clicking a combination highlights it (teal ring + teal bg) and shows its shake breakdown below the list
- "If you guess X-X-X-X" header with "Clear" button on the right
- Clicking the same combination again or clicking "Clear" dismisses it
- Clicking a different combination switches the display

### Extracted `ShakeBreakdownTable` component
- Reusable component in `Results.tsx` used by both the suggested guess details and the interactive remaining-possibilities breakdown
- Takes a `breakdown: Combination[][]` prop (array of 5 buckets)

### Exported `combinationsEqual` from solver
- Was a private function, now exported for use in Results.tsx to check selection state

## Design decisions
- Breakdown table is the same component in both places for consistency
- Selection state (`selectedCombo`) lives in Results component — no need to lift it
- `useMemo` on `selectedBreakdown` so it only recomputes when selection or remaining changes
- Interactive breakdown only shown when remaining is between 2 and 80 (not on full 81 or single remaining)
