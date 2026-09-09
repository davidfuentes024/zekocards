export function shuffle(arr, rng = Math.random) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function pick(arr, rng = Math.random) {
	return arr[Math.floor(rng() * arr.length)];
}

/** Weighted pick — the engine behind "you keep seeing what you keep missing". */
export function weightedPick(items, weightFn, rng = Math.random) {
	const weights = items.map(weightFn);
	const total = weights.reduce((a, b) => a + b, 0);
	if (total <= 0) return pick(items, rng);
	let r = rng() * total;
	for (let i = 0; i < items.length; i += 1) {
		r -= weights[i];
		if (r <= 0) return items[i];
	}
	return items[items.length - 1];
}

/**
 * Weighted pick that refuses to repeat anything in `recent`,
 * unless the pool is too small to avoid it.
 */
export function nextPrompt(items, weightFn, recent = [], gap = 4) {
	const blocked = new Set(recent.slice(-gap));
	const pool = items.filter((i) => !blocked.has(i));
	return weightedPick(pool.length ? pool : items, weightFn);
}
