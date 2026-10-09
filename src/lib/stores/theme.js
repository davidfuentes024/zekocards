import { browser } from '$app/environment';
import { writable } from 'svelte/store';

/** 'system' follows the OS; 'light' and 'dark' are the hidden manual override. */
const ORDER = ['system', 'light', 'dark'];
const KEY = 'zekocards:theme';

function read() {
	if (!browser) return 'system';
	try {
		const v = localStorage.getItem(KEY);
		return ORDER.includes(v) ? v : 'system';
	} catch {
		return 'system';
	}
}

function apply(mode) {
	if (!browser) return;
	const root = document.documentElement;
	if (mode === 'system') root.removeAttribute('data-theme');
	else root.setAttribute('data-theme', mode);
}

export const theme = writable(read());

if (browser) {
	apply(read());
	theme.subscribe((mode) => {
		apply(mode);
		try {
			localStorage.setItem(KEY, mode);
		} catch {
			/* private mode: the override just lasts for the session */
		}
	});
}

