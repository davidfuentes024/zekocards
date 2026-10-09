<script>
	import Icon from '$lib/components/Icon.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import ZekoSpeak from '$lib/components/ZekoSpeak.svelte';
	import Scenery from '$lib/components/Scenery.svelte';
	import Motif from '$lib/components/Motif.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { GAMES } from '$lib/data/games.js';

	let letterOpen = $state(false);

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
			<p class="lede">Pick your sounds. Every drill is built from exactly those.</p>
			<div class="cta">
				<a class="btn btn--xl" href="/cards">
					<Icon name="cards" size={22} /> Choose your cards
				</a>
				<a class="btn btn--soft btn--xl" href="/practice">
					<Icon name="target" size={22} /> Training hall
				</a>
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

</section>

<!-- ============ DRILLS RAIL ============ -->
<section class="band drills">
	<div class="wrap wrap--wide">
		<div class="menu-head">
			<Reveal from="up">
				<div>
					<h2>Training hall</h2>
				</div>
			</Reveal>
			<Reveal from="right">
				<a class="btn" href="/practice">All drills <Icon name="arrowRight" size={18} /></a>
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

	.buddy {
		justify-self: end;
	}

	/* ================= STEPS ================= */
	/* deliberately off the grid line */
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
		box-shadow: var(--sh-1);
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
