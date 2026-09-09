import { tokenize, acceptedRomaji } from '$lib/data/kana.js';

const MACRONS = { ā: 'aa', ī: 'ii', ū: 'uu', ē: 'ee', ō: 'ou', â: 'aa', î: 'ii', û: 'uu', ê: 'ee', ô: 'ou' };

export function normalize(input) {
	return String(input ?? '')
		.trim()
		.toLowerCase()
		.replace(/[āīūēōâîûêô]/g, (c) => MACRONS[c] ?? c)
		.replace(/[^a-z']/g, '');
}

/** Collapse long vowels so "toukyou" and "tokyo" both pass. */
function loose(s) {
	return s
		.replace(/ou/g, 'o')
		.replace(/oo/g, 'o')
		.replace(/uu/g, 'u')
		.replace(/ee/g, 'e')
		.replace(/aa/g, 'a')
		.replace(/ii/g, 'i')
		.replace(/n'/g, 'n');
}

/** Build romaji straight from the kana, so it always matches the tables. */
export function romajiFromKana(kana) {
	const { units } = tokenize(kana);
	let out = '';
	units.forEach((u, i) => {
		if (u.sound) {
			out += u.sound.r;
			return;
		}
		if (u.raw === 'っ' || u.raw === 'ッ') {
			const next = units[i + 1];
			out += next?.sound ? next.sound.r[0] : '';
			return;
		}
		if (u.raw === 'ー') {
			out += out.slice(-1);
			return;
		}
		if (u.raw === ' ' || u.raw === '　' || u.raw === '・') out += ' ';
	});
	return out;
}

/** Does `input` count as a correct romaji reading of this sound? */
export function checkSound(input, sound, { strict = false } = {}) {
	const n = normalize(input);
	if (!n) return false;
	const ok = acceptedRomaji(sound);
	if (ok.includes(n)) return true;
	return !strict && ok.some((c) => loose(c) === loose(n));
}

/** Does `input` count as a correct romaji reading of this word? */
export function checkWord(input, word, { strict = false } = {}) {
	const n = normalize(input);
	if (!n) return false;
	const candidates = new Set([normalize(word.romaji), normalize(romajiFromKana(word.kana))]);
	if (candidates.has(n)) return true;
	if (strict) return false;
	const l = loose(n);
	return [...candidates].some((c) => loose(c) === l);
}

/** Meaning check: any of the "/" or "," separated glosses, ignoring articles. */
export function checkMeaning(input, english) {
	const clean = (s) =>
		s
			.toLowerCase()
			.replace(/\(.*?\)/g, '')
			.replace(/\b(a|an|the|to|of)\b/g, '')
			.replace(/[^a-z ]/g, '')
			.replace(/\s+/g, ' ')
			.trim();
	const target = english.split(/[,/;]/).map(clean).filter(Boolean);
	return target.includes(clean(input));
}
