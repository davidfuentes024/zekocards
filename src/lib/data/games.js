/* The training hall roster.
   Every drill answers with Japanese symbols or English meaning — never with
   a romaji transcription — and every answer pad shows the complete script,
   reshuffled, so nothing can be solved by position or elimination. */
export const GAMES = [
	{
		id: 'blind',
		title: 'Blind Sound',
		jp: '音のみ',
		icon: 'ear',
		blurb: 'You only hear it. Find the symbol on a pad holding every kana in the script.',
		needs: 'sounds'
	},
	{
		id: 'bridge',
		title: 'Script Bridge',
		jp: '対応',
		icon: 'shuffle',
		blurb: 'See a symbol in one script, produce the same sound in the other. No romaji anywhere.',
		needs: 'sounds'
	},
	{
		id: 'dictation',
		title: 'Word Dictation',
		jp: '書き取り',
		icon: 'keyboard',
		blurb: 'One spoken word. Spell it out of the full grid, symbol by symbol.',
		needs: 'words'
	},
	{
		id: 'build',
		title: 'Word Forge',
		jp: '組み立て',
		icon: 'brush',
		blurb: 'Only the meaning is given. Write the word in kana from the complete pad.',
		needs: 'words'
	},
	{
		id: 'words',
		title: 'Reading → Meaning',
		jp: '意味',
		icon: 'scroll',
		blurb: 'Read the Japanese and say what it means. Comprehension, not transcription.',
		needs: 'words'
	},
	{
		id: 'lookalike',
		title: 'Look-alikes',
		jp: '紛らわしい字',
		icon: 'target',
		blurb: 'シ ツ ソ ン and the rest — identify which one you got, then produce it.',
		needs: 'sounds'
	},
	{
		id: 'anchor',
		title: 'Anchor Recall',
		jp: '連想',
		icon: 'pencil',
		blurb: 'Your own written association, with the symbol removed.',
		needs: 'anchors'
	},
	{
		id: 'speed',
		title: 'Sixty Seconds',
		jp: '速読み',
		icon: 'flame',
		blurb: 'Audio in, symbol out, one minute. No time to reason it out.',
		needs: 'sounds'
	},
	{
		id: 'kanji',
		title: 'Kanji Grind',
		jp: '漢字',
		icon: 'seal',
		blurb: 'Meanings in English, readings spelled out in kana on the full grid.',
		needs: 'kanji'
	}
];

export const GAME_BY_ID = new Map(GAMES.map((g) => [g.id, g]));
