# 00 - Initial Planning

## Project Overview
A web app to solve a Mastermind-variant game from a text-based claw machine. The player sets 4 controls (each with values 1, 2, or 3), plays, and gets feedback on how many controls are in the correct position ("shakes"). The app helps narrow down possibilities and suggests optimal next moves.

## Game Rules
- 4 controls, each set to position 1, 2, or 3
- Secret code is a 4-digit combination (e.g., 1132)
- After each play, feedback = number of controls in the correct position (0–4)
- Goal: find the exact code

## App Requirements

### Core Logic (pure functions, unit-tested)
1. **Generate all possible codes**: 3^4 = 81 total combinations
2. **Filter remaining possibilities**: Given a list of (guess, shakes) pairs, return which codes are still possible
3. **Suggest optimal next move**: Among valid moves, find the one that eliminates the most possibilities (minimax or expected-value strategy)
4. **Validate inputs**: Ensure guesses are 4 digits, each 1–3; shakes are 0–4

### UI (React)
1. **Input area**: Enter a guess (4 controls, each 1/2/3) and the number of shakes received
2. **History**: Show all previous guesses and their shake counts
3. **Remaining possibilities**: Display which combinations are still valid
4. **Suggested next move**: Show the optimal next guess
5. **Reset button**: Wipe all state and start fresh
6. **Win detection**: If only one possibility remains or user got 4 shakes, celebrate and offer reset

### Tech Stack
- TypeScript + Bun
- React (via bun, compiled to static site)
- Tailwind CSS for styling
- bun test for unit tests
- GitHub Pages deployment via GitHub Actions
- Static site build output

### Test Cases
**Example from user:**
- Guess 1111, shakes=1 → one control is 1
- Guess 2222, shakes=2 → two controls are 2
- Therefore code contains: one 1, two 2s, one 3 (since 4 - 1 - 2 = 1 three)
- Guess 1223, shakes=2
- Guess 1232, shakes=2
- App should narrow down remaining possibilities from these 4 guesses

**Additional test cases to write:**
- All same value (e.g., 1111 with 0 shakes eliminates all codes with any 1 in any position... wait no, it eliminates codes where the count of 1s in matching positions is 0)
- Edge case: 4 shakes = solved
- Edge case: 0 shakes = no position is correct
- Single guess narrowing
- Filtering with contradictory inputs (should result in 0 possibilities)

## Implementation Steps

### Phase 1: Project Setup & Deployment Pipeline
1. Initialize bun project with TypeScript
2. Set up React + Tailwind + static build
3. Create minimal "Hello World" page
4. Set up GitHub Actions for Pages deployment
5. Push to repo, verify deployment works

### Phase 2: Core Logic
1. Implement `generateAllCodes()` → string[] of all 81 codes
2. Implement `countMatches(guess, secret)` → number of exact position matches
3. Implement `filterPossibilities(codes, guesses)` → remaining valid codes
4. Implement `suggestBestGuess(remaining, allCodes)` → optimal next guess
5. Write comprehensive unit tests

### Phase 3: UI
1. Build the React app with state management
2. Guess input component (4 dropdowns or buttons for 1/2/3)
3. History list
4. Remaining possibilities display
5. Best move suggestion
6. Reset functionality
7. Win/error states
8. Styling with Tailwind

### Phase 4: Polish
1. Mobile-friendly layout
2. Edge case handling in UI
3. Final styling pass

## Styling Notes
- Clean, minimal design
- Accent colors: TBD (thinking a teal/cyan primary + warm accent)
- Monospace or game-like font for codes
- Responsive layout
