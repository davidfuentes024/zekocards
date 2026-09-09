<script>
	import Icon from '$lib/components/Icon.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import { GAMES } from '$lib/data/games.js';
	import { selectionSummary, script, readableWords } from '$lib/stores/selection.js';
	import { anchorCount } from '$lib/stores/associations.js';
	import { SCRIPTS } from '$lib/data/kana.js';

	const wordsInScript = $derived($readableWords.filter((w) => w.script === $script).length);

	function availability(g) {
		if (g.needs === 'sounds') return $selectionSummary.sounds > 0;
		if (g.needs === 'words') return wordsInScript > 0;
		if (g.needs === 'anchors') return $anchorCount > 0;
		return true;
	}

	function reason(g) {
		if (g.needs === 'sounds') return 'Select at least one sound on the Cards page.';
		if (g.needs === 'words') return `No ${$script} words are readable with your selection yet.`;
		if (g.needs === 'anchors') return 'Write an anchor on a card first.';
		return '';
	}
</script>

<svelte:head><title>Training hall · Zekocards</title></svelte:head>

<section class="section wrap">
	<div class="top">
		<div class="stack">
			<span class="eyebrow">Training hall · 道場</span>
			<h1>Same sounds. Nine angles.</h1>
			<p class="lede">
				Every drill below is built from the {$selectionSummary.sounds} sound{$selectionSummary.sounds ===
				1
					? ''
					: 's'} you selected — nothing else can appear. Switch script and the whole hall switches
				with it.
			</p>
			<div class="row">
				{#each SCRIPTS as s}
					<button class="chip" aria-pressed={$script === s.id} onclick={() => script.set(s.id)}>
						{s.label} <span class="jp">{s.jp}</span>
					</button>
				{/each}
				<a class="btn btn--ghost btn--sm" href="/cards">
					<Icon name="cards" size={15} /> change selection
				</a>
			</div>
		</div>
		<Zeko mood="think" size={150} />
	</div>

	<div class="grid-auto" style="--min:260px">
		{#each GAMES as g}
			{@const ok = availability(g)}
			<a class="card" class:locked={!ok} href={ok ? `/practice/${g.id}` : '/cards'}>
				<span class="ico"><Icon name={ok ? g.icon : 'lock'} size={22} /></span>
				<div>
					<strong>{g.title}</strong>
					<span class="jp muted">{g.jp}</span>
				</div>
				<p class="muted">{ok ? g.blurb : reason(g)}</p>
				<span class="go"><Icon name="arrowRight" size={16} /></span>
			</a>
		{/each}
	</div>
</section>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--s-5);
		margin-bottom: var(--s-6);
		flex-wrap: wrap;
	}
	.card {
		position: relative;
		display: grid;
		gap: var(--s-2);
		padding: var(--s-5);
		background: var(--bg-raised);
		border: var(--border);
		border-radius: var(--r-lg);
		color: var(--ink);
		overflow: hidden;
		transition:
			transform var(--t-fast) var(--ease-spring),
			box-shadow var(--t-fast) var(--ease-out),
			border-color var(--t-fast) var(--ease-out);
	}
	.card:hover {
		transform: translateY(-4px);
		box-shadow: var(--sh-2);
		border-color: var(--aqua-deep);
	}
	.card.locked {
		opacity: 0.62;
	}
	.ico {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: var(--r-md);
		background: var(--aqua-soft);
		color: var(--wedge-deep);
	}
	.card.locked .ico {
		background: var(--bg-sunken);
		color: var(--ink-muted);
	}
	.card strong {
		font-family: var(--font-display);
		font-size: var(--fs-lg);
		color: var(--ink-strong);
		display: block;
	}
	.card .jp {
		font-size: var(--fs-2xs);
	}
	.card p {
		font-size: var(--fs-sm);
		line-height: var(--lh-snug);
	}
	.go {
		position: absolute;
		right: var(--s-4);
		top: var(--s-5);
		color: var(--aqua-deep);
		transition: transform var(--t-base) var(--ease-spring);
	}
	.card:hover .go {
		transform: translateX(4px);
		color: var(--wedge);
	}
</style>
