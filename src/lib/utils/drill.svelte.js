import { record, startSession } from '$lib/stores/progress.js';

/**
 * Shared session bookkeeping for every mini-game.
 * Keeps the numbers the frame renders and pushes results into the
 * long-term mastery store.
 */
export function createDrill({ goal = 20 } = {}) {
	let asked = $state(0);
	let correct = $state(0);
	let streak = $state(0);
	let best = $state(0);
	let feedback = $state(null);
	let lastMs = $state(0);
	const recent = $state([]);
	let t0 = Date.now();

	startSession();

	return {
		get asked() {
			return asked;
		},
		get correct() {
			return correct;
		},
		get streak() {
			return streak;
		},
		get best() {
			return best;
		},
		get feedback() {
			return feedback;
		},
		get goal() {
			return goal;
		},
		get recent() {
			return recent;
		},
		get lastMs() {
			return lastMs;
		},
		mark() {
			t0 = Date.now();
		},
		remember(key) {
			recent.push(key);
			if (recent.length > 12) recent.shift();
		},
		answer(soundIds, ok) {
			const ms = Date.now() - t0;
			lastMs = ms;
			asked += 1;
			if (ok) {
				correct += 1;
				streak += 1;
				best = Math.max(best, streak);
			} else {
				streak = 0;
			}
			for (const id of [].concat(soundIds)) if (id) record(id, ok, ms);
			feedback = ok ? 'ok' : 'bad';
			return ok;
		},
		clearFeedback() {
			feedback = null;
		},
		setFeedback(v) {
			feedback = v;
		}
	};
}
