/* ============================================================
   ZEKOCARDS · ASR VERIFICATION GATE
   Transcribes every rendered clip back to kana and compares it
   with the reading the data says it should be. This is what
   catches the two failure modes a build script cannot see:

     · the engine picked the wrong reading for a kanji
       (日 → "nichi" where the row says "hi")
     · the engine read a lone kana as a particle
       (は → "wa")

   It needs a local Whisper. Either works:
     brew install whisper-cpp   (then --engine whisper-cpp)
     pipx install faster-whisper (then --engine faster-whisper)

   Usage:
     node scripts/audio/verify.js [--only kana] [--engine whisper-cpp]
   Output: scripts/audio/report.json + a summary on stdout
   ============================================================ */

import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EAR_CHECK } from './overrides.js';

const run = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const ENGINE = opt('--engine', 'whisper-cpp');
const MODEL = opt('--model', process.env.WHISPER_MODEL ?? 'models/ggml-medium.bin');

/* Katakana → hiragana, strip long marks and spacing, so the comparison
   is about the READING and not about how Whisper chose to spell it. */
function normalise(s) {
	return (s ?? '')
		.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
		.replace(/[ー・\s。、！？!?.,]/g, '')
		.trim();
}

/* Differences that are correct modern Japanese and must not be flagged. */
const MERGES = [
	[/ぢ/g, 'じ'],
	[/づ/g, 'ず'],
	[/を/g, 'お'],
	[/ゐ/g, 'い'],
	[/ゑ/g, 'え']
];

function canonical(s) {
	return MERGES.reduce((acc, [re, to]) => acc.replace(re, to), normalise(s));
}

async function transcribe(path) {
	if (ENGINE === 'whisper-cpp') {
		const { stdout } = await run('whisper-cli', [
			'-m', MODEL, '-l', 'ja', '-nt', '-np', '--no-prints', '-f', path
		]);
		return stdout.trim();
	}
	const { stdout } = await run('faster-whisper', ['--language', 'ja', '--model', 'medium', path]);
	return stdout.trim();
}

async function main() {
	const index = JSON.parse(await readFile(join(HERE, '.cache', 'index.json'), 'utf8'));
	const only = opt('--only');
	const entries = only ? index.filter((e) => e.sprite === only) : index;

	const bad = [];
	const ear = [];
	let ok = 0;

	for (const [i, e] of entries.entries()) {
		let heard = '';
		try {
			heard = await transcribe(e.clip);
		} catch (err) {
			bad.push({ ...e, heard: null, why: `asr failed: ${err.message}` });
			continue;
		}
		const want = canonical(e.read);
		const got = canonical(heard);
		if (got === want) ok++;
		else bad.push({ key: e.key, text: e.text, want: e.read, heard, why: 'reading mismatch' });

		if (e.romaji && EAR_CHECK.includes(e.romaji)) ear.push({ key: e.key, heard });
		if ((i + 1) % 100 === 0) console.log(`  ${i + 1}/${entries.length}…`);
	}

	await writeFile(join(HERE, 'report.json'), JSON.stringify({ ok, bad, ear }, null, '\t'));

	const pct = ((ok / entries.length) * 100).toFixed(1);
	console.log(`\n${ok}/${entries.length} coinciden (${pct}%)`);
	console.log(`${bad.length} para revisar → scripts/audio/report.json`);
	console.log(`${ear.length} marcados para revisión a oído (no basta el ASR)`);
	for (const b of bad.slice(0, 25)) console.log(`  · ${b.key}  quiere "${b.want}"  oye "${b.heard}"`);
}

main();
