# Tetiana Melnyk — Developer Portfolio

My Angular portfolio: professional experience, interactive frontend examples and a separate arcade.

**[Live demo](https://smiyka.github.io/Tetiana_Melnyk_Developer/)** · [CV](https://smiyka.github.io/Tetiana_Melnyk_Developer/#/cv) · [Developer Lab](https://smiyka.github.io/Tetiana_Melnyk_Developer/#/lab)

## Stack

Angular 21 · TypeScript (strict) · Signals · RxJS · Reactive Forms · SCSS · Vitest · GitHub Actions · GitHub Pages

## Highlights

- **Live API integration:** the Codewars card handles loading, errors, timeouts and request cancellation.
- **Interactive examples:** the Developer Lab demonstrates debugging, reactive filtering and accessible form validation, with progress saved locally.
- **Testing and delivery:** tests cover application behavior and game logic; GitHub Actions runs tests and builds before deploying to GitHub Pages.

The application uses standalone components, lazy-loaded routes, keyboard navigation, focus management and reduced motion support.

## Run locally

Requires Node.js 22.12+ in the 22.x series and npm.

```sh
npm ci
npm start
```

Open http://localhost:4200.

## Test and build

```sh
npm test -- --watch=false
npm run build
```

For the GitHub Pages deployment path:

```sh
npm run build -- --base-href /Tetiana_Melnyk_Developer/
```

## More

- [Portfolio guide](docs/portfolio-guide.md): Developer Lab walkthrough, arcade controls, implementation and deployment details.
- [Arcade](https://smiyka.github.io/Tetiana_Melnyk_Developer/#/games): six games exploring state, timers and algorithms, including minimax in tic-tac-toe.
- [GitHub](https://github.com/smiyka) · [LinkedIn](https://www.linkedin.com/in/89-tetiana-melnyk)
