import { persisted } from './persisted.js';

export const settings = persisted('settings', {
	showRomajiOnCards: false,
	speechRate: 0.85,
	autoAdvance: true,
	sessionLength: 20,
	strictRomaji: false,
	petals: true,
	zekoReactions: true
});

export function updateSetting(key, value) {
	settings.update((s) => ({ ...s, [key]: value }));
}
