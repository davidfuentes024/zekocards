/* ============================================================
   ZEKOCARDS · KANA CORE DATA
   One row per sound. Every sound carries both scripts so a card
   can be shown as hiragana, katakana, or both.
   Row format:  "hiragana|katakana|romaji|alt,alt"
   A "-" in a script slot means the sound has no form there.
   ============================================================ */

function parseRow(raw, columnId, groupId) {
	const [h, k, r, alts] = raw.split('|');
	return {
		id: `${groupId}:${r}:${h !== '-' ? h : k}`,
		h: h === '-' ? null : h,
		k: k === '-' ? null : k,
		r,
		alt: alts ? alts.split(',') : [],
		column: columnId,
		group: groupId
	};
}

function column(groupId, id, label, jp, rows) {
	return {
		id: `${groupId}-${id}`,
		key: id,
		label,
		jp,
		group: groupId,
		sounds: rows.map((row) => parseRow(row, `${groupId}-${id}`, groupId))
	};
}

/* ---------------- Gojūon — the 46 base sounds ---------------- */
export const GOJUON = [
	column('gojuon', 'a', 'A', 'あ行', ['あ|ア|a', 'い|イ|i', 'う|ウ|u', 'え|エ|e', 'お|オ|o']),
	column('gojuon', 'k', 'KA', 'か行', ['か|カ|ka', 'き|キ|ki', 'く|ク|ku', 'け|ケ|ke', 'こ|コ|ko']),
	column('gojuon', 's', 'SA', 'さ行', ['さ|サ|sa', 'し|シ|shi|si', 'す|ス|su', 'せ|セ|se', 'そ|ソ|so']),
	column('gojuon', 't', 'TA', 'た行', [
		'た|タ|ta',
		'ち|チ|chi|ti',
		'つ|ツ|tsu|tu',
		'て|テ|te',
		'と|ト|to'
	]),
	column('gojuon', 'n', 'NA', 'な行', ['な|ナ|na', 'に|ニ|ni', 'ぬ|ヌ|nu', 'ね|ネ|ne', 'の|ノ|no']),
	column('gojuon', 'h', 'HA', 'は行', [
		'は|ハ|ha',
		'ひ|ヒ|hi',
		'ふ|フ|fu|hu',
		'へ|ヘ|he',
		'ほ|ホ|ho'
	]),
	column('gojuon', 'm', 'MA', 'ま行', ['ま|マ|ma', 'み|ミ|mi', 'む|ム|mu', 'め|メ|me', 'も|モ|mo']),
	column('gojuon', 'y', 'YA', 'や行', ['や|ヤ|ya', 'ゆ|ユ|yu', 'よ|ヨ|yo']),
	column('gojuon', 'r', 'RA', 'ら行', ['ら|ラ|ra', 'り|リ|ri', 'る|ル|ru', 'れ|レ|re', 'ろ|ロ|ro']),
	column('gojuon', 'w', 'WA', 'わ行', ['わ|ワ|wa', 'を|ヲ|wo|o']),
	column('gojuon', 'nn', 'N', 'ん', ['ん|ン|n|nn,n\''])
];

/* ---------------- Dakuten & handakuten ---------------- */
export const DAKUTEN = [
	column('dakuten', 'g', 'GA', 'が行', ['が|ガ|ga', 'ぎ|ギ|gi', 'ぐ|グ|gu', 'げ|ゲ|ge', 'ご|ゴ|go']),
	column('dakuten', 'z', 'ZA', 'ざ行', [
		'ざ|ザ|za',
		'じ|ジ|ji|zi',
		'ず|ズ|zu',
		'ぜ|ゼ|ze',
		'ぞ|ゾ|zo'
	]),
	column('dakuten', 'd', 'DA', 'だ行', [
		'だ|ダ|da',
		'ぢ|ヂ|ji|di',
		'づ|ヅ|zu|du',
		'で|デ|de',
		'ど|ド|do'
	]),
	column('dakuten', 'b', 'BA', 'ば行', ['ば|バ|ba', 'び|ビ|bi', 'ぶ|ブ|bu', 'べ|ベ|be', 'ぼ|ボ|bo']),
	column('dakuten', 'p', 'PA', 'ぱ行', ['ぱ|パ|pa', 'ぴ|ピ|pi', 'ぷ|プ|pu', 'ぺ|ペ|pe', 'ぽ|ポ|po'])
];

