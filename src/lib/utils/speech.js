import { browser } from '$app/environment';

let voices = [];

function loadVoices() {
	if (!browser || !('speechSynthesis' in window)) return [];
	voices = window.speechSynthesis.getVoices();
	return voices;
}

if (browser && 'speechSynthesis' in window) {
	loadVoices();
	window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function hasSpeech() {
	return browser && 'speechSynthesis' in window;
}

/** True when the browser can actually pronounce Japanese. */
export function hasJapaneseVoice() {
	return !!japaneseVoice();
}

export function japaneseVoice() {
	if (!voices.length) loadVoices();
	return (
		voices.find((v) => v.lang === 'ja-JP') ??
		voices.find((v) => v.lang?.startsWith('ja')) ??
		null
	);
}

/** Speak Japanese text. Silently no-ops where the browser has no ja voice. */
export function say(text, { rate = 0.85, pitch = 1 } = {}) {
	if (!hasSpeech() || !text) return false;
	try {
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		const v = japaneseVoice();
		if (v) u.voice = v;
		u.lang = 'ja-JP';
		u.rate = rate;
		u.pitch = pitch;
		window.speechSynthesis.speak(u);
		return true;
	} catch {
		return false;
	}
}

export function stopSpeaking() {
	if (hasSpeech()) window.speechSynthesis.cancel();
}
