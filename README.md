# Tetiana Melnyk — Developer Portfolio

A professional portfolio for **Tetiana Melnyk**, a Software Developer in Milan with 3+ years of commercial web development experience. The site introduces my experience and approach to development, with a dedicated CV, guided frontend examples and a separate arcade.

## Live portfolio

**[Open the portfolio](https://smiyka.github.io/Tetiana_Melnyk_Developer/)**

| Page | Contents |
| --- | --- |
| [Home](https://smiyka.github.io/Tetiana_Melnyk_Developer/) | Professional introduction and a clear path to the CV, Developer Lab and games |
| [My CV](https://smiyka.github.io/Tetiana_Melnyk_Developer/#/cv) | Strengths, experience, skills, training, education, certifications and contacts |
| [Developer Lab](https://smiyka.github.io/Tetiana_Melnyk_Developer/#/lab) | Three structured examples with a goal, hands-on steps, visible results and an explanation |
| [Games](https://smiyka.github.io/Tetiana_Melnyk_Developer/#/games) | Arcade selection |
| [Bug Blaster](https://smiyka.github.io/Tetiana_Melnyk_Developer/#/games/bug-blaster) | Timed bug-squashing game |
| [Bug Tac Toe](https://smiyka.github.io/Tetiana_Melnyk_Developer/#/games/tic-tac-toe) | Green versus red bugs in tic-tac-toe |

The CV page provides a [downloadable PDF](https://smiyka.github.io/Tetiana_Melnyk_Developer/tetiana-melnyk-cv.pdf) containing only the CV, without the cover letter. **Print CV (PDF)** opens that document in a new tab; use the PDF viewer’s print button to print it.

## Professional background

- Software Engineer / Full-Stack Developer at **Intré**, May 2023–present.
- Current engagement: **Namirial**, working with Angular 18, TypeScript, .NET, REST APIs, SQL and PostgreSQL on a digital signature platform.
- Since early 2026: analyzing code and requirements, planning changes and writing Jira tasks for other developers.
- Earlier engagements: **Siemens** (Angular and Java/Spring Boot, energy) and **RGI** (Angular/TypeScript frontend and E2E tests, insurance).
- Frontend training at **Mate Academy**, 2022–2023; freelance graphic design experience, 2019–2021.
- Two Bachelor’s degrees, in Computer Software Engineering and teaching Mathematics and Computer Science.
- Certified Junior Angular Developer (January 2026) and DevOps Essentials (August 2026).

[GitHub](https://github.com/smiyka) · [LinkedIn](https://www.linkedin.com/in/89-tetiana-melnyk)

Profile content is based on the supplied CV. The lab and games are portfolio examples, separate from commercial client work. The portfolio uses Angular 21; Angular 18 is the version listed for professional experience in the CV.

## Developer Lab

Each example follows **goal → hands-on steps → result → explanation**. Visitors can follow the sequence or choose a topic from the example list.

1. **Debug a counter:** choose a replacement for a faulty assignment and run the counter twice. Compare the actual value with the expected result before completing the example.
2. **Filter a skill catalog:** type a query, observe the reactive results and select RxJS. Empty results explain how to continue.
3. **Validate a project brief:** try an empty submission, inspect accessible field errors, then correct the demo values. No form data is sent or saved.

Completion is saved locally, without levels or XP. The reset action clears example progress and input. The earlier `#/missions` link redirects to `#/lab`; completion records from the earlier version remain supported.

## Games

### Bug Blaster

A 30-second bug-squashing game with three increasingly fast waves. Click or tap bugs before they escape, build a combo for up to a ×4 multiplier and protect five stability bars. Focus the board and use **1–9**, or Tab and Enter. **P** or **Escape** pauses the game. It also pauses when the tab is hidden or the window loses focus.

The personal best is stored locally. Gameplay works without storage and respects reduced motion preferences.

### Bug Tac Toe

Tic-tac-toe with green **X** bugs and red **O** bugs. Play against the computer or a friend on the same screen. The computer uses minimax. Winning lines are highlighted; match scores last for the current visit. The starting team alternates between rounds. Switching mode resets the match.

Click, tap, use **1–9** with the board focused, or Tab and Enter. X/O markings and accessible labels distinguish teams without relying on color. Pending computer moves are cancelled on reset, mode changes and navigation away.

## Local development

Requires Node.js 22.12 or later in the 22.x series and npm.

```sh
npm ci
npm start
```

Open http://localhost:4200.

```sh
npm test -- --watch=false
npm run build
npm run build -- --base-href /Tetiana_Melnyk_Developer/
```

The static output is generated in `dist/skillquest/browser` (the existing internal Angular project directory).

## Deployment

The [CI workflow](.github/workflows/ci.yml) tests every push and pull request and deploys successful builds from `main` to GitHub Pages. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. Track deployments in the [Actions tab](https://github.com/smiyka/Tetiana_Melnyk_Developer/actions).

Pages use lazy-loaded Angular routes and hash URLs so direct links and refresh work on static hosting. The earlier `#bug-blaster` URL redirects to its game page.

## Implementation

- Standalone Angular components, strict TypeScript, Signals, computed state and SCSS.
- Reactive Forms with field descriptions, error messages and invalid-state attributes.
- Route titles, active navigation, focus management and reduced motion support.
- Tests for lab validation and progression, persistence, game rules, computer strategy, timer cleanup and page separation.

Profile data is in `src/app/profile.ts`; the CV template is `src/app/cv.html`. Lab content and interactions are in `src/app/developer-lab.*`, with completion storage in `src/app/progress.ts`. Routes are configured in `src/app/app.routes.ts`; shared navigation is in `src/app/app.html`.
