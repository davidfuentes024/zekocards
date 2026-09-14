/* ============================================================
   ZEKOCARDS · AUDIO ENTRY EXTRACTION
   Walks the same data modules the app uses and produces the flat
   list of clips to render. One entry per distinct SOUND, not per
   row: a reading shared by ten words is synthesised once.

   Entry shape:
     key    stable id the runtime asks for  ("word:あめ")
     text   what is actually sent to the TTS (may be kanji)
     read   the reading we expect to hear back (ASR gate)
     sprite which sprite file it is packed into
   ============================================================ */

import { ALL_SOUNDS } from '../../src/lib/data/kana.js';
import { WORDS } from '../../src/lib/data/dictionary.js';
import { KANJI } from '../../src/lib/data/kanji.js';
import { KANA_OVERRIDES } from './overrides.js';

const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

/** JLPT level tag of a word, or 'extra' when it carries none. */
function levelOf(word) {
	return LEVELS.find((l) => word.tags.includes(l)) ?? 'extra';
}

/* ---------------- kana ----------------
   Synthesised from the KATAKANA glyph on purpose. A lone hiragana
   は / へ / を is read by every neural engine as the particle
   ("wa", "e", "o"); the katakana form has no particle reading, so
   the engine says the mora. Both scripts share the clip because
   they are the same sound.                                      */
export function kanaEntries() {
	return ALL_SOUNDS.map((s) => {
		const o = KANA_OVERRIDES[s.r];
		return {
			key: `kana:${s.id}`,
			text: o?.text ?? s.k ?? s.h,
			ssml: o?.ssml ?? null,
			read: o?.read ?? s.k ?? s.h,
			romaji: s.r,
			sprite: 'kana'
		};
	});
}

/* ---------------- words ----------------
   Keyed by kana because that is all the callers have. Synthesised
   from the kanji form where the row has one: the engine's lexicon
   gives a far better pitch accent for 橋 than it can guess for はし.
   WORDS is already ordered curated-first, so the first row wins
   for a homograph.                                              */
export function wordEntries() {
	const byKana = new Map();
	for (const w of WORDS) {
		if (!w.kana) continue;
		if (!byKana.has(w.kana)) byKana.set(w.kana, w);
	}
	return [...byKana.values()].map((w) => ({
		key: `word:${w.kana}`,
		text: w.kanji && w.kanji !== '-' ? w.kanji : w.kana,
		ssml: null,
		read: w.kana,
		romaji: w.romaji,
		sprite: `words-${levelOf(w)}`
	}));
}

/* ---------------- kanji ----------------
   A bare glyph has no single pronunciation, so we commit to one
   reading and render THAT: kun first (it is the standalone word
   reading), on as fallback for glyphs with no kun.              */
export function kanjiEntries() {
	return KANJI.map((k) => {
		const read = k.kun?.[0] || k.on?.[0] || null;
		if (!read) return null;
		return {
			key: `kanji:${k.kanji}`,
			text: read,
			ssml: null,
			read,
			romaji: null,
			sprite: 'kanji'
		};
	}).filter(Boolean);
}

/** Every clip, deduplicated by key. */
export function allEntries() {
	const out = new Map();
	for (const e of [...kanaEntries(), ...wordEntries(), ...kanjiEntries()]) {
		if (!out.has(e.key)) out.set(e.key, e);
	}
	return [...out.values()];
}

/* Glyph → key shortcuts, so the runtime can resolve the raw strings the
   components already pass to `say()` without touching every call site.
   Word and kanji keys need no alias: their key IS the text. */
export function aliases() {
	const out = {};
	for (const s of ALL_SOUNDS) {
		const key = `kana:${s.id}`;
		if (s.h) out[s.h] = key;
		if (s.k) out[s.k] = key;
	}
	return out;
}