/* ---------------- Yōon — contracted sounds ---------------- */
export const YOON = [
	column('yoon', 'ky', 'KYA', 'きゃ行', ['きゃ|キャ|kya', 'きゅ|キュ|kyu', 'きょ|キョ|kyo']),
	column('yoon', 'gy', 'GYA', 'ぎゃ行', ['ぎゃ|ギャ|gya', 'ぎゅ|ギュ|gyu', 'ぎょ|ギョ|gyo']),
	column('yoon', 'sh', 'SHA', 'しゃ行', [
		'しゃ|シャ|sha|sya',
		'しゅ|シュ|shu|syu',
		'しょ|ショ|sho|syo'
	]),
	column('yoon', 'j', 'JA', 'じゃ行', ['じゃ|ジャ|ja|jya,zya', 'じゅ|ジュ|ju|jyu,zyu', 'じょ|ジョ|jo|jyo,zyo']),
	column('yoon', 'ch', 'CHA', 'ちゃ行', [
		'ちゃ|チャ|cha|tya',
		'ちゅ|チュ|chu|tyu',
		'ちょ|チョ|cho|tyo'
	]),
	column('yoon', 'ny', 'NYA', 'にゃ行', ['にゃ|ニャ|nya', 'にゅ|ニュ|nyu', 'にょ|ニョ|nyo']),
	column('yoon', 'hy', 'HYA', 'ひゃ行', ['ひゃ|ヒャ|hya', 'ひゅ|ヒュ|hyu', 'ひょ|ヒョ|hyo']),
	column('yoon', 'by', 'BYA', 'びゃ行', ['びゃ|ビャ|bya', 'びゅ|ビュ|byu', 'びょ|ビョ|byo']),
	column('yoon', 'py', 'PYA', 'ぴゃ行', ['ぴゃ|ピャ|pya', 'ぴゅ|ピュ|pyu', 'ぴょ|ピョ|pyo']),
	column('yoon', 'my', 'MYA', 'みゃ行', ['みゃ|ミャ|mya', 'みゅ|ミュ|myu', 'みょ|ミョ|myo']),
	column('yoon', 'ry', 'RYA', 'りゃ行', ['りゃ|リャ|rya', 'りゅ|リュ|ryu', 'りょ|リョ|ryo'])
];

/* ---------------- Katakana-only extended sounds ----------------
   Used almost exclusively for loanwords. No hiragana counterpart. */
export const EXTENDED = [
	column('extended', 'f', 'FA', 'ファ行', ['-|ファ|fa', '-|フィ|fi', '-|フェ|fe', '-|フォ|fo']),
	column('extended', 'v', 'VA', 'ヴァ行', ['-|ヴ|vu', '-|ヴァ|va', '-|ヴィ|vi', '-|ヴェ|ve', '-|ヴォ|vo']),
	column('extended', 'w2', 'WI', 'ウィ行', ['-|ウィ|wi', '-|ウェ|we', '-|ウォ|wo2|wo']),
	column('extended', 'td', 'TI', 'ティ行', ['-|ティ|ti', '-|ディ|di', '-|デュ|dyu', '-|トゥ|tu', '-|ドゥ|du']),
	column('extended', 'ce', 'CHE', 'シェ行', ['-|シェ|she', '-|ジェ|je', '-|チェ|che']),
	column('extended', 'ts', 'TSA', 'ツァ行', ['-|ツァ|tsa', '-|ツィ|tsi', '-|ツェ|tse', '-|ツォ|tso'])
];

