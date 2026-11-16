// EMBERFALL's handover packages the playable files and captured screenshots together.
// Refresh both folders before asking the vendored dossier builder to describe the entry.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

function destinationDirectory(): string {
  return resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
}

function replaceFolder(source: string, destination: string, optional = false): number {
  rmSync(destination, { recursive: true, force: true });
  if (optional && !existsSync(source)) {
    mkdirSync(destination, { recursive: true });
    return 0;
  }
  cpSync(source, destination, { recursive: true });
  return readdirSync(destination, { recursive: true, withFileTypes: true })
    .filter(entry => !entry.isDirectory()).length;
}

function handover(): void {
  const repository = fileURLToPath(new URL('.', import.meta.url));
  const destination = destinationDirectory();
  mkdirSync(destination, { recursive: true });

  const playableFiles = replaceFolder(join(repository, 'game'), join(destination, 'game'));
  const captures = replaceFolder(join(repository, 'screenshots'), join(destination, 'screenshots'), true);
  const dossier = buildDossier(destination, {
    game_path_max_bytes: 1000,
    game_max_bytes: 50331648,
    game_max_files: 993,
    screenshots: { max_bytes: 262144, max: 4 },
    text_max_bytes: 163840,
  });
  writeFileSync(join(destination, 'dossier.json'), dossier);
  console.log(`EMBERFALL: handed in ${playableFiles + captures + 1} files; dossier ${dossier.byteLength} bytes.`);
}

handover();
