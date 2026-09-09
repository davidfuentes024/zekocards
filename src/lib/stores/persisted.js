import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

const NS = 'zekocards:v1:';

/**
 * A writable store mirrored into localStorage.
 * Everything Zekocards remembers lives here — no account, no server.
 */
export function persisted(key, initial, { serialize, deserialize } = {}) {
	const full = NS + key;
	const ser = serialize ?? JSON.stringify;
	const de = deserialize ?? JSON.parse;

	let start = initial;
	if (browser) {
		try {
			const raw = localStorage.getItem(full);
			if (raw !== null) start = de(raw);
		} catch {
			start = initial;
		}
	}

	const store = writable(start);

	if (browser) {
		store.subscribe((value) => {
			try {
				localStorage.setItem(full, ser(value));
			} catch {
				/* storage full or blocked — the app keeps working in memory */
			}
		});
	}

	return {
		...store,
		reset: () => store.set(structuredClone(initial)),
		peek: () => get(store)
	};
}

/** Set <-> array bridge so Sets survive JSON. */
export function persistedSet(key, initial = []) {
	return persisted(key, new Set(initial), {
		serialize: (s) => JSON.stringify([...s]),
		deserialize: (raw) => new Set(JSON.parse(raw))
	});
}

export function clearAll() {
	if (!browser) return;
	Object.keys(localStorage)
		.filter((k) => k.startsWith(NS))
		.forEach((k) => localStorage.removeItem(k));
}
