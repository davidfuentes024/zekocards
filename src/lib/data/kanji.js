/* ============================================================
   ZEKOCARDS · KANJI DATA
   Row: "kanji|meaning|on readings|kun readings|strokes|level|examples"
   Readings are written in kana on purpose: kanji study here always
   loops back to the kana you already drilled.
   Examples: "word かな = english; ..."
   ============================================================ */

const RAW = [
	'一|one|イチ,イツ|ひと|1|N5|一つ ひとつ = one thing; 一月 いちがつ = January',
	'二|two|ニ|ふた|2|N5|二つ ふたつ = two things; 二人 ふたり = two people',
	'三|three|サン|み|3|N5|三つ みっつ = three things; 三月 さんがつ = March',
	'四|four|シ|よん,よ|5|N5|四つ よっつ = four things; 四月 しがつ = April',
	'五|five|ゴ|いつ|4|N5|五つ いつつ = five things; 五月 ごがつ = May',
	'六|six|ロク|む|4|N5|六つ むっつ = six things; 六月 ろくがつ = June',
	'七|seven|シチ|なな|2|N5|七つ ななつ = seven things; 七月 しちがつ = July',
	'八|eight|ハチ|や|2|N5|八つ やっつ = eight things; 八月 はちがつ = August',
	'九|nine|キュウ,ク|ここの|2|N5|九つ ここのつ = nine things; 九月 くがつ = September',
	'十|ten|ジュウ|とお|2|N5|十日 とおか = tenth day; 十月 じゅうがつ = October',
	'百|hundred|ヒャク|-|6|N5|百円 ひゃくえん = 100 yen',
	'千|thousand|セン|ち|3|N5|千円 せんえん = 1000 yen',
	'万|ten thousand|マン,バン|-|3|N5|一万 いちまん = ten thousand',
	'円|circle, yen|エン|まる|4|N5|円い まるい = round',
	'日|day, sun|ニチ,ジツ|ひ,か|4|N5|日本 にほん = Japan; 毎日 まいにち = every day',
	'月|moon, month|ゲツ,ガツ|つき|4|N5|月曜日 げつようび = Monday',
	'火|fire|カ|ひ|4|N5|火曜日 かようび = Tuesday',
	'水|water|スイ|みず|4|N5|水曜日 すいようび = Wednesday',
	'木|tree, wood|モク,ボク|き|4|N5|木曜日 もくようび = Thursday',
	'金|gold, money|キン,コン|かね|8|N5|金曜日 きんようび = Friday; お金 おかね = money',
	'土|earth, soil|ド,ト|つち|3|N5|土曜日 どようび = Saturday',
	'年|year|ネン|とし|6|N5|今年 ことし = this year',
	'時|time, hour|ジ|とき|10|N5|時間 じかん = time',
	'分|minute, divide|フン,ブン|わ|4|N5|分かる わかる = to understand',
	'半|half|ハン|なか|5|N5|半分 はんぶん = half',
	'今|now|コン,キン|いま|4|N5|今日 きょう = today',
	'週|week|シュウ|-|11|N5|今週 こんしゅう = this week',
	'間|interval|カン,ケン|あいだ|12|N5|時間 じかん = time',
	'朝|morning|チョウ|あさ|12|N5|朝ご飯 あさごはん = breakfast',
	'昼|noon|チュウ|ひる|9|N5|昼休み ひるやすみ = lunch break',
	'夜|night|ヤ|よる|8|N5|今夜 こんや = tonight',
	'前|before, front|ゼン|まえ|9|N5|名前 なまえ = name',
	'後|after, behind|ゴ,コウ|あと,うし|9|N5|午後 ごご = afternoon',
	'午|noon|ゴ|-|4|N5|午前 ごぜん = morning',
	'毎|every|マイ|-|6|N5|毎朝 まいあさ = every morning',
	'人|person|ジン,ニン|ひと|2|N5|日本人 にほんじん = Japanese person',
	'男|man|ダン,ナン|おとこ|7|N5|男の人 おとこのひと = man',
	'女|woman|ジョ|おんな|3|N5|女の子 おんなのこ = girl',
	'子|child|シ|こ|3|N5|子供 こども = child',
	'父|father|フ|ちち|4|N5|お父さん おとうさん = father',
	'母|mother|ボ|はは|5|N5|お母さん おかあさん = mother',
	'兄|older brother|ケイ|あに|5|N5|お兄さん おにいさん = older brother',
	'姉|older sister|シ|あね|8|N5|お姉さん おねえさん = older sister',
	'弟|younger brother|テイ|おとうと|7|N5|弟 おとうと = younger brother',
	'妹|younger sister|マイ|いもうと|8|N5|妹 いもうと = younger sister',
	'友|friend|ユウ|とも|4|N5|友達 ともだち = friend',
	'名|name|メイ|な|6|N5|有名 ゆうめい = famous',
	'先|previous, ahead|セン|さき|6|N5|先生 せんせい = teacher',
	'生|life, birth|セイ,ショウ|い,う|5|N5|学生 がくせい = student',
	'学|study|ガク|まな|8|N5|学校 がっこう = school',
	'校|school|コウ|-|10|N5|高校 こうこう = high school',
	'語|language|ゴ|かた|14|N5|日本語 にほんご = Japanese',
	'話|talk|ワ|はな|13|N5|電話 でんわ = telephone',
	'読|read|ドク|よ|14|N5|読む よむ = to read',
	'書|write|ショ|か|10|N5|書く かく = to write',
	'聞|hear, ask|ブン|き|14|N5|新聞 しんぶん = newspaper',
	'見|see|ケン|み|7|N5|見る みる = to see',
	'言|say|ゲン|い|7|N5|言葉 ことば = word',
	'行|go|コウ,ギョウ|い|6|N5|銀行 ぎんこう = bank',
	'来|come|ライ|く|7|N5|来週 らいしゅう = next week',
	'帰|return|キ|かえ|10|N5|帰る かえる = to go home',
	'入|enter|ニュウ|はい,い|2|N5|入口 いりぐち = entrance',
	'出|exit|シュツ|で,だ|5|N5|出口 でぐち = exit',
	'食|eat|ショク|た|9|N5|食べる たべる = to eat',
	'飲|drink|イン|の|12|N5|飲む のむ = to drink',
	'買|buy|バイ|か|12|N5|買う かう = to buy',
	'立|stand|リツ|た|5|N5|立つ たつ = to stand',
	'休|rest|キュウ|やす|6|N5|休む やすむ = to rest',
	'働|work|ドウ|はたら|13|N4|働く はたらく = to work',
	'車|car|シャ|くるま|7|N5|電車 でんしゃ = train',
	'電|electricity|デン|-|13|N5|電気 でんき = electricity',
	'気|spirit, air|キ,ケ|-|6|N5|元気 げんき = healthy',
	'天|heaven, sky|テン|あま|4|N5|天気 てんき = weather',
	'空|sky, empty|クウ|そら,から|8|N5|空港 くうこう = airport',
	'雨|rain|ウ|あめ|8|N5|雨降り あめふり = rainfall',
	'雪|snow|セツ|ゆき|11|N4|大雪 おおゆき = heavy snow',
	'風|wind|フウ|かぜ|9|N4|台風 たいふう = typhoon',
	'山|mountain|サン|やま|3|N5|富士山 ふじさん = Mt Fuji',
	'川|river|セン|かわ|3|N5|川口 かわぐち = river mouth',
	'海|sea|カイ|うみ|9|N5|海外 かいがい = overseas',
	'花|flower|カ|はな|7|N5|花火 はなび = fireworks',
	'魚|fish|ギョ|さかな|11|N5|金魚 きんぎょ = goldfish',
	'鳥|bird|チョウ|とり|11|N5|小鳥 ことり = little bird',
	'犬|dog|ケン|いぬ|4|N5|子犬 こいぬ = puppy',
	'猫|cat|ビョウ|ねこ|11|N4|子猫 こねこ = kitten',
	'牛|cow|ギュウ|うし|4|N4|牛肉 ぎゅうにく = beef',
	'馬|horse|バ|うま|10|N4|馬車 ばしゃ = carriage',
	'白|white|ハク|しろ|5|N5|白い しろい = white',
	'黒|black|コク|くろ|11|N4|黒い くろい = black',
	'赤|red|セキ|あか|7|N5|赤い あかい = red',
	'青|blue|セイ|あお|8|N5|青い あおい = blue',
	'色|colour|ショク|いろ|6|N4|茶色 ちゃいろ = brown',
	'大|big|ダイ,タイ|おお|3|N5|大学 だいがく = university',
	'小|small|ショウ|ちい,こ|3|N5|小さい ちいさい = small',
	'中|middle, inside|チュウ|なか|4|N5|中学 ちゅうがく = middle school',
	'長|long, chief|チョウ|なが|8|N5|社長 しゃちょう = company head',
	'高|tall, expensive|コウ|たか|10|N5|高校 こうこう = high school',
	'安|cheap, safe|アン|やす|6|N5|安い やすい = cheap',
	'新|new|シン|あたら|13|N5|新聞 しんぶん = newspaper',
	'古|old|コ|ふる|5|N5|中古 ちゅうこ = second hand',
	'多|many|タ|おお|6|N5|多い おおい = many',
	'少|few|ショウ|すく,すこ|4|N5|少し すこし = a little',
	'早|early|ソウ|はや|6|N5|早い はやい = early',
	'上|up, above|ジョウ|うえ,あ|3|N5|上手 じょうず = skilled',
	'下|down, below|カ,ゲ|した,さ|3|N5|下手 へた = unskilled',
	'右|right|ウ,ユウ|みぎ|5|N5|右手 みぎて = right hand',
	'左|left|サ|ひだり|5|N5|左手 ひだりて = left hand',
	'北|north|ホク|きた|5|N5|北口 きたぐち = north exit',
	'南|south|ナン|みなみ|9|N5|南口 みなみぐち = south exit',
	'東|east|トウ|ひがし|8|N5|東京 とうきょう = Tokyo',
	'西|west|セイ,サイ|にし|6|N5|西口 にしぐち = west exit',
	'外|outside|ガイ|そと|5|N5|外国 がいこく = foreign country',
	'内|inside|ナイ|うち|4|N4|案内 あんない = guidance',
	'国|country|コク|くに|8|N5|中国 ちゅうごく = China',
	'家|house, family|カ|いえ|10|N5|家族 かぞく = family',
	'店|shop|テン|みせ|8|N5|店員 てんいん = shop clerk',
	'駅|station|エキ|-|14|N5|駅前 えきまえ = in front of the station',
	'道|road|ドウ|みち|12|N5|書道 しょどう = calligraphy',
	'町|town|チョウ|まち|7|N5|町中 まちなか = downtown',
	'村|village|ソン|むら|7|N4|村人 むらびと = villager',
	'口|mouth|コウ|くち|3|N5|人口 じんこう = population',
	'目|eye|モク|め|5|N5|目薬 めぐすり = eye drops',
	'耳|ear|ジ|みみ|6|N5|耳鼻科 じびか = ENT clinic',
	'手|hand|シュ|て|4|N5|手紙 てがみ = letter',
	'足|foot, suffice|ソク|あし|7|N5|足りる たりる = to be enough',
	'心|heart|シン|こころ|4|N4|安心 あんしん = relief',
	'体|body|タイ|からだ|7|N4|体育 たいいく = physical education',
	'力|power|リョク,リキ|ちから|2|N4|体力 たいりょく = stamina',
	'本|book, origin|ホン|もと|5|N5|日本 にほん = Japan',
	'文|writing|ブン|-|4|N5|文化 ぶんか = culture',
	'字|character|ジ|-|6|N5|漢字 かんじ = kanji',
	'紙|paper|シ|かみ|10|N4|手紙 てがみ = letter',
	'物|thing|ブツ,モツ|もの|8|N4|荷物 にもつ = luggage',
	'事|matter|ジ|こと|8|N4|仕事 しごと = work',
	'花見|flower viewing|-|はなみ|-|culture|花見 はなみ = cherry blossom viewing'
];

