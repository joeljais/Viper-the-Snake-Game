class ThemeManager {
  constructor() {
    this.themes = {
      dark:     { name:'Dark',     bg:'#0a0a1a', grid:'#0f0f23', gridLine:'#1a1a35', snakeHead:'#00ff88', snakeBody:'#00cc6a', food:'#ff6b6b', golden:'#ffd93d', speed:'#6bcbff', slow:'#00ff88', obstacle:'#555577', wall:'#2a2a4a', text:'#e0e0ff', accent:'#00ff88' },
      classic:  { name:'Classic',  bg:'#1a1a1a', grid:'#222222', gridLine:'#2a2a2a', snakeHead:'#4caf50', snakeBody:'#388e3c', food:'#f44336', golden:'#ffeb3b', speed:'#2196f3', slow:'#4caf50', obstacle:'#666666', wall:'#333333', text:'#ffffff', accent:'#4caf50' },
      neon:     { name:'Neon',     bg:'#0a0015', grid:'#100020', gridLine:'#200040', snakeHead:'#ff00ff', snakeBody:'#cc00cc', food:'#00ffff', golden:'#ffff00', speed:'#ff6600', slow:'#ff00ff', obstacle:'#440066', wall:'#330044', text:'#e0e0ff', accent:'#ff00ff' },
      ocean:    { name:'Ocean',    bg:'#001a2e', grid:'#002240', gridLine:'#003355', snakeHead:'#00e5ff', snakeBody:'#00b8d4', food:'#ff6f00', golden:'#ffd600', speed:'#76ff03', slow:'#00e5ff', obstacle:'#1a3a4a', wall:'#0a2a3a', text:'#e0f0ff', accent:'#00e5ff' },
      sunset:   { name:'Sunset',   bg:'#1a0a05', grid:'#2a1008', gridLine:'#3a1a0c', snakeHead:'#ff6b35', snakeBody:'#e55a20', food:'#ff006e', golden:'#ffd600', speed:'#00e5ff', slow:'#ff6b35', obstacle:'#4a2010', wall:'#3a1808', text:'#fff0e0', accent:'#ff6b35' },
      candy:    { name:'Candy',    bg:'#1a0510', grid:'#250818', gridLine:'#350c20', snakeHead:'#ff4081', snakeBody:'#e03570', food:'#69f0ae', golden:'#ffd740', speed:'#40c4ff', slow:'#ff4081', obstacle:'#4a1530', wall:'#3a1025', text:'#ffe0f0', accent:'#ff4081' }
    };
    this.current = 'dark';
  }

  getTheme(n) { return this.themes[n] || this.themes.dark; }
  getCurrent() { return this.getTheme(this.current); }

  setTheme(n) {
    if (!this.themes[n]) return false;
    this.current = n;
    const t = this.getCurrent();
    const r = document.documentElement;
    r.style.setProperty('--bg-primary', t.bg);
    r.style.setProperty('--bg-secondary', t.grid);
    r.style.setProperty('--bg-card', t.gridLine);
    r.style.setProperty('--text-primary', t.text);
    r.style.setProperty('--accent-primary', t.accent);
    const c = document.getElementById('gameCanvas');
    if (c && c.parentElement) c.parentElement.style.background = t.bg;
    return true;
  }

  getOptions() {
    return Object.entries(this.themes).map(([k, t]) => ({ id: k, name: t.name, bg: t.bg, accent: t.accent }));
  }
}
