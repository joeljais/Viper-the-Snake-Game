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
