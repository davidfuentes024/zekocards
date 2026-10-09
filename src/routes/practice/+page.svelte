<script>
	import Icon from '$lib/components/Icon.svelte';
	import ZekoSpeak from '$lib/components/ZekoSpeak.svelte';
	import Motif from '$lib/components/Motif.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import { GAMES } from '$lib/data/games.js';
	import DifficultyBoard from '$lib/components/DifficultyBoard.svelte';
	import { selectionSummary, script, readableWords } from '$lib/stores/selection.js';
	import { anchors } from '$lib/stores/associations.js';
	import { SCRIPTS } from '$lib/data/kana.js';
	import { stats, overall } from '$lib/stores/progress.js';

	const wordsInScript = $derived($readableWords.filter((w) => w.script === $script).length);

	function availability(g) {
		if (g.needs === 'sounds') return $selectionSummary.sounds > 0;
		if (g.needs === 'words') return wordsInScript > 0;
		if (g.needs === 'anchors') return Object.keys($anchors[$script] ?? {}).length > 0;
		return true;
	}
	function reason(g) {
		if (g.needs === 'sounds') return 'Select at least one sound on the Cards page.';
		if (g.needs === 'words') return `No ${$script} words are readable with your selection yet.`;
		if (g.needs === 'anchors') return `Write a ${$script} anchor on a card first.`;
		return '';
	}

	const TONES = ['aqua', 'ink', 'plain', 'mint', 'aqua', 'plain', 'ink', 'mint', 'plain'];
	const featured = $derived(GAMES[0]);
	const rest = $derived(GAMES.slice(1));
</script>

<svelte:head><title>Training hall · Zekocards</title></svelte:head>

