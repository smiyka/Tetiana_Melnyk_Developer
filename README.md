# SkillQuest

A playable portfolio for **Tetiana Melnyk**, a Software Developer based in Milan with 3+ years of commercial web development experience. Three interactive missions introduce logic, reactive state and form validation, followed by professional experience, skills, education and contact links.

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

## Missions

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

## Customization

Profile data, skill groups, engagements, learning projects, education and credentials are defined in `src/app/profile.ts`. Missions are defined in `src/app/progress.ts`; page content lives in `src/app/app.html`.

The skill radar uses the profile’s skill groups, including technologies from earlier projects and training. Learning projects are listed from the CV; individual repository links can be added when available.
