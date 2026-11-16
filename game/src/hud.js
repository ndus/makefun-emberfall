const $ = id => document.getElementById(id);
export function updateHUD(g) {
  const p = g.player;
  $('score').textContent = String(g.score).padStart(6, '0'); $('wave').textContent = String(g.wave || 1).padStart(2, '0');
  $('hp-fill').style.width = `${p.hp / p.maxHp * 100}%`; $('hp-label').textContent = `${Math.ceil(p.hp)} / ${p.maxHp}`;
  $('dash-fill').style.width = `${(1 - p.dashTimer / p.dashCooldown) * 100}%`; $('dash-label').textContent = p.dashTimer > 0 ? `${p.dashTimer.toFixed(1)}s` : 'READY';
  $('remaining').textContent = g.enemies.filter(e => !e.dead).length + g.queue.length;
  $('sound').textContent = g.audio.muted ? 'M / SOUND OFF' : 'M / SOUND ON';
  const boss = g.enemies.find(e => e.boss && !e.dead);
  $('boss').hidden = !boss; if (boss) $('boss-fill').style.width = `${boss.hp / boss.maxHp * 100}%`;
  $('hud').classList.toggle('subdued', g.state === 'title');
}
export function showScreen(g) {
  for (const id of ['title', 'upgrade', 'paused', 'gameover']) $(id).hidden = g.state !== id;
  if (g.state === 'upgrade') $('cleared-wave').textContent = String(g.wave).padStart(2, '0');
  if (g.state === 'gameover') {
    $('final-score').textContent = g.score.toLocaleString('en-US'); $('final-wave').textContent = String(g.wave).padStart(2, '0');
    $('best-score').textContent = g.best.toLocaleString('en-US');
  }
}
