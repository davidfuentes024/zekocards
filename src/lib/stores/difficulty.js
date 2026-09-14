/* ============================================================
   ZEKOCARDS · DIFFICULTY
   Three dials, and a preset for people who do not want to think
   about them.

   None of them can turn a drill into a shortlist: the pad always
   holds a complete section of the script, a miss always costs a
   repetition, and romaji is never an answer. What they change is
   how much of the difficulty is *knowing* and how much of it is
   *searching*.
   ============================================================ */
import { derived } from 'svelte/store';
import { persisted } from './persisted.js';

/** How long you get. `off` removes the clock, never the consequence. */
export const CLOCKS = [
	{ id: 'off', label: 'No clock', jp: '無制限', factor: 0 },
	{ id: 'wide', label: 'Generous', jp: '緩', factor: 1.8 },
	{ id: 'normal', label: 'Standard', jp: '標準', factor: 1 },
	{ id: 'merciless', label: 'Merciless', jp: '無情', factor: 0.6 }
];

/** How the pad is laid out. The contents never change — only the order. */
export const ORDERS = [
	{ id: 'grid', label: 'Gojūon grid', jp: '五十音' },
	{ id: 'shuffled', label: 'Shuffled', jp: '混' }
];

/** How much of the script the pad holds — in whole groups, never a shortlist. */
export const SCOPES = [
	{ id: 'selected', label: 'My symbols', jp: '自分' },
	{ id: 'section', label: 'Section', jp: '段' },
	{ id: 'full', label: 'Whole script', jp: '全' }
];

/* One line per dial and per option — shown only when the learner asks. */
export const DIAL_INFO = {
	clock: {
		what: 'Time you get per question. Running out counts as a miss.',
		options: {
			off: 'No timer.',
			wide: 'About twice the standard time.',
			normal: 'The time the drill was designed for.',
			merciless: 'A little over half the standard time.'
		}
	},
	order: {
		what: 'How the answer pad is laid out.',
		options: {
			grid: 'The kana table in its own order, row names on the side.',
			shuffled: 'Same keys, new random order every question.'
		}
	},
	scope: {
		what: 'Which symbols the answer pad holds.',
		options: {
			selected: 'Only the symbols you selected on the Cards page.',
			section: 'Every group your selection reaches into (46 → 71 → 104 → 128).',
			full: 'All symbols of the script.'
		}
	}
};

export const PRESETS = [
	{
		id: 'practice',
		label: 'Learn',
		jp: '稽古',
		blurb: 'No clock, ordered pad.',
		value: { clock: 'off', order: 'grid', scope: 'section' }
	},
	{
		id: 'standard',
		label: 'Standard',
		jp: '標準',
		blurb: 'Standard clock, ordered pad.',
		value: { clock: 'normal', order: 'grid', scope: 'section' }
	},
	{
		id: 'oni',
		label: 'Oni',
		jp: '鬼',
		blurb: 'Short clock, whole script, shuffled.',
		value: { clock: 'merciless', order: 'shuffled', scope: 'full' }
	}
];

export const difficulty = persisted('difficulty', PRESETS[1].value);

export function setDial(key, value) {
	difficulty.update((d) => ({ ...d, [key]: value }));
}

export function setPreset(id) {
	const p = PRESETS.find((x) => x.id === id);
	if (p) difficulty.set({ ...p.value });
}

export const presetId = derived(difficulty, ($d) => {
	const hit = PRESETS.find(
		(p) => p.value.clock === $d.clock && p.value.order === $d.order && p.value.scope === $d.scope
	);
	return hit ? hit.id : 'custom';
});

export const clockFactor = derived(difficulty, ($d) => {
	const c = CLOCKS.find((x) => x.id === $d.clock);
	return c ? c.factor : 1;
});

/**
 * The clock a drill actually runs with.
 * `clockIsTheGame` drills — Sixty Seconds — are only ever loosened by the
 * dial, never switched off: without a clock they stop being drills.
 */
export function secondsUnder(base, factor, { clockIsTheGame = false } = {}) {
	if (!base) return 0;
	const f = clockIsTheGame && factor === 0 ? 1.8 : factor;
	return f === 0 ? 0 : Math.round(base * f);
}
