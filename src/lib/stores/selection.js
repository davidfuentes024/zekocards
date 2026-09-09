import { derived, get } from 'svelte/store';
import { persisted, persistedSet } from './persisted.js';
import { ALL_COLUMNS, COLUMN_BY_ID, SOUND_BY_ID, GOJUON } from '$lib/data/kana.js';
import { wordsWithin } from '$lib/data/dictionary.js';

/** Sound ids the learner has switched on. Drives every single exercise. */
export const selectedSounds = persistedSet(
	'selection',
	GOJUON[0].sounds.concat(GOJUON[1].sounds).map((s) => s.id)
);

/** Which script the cards and drills are shown in. */
export const script = persisted('script', 'hiragana');

export function toggleSound(id) {
	selectedSounds.update((s) => {
		const next = new Set(s);
		next.has(id) ? next.delete(id) : next.add(id);
		return next;
	});
}

export function setColumn(columnId, on) {
	const col = COLUMN_BY_ID.get(columnId);
	if (!col) return;
	selectedSounds.update((s) => {
		const next = new Set(s);
		for (const snd of col.sounds) on ? next.add(snd.id) : next.delete(snd.id);
		return next;
	});
}

export function toggleColumn(columnId) {
	const col = COLUMN_BY_ID.get(columnId);
	if (!col) return;
	const current = get(selectedSounds);
	const allOn = col.sounds.every((s) => current.has(s.id));
	setColumn(columnId, !allOn);
}

export function setGroup(groupId, on) {
	selectedSounds.update((s) => {
		const next = new Set(s);
		for (const col of ALL_COLUMNS.filter((c) => c.group === groupId))
			for (const snd of col.sounds) on ? next.add(snd.id) : next.delete(snd.id);
		return next;
	});
}

export function selectAll() {
	selectedSounds.set(new Set(ALL_COLUMNS.flatMap((c) => c.sounds.map((s) => s.id))));
}

export function clearSelection() {
	selectedSounds.set(new Set());
}

/** The actual sound records currently selected, in table order. */
export const activeSounds = derived([selectedSounds, script], ([$sel, $script]) =>
	ALL_COLUMNS.flatMap((c) => c.sounds)
		.filter((s) => $sel.has(s.id))
		.filter((s) => ($script === 'hiragana' ? s.h : s.k))
		.map((s) => SOUND_BY_ID.get(s.id))
);

/** Every dictionary word readable with the current selection. */
export const readableWords = derived(selectedSounds, ($sel) => wordsWithin($sel));

export const readableByScript = derived([readableWords, script], ([$words, $script]) =>
	$words.filter((w) => w.script === $script)
);

export const selectionSummary = derived([selectedSounds, readableWords], ([$sel, $words]) => ({
	sounds: $sel.size,
	words: $words.length,
	columns: ALL_COLUMNS.filter((c) => c.sounds.some((s) => $sel.has(s.id))).length
}));