export const GROUPS = [
	{
		id: 'gojuon',
		label: 'Gojūon',
		jp: '五十音',
		blurb: 'The 46 base syllables. Everything else is built on top of these.',
		columns: GOJUON
	},
	{
		id: 'dakuten',
		label: 'Dakuten',
		jp: '濁音',
		blurb: 'Voiced marks — two strokes or a small circle change the consonant.',
		columns: DAKUTEN
	},
	{
		id: 'yoon',
		label: 'Yōon',
		jp: '拗音',
		blurb: 'A small ya / yu / yo glued on: two symbols, one beat.',
		columns: YOON
	},
	{
		id: 'extended',
		label: 'Extended katakana',
		jp: '外来音',
		blurb: 'Katakana-only combinations invented to spell foreign words.',
		columns: EXTENDED
	}
];

export const ALL_COLUMNS = GROUPS.flatMap((g) => g.columns);
export const ALL_SOUNDS = ALL_COLUMNS.flatMap((c) => c.sounds);

/* ---------------- Lookup maps ---------------- */
export const SOUND_BY_ID = new Map(ALL_SOUNDS.map((s) => [s.id, s]));
export const COLUMN_BY_ID = new Map(ALL_COLUMNS.map((c) => [c.id, c]));

/** Every kana glyph (either script) mapped to its sound record. */
export const KANA_INDEX = (() => {
	const m = new Map();
	for (const s of ALL_SOUNDS) {
		if (s.h && !m.has(s.h)) m.set(s.h, s);
		if (s.k && !m.has(s.k)) m.set(s.k, s);
	}
	return m;
})();

/** Longest kana token first, so combos win over singles when parsing. */
const TOKEN_KEYS = [...KANA_INDEX.keys()].sort((a, b) => b.length - a.length);

/** Characters that never need to be "unlocked": small tsu, long mark, punctuation. */
export const NEUTRAL_CHARS = new Set(['っ', 'ッ', 'ー', '・', '　', ' ', '、', '。', '〜']);

/**
 * Split a kana string into sound records.
 * Returns { units, unknown } where units keep neutral chars as {raw, neutral:true}.
 */
export function tokenize(text) {
	const units = [];
	let unknown = false;
	let i = 0;
	outer: while (i < text.length) {
		const ch = text[i];
		if (NEUTRAL_CHARS.has(ch)) {
			units.push({ raw: ch, neutral: true });
			i += 1;
			continue;
		}
		for (const key of TOKEN_KEYS) {
			if (text.startsWith(key, i)) {
				units.push({ raw: key, sound: KANA_INDEX.get(key) });
				i += key.length;
				continue outer;
			}
		}
		unknown = true;
		units.push({ raw: ch, neutral: true });
		i += 1;
	}
	return { units, unknown };
}

/** All accepted romaji spellings for a sound, lowercase. */
export function acceptedRomaji(sound) {
	return [sound.r, ...sound.alt].map((x) => x.toLowerCase());
}

/**
 * Every sound that exists in a script. This is the answer pool for the
 * drills: distractors are never limited to what the learner selected,
 * so a symbol can never be identified by elimination.
 */
export function scriptSounds(script) {
	return ALL_SOUNDS.filter((s) => (script === 'hiragana' ? s.h : s.k));
}

/* ---------------- The answer pad ----------------
   The pad always holds a complete, publicly-defined section of the script.
   That is what makes elimination impossible — not the order it is drawn in,
   and not how many groups it covers. Both of those are display choices that
   depend on the learner, never on the answer. */

/** The order the groups are learned in. `section` scope walks this list. */
export const GROUP_ORDER = ['gojuon', 'dakuten', 'yoon', 'extended'];

/**
 * The groups a pad covers.
 * It grows in whole groups as the learner's selection reaches further in, so
 * a beginner holding five vowels faces the 46 gojūon rather than all 128
 * symbols — and still cannot tell which of the 46 is being asked for.
 */
export function padGroups(selectedIds, scope = 'section') {
	if (scope === 'full') return GROUP_ORDER;
	let reach = 0;
	for (const id of selectedIds ?? []) {
		const sound = SOUND_BY_ID.get(id);
		const i = sound ? GROUP_ORDER.indexOf(sound.group) : -1;
		if (i > reach) reach = i;
	}
	return GROUP_ORDER.slice(0, reach + 1);
}

