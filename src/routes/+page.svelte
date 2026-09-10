<script>
	import Icon from '$lib/components/Icon.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import ZekoSpeak from '$lib/components/ZekoSpeak.svelte';
	import Scenery from '$lib/components/Scenery.svelte';
	import Motif from '$lib/components/Motif.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { selectionSummary } from '$lib/stores/selection.js';
	import { overall, dayStreak } from '$lib/stores/progress.js';
	import { anchorCount } from '$lib/stores/associations.js';
	import { WORDS } from '$lib/data/dictionary.js';
	import { ALL_SOUNDS } from '$lib/data/kana.js';
	import { KANJI } from '$lib/data/kanji.js';
	import { GAMES } from '$lib/data/games.js';

	let letterOpen = $state(false);

	const STEPS = [
		{
			n: '01',
			title: 'Pick a column',
			jp: '選ぶ',
			motif: 'torii',
			text: 'The tables are laid out the way Japanese organises them. Turn on あ and か and the whole app narrows to those ten sounds.',
			href: '/cards',
			cta: 'Open the cards',
			icon: 'cards',
			tone: 'aqua'
		},
		{
			n: '02',
			title: 'Anchor it yourself',
			jp: '連想',
			motif: 'sakura',
			text: 'Every card has a blank line. Write the word that makes the shape stick — then Zekocards quizzes you on your own handwriting.',
			href: '/practice/anchor',
			cta: 'Anchor drill',
			icon: 'pencil',
			tone: 'ink'
		},
		{
			n: '03',
			title: 'Then repeat. A lot.',
			jp: '繰り返し',
			motif: 'daruma',
			text: 'Answers are typed, or picked from every sound you study at once. Miss one and you type the right reading before moving on.',
			href: '/practice',
			cta: 'See the drills',
			icon: 'target',
			tone: 'solid'
		}
	];
</script>

<svelte:head>
	<title>Zekocards — learn hiragana, katakana and kanji by repetition</title>
</svelte:head>

<!-- ============ HERO ============ -->
<section class="hero">
	<div class="scenery"><Scenery height={360} /></div>

	<Motif name="lantern" size={110} rotate={-6} class="float-a" />
	<Motif name="cloud" size={140} rotate={0} class="float-b" />
	<Motif name="koi" size={130} rotate={-14} class="float-c" />
	<Motif name="sakura" size={120} rotate={12} class="float-d" />

	<div class="wrap wrap--wide hero-in">
		<div class="copy">
			<h1>
				Learn every<br />
				Japanese sound<br />
				<em>the stubborn way.</em>
			</h1>
			<p class="lede">
				A card game for hiragana, katakana and kanji. Choose your columns — every word, drill and
				example is rebuilt from exactly those sounds.
			</p>
			<div class="cta">
				<a class="btn btn--xl" href="/cards">
					<Icon name="cards" size={22} /> Choose your cards
				</a>
				<a class="btn btn--soft btn--xl" href="/practice">
					<Icon name="target" size={22} /> Training hall
				</a>
			</div>
			<div class="facts">
				<span><strong>{ALL_SOUNDS.length}</strong> sounds</span>
				<span><strong>{WORDS.length}</strong> words</span>
				<span><strong>{KANJI.length}</strong> kanji</span>
				<span><strong>{GAMES.length}</strong> drills</span>
			</div>
		</div>

		<div class="buddy">
			<ZekoSpeak
				size={300}
				mood="idle"
				lines={[
					'Poke me. I get bored standing still.',
					'あ い う え お — say them out loud.',
					'Wrong answers just mean more reps.',
					'I never give you four options. Ever.',
					'Pick two columns. That is enough for today.'
				]}
			/>
		</div>
	</div>

	<a class="cue" href="#how" aria-label="Scroll down">
		<span>keep going</span>
		<Icon name="chevronDown" size={20} />
	</a>
</section>

