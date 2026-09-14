/* ============================================================
   ZEKOCARDS · MOBILE AUDIO PACKER
   Re-encodes the clips build.js already rendered into one small
   AAC file per distinct sound for the Flutter app, plus a flat
   text → file index. Purely local (ffmpeg); it never calls the
   TTS provider.

   Why not the web sprites: iOS cannot decode WebM/Opus, and
   seeking into an AAC sprite drifts by the encoder priming delay
   (~90 ms at 24 kHz), which is longer than the clip padding.
   Whole files sidestep both.

   Usage: node scripts/audio/pack-mobile.js [--out ../japones-mobile/assets/audio]
   ============================================================ */

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { cpus } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aliases } from './entries.js';

const run = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const OUT = resolve(
	args.includes('--out') ? args[args.indexOf('--out') + 1] : join(HERE, '..', '..', '..', 'japones-mobile', 'assets', 'audio')
);
const BITRATE = '40k';

const exists = (p) => access(p).then(() => true, () => false);

async function main() {
	const index = JSON.parse(await readFile(join(HERE, '.cache', 'index.json'), 'utf8'));
	await mkdir(OUT, { recursive: true });

	/* One file per rendered clip; many keys can share it. */
	const byHash = new Map();
	const clips = {};
	for (const e of index) {
		if (!(await exists(e.clip))) {
			console.warn(`  skip ${e.key} (no clip)`);
			continue;
		}
		byHash.set(e.hash, e.clip);
		clips[e.key] = e.hash;
	}

	const jobs = [...byHash.entries()];
	let done = 0;
	async function worker() {
		while (jobs.length) {
			const [hash, clip] = jobs.pop();
			const out = join(OUT, `${hash}.m4a`);
			if (!(await exists(out))) {
				await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', clip,
					'-c:a', 'aac', '-b:a', BITRATE, '-ac', '1', '-movflags', '+faststart', out]);
			}
			if (++done % 500 === 0) console.log(`  ${done}/${byHash.size}…`);
		}
	}
	await Promise.all(Array.from({ length: Math.max(2, cpus().length) }, worker));

	/* Flatten to text → hash with the same precedence the web runtime uses:
	   a glyph alias (kana card) first, then word, then kanji. */
	const text = {};
	for (const [key, hash] of Object.entries(clips)) {
		const [kind, ...rest] = key.split(':');
		if (kind === 'kanji') text[rest.join(':')] ??= hash;
	}
	for (const [key, hash] of Object.entries(clips)) {
		const [kind, ...rest] = key.split(':');
		if (kind === 'word') text[rest.join(':')] = hash;
	}
	for (const [glyph, key] of Object.entries(aliases())) {
		if (clips[key]) text[glyph] = clips[key];
	}

	await writeFile(join(OUT, 'index.json'), JSON.stringify({ version: 1, ext: 'm4a', text }));
	console.log(`\n${byHash.size} files, ${Object.keys(text).length} texts → ${OUT}`);
}

main();