/** The あいうえお column a sound belongs in, read off its own romaji. */
export function vowelSlot(sound) {
	for (let i = sound.r.length - 1; i >= 0; i -= 1) {
		const v = 'aiueo'.indexOf(sound.r[i]);
		if (v >= 0) return v;
	}
	return 0; // ん has no vowel and takes the first slot
}

/**
 * Lay a set of sounds out as the kana table: one row per column of the
 * script, every sound under its own vowel. When a column holds two sounds
 * with the same vowel — ティ and ディ are both in the i column — the column
 * simply continues on the next line rather than lying about where a symbol
 * belongs.
 */
export function gridRows(sounds, script) {
	const allowed = new Set(sounds.map((s) => s.id));
	const rows = [];
	for (const col of ALL_COLUMNS) {
		let slots = [null, null, null, null, null];
		let label = col.jp;
		let used = false;
		for (const s of col.sounds) {
			if (!allowed.has(s.id) || !glyphOf(s, script)) continue;
			const slot = vowelSlot(s);
			if (slots[slot]) {
				rows.push({ id: `${col.id}-${rows.length}`, label, slots });
				slots = [null, null, null, null, null];
				label = '';
			}
			slots[slot] = s;
			used = true;
		}
		if (used) rows.push({ id: `${col.id}-${rows.length}`, label, slots });
	}
	return rows;
}

/** The glyph of a sound in a given script. */
export function glyphOf(sound, script) {
	return script === 'hiragana' ? sound.h : sound.k;
}

export const SCRIPTS = [
	{ id: 'hiragana', label: 'Hiragana', jp: 'ひらがな' },
	{ id: 'katakana', label: 'Katakana', jp: 'カタカナ' }
];

/** Sounds that are genuinely hard to tell apart — used by the Look-alike drill. */
export const CONFUSION_SETS = [
	{ id: 'shi-tsu', script: 'katakana', glyphs: ['シ', 'ツ', 'ソ', 'ン'], note: 'Stroke direction and angle decide everything here.' },
	{ id: 'so-n', script: 'hiragana', glyphs: ['そ', 'ろ', 'ふ'], note: 'Watch where the line turns back on itself.' },
	{ id: 'ne-re-wa', script: 'hiragana', glyphs: ['ね', 'れ', 'わ'], note: 'Same left post, three different tails.' },
	{ id: 'nu-me', script: 'hiragana', glyphs: ['ぬ', 'め', 'あ', 'む'], note: 'Only the loop tells them apart.' },
	{ id: 'ki-sa', script: 'hiragana', glyphs: ['き', 'さ', 'ち'], note: 'Count the crossbars, then check the curve.' },
	{ id: 'ru-ro', script: 'hiragana', glyphs: ['る', 'ろ'], note: 'One ends in a loop, one does not.' },
	{ id: 'ha-ho', script: 'hiragana', glyphs: ['は', 'ほ', 'ま'], note: 'Crossbars again — one, two, or a loop.' },
	{ id: 'ka-ke', script: 'katakana', glyphs: ['カ', 'ケ', 'ク', 'タ'], note: 'Short strokes in different corners.' },
	{ id: 'ma-mu', script: 'katakana', glyphs: ['マ', 'ム', 'ヌ', 'メ'], note: 'The extra stroke is the whole difference.' },
	{ id: 'ko-yu', script: 'katakana', glyphs: ['コ', 'ユ', 'エ', 'ヨ'], note: 'Boxy shapes; look at the open side.' },
	{ id: 'a-o', script: 'katakana', glyphs: ['ア', 'オ', 'ワ', 'ウ'], note: 'Roof plus tail combinations.' },
	{ id: 'nu-su', script: 'katakana', glyphs: ['ヌ', 'ス', 'ラ', 'ヲ'], note: 'Diagonals crossing or not crossing.' }
];
