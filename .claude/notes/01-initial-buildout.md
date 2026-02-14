# 01 - Initial Buildout

## What we built

### Project setup
- Bun + TypeScript + React + Tailwind CSS
- Static site build: `bun run build.ts` bundles JS (Bun bundler) and CSS (Tailwind CLI) into `dist/`
- Dev server: `bun run dev` runs `dev.ts` which watches `src/` and `public/` for changes, auto-rebuilds, and serves on localhost:3000 (manual browser refresh needed — no HMR)
- Tests: `bun test` runs solver unit tests

### Deployment
- GitHub Actions workflow at `.github/workflows/deploy.yml`
- Uses artifact-based Pages deployment (no `gh-pages` branch)
- Runs tests before build — failing tests block deployment
- Repo: `git@github.com:tuchandra/cc-claw.git`
- Requires **Settings → Pages → Source → GitHub Actions** to be enabled in the repo
- Asset paths in `index.html` are relative (`./style.css`, `./app.js`) so they work under any subpath

### Core solver (`src/solver.ts`)
- **Types**: `Column = 1 | 2 | 3`, `Combination = [Column, Column, Column, Column]`, `Guess = { combination, shakes }`
- `allCombinations()` — generates all 81 possible combinations
- `countMatches(a, b)` — counts exact position matches between two combinations
- `filterCombinations(combinations, guesses)` — returns only combinations consistent with all guesses
- `bestGuess(remaining)` — minimax strategy: picks the guess that minimizes the worst-case remaining possibilities, preferring guesses from the remaining set (could win outright)
- `parseCombination(s)` / `formatCombination(c)` — parse "1132" to `[1,1,3,2]`, format as "1-1-3-2"

### Tests (`src/solver.test.ts`)
- 18 tests covering all solver functions
- User's example scenario: 1111→1 shake, 2222→2 shakes, 1223→2, 1232→2 — verifies narrowing
- Edge cases: contradictory guesses → empty, 0 shakes eliminates all positional matches, etc.
- Helper `c("1132")` shorthand for test readability

### React UI (`src/components/`)
- **App.tsx**: State management (guesses, resetKey), derived state (remaining, suggested, solved, impossible)
- **GuessInput.tsx**: 4 rows × 3 columns button grid matching the game's layout, shake selector (0–4), submit button, "use suggested" shortcut. Resets controls to 1-1-1-1 on reset.
- **GuessHistory.tsx**: List of past guesses with shake counts
- **Results.tsx**: Shows suggested next guess (minimax) and remaining possibilities. Shows all remaining unless it's the full 81 ("Anything is possible! Take a guess to get started.")
- Solved state: jackpot banner with play-again button
- Impossible state: error banner with undo-last and reset buttons
- Styling: dark theme (gray-950 bg), teal-400 accent, amber-600 for shakes

## Design decisions
- Column/Combination/Guess naming chosen to match the game's language of "columns"
- Tuple-based `Combination` type instead of string for type safety
- Pure solver functions separated from React for testability
- Minimax best-guess strategy (not expected-value) — conservative, minimizes worst case
- No external state management library — useState + useMemo sufficient for this complexity

## What's next
- Verify GitHub Pages deployment works end-to-end
- Polish: mobile layout, maybe keyboard shortcuts
- Could add more test scenarios
