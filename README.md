[![make.fun best-game-01](https://make.fun/api/badge/best-game-01)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=ndus%2Fmakefun-emberfall)
[![rank](https://make.fun/api/badge/best-game-01/ndus/makefun-emberfall/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ndus%2Fmakefun-emberfall)
[![reward](https://make.fun/api/badge/best-game-01/ndus/makefun-emberfall/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=ndus%2Fmakefun-emberfall)

# EMBERFALL

A little light against the endless night. An original twin-stick survival game: defend the last ember against the Gloam in a circular arena. Canvas 2D, ES modules, synthesized WebAudio; no libraries, external assets, or network requests.

## Play

Run `node serve.ts` (Node 22+), then open `http://localhost:8080`. Click to start. Defeat each wave, collect ember shards for score and dash energy, and select one of three upgrades. Every fifth wave brings the Hollow Crown, a boss brute. Survive escalating waves for a local best score.

| Control | Action |
| --- | --- |
| WASD / arrows | Move |
| Mouse | Aim |
| Hold left mouse / Space | Fire |
| Shift / right mouse | Dash, briefly invulnerable |
| 1 / 2 / 3 or click | Choose an upgrade |
| P / Esc | Pause / resume |
| M | Toggle sound |
| R / Rekindle | Restart after defeat |

## Structure

`game/index.html` contains the page, HUD, styles and overlays. Each module in `game/src/` has one responsibility:

- `config.js`: balance settings, upgrade definitions and seeded RNG.
- `input.js`: keyboard and mouse input.
- `audio.js`: synthesized sound envelopes.
- `player.js`: movement, dash and shooting.
- `enemies.js`: spawning, AI, damage and death drops.
- `waves.js`: escalating compositions and wave transitions.
- `upgrades.js`: upgrade selection, application and cards.
- `particles.js`: sparks and floating score text.
- `hud.js`: counters, bars and overlay visibility.
- `render.js`: canvas arena and entity drawing.
- `main.js`: boot, state machine, fixed-step loop and collisions.
- `shots.js`: deterministic real-state screenshot staging.

The four reproducible views are `?shot=start&seed=1`, `?shot=play&seed=1`, `?shot=upgrade&seed=1` and `?shot=end&seed=1`. Staged action is frozen so capture timing does not affect the frame; regular play is live. Upgrade and restart buttons continue into live play.

`shots.json` lists the capture routes. `node main.ts` builds the kit dossier; use `MAKEFUN_OUTPUT_DIR=out node main.ts` locally. The kit entry point and vendor sources are unchanged.
