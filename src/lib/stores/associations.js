import { derived } from 'svelte/store';
import { browser } from '$app/environment';
import { persisted } from './persisted.js';
import { SOUND_BY_ID } from '$lib/data/kana.js';

/**
 * The learner's own anchor word for each sound, kept PER SCRIPT.
 * "ね looks like a cat's tail → NEko" says nothing about ネ, so an anchor
 * written on a hiragana card never shows up on the katakana one.
 * Written by hand, stored locally, and quizzed back in the Anchor drill.
 *
 * Shape: { hiragana: { [soundId]: anchor }, katakana: { [soundId]: anchor } }
 */
const EMPTY = { hiragana: {}, katakana: {} };

export const anchors = persisted('anchors-v2', legacy() ?? EMPTY);

/* Anchors written before the split were keyed by sound only. They move to
   the script whose glyph exists — hiragana first, since that was the
   default script — and the old key is left alone so nothing is lost. */
function legacy() {
	if (!browser) return null;
	try {
		if (localStorage.getItem('zekocards:v1:anchors-v2') !== null) return null;
		const raw = localStorage.getItem('zekocards:v1:anchors');
		if (!raw) return null;
		const out = { hiragana: {}, katakana: {} };
		for (const [id, a] of Object.entries(JSON.parse(raw))) {
			const s = SOUND_BY_ID.get(id);
			if (!s) continue;
			out[s.h ? 'hiragana' : 'katakana'][id] = a;
		}
		return out;
	} catch {
		return null;
	}
}

const bucket = (all, script) => all?.[script] ?? {};

export function anchorFor(all, script, soundId) {
	return bucket(all, script)[soundId] ?? null;
}

export function setAnchor(script, soundId, patch) {
	anchors.update((all) => {
		const mine = { ...bucket(all, script) };
		const prev = mine[soundId] ?? { word: '', note: '', updated: 0 };
		const next = { ...prev, ...patch, updated: Date.now() };
		if (!next.word && !next.note) delete mine[soundId];
		else mine[soundId] = next;
		return { ...EMPTY, ...all, [script]: mine };
	});
}

export function clearAnchor(script, soundId) {
	anchors.update((all) => {
		const mine = { ...bucket(all, script) };
		delete mine[soundId];
		return { ...EMPTY, ...all, [script]: mine };
	});
}

export const anchorCount = derived(
	anchors,
	($a) => Object.keys(bucket($a, 'hiragana')).length + Object.keys(bucket($a, 'katakana')).length
);
