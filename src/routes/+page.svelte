<script>
	import Icon from '$lib/components/Icon.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import Scenery from '$lib/components/Scenery.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import { selectionSummary } from '$lib/stores/selection.js';
	import { overall, dayStreak } from '$lib/stores/progress.js';
	import { anchorCount } from '$lib/stores/associations.js';
	import { WORDS } from '$lib/data/dictionary.js';
	import { ALL_SOUNDS } from '$lib/data/kana.js';
	import { KANJI } from '$lib/data/kanji.js';
	import { GAMES } from '$lib/data/games.js';

	let mood = $state('idle');
	const moods = ['idle', 'happy', 'think', 'read', 'cheer', 'sleep'];
</script>

<svelte:head>
	<title>Zekocards — learn hiragana, katakana and kanji by repetition</title>
</svelte:head>

<section class="hero">
	<div class="scenery"><Scenery height={300} /></div>

	<div class="wrap hero-in">
		<div class="copy stack">
			<span class="eyebrow anim-rise">Free · no account · works offline</span>
			<h1 class="anim-rise delay-1">
				Learn every Japanese sound<br />
				the slow, stubborn way.
			</h1>
			<p class="lede anim-rise delay-2">
				Zekocards is a card game for hiragana, katakana and kanji. You choose the columns you want,
				and every exercise in the app is rebuilt from exactly those sounds — real words, real
				readings, typed answers. No four-option guessing, no lives, no streak bribes.
			</p>
			<div class="row anim-rise delay-3">
				<a class="btn btn--lg" href="/cards">
					<Icon name="cards" size={18} /> Choose your cards
				</a>
				<a class="btn btn--ghost btn--lg" href="/practice">
					<Icon name="target" size={18} /> Training hall
				</a>
			</div>
			<div class="row facts anim-rise delay-4">
				<span><strong>{ALL_SOUNDS.length}</strong> sounds</span>
				<span><strong>{WORDS.length}</strong> dictionary words</span>
				<span><strong>{KANJI.length}</strong> kanji</span>
				<span><strong>{GAMES.length}</strong> drills</span>
			</div>
		</div>

		<button
			class="mascot"
			onclick={() => (mood = moods[(moods.indexOf(mood) + 1) % moods.length])}
			aria-label="Poke Zeko"
		>
			<Zeko {mood} size={280} />
			<span class="poke">poke me</span>
		</button>
	</div>
</section>

<section class="section wrap">
	<div class="grid-auto" style="--min:250px">
		<Panel title="Pick a column" jp="選ぶ">
			<p class="muted">
				The kana tables are laid out the way Japanese actually organises them: by column. Turn on
				あ and か, and the whole app narrows to words spelled with あいうえお かきくけこ.
			</p>
			<a class="link" href="/cards">Open the cards <Icon name="arrowRight" size={15} /></a>
		</Panel>
		<Panel title="Anchor it yourself" jp="連想">
			<p class="muted">
				Every card has a blank line. Write the word that makes the shape stick for you — your
				handwriting, your memory. Zekocards quizzes you on your own notes later.
			</p>
			<a class="link" href="/practice/anchor">Anchor drill <Icon name="arrowRight" size={15} /></a>
		</Panel>
		<Panel title="Then repeat. A lot." jp="繰り返し">
			<p class="muted">
				Answers are typed or picked from every sound you study at once. Miss one and you type the
				correct reading before moving on. Weak sounds come back more often, automatically.
			</p>
			<a class="link" href="/practice">See the drills <Icon name="arrowRight" size={15} /></a>
		</Panel>
	</div>
</section>

