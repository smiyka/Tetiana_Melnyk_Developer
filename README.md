# SkillQuest

A portfolio and small arcade for **Tetiana Melnyk**, a Software Developer based in Milan with 3+ years of commercial web development experience. Dedicated pages separate the professional CV, games and interactive frontend missions.

## About Tetiana

- Software Engineer / Full-Stack Developer at **Intré**, May 2023–present.
- Current engagement: **Namirial**, working with Angular 18, TypeScript, .NET, REST APIs, SQL and PostgreSQL on a digital signature platform.
- Earlier engagements: **Siemens** (Angular and Java/Spring Boot, energy) and **RGI** (Angular/TypeScript frontend and E2E tests, insurance).
- Frontend training at **Mate Academy**, 2022–2023; previous freelance graphic design experience, 2019–2021.
- Two Bachelor’s degrees, in Computer Software Engineering and teaching Mathematics and Computer Science.
- Certified Junior Angular Developer (January 2026) and DevOps Essentials (August 2026).

[GitHub](https://github.com/smiyka) · [LinkedIn](https://www.linkedin.com/in/89-tetiana-melnyk)

Profile content is based on the supplied CV. Commercial engagements describe experience; the playable missions are educational demos. The portfolio itself uses Angular 21, while Angular 18 is the version listed for professional experience in the CV.

## Live demo

**[Open SkillQuest](https://smiyka.github.io/skillquest/)**

The site is deployed automatically to GitHub Pages after every push to `main`, once tests and the build pass.

## Pages

| Page | Contents |
| --- | --- |
| [Home](https://smiyka.github.io/skillquest/) | Introduction and links to the professional CV, arcade and missions |
| [My CV](https://smiyka.github.io/skillquest/#/cv) | Professional strengths, experience, skills, training, education, certifications and contacts |
| [Games](https://smiyka.github.io/skillquest/#/games) | Arcade selection |
| [Bug Blaster](https://smiyka.github.io/skillquest/#/games/bug-blaster) | Timed bug-squashing game |
| [Bug Tac Toe](https://smiyka.github.io/skillquest/#/games/tic-tac-toe) | Green versus red bugs in tic-tac-toe |
| [Missions](https://smiyka.github.io/skillquest/#/missions) | Three frontend challenges with persistent XP |

The CV page includes a printable view and a [downloadable CV](https://smiyka.github.io/skillquest/tetiana-melnyk-cv.pdf) containing only the CV page from the supplied document, without the cover letter.

Pages use lazy-loaded Angular routes and hash-based URLs so direct links and refresh work on static GitHub Pages hosting. The earlier `#bug-blaster` URL redirects to the dedicated game page.

## Local development

Requires Node.js 22.12 or later in the 22.x series and npm.

```sh
npm ci
npm start
```

Open http://localhost:4200.

## Commands

```sh
npm run build
npm test -- --watch=false
```

The static build is generated in `dist/skillquest/browser`.

To build with the GitHub Pages base path:

```sh
npm run build -- --base-href /skillquest/
```

## Deployment

The [CI workflow](.github/workflows/ci.yml) checks every push and pull request and deploys to GitHub Pages only from `main`.
In the repository settings, **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions**.
Track deployment status in the [Actions tab](https://github.com/smiyka/skillquest/actions).

## Games & missions

### Bug Blaster arcade

A 30-second bug-squashing game with three increasingly fast waves. Click or tap bugs before they escape, build a combo for up to a ×4 multiplier, and protect five stability bars. Focus the board and press **1–9** to hit matching slots, or use Tab and Enter. Press **P** or **Escape** to pause. The game pauses automatically when the browser tab is hidden or the window loses focus.

The personal best is stored locally in this browser. Gameplay works without storage and respects reduced motion preferences. The arcade score is separate from mission XP.

### Bug Tac Toe

Tic-tac-toe with green **X** bugs and red **O** bugs. Play against the computer or with a friend on the same screen. The computer uses minimax to choose its moves. Winning rows, columns and diagonals are highlighted; draws and wins are counted for the current visit. The starting team alternates between rounds, while restarting a round keeps its original starter. Switching mode resets the match scores.

Click or tap an empty square, focus the board and press **1–9**, or use Tab and Enter. Tokens include X/O markings and accessible labels so teams can be distinguished without relying on color. Pending computer moves are cancelled when resetting, changing mode or leaving the page.

### Portfolio challenges

| Mission | Experience | Reward |
| --- | --- | --- |
| Bug hunt | Fix a TypeScript increment | 100 XP |
| Skill radar | Filter the catalog and find RxJS | 150 XP |
| Ready for launch | Complete a form with valid data | 200 XP |

Each reward is granted only once. Progress is saved in localStorage and can be reset with **Start again**. If storage is unavailable, the game continues in memory. Form fields are for demonstration only: no data is sent to a server and no personal data is saved.

## Technical choices

- Standalone Angular components, strict TypeScript and SCSS.
- Signals and computed values for state, filters, levels and points.
- A `Progress` service separated from the UI, with validation of persisted data.
- Reactive Forms with accessible error messages.
- Responsive layout, keyboard navigation, live feedback and reduced motion support.
- Tests covering duplicate rewards, corrupt data, validation and mission interactions.
- GitHub Actions CI running tests and a build on every push and pull request.
- Lazy-loaded pages, route titles, active navigation and focus management.
- Tests covering tic-tac-toe wins, draws, computer strategy, reset behavior and page separation.

## Customization

Profile data, skill groups, engagements, learning projects, education and credentials are defined in `src/app/profile.ts`. The CV template lives in `src/app/cv.html`; mission content lives in `src/app/missions.html` and mission rewards are defined in `src/app/progress.ts`. Routes are configured in `src/app/app.routes.ts` and the shared navigation lives in `src/app/app.html`.

The skill radar uses the profile’s skill groups, including technologies from earlier projects and training. Learning projects are listed from the CV; individual repository links can be added when available.
