/* The training hall roster.
   Every drill answers with Japanese symbols or English meaning — never with
   a romaji transcription. What the answer pad holds is a difficulty dial. */
export const GAMES = [
	{
		id: 'blind',
		title: 'Blind Sound',
		jp: '音のみ',
		icon: 'ear',
		blurb: 'Hear a sound, pick the symbol.',
		needs: 'sounds'
	},
	{
		id: 'bridge',
		title: 'Script Bridge',
		jp: '対応',
		icon: 'shuffle',
		blurb: 'See one script, answer in the other.',
		needs: 'sounds'
	},
	{
		id: 'dictation',
		title: 'Word Dictation',
		jp: '書き取り',
		icon: 'keyboard',
		blurb: 'Hear a word, spell it in kana.',
		needs: 'words'
	},
	{
		id: 'build',
		title: 'Word Forge',
		jp: '組み立て',
		icon: 'brush',
		blurb: 'See the meaning, spell the word.',
		needs: 'words'
	},
	{
		id: 'words',
		title: 'Reading → Meaning',
		jp: '意味',
		icon: 'scroll',
		blurb: 'Read a word, type its meaning.',
		needs: 'words'
	},
	{
		id: 'lookalike',
		title: 'Look-alikes',
		jp: '紛らわしい字',
		icon: 'target',
		blurb: 'Tell look-alike symbols apart.',
		needs: 'sounds'
	},
	{
		id: 'anchor',
		title: 'Anchor Recall',
		jp: '連想',
		icon: 'pencil',
		blurb: 'Your own note, find the symbol.',
		needs: 'anchors'
	},
	{
		id: 'speed',
		title: 'Sixty Seconds',
		jp: '速読み',
		icon: 'flame',
		blurb: 'Audio in, symbol out, one minute.',
		needs: 'sounds'
	},
	{
		id: 'kanji',
		title: 'Kanji Grind',
		jp: '漢字',
		icon: 'seal',
		blurb: 'Kanji meanings and readings.',
		needs: 'kanji'
	}
];

export const GAME_BY_ID = new Map(GAMES.map((g) => [g.id, g]));