<section class="section wrap">
	<div class="spread head">
		<div>
			<span class="eyebrow">The training hall</span>
			<h2>Nine ways to grind the same sounds</h2>
		</div>
		<a class="btn btn--soft" href="/practice">Enter <Icon name="arrowRight" size={16} /></a>
	</div>

	<div class="grid-auto" style="--min:230px">
		{#each GAMES as g}
			<a class="game" href="/practice/{g.id}">
				<span class="game-icon"><Icon name={g.icon} size={22} /></span>
				<strong>{g.title}</strong>
				<span class="jp muted">{g.jp}</span>
				<p class="muted">{g.blurb}</p>
			</a>
		{/each}
	</div>
</section>

<section class="section wrap">
	<div class="statline panel">
		<div class="stat">
			<span class="eyebrow">Selected</span>
			<strong>{$selectionSummary.sounds}</strong>
			<small class="muted">sounds across {$selectionSummary.columns} columns</small>
		</div>
		<div class="stat">
			<span class="eyebrow">Unlocked words</span>
			<strong>{$selectionSummary.words}</strong>
			<small class="muted">readable with your current selection</small>
		</div>
		<div class="stat">
			<span class="eyebrow">Mastered</span>
			<strong>{$overall.mastered}</strong>
			<small class="muted">{$overall.accuracy}% lifetime accuracy</small>
		</div>
		<div class="stat">
			<span class="eyebrow">Anchors written</span>
			<strong>{$anchorCount}</strong>
			<small class="muted">day streak: {$dayStreak}</small>
		</div>
	</div>
</section>

<section class="section wrap manifesto">
	<Panel variant="edge">
		<span class="eyebrow">What this app refuses to do</span>
		<ul>
			<li><Icon name="cross" size={16} /> Give you four options so you can answer by elimination.</li>
			<li><Icon name="cross" size={16} /> Show you words containing sounds you have not studied.</li>
			<li><Icon name="cross" size={16} /> Ask for an account, an email, or a subscription.</li>
			<li><Icon name="cross" size={16} /> Send anything you write anywhere.</li>
		</ul>
		<span class="eyebrow">What it does instead</span>
		<ul class="do">
			<li><Icon name="check" size={16} /> Makes you produce the answer from memory, every time.</li>
			<li><Icon name="check" size={16} /> Repeats what you get wrong until it stops being wrong.</li>
			<li><Icon name="check" size={16} /> Keeps every word inside the set you chose.</li>
			<li><Icon name="check" size={16} /> Saves your progress in this browser and nowhere else.</li>
		</ul>
	</Panel>
	<div class="zeko-read"><Zeko mood="read" size={190} /></div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		padding-block: var(--s-7) 15rem;
	}
	.scenery {
		position: absolute;
		inset: auto 0 -18px 0;
		opacity: 0.42;
		pointer-events: none;
		mask-image: linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%);
	}
	.hero-in {
		position: relative;
		display: grid;
		grid-template-columns: 1.15fr auto;
		align-items: center;
		gap: var(--s-6);
	}
	.copy h1 {
		font-size: var(--fs-4xl);
	}
	.facts {
		gap: var(--s-5);
		font-size: var(--fs-sm);
		color: var(--ink-muted);
	}
	.facts strong {
		font-family: var(--font-display);
		font-size: var(--fs-lg);
		color: var(--ink-strong);
		margin-right: 4px;
	}

	.mascot {
		position: relative;
		background: none;
		border: 0;
		cursor: pointer;
		display: grid;
		justify-items: center;
	}
	.poke {
		font-size: var(--fs-2xs);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
		color: var(--wedge);
		opacity: 0;
		transition: opacity var(--t-base) var(--ease-out);
	}
	.mascot:hover .poke {
		opacity: 1;
	}

	.link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: var(--s-3);
		font-size: var(--fs-sm);
		font-weight: 700;
	}

	.head {
		margin-bottom: var(--s-5);
	}

	.game {
		display: grid;
		gap: 2px;
		padding: var(--s-4);
		background: var(--bg-raised);
		border: var(--border);
		border-radius: var(--r-lg);
		color: var(--ink);
		transition:
			transform var(--t-fast) var(--ease-spring),
			box-shadow var(--t-fast) var(--ease-out),
			border-color var(--t-fast) var(--ease-out);
	}
	.game:hover {
		transform: translateY(-4px);
		box-shadow: var(--sh-2);
		border-color: var(--aqua-deep);
	}
	.game-icon {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		margin-bottom: var(--s-2);
		border-radius: var(--r-md);
		background: var(--aqua-soft);
		color: var(--wedge-deep);
	}
	.game strong {
		font-family: var(--font-display);
		font-size: var(--fs-md);
		color: var(--ink-strong);
	}
	.game .jp {
		font-size: var(--fs-2xs);
	}
	.game p {
		margin-top: var(--s-2);
		font-size: var(--fs-sm);
		line-height: var(--lh-snug);
	}

	.statline {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--s-5);
	}
	.stat {
		display: grid;
		gap: 2px;
	}
	.stat strong {
		font-family: var(--font-display);
		font-size: var(--fs-2xl);
		color: var(--ink-strong);
		line-height: 1;
	}
	.stat small {
		font-size: var(--fs-xs);
	}

	.manifesto {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--s-5);
		align-items: end;
	}
	.manifesto ul {
		list-style: none;
		margin: var(--s-3) 0 var(--s-5);
		padding: 0;
		display: grid;
		gap: var(--s-2);
	}
	.manifesto li {
		display: flex;
		gap: var(--s-2);
		align-items: flex-start;
		font-size: var(--fs-sm);
		color: var(--ink-muted);
	}
	.manifesto li :global(.icon) {
		margin-top: 3px;
		color: var(--bad);
	}
	.manifesto .do li :global(.icon) {
		color: var(--ok);
	}
	.manifesto ul:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 900px) {
		.hero {
			padding-bottom: 11rem;
		}
		.hero-in,
		.manifesto {
			grid-template-columns: 1fr;
		}
		.mascot,
		.zeko-read {
			justify-self: center;
		}
	}
</style>
