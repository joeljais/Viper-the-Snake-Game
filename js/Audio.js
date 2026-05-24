class Audio {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.musicNodes = null;
    this.initCalled = false;
  }

  init() {
    if (this.initCalled) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initCalled = true;
    } catch {}
  }

  ensure() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }

  tone(freq, dur, type = 'square', vol = 0.08) {
    if (!this.soundEnabled || !this.ctx) return;
    this.ensure();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + dur);
  }

  eat() {
    this.tone(600, 0.08);
    setTimeout(() => this.tone(800, 0.06), 60);
  }

  golden() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.12, 'sine', 0.07), i * 80));
  }

  death() {
    [300, 250, 200, 150].forEach((f, i) => setTimeout(() => this.tone(f, 0.2, 'sawtooth', 0.08), i * 120));
  }

  powerup() {
    this.tone(400, 0.1, 'sine');
    setTimeout(() => this.tone(600, 0.1, 'sine'), 80);
    setTimeout(() => this.tone(900, 0.15, 'sine'), 160);
  }

  click() { this.tone(500, 0.05, 'sine', 0.03); }
  levelUp() { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => this.tone(f, 0.12, 'sine', 0.06), i * 70)); }
  coin() { this.tone(880, 0.06, 'sine', 0.05); setTimeout(() => this.tone(1320, 0.08, 'sine', 0.05), 60); }
  achievement() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.15, 'sine', 0.07), i * 100)); }

  startMusic() {
    if (!this.musicEnabled || !this.ctx || this.musicNodes) return;
    this.ensure();
    const o = this.ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = 55;
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5;
    const lg = this.ctx.createGain();
    lg.gain.value = 10;
    lfo.connect(lg); lg.connect(o.frequency);
    const mg = this.ctx.createGain();
    mg.gain.setValueAtTime(0, this.ctx.currentTime);
    mg.gain.linearRampToValueAtTime(0.025, this.ctx.currentTime + 2);
    o.connect(mg); mg.connect(this.ctx.destination);
    o.start(); lfo.start();
    this.musicNodes = { o, lfo, mg };
  }

  stopMusic() {
    if (!this.musicNodes) return;
    this.musicNodes.mg.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    setTimeout(() => {
      if (this.musicNodes) {
        this.musicNodes.o.stop(); this.musicNodes.lfo.stop();
        this.musicNodes = null;
      }
    }, 300);
  }

  setSound(v) { this.soundEnabled = v; }
  setMusic(v) { this.musicEnabled = v; if (v) this.startMusic(); else this.stopMusic(); }
}
