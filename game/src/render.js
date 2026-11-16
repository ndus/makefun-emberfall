import { FIELD } from './config.js';
const TAU = Math.PI * 2;
function circle(c, x, y, radius, color) {
  c.fillStyle = color; c.beginPath(); c.arc(x, y, radius, 0, TAU); c.fill();
}
function ring(c, x, y, radius, color, width = 1) {
  c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.arc(x, y, radius, 0, TAU); c.stroke();
}
function glow(c, x, y, radius, color) {
  const gradient = c.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color); gradient.addColorStop(1, 'transparent');
  circle(c, x, y, radius, gradient);
}
// Cached arena art keeps the hundreds of floor strokes out of the frame loop.
let floor;
function arena() {
  floor = document.createElement('canvas'); floor.width = 1440; floor.height = 900;
  const c = floor.getContext('2d'), { x, y, radius } = FIELD;
  c.fillStyle = '#070a14'; c.fillRect(0, 0, 1440, 900);
  glow(c, x, y, 600, '#202036');
  for (let i = 0; i < 120; i++) {
    const a = i * 2.39996, r = 390 + ((i * 73) % 210);
    circle(c, x + Math.cos(a) * r, y + Math.sin(a) * r, 1, '#514052');
  }
  circle(c, x, y, radius + 18, '#0d101b');
  ring(c, x, y, radius + 17, '#473342');
  circle(c, x, y, radius, '#121a2b');
  glow(c, x, y, radius, '#20273c');
  for (let r = 75; r < radius; r += 70) ring(c, x, y, r, '#2b304133');
  for (let i = 0; i < 32; i++) {
    const a = i * TAU / 32;
    c.strokeStyle = '#35344655'; c.beginPath();
    c.moveTo(x + Math.cos(a) * 285, y + Math.sin(a) * 285);
    c.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius); c.stroke();
  }
  ring(c, x, y, radius - 4, '#61505b'); ring(c, x, y, radius - 12, '#373344', 2);
  ring(c, x, y, 66, '#5c455047');
  c.save(); c.translate(x, y); c.rotate(Math.PI / 4); c.strokeStyle = '#68494540';
  c.strokeRect(-35, -35, 70, 70); c.rotate(Math.PI / 4); c.strokeRect(-35, -35, 70, 70); c.restore();
  for (let i = 0; i < 12; i++) {
    const a = i * TAU / 12, rx = x + Math.cos(a) * (radius + 1), ry = y + Math.sin(a) * (radius + 1);
    glow(c, rx, ry, 48, '#e57e252b');
    c.save(); c.translate(rx, ry); c.rotate(a);
    c.fillStyle = '#131422'; c.fillRect(-13, -18, 26, 36);
    c.strokeStyle = '#ae724e'; c.strokeRect(-7, -11, 14, 22);
    c.beginPath(); c.moveTo(0, -6); c.lineTo(4, 0); c.lineTo(0, 6); c.lineTo(-4, 0); c.closePath(); c.fillStyle = '#eeb674'; c.fill(); c.restore();
  }
  return floor;
}
function enemy(c, e, time) {
  c.save(); c.translate(e.x, e.y); c.rotate(e.facing);
  const r = e.radius;
  glow(c, 0, 0, r * 2.1, e.type === 'dart' ? '#63cfb81b' : '#a878e51c');
  c.fillStyle = '#090c19'; c.strokeStyle = e.flash > 0 ? '#fff3d4' : e.color; c.lineWidth = 2;
  c.beginPath();
  if (e.type === 'dart') {
    c.moveTo(r + 4, 0); c.lineTo(-r, -r); c.lineTo(-r * .5, 0); c.lineTo(-r, r);
  } else {
    for (let i = 0; i < 10; i++) {
      const a = i * TAU / 10, v = r * (i % 2 ? .75 : 1.12);
      const x = Math.cos(a) * v, y = Math.sin(a) * v;
      if (!i) c.moveTo(x, y); else c.lineTo(x, y);
    }
  }
  c.closePath(); c.fill(); c.stroke();
  circle(c, 0, 0, r * .5, e.flash > 0 ? '#fdf0d8' : '#29233f');
  circle(c, r * .3, -r * .21, 2.5, e.color); circle(c, r * .3, r * .21, 2.5, e.color);
  if (e.boss) { ring(c, 0, 0, r + 9, '#ba8bdf80', 2); }
  if (e.type === 'dart' && e.lunge < .35) ring(c, 0, 0, r + 7 + Math.sin(time * 30) * 2, '#9af9d3');
  c.restore();
  if (e.hp < e.maxHp && !e.boss) {
    c.fillStyle = '#29243c'; c.fillRect(e.x-r, e.y-r-10, r*2, 3);
    c.fillStyle = e.color; c.fillRect(e.x-r, e.y-r-10, r*2*Math.max(0,e.hp/e.maxHp), 3);
  }
}
export function render(g) {
  const c = g.ctx, p = g.player;
  c.save();
  // Shake is visual only, never consuming the simulation's seeded random stream.
  if (g.shake) c.translate(Math.sin(g.time * 173) * g.shake, Math.cos(g.time * 137) * g.shake);
  c.drawImage(floor || arena(), 0, 0);
  for (let i = 0; i < 40; i++) {
    const a = i * 2.39996, r = (i * 79) % 350;
    circle(c, FIELD.x + Math.cos(a) * r, FIELD.y + Math.sin(a) * r - Math.sin(g.time + i) * 8, 1, '#b7865645');
  }
  for (const s of g.shards) {
    c.save(); c.translate(s.x, s.y); glow(c, 0, 0, 15, '#ffad3530');
    c.rotate((g.time + s.phase) * 1.5); c.fillStyle = '#f6b75e';
    c.beginPath(); c.moveTo(0,-6); c.lineTo(4,0); c.lineTo(0,6); c.lineTo(-4,0); c.fill(); c.restore();
  }
  for (const b of g.bolts) {
    const a = Math.atan2(b.vy, b.vx);
    c.strokeStyle = '#f79b4c70'; c.lineWidth = 4; c.beginPath(); c.moveTo(b.x, b.y);
    c.lineTo(b.x - Math.cos(a) * 26, b.y - Math.sin(a) * 26); c.stroke();
    glow(c,b.x,b.y,19,'#fa8b3b50'); circle(c,b.x,b.y,4,'#ffe6ac');
  }
  for (const e of g.enemies) if (!e.dead) enemy(c, e, g.time);
  glow(c, p.x, p.y, 80, '#ff8d2928'); glow(c, p.x, p.y, 31, '#ffa34d45');
  if (p.invulnerable > 0) ring(c, p.x, p.y, 24, '#ffe4ab99', 2);
  c.save(); c.translate(p.x, p.y); c.rotate(p.angle);
  c.beginPath(); c.moveTo(-28, 0); c.quadraticCurveTo(-8,-22,9,-12);
  c.quadraticCurveTo(20,0,9,12); c.quadraticCurveTo(-8,22,-28,0);
  c.fillStyle = p.flash > 0 ? '#fff8de' : '#e57d37'; c.fill();
  circle(c, 0, 0, 10, '#ffcb73'); circle(c, 4, -3, 2, '#fff9d6'); circle(c, 4, 3, 2, '#fff9d6');
  c.fillStyle = '#fff0bc'; c.fillRect(9,-3,13,6);
  if (p.muzzle > 0) { glow(c,26,0,32,'#ffd37e99'); circle(c,25,0,5,'#fff8d7'); }
  c.restore();
  for (const q of g.particles) {
    c.globalAlpha = Math.max(0, q.life / q.max);
    circle(c, q.x, q.y, q.size * (.5 + q.life / q.max), q.color);
  }
  c.globalAlpha = 1;
  for (const t of g.texts) {
    c.globalAlpha = t.life; c.fillStyle = t.color; c.font = 'bold 16px monospace'; c.textAlign = 'center'; c.fillText(t.text,t.x,t.y);
  }
  c.restore();
  if (g.waveBanner > 0) {
    c.save(); c.globalAlpha = Math.min(1, g.waveBanner); c.fillStyle = '#ffd488';
    c.font = '20px monospace'; c.textAlign = 'center'; c.fillText(`— WAVE ${String(g.wave).padStart(2,'0')} —`,FIELD.x,100); c.restore();
  }
}