<!-- ============ HOW IT WORKS ============ -->
<section class="section wrap wrap--wide steps" id="how">
	<Reveal from="left">
		<h2 class="steps-title">Three moves,<br /><em>then repetition.</em></h2>
	</Reveal>

	<div class="step-row">
		{#each STEPS as s, i}
			<Reveal from={i === 1 ? 'up' : i === 0 ? 'left' : 'right'} delay={i * 120} distance={70}>
				<article class="step step--{s.tone}" style="--i:{i}">
					<div class="step-motif"><Motif name={s.motif} size={92} rotate={i % 2 ? 8 : -8} /></div>
					<span class="num">{s.n}</span>
					<h3>{s.title}</h3>
					<span class="jp">{s.jp}</span>
					<p>{s.text}</p>
					<a class="btn {s.tone === 'aqua' ? 'btn--soft' : s.tone === 'ink' ? 'btn--ink' : ''}" href={s.href}>
						<Icon name={s.icon} size={18} />
						{s.cta}
					</a>
				</article>
			</Reveal>
		{/each}
	</div>
</section>

<!-- ============ DRILLS RAIL ============ -->
<section class="band drills">
	<div class="wrap wrap--wide">
		<div class="menu-head">
			<Reveal from="up">
				<div>
					<span class="eyebrow">Training hall · 道場</span>
					<h2>Nine ways to grind<br />the same sounds.</h2>
				</div>
			</Reveal>
			<Reveal from="right">
				<a class="btn btn--lg" href="/practice">Enter <Icon name="arrowRight" size={18} /></a>
			</Reveal>
		</div>

		<div class="rail">
			{#each GAMES as g, i}
				<Reveal from="right" delay={i * 60} distance={54}>
					<a class="game tile" href="/practice/{g.id}">
						<span class="game-icon"><Icon name={g.icon} size={26} /></span>
						<strong>{g.title}</strong>
						<span class="jp">{g.jp}</span>
						<p>{g.blurb}</p>
						<span class="go"><Icon name="arrowRight" size={18} /></span>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<!-- ============ YOUR NUMBERS ============ -->
<section class="section wrap wrap--wide">
	<div class="stats">
		<Reveal from="tilt">
			<div class="stat stat--a">
				<Icon name="target" size={26} />
				<strong>{$selectionSummary.sounds}</strong>
				<span>sounds selected</span>
			</div>
		</Reveal>
		<Reveal from="tilt" delay={90}>
			<div class="stat stat--b">
				<Icon name="scroll" size={26} />
				<strong>{$selectionSummary.words}</strong>
				<span>words unlocked</span>
			</div>
		</Reveal>
		<Reveal from="tilt" delay={180}>
			<div class="stat stat--c">
				<Icon name="star" size={26} />
				<strong>{$overall.mastered}</strong>
				<span>sounds mastered</span>
			</div>
		</Reveal>
		<Reveal from="tilt" delay={270}>
			<div class="stat stat--d">
				<Icon name="flame" size={26} />
				<strong>{$dayStreak}</strong>
				<span>day streak</span>
			</div>
		</Reveal>
		<Reveal from="tilt" delay={360}>
			<div class="stat stat--e">
				<Icon name="pencil" size={26} />
				<strong>{$anchorCount}</strong>
				<span>anchors written</span>
			</div>
		</Reveal>
	</div>
</section>

<!-- ============ THE LETTER (quiet corner) ============ -->
<section class="letter-zone" id="letter">
	<div class="wrap wrap--wide">
		<Reveal from="up">
			<button class="envelope" onclick={() => (letterOpen = true)}>
				<span class="flap"></span>
				<span class="seal"><Icon name="seal" size={22} /></span>
				<span class="text">
					<em>A letter about why this exists</em>
					<small>one page, from Zeko</small>
				</span>
				<Icon name="arrowRight" size={20} class="arrow" />
			</button>
		</Reveal>
	</div>
</section>

<Modal open={letterOpen} label="A letter about why this exists" size={720} onClose={() => (letterOpen = false)}>
	<article class="letter">
		<header>
			<Motif name="sakura" size={80} rotate={-14} float={false} />
			<div>
				<span class="eyebrow">拝啓 · a note from the desk</span>
				<h2>Why Zekocards exists</h2>
			</div>
		</header>

		<p>
			Most kana apps are built to feel good. They give you four options, a green tick and a number
			that goes up. You finish a lesson believing you can read あ — and then you meet it inside a
			word and nothing comes.
		</p>
		<p>
			Zekocards is built the other way round. It asks you to <em>produce</em> the answer from an
			empty screen, over and over, using only the sounds you decided to learn. It is slower, and it
			is duller, and it works, because recall is the thing being trained.
		</p>

		<div class="cols">
			<div class="col col--no">
				<h3>What this app refuses to do</h3>
				<ul>
					<li><Icon name="cross" size={17} /> Give you four options so you can answer by elimination.</li>
					<li><Icon name="cross" size={17} /> Show you words containing sounds you have not studied.</li>
					<li><Icon name="cross" size={17} /> Ask for an account, an email, or a subscription.</li>
					<li><Icon name="cross" size={17} /> Send anything you write anywhere.</li>
				</ul>
			</div>
			<div class="col col--yes">
				<h3>What it does instead</h3>
				<ul>
					<li><Icon name="check" size={17} /> Makes you produce the answer from memory, every time.</li>
					<li><Icon name="check" size={17} /> Repeats what you get wrong until it stops being wrong.</li>
					<li><Icon name="check" size={17} /> Keeps every word inside the set you chose.</li>
					<li><Icon name="check" size={17} /> Saves your progress in this browser and nowhere else.</li>
				</ul>
			</div>
		</div>

		<footer>
			<Zeko mood="read" size={110} />
			<p class="sign">
				Take two columns. Do them until they are boring.<br />
				That is the whole method.
				<em>— Zeko</em>
			</p>
		</footer>
	</article>
</Modal>

<style>
	/* ================= HERO ================= */
	.hero {
		position: relative;
		min-height: calc(100dvh - var(--header-h));
		display: flex;
		align-items: center;
		overflow: hidden;
		padding-block: var(--s-6) var(--s-9);
	}

	.scenery {
		position: absolute;
		inset: auto 0 -10px 0;
		opacity: 0.38;
		pointer-events: none;
		mask-image: linear-gradient(to bottom, transparent 0%, #000 42%, #000 100%);
	}

	.hero :global(.float-a) {
		position: absolute;
		left: 2.5%;
		top: 6%;
	}
	.hero :global(.float-b) {
		position: absolute;
		right: 6%;
		top: 8%;
		opacity: 0.9;
	}
	.hero :global(.float-c) {
		position: absolute;
		left: 46%;
		bottom: 9%;
		opacity: 0.5;
	}
	.hero :global(.float-d) {
		position: absolute;
		right: 3%;
		bottom: 22%;
		opacity: 0.75;
	}

	.hero-in {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) auto;
		align-items: center;
		gap: var(--s-6);
	}

	.copy h1 {
		font-size: var(--fs-4xl);
		line-height: 0.98;
		letter-spacing: -0.035em;
	}
	.copy h1 em {
		font-style: normal;
		color: var(--wedge);
		position: relative;
		display: inline-block;
	}
	.copy h1 em::after {
		content: '';
		position: absolute;
		left: -2%;
		right: -2%;
		bottom: -0.01em;
		height: 0.17em;
		background: var(--aqua);
		border-radius: var(--r-full);
		z-index: -1;
	}

	.copy .lede {
		margin-top: var(--s-4);
		font-size: var(--fs-lg);
	}

	.cta {
		display: flex;
		gap: var(--s-3);
		flex-wrap: wrap;
		margin-top: var(--s-5);
	}

	.facts {
		display: flex;
		gap: var(--s-5);
		flex-wrap: wrap;
		margin-top: var(--s-6);
		font-size: var(--fs-xs);
		font-weight: 600;
		color: var(--ink-muted);
	}
	.facts strong {
		font-family: var(--font-display);
		font-size: var(--fs-xl);
		color: var(--ink-strong);
		margin-right: 5px;
	}

	.buddy {
		justify-self: end;
	}

	.cue {
		position: absolute;
		left: 50%;
		bottom: var(--s-5);
		transform: translateX(-50%);
		display: grid;
		justify-items: center;
		gap: 2px;
		z-index: 3;
		font-size: var(--fs-2xs);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
		color: var(--wedge);
		animation: zk-float 2.6s var(--ease-in-out) infinite;
	}

	/* ================= STEPS ================= */
	.steps-title {
		font-size: var(--fs-3xl);
		margin-bottom: var(--s-6);
	}
	.steps-title em {
		font-style: normal;
		color: var(--wedge);
	}

	.step-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--s-5);
		align-items: start;
	}
	/* deliberately off the grid line */
	.step-row > :global(*:nth-child(1)) {
		margin-top: var(--s-6);
	}
	.step-row > :global(*:nth-child(3)) {
		margin-top: var(--s-7);
	}

	.step {
		position: relative;
		display: grid;
		gap: var(--s-2);
		padding: var(--s-6) var(--s-5) var(--s-5);
		border-radius: var(--r-tile);
		border: 3px solid var(--cello);
		background: var(--bg-raised);
		box-shadow: 0 8px 0 var(--cello);
		overflow: hidden;
		transition: transform 160ms var(--ease-spring);
	}
	.step:hover {
		transform: translateY(-6px) rotate(-0.6deg);
	}
	.step--aqua {
		background: var(--aqua-soft);
	}
	.step--ink {
		background: var(--bg-raised);
	}

	.step-motif {
		position: absolute;
		right: -14px;
		top: -10px;
		opacity: 0.5;
	}

	.num {
		font-family: var(--font-display);
		font-size: var(--fs-sm);
		font-weight: 800;
		letter-spacing: var(--tracking-caps);
		color: var(--wedge);
	}
	.step h3 {
		font-size: var(--fs-2xl);
		line-height: 1.05;
	}
	.step .jp {
		font-family: var(--font-jp);
		font-size: var(--fs-sm);
		color: var(--ink-muted);
	}
	.step p {
		font-size: var(--fs-sm);
		color: var(--ink-muted);
		line-height: var(--lh-snug);
		margin-block: var(--s-2) var(--s-3);
	}
	.step .btn {
		justify-self: start;
	}

	/* ================= DRILLS ================= */
	.drills {
		margin-top: var(--s-8);
		padding-block: var(--s-8);
	}
	.drills .menu-head {
		margin-bottom: var(--s-5);
	}
	.drills h2 {
		font-size: var(--fs-3xl);
		line-height: 1.02;
	}

	.game {
		display: grid;
		gap: 2px;
		width: 290px;
		padding: var(--s-5);
	}
	.game-icon {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		margin-bottom: var(--s-3);
		border-radius: var(--r-md);
		background: var(--aqua-soft);
		color: var(--wedge-deep);
		box-shadow: 0 4px 0 var(--aqua);
	}
	.game strong {
		font-family: var(--font-display);
		font-size: var(--fs-lg);
		color: var(--ink-strong);
	}
	.game .jp {
		font-family: var(--font-jp);
		font-size: var(--fs-xs);
		color: var(--ink-muted);
	}
	.game p {
		margin-top: var(--s-2);
		font-size: var(--fs-sm);
		color: var(--ink-muted);
		line-height: var(--lh-snug);
	}
	.game .go {
		position: absolute;
		right: var(--s-4);
		top: var(--s-5);
		color: var(--aqua-deep);
		transition: transform var(--t-base) var(--ease-spring);
	}
	.game:hover .go {
		transform: translateX(5px);
		color: var(--wedge);
	}

	/* ================= STATS ================= */
	.stats {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: var(--s-4);
	}
	.stats > :global(*:nth-child(even)) {
		margin-top: var(--s-5);
	}
	.stat {
		display: grid;
		justify-items: center;
		gap: 2px;
		padding: var(--s-5) var(--s-3);
		border-radius: var(--r-tile);
		border: 2px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: var(--edge);
		text-align: center;
		color: var(--wedge-deep);
	}
	.stat--a {
		background: var(--aqua-soft);
	}
	.stat--c {
		background: var(--mint);
	}
	.stat--e {
		background: var(--aqua-soft);
	}
	.stat strong {
		font-family: var(--font-display);
		font-size: var(--fs-3xl);
		line-height: 1;
		color: var(--ink-strong);
	}
	.stat span {
		font-size: var(--fs-xs);
		font-weight: 600;
		color: var(--ink-muted);
	}

	/* ================= LETTER ================= */
	.letter-zone {
		position: relative;
		z-index: 1;
		padding-block: var(--s-8) var(--s-9);
	}

	.envelope {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--s-4);
		width: fit-content;
		max-width: 100%;
		margin-inline: auto;
		padding: var(--s-4) var(--s-5) var(--s-4) var(--s-6);
		background: var(--bg-raised);
		border: 2px dashed var(--surface-line-strong);
		border-radius: var(--r-md);
		cursor: pointer;
		color: var(--ink-muted);
		box-shadow: var(--sh-1);
		transition:
			transform 160ms var(--ease-spring),
			border-color var(--t-fast) var(--ease-out),
			box-shadow var(--t-fast) var(--ease-out);
	}
	.envelope:hover {
		transform: rotate(-1deg) translateY(-3px);
		border-color: var(--wedge);
		box-shadow: var(--sh-2);
	}
	.envelope .flap {
		position: absolute;
		left: 0;
		top: 0;
		width: 46px;
		height: 100%;
		background: var(--mint);
		border-right: 2px dashed var(--surface-line-strong);
		border-radius: var(--r-md) 0 0 var(--r-md);
	}
	.envelope .seal {
		position: relative;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--hanko);
		color: var(--mint);
	}
	.envelope .text {
		display: grid;
		text-align: left;
	}
	.envelope em {
		font-style: normal;
		font-family: var(--font-display);
		font-size: var(--fs-md);
		font-weight: 700;
		color: var(--ink-strong);
	}
	.envelope small {
		font-size: var(--fs-xs);
	}
	.envelope :global(.arrow) {
		color: var(--wedge);
	}

	/* the letter itself */
	.letter header {
		display: flex;
		align-items: center;
		gap: var(--s-4);
		margin-bottom: var(--s-4);
		padding-right: var(--s-7);
	}
	.letter h2 {
		font-size: var(--fs-2xl);
	}
	.letter p {
		font-size: var(--fs-sm);
		color: var(--ink-muted);
		line-height: var(--lh-body);
		margin-bottom: var(--s-3);
	}
	.letter p em {
		font-style: italic;
		color: var(--ink-strong);
	}

	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-4);
		margin-block: var(--s-5);
	}
	.col {
		padding: var(--s-4);
		border-radius: var(--r-md);
		background: var(--bg-sunken);
	}
	.col--no {
		background: var(--bad-bg);
	}
	.col--yes {
		background: var(--aqua-soft);
	}
	.col h3 {
		font-size: var(--fs-sm);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		margin-bottom: var(--s-3);
	}
	.col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--s-2);
	}
	.col li {
		display: flex;
		gap: var(--s-2);
		align-items: flex-start;
		font-size: var(--fs-xs);
		line-height: var(--lh-snug);
		color: var(--ink);
	}
	.col--no li :global(.icon) {
		color: var(--bad);
		margin-top: 2px;
	}
	.col--yes li :global(.icon) {
		color: var(--wedge-deep);
		margin-top: 2px;
	}

	.letter footer {
		display: flex;
		align-items: center;
		gap: var(--s-4);
		padding-top: var(--s-4);
		border-top: 2px dashed var(--surface-line);
	}
	.sign {
		font-family: var(--font-display);
		font-size: var(--fs-md);
		color: var(--ink-strong);
	}
	.sign em {
		display: block;
		margin-top: var(--s-2);
		font-style: normal;
		color: var(--wedge);
	}

	/* ================= RESPONSIVE ================= */
	@media (max-width: 1080px) {
		.step-row {
			grid-template-columns: 1fr 1fr;
		}
		.stats {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 900px) {
		.hero {
			min-height: auto;
			padding-block: var(--s-6) var(--s-8);
		}
		.hero-in {
			grid-template-columns: 1fr;
			text-align: left;
		}
		.buddy {
			justify-self: center;
		}
		.hero :global(.float-a),
		.hero :global(.float-c),
		.hero :global(.float-d) {
			display: none;
		}
		.cue {
			display: none;
		}
		.step-row {
			grid-template-columns: 1fr;
		}
		.step-row > :global(*) {
			margin-top: 0 !important;
		}
		.stats {
			grid-template-columns: repeat(2, 1fr);
		}
		.stats > :global(*) {
			margin-top: 0 !important;
		}
		.cols {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.buddy {
			transform: scale(0.74);
			transform-origin: top center;
			margin-block: calc(var(--s-5) * -1);
		}
	}
</style>
