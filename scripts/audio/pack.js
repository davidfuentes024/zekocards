/* ============================================================
   ZEKOCARDS · SPRITE PACKER
   Concatenates the finished clips into one file per group and
   writes the offset map the runtime uses to seek into them.

   Offsets are measured on the WAV before encoding. That is safe
   because every clip carries 80 ms of padding at each end, which
   is far more than any decoder-side drift.

   Usage: node scripts/audio/pack.js
   Output: static/audio/<sprite>.webm + static/audio/manifest.json
   ============================================================ */

import { mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aliases } from './entries.js';

const run = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', '..', 'static', 'audio');
const TMP = join(HERE, '.cache', 'tmp');

const BITRATE = '32k';

async function duration(path) {
	const { stdout } = await run('ffprobe', [
		'-v', 'error', '-show_entries', 'format=duration',
		'-of', 'default=noprint_wrappers=1:nokey=1', path
	]);
	return Number(stdout.trim());
}

async function main() {
	const all = JSON.parse(await readFile(join(HERE, '.cache', 'index.json'), 'utf8'));
	/* A clip the render step could not produce is left out, not fatal:
	   the runtime falls back to speechSynthesis for any key it lacks. */
	const index = [];
	for (const e of all) {
		if (await access(e.clip).then(() => true, () => false)) index.push(e);
		else console.warn(`  skip ${e.key} (no clip)`);
	}
	await mkdir(OUT, { recursive: true });
	await mkdir(TMP, { recursive: true });

	const sprites = [...new Set(index.map((e) => e.sprite))];
	const manifest = { version: 1, format: 'webm-opus', sprites: {}, clips: {}, aliases: aliases() };

	for (const sprite of sprites) {
		const entries = index.filter((e) => e.sprite === sprite);
		const listPath = join(TMP, `${sprite}.txt`);
		await writeFile(listPath, entries.map((e) => `file '${e.clip.replace(/'/g, "'\\''")}'`).join('\n'));

		const joined = join(TMP, `${sprite}.wav`);
		await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y',
			'-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', joined]);

		const outFile = join(OUT, `${sprite}.webm`);
		await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y',
			'-i', joined, '-c:a', 'libopus', '-b:a', BITRATE, '-vbr', 'on',
			'-application', 'voip', '-ar', '48000', '-ac', '1', outFile]);

		/* Walk the clips again to build offsets in the same order ffmpeg
		   concatenated them. */
		let cursor = 0;
		for (const e of entries) {
			const d = await duration(e.clip);
			manifest.clips[e.key] = { s: sprite, t: round(cursor), d: round(d) };
			cursor += d;
		}

		const bytes = (await run('ffprobe', ['-v', 'error', '-show_entries', 'format=size',
			'-of', 'default=noprint_wrappers=1:nokey=1', outFile])).stdout.trim();
		manifest.sprites[sprite] = { file: `${sprite}.webm`, clips: entries.length, bytes: Number(bytes), dur: round(cursor) };
		console.log(`${sprite.padEnd(12)} ${String(entries.length).padStart(5)} clips  ${(bytes / 1e6).toFixed(2)} MB  ${cursor.toFixed(1)}s`);
	}

	await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest));
	await rm(TMP, { recursive: true, force: true });

	const total = Object.values(manifest.sprites).reduce((a, s) => a + s.bytes, 0);
	console.log(`\ntotal ${(total / 1e6).toFixed(2)} MB across ${sprites.length} sprites`);
}

const round = (n) => Math.round(n * 1000) / 1000;

main();
