# Snake Game v2

A complete rebuild of the classic Snake Game with 50 levels, economy, login system, social features, and full developer configuration. Runs on iOS, Android, Web, and Desktop via any modern browser.

## Features

### Core Gameplay
- **50 Progressive Levels** — each with increasing obstacles and higher target scores
- **5 Food Types** — Normal, Golden (bonus points), Speed, Slow, Rainbow (jackpot)
- **Leveling System** — unlock new food types and grid sizes as you progress
- **6 Visual Themes** — Dark, Classic, Neon, Ocean, Sunset, Candy

### Economy & Progression
- **Coin System** — earn coins by completing levels
- **Store** — purchase themes, power-ups, and coin packs
- **Special Rewards** — exclusive unlocks at milestone levels (cannot be bought)
- **Level Stars** — earn up to 3 stars per level based on score

### Account System
- **Unique Login IDs** — register with username + password
- **Password Hashing** — passwords are hashed before storage
- **Guest Mode** — play instantly without registration
- **Profile Persistence** — all progress saved automatically

### Social
- **World Chat** — in-game chat system
- **Developer Wall** — submit feedback and ratings
- **Privacy Policy** — built-in transparency about data usage

### Developer Config
All game parameters are editable in `js/Config.js`:
- Level difficulty, speed, obstacle growth
- Food weights and unlock levels
- Store item prices and availability
- Special rewards at milestone levels
- Authentication rules
- Social features limits

### Other Features
- Splash screen with animated logo
- First-time player tutorial
- Touch controls, keyboard (arrows/WASD), and gamepad support
- Particle effects and smooth animations
- PWA support (installable, offline-capable)
- Responsive design for all screen sizes

## Quick Start

```bash
# Serve with any static server
npx serve .
# or
python -m http.server 8000
```

Open `http://localhost:8000` in any browser.

## Project Structure

```
snake-game/
├── index.html              # Main HTML with all screens
├── css/style.css           # Complete styles
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── README.md               # This file
├── js/
│   ├── Config.js           # Developer configuration hub
│   ├── Database.js         # Storage + Auth system
│   ├── Input.js            # Keyboard, touch, gamepad
│   ├── Snake.js            # Snake entity
│   ├── Food.js             # Food types and spawning
│   ├── Audio.js            # Sound synthesis
│   ├── ParticleSystem.js   # Particle effects
│   ├── ThemeManager.js     # 6 color themes
│   ├── Renderer.js         # Canvas rendering
│   ├── LevelManager.js     # 50-level progression
│   ├── Economy.js          # Coins, store, purchases
│   ├── Social.js           # Chat, dev wall
│   ├── Tutorial.js         # First-time tutorial
│   ├── Splash.js           # Animated splash screen
│   ├── Game.js             # Core game engine
│   ├── UI.js               # Complete UI management
│   └── main.js             # Entry point
└── assets/icons/           # PWA icons
```

## Developer Configuration

Edit `js/Config.js` to tune every aspect of the game. Key sections:

| Section | What you can change |
|---------|-------------------|
| `grid` | Min/max sizes, unlock levels for each size |
| `gameplay` | Base speed, food weights, unlock levels |
| `levels` | Total levels, obstacle growth, coin rewards |
| `rewards` | Special rewards at milestone levels |
| `store` | Shop items, prices, types |
| `auth` | Username/password rules |
| `social` | Chat limits and cooldowns |

## Building for App Stores

```bash
# Using Capacitor (recommended)
npm install -g @capacitor/cli
npx cap init SnakeGame com.example.snake
npx cap add ios
npx cap add android
npx cap copy
npx cap open ios   # Xcode
npx cap open android  # Android Studio
```

## Browser Support

Chrome, Firefox, Safari (14+), Edge, iOS Safari, Android Chrome — all fully supported.

## Version History

**v2.0.0** — Complete rebuild
- 50 level progression with difficulty scaling
- Login system with unique IDs
- Coin economy and store
- Social features (chat, dev wall)
- Tutorial, splash screen, privacy policy
- Developer config system

**v1.0.0** — Initial release
- Classic snake with 6 game modes
- Achievement system
- Particle effects

## License

MIT
