import { derived } from 'svelte/store';
import { persisted } from './persisted.js';

/**
 * The learner's own anchor word for each sound.
 * "ね looks like a cat's tail → NEko."  Written by hand, stored locally,
 * and then quizzed back at them in the Anchor drill.
 */
export const anchors = persisted('anchors', {});

export function setAnchor(soundId, patch) {
	anchors.update((all) => {
		const prev = all[soundId] ?? { word: '', note: '', updated: 0 };
		const next = { ...prev, ...patch, updated: Date.now() };
		if (!next.word && !next.note) {
			const copy = { ...all };
			delete copy[soundId];
			return copy;
		}
		return { ...all, [soundId]: next };
	});
}

export function clearAnchor(soundId) {
	anchors.update((all) => {
		const copy = { ...all };
		delete copy[soundId];
		return copy;
	});
}

export const anchorCount = derived(anchors, ($a) => Object.keys($a).length);
