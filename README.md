# SkillQuest

A playable Angular portfolio: three interactive missions exploring logic, reactive state and form validation.

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

Missions are defined in `src/app/progress.ts`; page content lives in `src/app/app.html`. This initial version contains demo experiences, without claiming personal skills or projects that have not been provided yet.

Next steps: real project cards, a personal profile and new missions.
