import { STEP, seededRandom } from './config.js';
import { createInput } from './input.js';
import { AudioSynth } from './audio.js';
import { createPlayer, updatePlayer } from './player.js';
import { updateEnemies, damageEnemy } from './enemies.js';
import { beginWave, updateWaves } from './waves.js';
import { offerUpgrades, applyUpgrade } from './upgrades.js';
import { updateParticles } from './particles.js';
import { updateHUD, showScreen } from './hud.js';
import { render } from './render.js';
import { stageShot } from './shots.js';

function readBest() {
  try { return Number(localStorage.getItem('emberfall-best') || 0) || 0; } catch { return 0; }
}
const params = new URLSearchParams(location.search);
const canvas = document.querySelector('canvas');
const input = createInput(canvas);
const g = {
  canvas, ctx: canvas.getContext('2d'), rng: seededRandom(params.get('seed') || 1),
  time: 0, state: 'title', player: createPlayer(), enemies: [], bolts: [], shards: [],
  particles: [], texts: [], queue: [], wave: 0, score: 0, kills: 0, nextId: 1,
  shake: 0, choices: [], audio: new AudioSynth(), best: readBest(), waveBanner: 0,
  clearTimer: 0, spawnTimer: 0,
};
function reset() {
  input.clear();
  Object.assign(g, { staged: false, state: 'playing', player: createPlayer(), enemies: [],
    bolts: [], shards: [], particles: [], texts: [], queue: [], wave: 0, score: 0,
    kills: 0, time: 0, shake: 0 });
  beginWave(g, 1); showScreen(g); updateHUD(g);
}
function choose(index) {
  if (g.state === 'upgrade' && applyUpgrade(g, index)) {
    input.clear(); g.staged = false; g.state = 'playing';
    beginWave(g); showScreen(g); updateHUD(g);
  }
}
function openUpgrade() {
  g.state = 'upgrade'; input.clear(); offerUpgrades(g, choose); showScreen(g);
}
function update(dt) {
  if (g.state !== 'playing' || g.staged) return;
  g.time += dt; g.shake = Math.max(0, g.shake - dt * 35);
  updatePlayer(g, input, dt);
  for (const b of g.bolts) {
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    for (const e of g.enemies) {
      if (e.dead || b.hits.has(e.id)) continue;
      const dx = b.x - e.x, dy = b.y - e.y, radius = e.radius + 6;
      // Axis rejection avoids square roots for the vast majority of pairs.
      if (Math.abs(dx) > radius || Math.abs(dy) > radius) continue;
      if (dx * dx + dy * dy < radius * radius) {
        b.hits.add(e.id); damageEnemy(g, e, b.damage, b.vx, b.vy);
        if (--b.pierce < 0) { b.life = 0; break; }
      }
    }
  }
  g.bolts = g.bolts.filter(b => b.life > 0);
  updateEnemies(g, dt);
  for (const s of g.shards) {
    const d = Math.hypot(s.x - g.player.x, s.y - g.player.y);
    if (d < g.player.magnet) {
      s.x += (g.player.x - s.x) * dt * 5; s.y += (g.player.y - s.y) * dt * 5;
    }
    if (d < g.player.radius + 12) {
      s.dead = true; g.score += s.value || 10;
      g.player.dashTimer = Math.max(0, g.player.dashTimer - .08); g.audio.play('pickup');
    }
  }
  g.shards = g.shards.filter(s => !s.dead);
  updateParticles(g, dt); g.enemies = g.enemies.filter(e => !e.dead);
  if (g.player.hp <= 0) {
    g.state = 'gameover'; g.best = Math.max(g.best, g.score);
    try { localStorage.setItem('emberfall-best', g.best); } catch { /* Storage may be disabled. */ }
    g.audio.play('over'); showScreen(g);
  } else updateWaves(g, dt, openUpgrade);
  updateHUD(g);
}
let last = 0, accumulator = 0;
function frame(now) {
  accumulator += Math.min(.05, (now - (last || now)) / 1000); last = now;
  while (accumulator >= STEP) { update(STEP); accumulator -= STEP; input.endFrame(); }
  render(g); requestAnimationFrame(frame);
}
function pauseToggle() {
  if (g.state === 'playing') g.state = 'paused';
  else if (g.state === 'paused') g.state = 'playing';
  input.clear(); showScreen(g);
}
window.addEventListener('keydown', e => {
  if (e.repeat) return;
  if (e.code === 'KeyM') { g.audio.muted = !g.audio.muted; updateHUD(g); }
  if (e.code === 'KeyP' || e.code === 'Escape') pauseToggle();
  if (g.state === 'upgrade' && ['Digit1', 'Digit2', 'Digit3'].includes(e.code)) choose(Number(e.code.slice(-1)) - 1);
  if (g.state === 'gameover' && e.code === 'KeyR') reset();
});
document.getElementById('start').onclick = () => { g.audio.unlock(); reset(); };
document.getElementById('resume').onclick = pauseToggle;
document.getElementById('restart').onclick = () => { g.audio.unlock(); reset(); };
canvas.addEventListener('pointerdown', () => g.audio.unlock());
window.addEventListener('blur', () => { if (g.state === 'playing' && !g.staged) pauseToggle(); });
if (params.has('shot')) {
  g.best = 0; // Stored records cannot change reproducible screenshot scenes.
  stageShot(g, params.get('shot'), reset, openUpgrade);
}
showScreen(g); updateHUD(g); requestAnimationFrame(frame);
