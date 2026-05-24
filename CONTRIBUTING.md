# Contributing to Snake Game

First off, thank you for taking the time to contribute! It's people like you who make this a fantastic framework for everyone.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md) terms.

## How Can I Contribute?

### Reporting Bugs

1. Check the **Issues Tab** to ensure the bug hasn't already been reported.
2. If it's new, open a new issue using our [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md).
3. Include clear steps to reproduce the bug along with your browser/OS details.

### Suggesting Features

1. Open a new issue using our [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).
2. Describe the feature, why it's useful, and how it should work.
3. Tag the issue with the `enhancement` label.

### Submitting Pull Requests

1. Fork the repository to your own GitHub profile.
2. Create a descriptive branch for your feature (`git checkout -b feat/new-theme`).
3. Make your changes in the targeted module (`js/ThemeManager.js`, `js/Config.js`, etc.).
4. Keep your code clean, modular, and double-check browser rendering.
5. Push to your fork and submit a Pull Request to our `main` branch.
6. Ensure your PR description clearly describes the changes and references any related issues.

## Development Standards

- Do not mix core game loop mechanics (`Game.js`) with UI changes (`UI.js`).
- Keep all adjustable parameters within `js/Config.js` — this is the single source of truth for game tuning.
- Ensure features remain fully responsive across both desktop viewports and touch layouts.
- Test on at least two browsers before submitting.
- Do not introduce external dependencies unless absolutely necessary — the game is zero-dependency by design.
- Follow the existing code style: ES6 classes, no semicolons where optional, 2-space indentation.

## Project Structure

```
snake-game/
├── index.html       # Main HTML entry
├── css/style.css    # All styles
├── js/              # Game modules
│   ├── Config.js    # <-- All tunable parameters live here
│   ├── Game.js      # Core game loop
│   ├── UI.js        # DOM management
│   └── ...
└── README.md        # Documentation
```

## Questions?

Open a discussion in the Issues tab or reach out to the maintainers.