<section class="hall">
	<Motif name="lantern" size={110} rotate={-8} class="deco deco--a" opacity={0.5} />
	<Motif name="koi" size={140} rotate={12} class="deco deco--b" opacity={0.35} />
	<Motif name="cloud" size={130} class="deco deco--c" opacity={0.6} />

	<div class="wrap wrap--wide">
		<div class="top">
			<div>
				<span class="eyebrow">道場</span>
				<h1>Training hall</h1>

				<div class="difficulty panel">
					<DifficultyBoard />
				</div>

				<div class="controls">
					<div class="seg">
						{#each SCRIPTS as s}
							<button class="seg-btn" class:is-on={$script === s.id} onclick={() => script.set(s.id)}>
								<span class="jp">{s.jp}</span>{s.label}
							</button>
						{/each}
					</div>
					<a class="btn btn--ghost" href="/cards"><Icon name="cards" size={17} /> change selection</a>
				</div>
			</div>

			<ZekoSpeak
				size={190}
				mood="think"
				align="end"
				lines={[
					'Start with Sound Recall. Always.',
					'Ear training is the one everyone skips.',
					'Sixty Seconds is where you find out.',
					`${$overall.answers} answers so far. Keep going.`
				]}
			/>
		</div>

		<!-- featured -->
		<Reveal from="up">
			<a class="hero-tile" href="/practice/{featured.id}">
				<div class="ht-icon"><Icon name={featured.icon} size={40} /></div>
				<div class="ht-body">
					<h2>{featured.title} <span class="jp">{featured.jp}</span></h2>
					<p>{featured.blurb}</p>
				</div>
				<span class="ht-go"><Icon name="arrowRight" size={26} /></span>
				<Motif name="sakura" size={120} rotate={16} class="ht-motif" opacity={0.35} />
			</a>
		</Reveal>

		<div class="grid">
			{#each rest as g, i}
				{@const ok = availability(g)}
				<Reveal from={i % 2 ? 'right' : 'left'} delay={i * 60} distance={46}>
					<a class="tile game tone-{TONES[i + 1]}" class:locked={!ok} href={ok ? `/practice/${g.id}` : '/cards'}>
						<span class="ico"><Icon name={ok ? g.icon : 'lock'} size={26} /></span>
						<strong>{g.title}</strong>
						<span class="jp">{g.jp}</span>
						<p>{ok ? g.blurb : reason(g)}</p>
						<span class="go"><Icon name="arrowRight" size={18} /></span>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<style>
	.hall {
		position: relative;
		padding-block: var(--s-6) var(--s-8);
		overflow: hidden;
	}
	.hall :global(.deco--a) {
		position: absolute;
		left: 1.5%;
		bottom: 4%;
	}
	.hall :global(.deco--b) {
		position: absolute;
		right: 4%;
		bottom: 8%;
	}
	.hall :global(.deco--c) {
		position: absolute;
		right: 26%;
		top: 3%;
	}

	.top {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: var(--s-5);
		margin-bottom: var(--s-6);
	}
	.top h1 {
		font-size: var(--fs-3xl);
		line-height: 1.02;
		margin-block: var(--s-2) var(--s-3);
	}
	.controls {
		display: flex;
		gap: var(--s-3);
		align-items: center;
		flex-wrap: wrap;
		margin-top: var(--s-4);
	}
	.seg {
		display: flex;
		padding: 4px;
		gap: 4px;
		border-radius: var(--r-md);
		background: var(--bg-tint);
		border: 1px solid var(--surface-line);
	}
	.seg-btn {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 0.45em 0.9em;
		border: 0;
		border-radius: var(--r-tab);
		background: transparent;
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 800;
		color: var(--ink-muted);
		cursor: pointer;
	}
	.seg-btn .jp {
		font-family: var(--font-jp);
		font-size: var(--fs-sm);
	}
	.seg-btn.is-on {
		background: var(--cello);
		color: var(--on-accent);
		box-shadow: var(--sh-1);
	}

	/* featured */
	.hero-tile {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--s-5);
		padding: var(--s-5) var(--s-6);
		margin-bottom: var(--s-5);
		border-radius: var(--r-xl);
		border: 1px solid var(--cello);
		background: var(--cello);
		color: var(--mint);
		box-shadow: var(--sh-1);
		overflow: hidden;
		transition:
			transform 140ms var(--ease-spring),
			box-shadow 140ms var(--ease-out);
	}
	.hero-tile:hover {
		transform: translateY(-5px);
		box-shadow: var(--sh-1);
	}
	.hero-tile:active {
		transform: scale(0.97);
		box-shadow: var(--sh-1);
	}
	.ht-icon {
		display: grid;
		place-items: center;
		width: 84px;
		height: 84px;
		flex: none;
		border-radius: var(--r-lg);
		background: var(--aqua);
		color: var(--cello);
		box-shadow: var(--sh-1);
	}
	.ht-body h2 {
		color: var(--on-accent);
		font-size: var(--fs-2xl);
		margin-block: 2px;
	}
	.ht-body .jp {
		font-family: var(--font-jp);
		font-size: var(--fs-md);
		color: var(--aqua);
	}
	.ht-body p {
		font-size: var(--fs-sm);
		color: var(--aqua-soft);
		max-width: min(60ch, 100%);
	}
	.ht-go {
		margin-left: auto;
		color: var(--aqua);
	}
	.hero-tile :global(.ht-motif) {
		position: absolute;
		right: 8%;
		bottom: -30px;
		opacity: 0.3;
	}

	/* grid */
	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--s-4);
	}
	.grid > :global(*:nth-child(3n + 2)) {
		margin-top: var(--s-4);
	}

	.game {
		display: grid;
		gap: 2px;
		height: 100%;
	}
	.game.tone-aqua {
		background: var(--aqua-soft);
	}
	.game.tone-mint {
		background: var(--mint);
	}
	.game.tone-ink {
		background: var(--bg-raised);
		border-color: var(--cello);
		box-shadow: var(--sh-1);
	}
	.game.locked {
		opacity: 0.6;
	}
	.ico {
		display: grid;
		place-items: center;
		width: 58px;
		height: 58px;
		margin-bottom: var(--s-3);
		border-radius: var(--r-md);
		background: var(--bg-raised);
		border: 1px solid var(--surface-line);
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
	.go {
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

	@media (max-width: 1200px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (max-width: 900px) {
		.top {
			grid-template-columns: 1fr;
		}
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.grid > :global(*) {
			margin-top: 0 !important;
		}
		.hall :global(.deco--a),
		.hall :global(.deco--b),
		.hall :global(.deco--c) {
			display: none;
		}
		.hero-tile {
			flex-wrap: wrap;
		}
	}
	@media (max-width: 620px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.difficulty {
		display: grid;
		gap: var(--s-3);
		margin: var(--s-4) 0;
		max-width: 46rem;
	}
</style>
