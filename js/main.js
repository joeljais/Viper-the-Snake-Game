/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  VIPER: THE SNAKE GAME & FRAMEWORK
 * ═══════════════════════════════════════════════════════════════════════════
 *  Copyright (C) 2026 Joel Jais. All rights reserved.
 *
 *  LICENSING TERMS:
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Affero General Public License for more details.
 *
 *  DUAL-LICENSE NOTICE:
 *  The copyright holder (Joel Jais) reserves the right to distribute this
 *  software under alternative commercial, proprietary, or closed-source
 *  licenses for deployment in centralized applications, app stores, or
 *  commercial platforms.
 *
 *  Full License Text: <https://www.gnu.org/licenses/agpl-3.0.txt>
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
  const canvas = document.getElementById('gameCanvas');
  const themeMgr = new ThemeManager();
  const particles = new ParticleSystem();
  const audio = new Audio();
  const levelMgr = new LevelManager();
  const input = new Input();

  const renderer = new Renderer(canvas, themeMgr);

  const game = new Game({
    canvas, renderer, input, audio, particles,
    themeMgr, levelMgr,
    onStateChange: () => {}
  });

  const ui = new UI(game);
  const tutorial = new Tutorial();
  window.tutorial = tutorial;

  input.init();
  ui.init();

  tutorial.onComplete = () => {
    ui.showScreen('main');
  };

  window.tutorial = tutorial;

  window.addEventListener('resize', () => {
    if (game.state === 'playing' || game.state === 'paused') {
      renderer.resize(game.gridSize);
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  const splash = new Splash();
  splash.show(() => {
    ui.checkAuthAndShow();
  });
})();
