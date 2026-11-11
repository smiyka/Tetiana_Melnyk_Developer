# Portfolio guide

## Developer Lab

Each example follows **goal → hands-on steps → result → explanation**. Visitors can follow the sequence or choose a topic from the example list.

1. **Debug a counter:** choose a replacement for a faulty assignment and run the counter twice. Compare the actual value with the expected result before completing the example.
2. **Filter a skill catalog:** type a query, observe the reactive results and select RxJS. Empty results explain how to continue.
3. **Validate a project brief:** try an empty submission, inspect accessible field errors, then correct the demo values. No form data is sent or saved.

Completion is saved locally, without levels or XP. The reset action clears example progress and input. The earlier `#/missions` link redirects to `#/lab`; completion records from the earlier version remain supported.

## Games

### Bug Memory

Match bug twins by their symbols and names, with 6, 8 or 12 pairs. Flip cards by click, tap, or Tab and Enter. The timer starts with the first card; mismatches briefly remain visible and block further flips. Pause covers the board and freezes both the clock and pending flips. Changing tabs also pauses. Each difficulty saves its fastest time locally, breaking ties by fewer moves.

### Bug Merge

A 2048 puzzle with evolving bug characters. Arrow keys or WASD while the board is focused, swipes, and direction buttons slide the garden. Equal neighbors merge once per turn; a valid move adds a new 2 or 4. Discover the 2048 bug and continue beyond it, or restart when no moves remain. The highest score is saved locally.

### Bug Tower Defense

Defend a fixed garden path over eight waves. Select a Sprayer, Sniper or Chiller and place it on a build pad. Towers fire automatically; upgrades increase damage, range and firing speed. Chillers slow enemies. Kills and cleared waves earn coins; escaping bugs cost lives. Select an existing tower to view its range, upgrade or sell it. Touch screens also have larger pad buttons. Battles pause on tab changes and losing focus. The highest cleared wave is saved locally.

### Bug Snake

Grow a bug by eating pink flowers. Each snack adds a segment; hitting a wall or the body ends the run. The garden is 20 × 20 cells, with a steady pace and no countdown. Length, survival time and a locally saved best length appear above the board.

Steer with the mouse, arrow keys or WASD while the board is focused. Touch players can drag on the board or use the direction buttons. P, Space or Escape pauses; changing tabs or losing window focus also pauses. Leaving the game clears its timer.

### Bug Blaster

A 30-second bug-squashing game with three increasingly fast waves. Click or tap bugs before they escape, build a combo for up to a ×4 multiplier and protect five stability bars. Focus the board and use **1–9**, or Tab and Enter. **P** or **Escape** pauses the game. It also pauses when the tab is hidden or the window loses focus.

The personal best is stored locally. Gameplay works without storage and respects reduced motion preferences.

### Bug Tac Toe

Tic-tac-toe with green **X** bugs and red **O** bugs. Play against the computer or a friend on the same screen. The computer uses minimax. Winning lines are highlighted; match scores last for the current visit. The starting team alternates between rounds. Switching mode resets the match.

Click, tap, use **1–9** with the board focused, or Tab and Enter. X/O markings and accessible labels distinguish teams without relying on color. Pending computer moves are cancelled on reset, mode changes and navigation away.

## Implementation

Each component has its own directory containing its TypeScript, template, styles and tests where applicable. The root component is in `src/app/shell/`; shared data, services and styles are in `src/app/data/`, `src/app/services/` and `src/app/styles/`. Application configuration and routes remain in `src/app/`.

The CV ends with a live Codewars card for [smiyka](https://www.codewars.com/users/smiyka). It requests completed kata, overall rank, Honor points and trained languages with their ranks from the public Codewars API on opening, every minute while visible, and on manual refresh. Completed kata and Honor points are separate metrics. Loading and service failures have explicit states; no profile statistics are hardcoded. Requests time out after eight seconds and are cancelled when leaving the CV.

- Standalone Angular components, strict TypeScript, Signals, computed state and SCSS.
- Reactive Forms with field descriptions, error messages and invalid-state attributes.
- Route titles, active navigation, focus management and reduced motion support.
- Tests for lab validation and progression, persistence, game rules, computer strategy, timer cleanup and page separation.

Profile data is in `src/app/data/profile.ts`; the CV template is `src/app/cv/cv.html`. Lab content and interactions are in `src/app/developer-lab/developer-lab.*`, with completion storage in `src/app/services/progress.ts`. Routes are configured in `src/app/app.routes.ts`; shared navigation is in `src/app/shell/app.html`.

## Deployment

The [CI workflow](../.github/workflows/ci.yml) tests every push and pull request and deploys successful builds from `main` to GitHub Pages. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. Track deployments in the [Actions tab](https://github.com/smiyka/Tetiana_Melnyk_Developer/actions).

Pages use lazy-loaded Angular routes and hash URLs so direct links and refresh work on static hosting. The earlier `#bug-blaster` URL redirects to its game page.

The static output is generated in `dist/skillquest/browser`, using the internal Angular project name configured in [`angular.json`](../angular.json).

[Back to README](../README.md)
