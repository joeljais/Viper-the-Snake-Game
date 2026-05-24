class Splash {
  constructor() {
    this.element = document.getElementById('splashScreen');
    this.canvas = document.getElementById('splashCanvas');
    this.duration = 2500;
    this.fadeOut = 400;
  }

  show(onDone) {
    if (!this.element) { if (onDone) onDone(); return; }
    this.element.classList.remove('hidden');

    if (this.canvas) {
      this.animateLogo();
    }

    setTimeout(() => {
      this.element.classList.add('fade-out');
      setTimeout(() => {
        this.element.classList.add('hidden');
        this.element.classList.remove('fade-out');
        if (onDone) onDone();
      }, this.fadeOut);
    }, this.duration);
  }

  animateLogo() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const cx = canvas.width / 2, cy = canvas.height / 2;

    let startTime = performance.now();
    const animate = (ts) => {
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulse = Math.sin(progress * Math.PI * 4) * 0.1 + 0.9;
      const alpha = progress < 0.1 ? progress / 0.1 : (progress > 0.85 ? (1 - progress) / 0.15 : 1);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.scale(pulse, pulse);

      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 30 * pulse;

      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(0, -10, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0a0a1a';
      ctx.font = 'bold 28px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S', 0, -10);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#e0e0ff';
      ctx.font = 'bold 36px "Segoe UI", sans-serif';
      ctx.fillText('SNAKE', 0, 50);

      ctx.fillStyle = '#8888bb';
      ctx.font = '14px "Segoe UI", sans-serif';
      ctx.fillText('Classic. Evolved.', 0, 85);

      ctx.restore();

      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}
