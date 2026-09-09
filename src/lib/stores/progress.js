import { derived, get } from 'svelte/store';
import { persisted } from './persisted.js';
import { ALL_SOUNDS } from '$lib/data/kana.js';

/**
 * Per-sound mastery record.
 * Repetition is the whole point: a sound only levels up after it has been
 * answered correctly, from cold, several separate times.
 */
const EMPTY = () => ({ seen: 0, ok: 0, bad: 0, streak: 0, best: 0, level: 0, last: 0, ms: 0 });

export const REPS_PER_LEVEL = 3;
export const MAX_LEVEL = 5;

export const stats = persisted('stats', {});
export const history = persisted('history', {}); // yyyy-mm-dd -> answers
export const totals = persisted('totals', { answers: 0, correct: 0, sessions: 0, ms: 0 });

function today() {
	return new Date().toISOString().slice(0, 10);
}

export function record(soundId, correct, ms = 0) {
	stats.update((all) => {
		const s = { ...(all[soundId] ?? EMPTY()) };
		s.seen += 1;
		s.last = Date.now();
		s.ms += ms;
		if (correct) {
			s.ok += 1;
			s.streak += 1;
			s.best = Math.max(s.best, s.streak);
			if (s.streak > 0 && s.streak % REPS_PER_LEVEL === 0) s.level = Math.min(MAX_LEVEL, s.level + 1);
		} else {
			s.bad += 1;
			s.streak = 0;
			s.level = Math.max(0, s.level - 1);
		}
		return { ...all, [soundId]: s };
	});

	history.update((h) => ({ ...h, [today()]: (h[today()] ?? 0) + 1 }));
	totals.update((t) => ({
		...t,
		answers: t.answers + 1,
		correct: t.correct + (correct ? 1 : 0),
		ms: t.ms + ms
	}));
}

export function startSession() {
	totals.update((t) => ({ ...t, sessions: t.sessions + 1 }));
}

export function statFor(soundId) {
	return get(stats)[soundId] ?? EMPTY();
}

/** 0 → never touched, 1 → fully drilled. */
export function masteryOf(soundId, all = get(stats)) {
	const s = all[soundId];
	if (!s) return 0;
	return Math.min(1, s.level / MAX_LEVEL);
}

/**
 * Weight used by every drill when picking the next prompt.
 * Weak, stale and never-seen sounds come back constantly — by design.
 */
export function weightOf(soundId, all = get(stats)) {
	const s = all[soundId];
	if (!s || s.seen === 0) return 9;
	const accuracy = s.ok / Math.max(1, s.seen);
	const staleness = Math.min(1, (Date.now() - s.last) / (1000 * 60 * 30));
	return 1 + (1 - accuracy) * 8 + (MAX_LEVEL - s.level) * 1.1 + staleness * 2;
}

export const overall = derived([stats, totals], ([$stats, $totals]) => {
	const touched = Object.keys($stats).length;
	const mastered = Object.values($stats).filter((s) => s.level >= MAX_LEVEL).length;
	const learning = Object.values($stats).filter((s) => s.level > 0 && s.level < MAX_LEVEL).length;
	return {
		touched,
		mastered,
		learning,
		untouched: ALL_SOUNDS.length - touched,
		accuracy: $totals.answers ? Math.round(($totals.correct / $totals.answers) * 100) : 0,
		answers: $totals.answers
	};
});

/** Consecutive days with at least one answer, ending today or yesterday. */
export const dayStreak = derived(history, ($h) => {
	let streak = 0;
	const d = new Date();
	for (let i = 0; i < 400; i += 1) {
		const key = d.toISOString().slice(0, 10);
		if ($h[key]) streak += 1;
		else if (i > 0) break;
		d.setDate(d.getDate() - 1);
	}
	return streak;
});

export const last30 = derived(history, ($h) => {
	const out = [];
	const d = new Date();
	d.setDate(d.getDate() - 29);
	for (let i = 0; i < 30; i += 1) {
		const key = d.toISOString().slice(0, 10);
		out.push({ key, count: $h[key] ?? 0 });
		d.setDate(d.getDate() + 1);
	}
	return out;
});
