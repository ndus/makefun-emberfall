// All voices are tiny oscillator envelopes; no assets or connections are needed.
const tones = { shoot: [560, 170, .055, 'triangle', .025], hit: [150, 65, .07, 'square', .025], pickup: [920, 1450, .09, 'sine', .05], hurt: [140, 35, .24, 'sawtooth', .06], wave: [180, 720, .5, 'sine', .1], upgrade: [430, 1100, .35, 'triangle', .08], over: [210, 40, .9, 'triangle', .1], dash: [300, 70, .17, 'triangle', .04] };
export class AudioSynth {
  constructor() { this.muted = false; this.ctx = null; this.last = {}; }
  unlock() { try { this.ctx ??= new (window.AudioContext || window.webkitAudioContext)(); this.ctx.resume(); } catch { /* Sound is optional on unsupported devices. */ } }
  play(name) {
    if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    if (t - (this.last[name] ?? -1) < .035) return;
    this.last[name] = t;
    const [start, end, duration, type, volume] = tones[name];
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(start, t); o.frequency.exponentialRampToValueAtTime(end, t + duration);
    g.gain.setValueAtTime(volume, t); g.gain.exponentialRampToValueAtTime(.0001, t + duration);
    o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + duration);
    o.onended = () => { o.disconnect(); g.disconnect(); };
  }
}
