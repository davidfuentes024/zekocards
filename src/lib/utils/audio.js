/* ============================================================
   ZEKOCARDS · PRE-RENDERED AUDIO
   Plays slices out of the sprites built by scripts/audio/*.

   Why Web Audio and not <audio>: a drill fires a sound every
   second or two, and the learner interrupts constantly. Decoded
   buffers give ~5 ms latency and let us stop the previous sound
   explicitly, instead of the speechSynthesis.cancel() race that
   used to swallow replays.

   Falls back to speechSynthesis whenever a clip is missing, so a
   first visit with a cold cache still makes noise.
   ============================================================ */

import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { say as speak, stopSpeaking } from './speech.js';

const BASE = '/audio';
const CACHE = 'zeko-audio-v1';

let manifest = null;
let manifestPromise = null;
let ctx = null;
let gain = null;
let current = null;
let pending = 0;

/* How long a press waits for a sprite that is still downloading. */
const COLD_WAIT_MS = 1500;

const buffers = new Map(); // sprite -> AudioBuffer
const loading = new Map(); // sprite -> Promise

/* The manifest arrives after first paint, so anything that renders a
   decision about audio ("is this drill playable?") has to be able to
   re-run when it lands. Components read this store; hasClip() alone is
   a plain function and would be computed once, too early. */
export const audioReady = writable(false);

/* The context must be created inside a gesture on iOS, and stays
   suspended until one happens. Every play() nudges it. */
function audioContext() {
	if (!browser) return null;
	if (!ctx) {
		const Ctx = window.AudioContext ?? window.webkitAudioContext;
		if (!Ctx) return null;
		ctx = new Ctx();
		gain = ctx.createGain();
		gain.connect(ctx.destination);
	}
	if (ctx.state === 'suspended') ctx.resume();
	return ctx;
}

export function loadManifest() {
	if (!browser) return Promise.resolve(null);
	if (manifestPromise) return manifestPromise;
	manifestPromise = fetch(`${BASE}/manifest.json`)
		.then((r) => (r.ok ? r.json() : null))
		.then((m) => {
			manifest = m;
			audioReady.set(!!m);
			return m;
		})
		.catch(() => null);
	return manifestPromise;
}

/* Cache Storage holds the compressed bytes, so a reload skips the
   network entirely and the app keeps working offline. */
async function spriteBytes(file) {
	const url = `${BASE}/${file}`;
	if ('caches' in window) {
		try {
			const cache = await caches.open(CACHE);
			const hit = await cache.match(url);
			if (hit) return hit.arrayBuffer();
			const res = await fetch(url);
			if (!res.ok) throw new Error(String(res.status));
			await cache.put(url, res.clone());
			return res.arrayBuffer();
		} catch {
			/* private mode, quota, or an opaque failure — just fetch */
		}
	}
	const res = await fetch(url);
	if (!res.ok) throw new Error(String(res.status));
	return res.arrayBuffer();
}

/** Fetch and decode a sprite. Safe to call repeatedly. */
export function loadSprite(sprite) {
	if (buffers.has(sprite)) return Promise.resolve(buffers.get(sprite));
	if (loading.has(sprite)) return loading.get(sprite);

	const p = (async () => {
		const m = await loadManifest();
		const meta = m?.sprites?.[sprite];
		const c = audioContext();
		if (!meta || !c) return null;
		const buf = await c.decodeAudioData(await spriteBytes(meta.file));
		buffers.set(sprite, buf);
		return buf;
	})()
		.catch(() => null)
		.finally(() => loading.delete(sprite));

	loading.set(sprite, p);
	return p;
}

/** Warm sprites ahead of a drill so the first press is instant. */
export function preload(...sprites) {
	return Promise.all(sprites.flat().map(loadSprite));
}

/* Resolution order matters. A one-character kana string is far more
   likely to be a kana card than the rare single-kana word that shares
   its spelling, so aliases win; everything else is looked up as a word
   first and a kanji second. */
function resolve(text) {
	if (!manifest || !text) return null;
	const { aliases, clips } = manifest;
	const alias = aliases?.[text];
	if (alias && clips[alias]) return clips[alias];
	return clips[`word:${text}`] ?? clips[`kanji:${text}`] ?? null;
}

export function stop() {
	if (current) {
		try {
			current.onended = null;
			current.stop();
		} catch {
			/* already finished */
		}
		current = null;
	}
	stopSpeaking();
}

/**
 * Play `text`. Returns 'clip' when real audio played, 'tts' when it fell
 * back to the browser voice, 'pending' while a cold sprite loads, or null
 * when nothing could be played.
 *
 * `rate` is applied as playback rate, which shifts pitch slightly. Below
 * about 0.8 that starts to sound wrong, so it is clamped.
 */
export function play(text, { rate = 1, volume = 1 } = {}) {
	if (!browser || !text) return null;

	const entry = resolve(text);
	if (!entry) {
		loadManifest().then(() => {
			const late = resolve(text);
			if (late) loadSprite(late.s);
		});
		return speak(text, { rate: Math.min(rate, 1) }) ? 'tts' : null;
	}

	const buf = buffers.get(entry.s);
	if (!buf) {
		/* A cold word/kanji sprite is a one-off fetch. Waiting a moment for it
		   beats answering the first press with a different (browser) voice. */
		const token = ++pending;
		audioContext();
		Promise.race([loadSprite(entry.s), new Promise((r) => setTimeout(() => r(null), COLD_WAIT_MS))]).then(
			(loaded) => {
				if (token !== pending) return; // a newer play() superseded this one
				if (loaded) startClip(loaded, entry, rate, volume);
				else speak(text, { rate: Math.min(rate, 1) });
			}
		);
		return 'pending';
	}

	pending += 1;
	return startClip(buf, entry, rate, volume);
}

function startClip(buf, entry, rate, volume) {
	const c = audioContext();
	if (!c) return null;

	stop();
	const src = c.createBufferSource();
	src.buffer = buf;
	/* Playback rate shifts pitch, which makes a recorded voice sound wrong
	   well before it sounds slower, so only a faster-than-normal setting is
	   applied to clips. The slow setting is for the browser voice. */
	src.playbackRate.value = Math.max(1, Math.min(1.25, rate));
	gain.gain.value = Math.max(0, Math.min(1, volume));
	src.connect(gain);
	/* The clip carries 80 ms of padding at each end; play it whole so the
	   attack is never clipped, which is the bug this whole pipeline exists
	   to fix. */
	src.start(0, entry.t, entry.d);
	src.onended = () => {
		if (current === src) current = null;
	};
	current = src;
	return 'clip';
}

/** True once real audio is available for `text`. */
export function hasClip(text) {
	return !!resolve(text);
}

/** Sprite a JLPT level's words live in, for preloading. */
export const spriteForLevel = (level) => `words-${String(level).toLowerCase()}`;

if (browser) loadManifest();
