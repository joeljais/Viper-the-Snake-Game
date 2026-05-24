class Tutorial {
  constructor() {
    this.steps = [
      { id: 'welcome', title: 'Welcome to Snake!', text: 'Let\'s learn how to play. Swipe or tap Next to continue.', target: null, pos: 'center' },
      { id: 'controls', title: 'Controls', text: 'Use arrow keys (desktop) or swipe (mobile) to change direction. Tap/space to pause.', target: null, pos: 'center' },
      { id: 'food', title: 'Food', text: 'Eat food to grow and score points. Red = normal, Gold = bonus, Blue = speed, Green = slow, Rainbow = jackpot!', target: null, pos: 'center' },
      { id: 'levels', title: 'Levels', text: 'Complete 50 levels! Each level has more obstacles and higher target scores.', target: null, pos: 'center' },
      { id: 'obstacles', title: 'Obstacles', text: 'Avoid obstacles on the grid. Hitting them ends the game.', target: null, pos: 'center' },
      { id: 'rewards', title: 'Rewards', text: 'Win levels to earn coins and unlock special rewards like new food types and grid sizes.', target: null, pos: 'center' },
      { id: 'store', title: 'Store', text: 'Spend coins in the store to buy themes, power-ups, and more!', target: null, pos: 'center' },
      { id: 'done', title: 'Ready!', text: 'You\'re all set. Good luck!', target: null, pos: 'center' }
    ];
    this.currentStep = 0;
    this.active = false;
    this.onComplete = null;
  }

  start() {
    this.currentStep = 0;
    this.active = true;
    this.showStep();
  }

  showStep() {
    if (this.currentStep >= this.steps.length) {
      this.finish();
      return;
    }
    const step = this.steps[this.currentStep];
    const overlay = document.getElementById('tutorialOverlay');
    const title = document.getElementById('tutorialTitle');
    const text = document.getElementById('tutorialText');
    const progress = document.getElementById('tutorialProgress');
    const btn = document.getElementById('tutorialBtn');

    if (!overlay) return;
    overlay.classList.remove('hidden');
    if (title) title.textContent = step.title;
    if (text) text.textContent = step.text;
    if (progress) progress.textContent = `${this.currentStep + 1} / ${this.steps.length}`;
    if (btn) {
      btn.textContent = this.currentStep === this.steps.length - 1 ? 'Start Playing!' : 'Next';
      btn.onclick = () => {
        this.currentStep++;
        this.showStep();
      };
    }
  }

  finish() {
    this.active = false;
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) overlay.classList.add('hidden');

    const profile = Auth.getProfile();
    if (profile) { profile.tutorialDone = true; Auth.saveProfile(); }
    if (this.onComplete) this.onComplete();
  }

  shouldShow() {
    const p = Auth.getProfile();
    return p && !p.tutorialDone;
  }
}