import { EXTRA_KANJI_ROWS } from './kanji-extra.js';

function parse(row, i) {
	const [k, meaning, on, kun, strokes, level, ex] = row.split('|');
	return {
		id: `k${i}`,
		kanji: k,
		meaning,
		on: on === '-' ? [] : on.split(','),
		kun: kun === '-' ? [] : kun.split(','),
		strokes: Number(strokes) || null,
		level,
		examples: (ex || '')
			.split(';')
			.map((s) => s.trim())
			.filter(Boolean)
			.map((s) => {
				const [jp, en] = s.split('=').map((x) => x.trim());
				const [word, reading] = jp.split(/\s+/);
				return { word, reading, en };
			})
	};
}

/* base list (N5) + the extended N4/N3 file, first definition wins */
const ALL_ROWS = [...RAW, ...EXTRA_KANJI_ROWS].filter((r) => r.split('|')[0].length === 1);

const seen = new Set();
export const KANJI = ALL_ROWS.filter((r) => {
	const k = r.split('|')[0];
	if (seen.has(k)) return false;
	seen.add(k);
	return true;
}).map(parse);

const ORDER = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 };
export const KANJI_LEVELS = [...new Set(KANJI.map((k) => k.level))].sort(
	(a, b) => (ORDER[a] ?? 9) - (ORDER[b] ?? 9)
);
export const KANJI_BY_LEVEL = (level) => KANJI.filter((k) => k.level === level);
