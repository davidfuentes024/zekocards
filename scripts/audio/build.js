/* ============================================================
   ZEKOCARDS · TTS RENDER
   Renders every entry to a raw WAV in .cache/, then normalises,
   trims and pads it. Both stages are content-addressed: a clip is
   only re-requested when its text, voice or prosody actually
   changed, so re-running this costs nothing.

   Usage:
     AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=westeurope \
       node scripts/audio/build.js [--only kana] [--limit 20] [--dry]
   ============================================================ */

import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allEntries } from './entries.js';

const run = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = join(HERE, '.cache', 'raw');
const CLIP = join(HERE, '.cache', 'clip');

/* Bump when the render recipe changes; it invalidates the cache. */
const RECIPE = 'v1';

const VOICE = process.env.AZURE_VOICE ?? 'ja-JP-NanamiNeural';
const KEY = process.env.AZURE_SPEECH_KEY;
const REGION = process.env.AZURE_SPEECH_REGION ?? 'westeurope';

/* Teaching audio, not narration: a hair slower than conversational,
   flat default pitch so the engine's own accent contour survives. */
const RATE = { kana: '-8%', word: '-5%', kanji: '-5%' };
const PAD_MS = 80;
const LUFS = -16;

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);

const exists = (p) => access(p).then(() => true, () => false);

function ssmlFor(entry) {
	const kind = entry.key.split(':')[0];
	const body = entry.ssml ?? escapeXml(entry.text);
	return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ja-JP"><voice name="${VOICE}"><prosody rate="${RATE[kind] ?? '0%'}">${body}</prosody></voice></speak>`;
}

const escapeXml = (s) =>
	s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

const hashOf = (entry) => createHash('sha256').update(RECIPE + '|' + ssmlFor(entry)).digest('hex').slice(0, 16);

async function synthesize(ssml, attempt = 0) {
	const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
		method: 'POST',
		headers: {
			'Ocp-Apim-Subscription-Key': KEY,
			'Content-Type': 'application/ssml+xml',
			/* 24 kHz 16-bit PCM: lossless in, so the loudness pass and the
			   final Opus encode are the only quality-affecting steps. */
			'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
			'User-Agent': 'zekocards-audio-build'
		},
		body: ssml
	});
	if (res.status === 429 || res.status >= 500) {
		if (attempt >= 5) throw new Error(`TTS ${res.status} after ${attempt} retries`);
		const wait = Number(res.headers.get('retry-after') ?? 0) * 1000 || 2 ** attempt * 500;
		await new Promise((r) => setTimeout(r, wait));
		return synthesize(ssml, attempt + 1);
	}
	if (!res.ok) throw new Error(`TTS ${res.status}: ${(await res.text()).slice(0, 200)}`);
	return Buffer.from(await res.arrayBuffer());
}

/* Silence-trim, then loudness-normalise, then pad both ends. Order
   matters: padding before the trim would be eaten by it, and
   normalising before the trim lets leading hiss set the gain. */
async function post(rawPath, outPath) {
	const pad = PAD_MS / 1000;
	await run('ffmpeg', [
		'-hide_banner', '-loglevel', 'error', '-y',
		'-i', rawPath,
		'-af', [
			`silenceremove=start_periods=1:start_silence=0.02:start_threshold=-50dB:detection=peak`,
			`areverse`,
			`silenceremove=start_periods=1:start_silence=0.02:start_threshold=-50dB:detection=peak`,
			`areverse`,
			`loudnorm=I=${LUFS}:TP=-1.5:LRA=11`,
			`adelay=${PAD_MS}:all=1`,
			`apad=pad_dur=${pad}`
		].join(','),
		'-ar', '24000', '-ac', '1',
		outPath
	]);
}

async function main() {
	if (!KEY && !flag('--dry')) {
		console.error('AZURE_SPEECH_KEY no está definida. Usa --dry para ver el plan sin llamar a Azure.');
		process.exit(1);
	}
	await mkdir(RAW, { recursive: true });
	await mkdir(CLIP, { recursive: true });

	let entries = allEntries();
	const only = opt('--only');
	if (only) entries = entries.filter((e) => e.sprite === only || e.key.startsWith(only + ':'));
	const limit = Number(opt('--limit', 0));
	if (limit) entries = entries.slice(0, limit);

	let made = 0, cached = 0, failed = 0;
	const index = [];

	for (const [i, entry] of entries.entries()) {
		const h = hashOf(entry);
		const rawPath = join(RAW, `${h}.wav`);
		const clipPath = join(CLIP, `${h}.wav`);
		index.push({ ...entry, hash: h, clip: clipPath });

		if (await exists(clipPath)) { cached++; continue; }
		if (flag('--dry')) { made++; continue; }

		try {
			if (!(await exists(rawPath))) await writeFile(rawPath, await synthesize(ssmlFor(entry)));
			await post(rawPath, clipPath);
			made++;
		} catch (err) {
			failed++;
			console.error(`  ✗ ${entry.key}: ${err.message}`);
		}
		if ((i + 1) % 100 === 0) console.log(`  ${i + 1}/${entries.length}…`);
	}

	await writeFile(join(HERE, '.cache', 'index.json'), JSON.stringify(index, null, '\t'));
	console.log(`\nrendered ${made} · cached ${cached} · failed ${failed} · total ${entries.length}`);
	const chars = entries.reduce((a, e) => a + (e.ssml ?? e.text).length, 0);
	console.log(`caracteres de contenido: ${chars}`);
}

main();
