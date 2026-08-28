/**
 * Web Audio API Paper & Comic Sound FX Synthesizer
 * Generates tactile page-flip swooshes, paper rustles, and retro comic chimes in real-time.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.initAudioContext = this.initAudioContext.bind(this);
  }

  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  // Realistic Paper Page Flip Rustle / Swoosh
  playPageFlip() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 0.28;

    // Filtered white noise for paper friction
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, t);
    bandpass.frequency.exponentialRampToValueAtTime(3200, t + 0.1);
    bandpass.frequency.exponentialRampToValueAtTime(400, t + duration);
    bandpass.Q.setValueAtTime(2.5, t);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, t);
    gainNode.gain.linearRampToValueAtTime(0.18, t + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + duration);

    // Subtle low frequency thump for book spine motion
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    oscGain.gain.setValueAtTime(0.08, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  // Comic Action Chime (e.g. When adding to Pull Box)
  playAddPop() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.15);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Comic Explosion Zap sound
  playZap() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.18);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }
}

export const soundFx = new AudioEngine();
