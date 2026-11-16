import { UPGRADES } from './config.js';
export function offerUpgrades(g, select) {
  const pool = UPGRADES.filter(u => !u.max || (g.player.upgrades[u.id] || 0) < u.max);
  g.choices = [];
  for (let i = 0; i < 3; i++) g.choices.push(pool.splice(Math.floor(g.rng() * pool.length), 1)[0]);
  const root = document.getElementById('cards'); root.replaceChildren();
  g.choices.forEach((u, i) => {
    const card = document.createElement('button'); card.className = 'upgrade-card';
    card.innerHTML = `<span class="card-top">${u.tag}<span>0${i + 1}</span></span><span class="card-icon">${u.icon}</span><strong>${u.name}</strong><span class="card-poem">${u.text}</span><span class="card-effect">${u.effect}</span><span class="card-select">[ ${i + 1} ] &nbsp; CLAIM EMBER <span>↗</span></span>`;
    card.addEventListener('click', () => select(i)); root.append(card);
  });
}
export function applyUpgrade(g, index) {
  const u = g.choices[index]; if (!u) return false;
  u.apply(g.player); g.player.upgrades[u.id] = (g.player.upgrades[u.id] || 0) + 1;
  g.audio.play('upgrade'); return true;
}
