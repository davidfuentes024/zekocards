import { get } from 'svelte/store';
import { record, startSession } from '$lib/stores/progress.js';
import { clockFactor, secondsUnder } from '$lib/stores/difficulty.js';

/**
 * Shared session bookkeeping for every mini-game.
 * Keeps the numbers the frame renders and pushes results into the
 * long-term mastery store.
 *
 * It also owns the clock. The clock is a dial, not a law: `seconds` is the
 * drill's own idea of a fair budget, and the learner's difficulty setting
 * stretches it, shrinks it, or removes it. Removing it never removes the
 * consequence of a miss — running out of time is a miss, not a skip.
 */
export function createDrill({ goal = 20, seconds = 0, clockIsTheGame = false } = {}) {
	let asked = $state(0);
	let correct = $state(0);
	let streak = $state(0);
	let best = $state(0);
	let feedback = $state(null);
	let lastMs = $state(0);
	let remainingMs = $state(0);
	let budgetMs = $state(0);
	const recent = $state([]);
	let t0 = Date.now();
	let ticker = null;
	let timeoutFn = null;

	startSession();

	function stopClock() {
		if (ticker) clearInterval(ticker);
		ticker = null;
	}

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
		get remainingMs() {
			return remainingMs;
		},
		get budgetMs() {
			return budgetMs;
		},
		get timed() {
			return budgetMs > 0;
		},

		/** The drill registers what should happen when the clock runs out. */
		set onTimeout(fn) {
			timeoutFn = fn;
		},

		/** Start the clock for a new question. */
		mark() {
			t0 = Date.now();
			stopClock();
			const budget = secondsUnder(seconds, get(clockFactor), { clockIsTheGame });
			budgetMs = budget * 1000;
			remainingMs = budgetMs;
			if (!budgetMs) return;
			ticker = setInterval(() => {
				remainingMs -= 100;
				if (remainingMs <= 0) {
					remainingMs = 0;
					stopClock();
					timeoutFn?.();
				}
			}, 100);
		},

		pauseClock: stopClock,

		remember(key) {
			recent.push(key);
			if (recent.length > 12) recent.shift();
		},
		answer(soundIds, ok) {
			stopClock();
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
		},
		dispose: stopClock
	};
}
