/* ============================================================
   ZEKOCARDS · KANA PRONUNCIATION OVERRIDES
   Keyed by romaji. Everything not listed here is rendered from
   its katakana glyph, which neural TTS reads as a plain mora.

   Only add a row here when the default is demonstrably WRONG,
   and only after listening to it. Each row must say why.

   Fields:
     text  plain text to send instead of the katakana glyph
     ssml  full <phoneme> element, wins over `text`
     read  what the ASR gate should expect to hear back
   ============================================================ */

const ipa = (ph, read) => ({
	ssml: `<phoneme alphabet="ipa" ph="${ph}">${read}</phoneme>`,
	read
});

export const KANA_OVERRIDES = {
	/* ヲ is pronounced /o/ in modern Japanese, so the engine says "o"
	   and the card teaching "wo" contradicts its own audio. The app
	   teaches the textbook value, so we force it. */
	wo: ipa('wo', 'ヲ'),

	/* Lone ン has no vowel. Engines either swallow it or append one.
	   The moraic nasal spelled out keeps it audible. */
	n: ipa('ɴ', 'ン'),

	/* ヂ and ヅ are merged with ジ / ズ by every engine. That merger is
	   correct modern Japanese, so we do NOT override them — but the
	   verifier is told to expect the merged reading rather than flag
	   ~1 400 false positives. */
	di: { text: 'ヂ', read: 'ジ' },
	du: { text: 'ヅ', read: 'ズ' }
};

/* Sounds that must be signed off by ear before shipping, even when the
   ASR gate passes them. These are the morae where ASR and human hearing
   are known to disagree. */
export const EAR_CHECK = ['wo', 'n', 'di', 'du', 'fu', 'tsu', 'ryu', 'ryo', 'rya'];
