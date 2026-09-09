/* The training hall roster. Order here is the order shown everywhere. */
export const GAMES = [
	{
		id: 'recall',
		title: 'Sound Recall',
		jp: '音読み',
		icon: 'eye',
		blurb: 'See the character, type the reading. Miss it and you type the answer before moving on.',
		needs: 'sounds'
	},
	{
		id: 'produce',
		title: 'Kana Production',
		jp: '書き取り',
		icon: 'keyboard',
		blurb: 'Given a sound, find the character among every sound you study. No shortlists.',
		needs: 'sounds'
	},
	{
		id: 'words',
		title: 'Word Reading',
		jp: '単語読み',
		icon: 'scroll',
		blurb: 'Whole words made only from your selection. Read them, type the full reading.',
		needs: 'words'
	},
	{
		id: 'build',
		title: 'Word Forge',
		jp: '組み立て',
		icon: 'brush',
		blurb: 'Spell a word kana by kana from the full pad. Wrong keys simply refuse to land.',
		needs: 'words'
	},
	{
		id: 'listen',
		title: 'Ear Training',
		jp: '聞き取り',
		icon: 'ear',
		blurb: 'Audio first, characters after. Sounds or whole words, your choice.',
		needs: 'sounds'
	},
	{
		id: 'lookalike',
		title: 'Look-alikes',
		jp: '紛らわしい字',
		icon: 'target',
		blurb: 'シ ツ ソ ン and every other pair that ruins beginners, drilled side by side.',
		needs: 'sounds'
	},
	{
		id: 'anchor',
		title: 'Anchor Recall',
		jp: '連想',
		icon: 'pencil',
		blurb: 'Your own written associations, played back as the only clue.',
		needs: 'anchors'
	},
	{
		id: 'speed',
		title: 'Sixty Seconds',
		jp: '速読み',
		icon: 'flame',
		blurb: 'A one-minute sprint. Recognition, not decoding.',
		needs: 'sounds'
	},
	{
		id: 'kanji',
		title: 'Kanji Grind',
		jp: '漢字',
		icon: 'seal',
		blurb: 'Meanings and readings, with every reading written in kana you already know.',
		needs: 'kanji'
	}
];

export const GAME_BY_ID = new Map(GAMES.map((g) => [g.id, g]));
