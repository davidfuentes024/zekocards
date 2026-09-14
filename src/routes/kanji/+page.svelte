<script>
	import Icon from '$lib/components/Icon.svelte';
	import ZekoSpeak from '$lib/components/ZekoSpeak.svelte';
	import Motif from '$lib/components/Motif.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Pager from '$lib/components/Pager.svelte';
	import { KANJI, KANJI_LEVELS } from '$lib/data/kanji.js';
	import { play as say } from '$lib/utils/audio.js';
	import { romajiFromKana } from '$lib/utils/answer.js';

	let q = $state('');
	let level = $state('all');
	let open = $state(null);
	let page = $state(1);
	const PER_PAGE = 60;
	let gridTop;

	const list = $derived(
		KANJI.filter((k) => {
			if (level !== 'all' && k.level !== level) return false;
			const n = q.trim().toLowerCase();
			if (!n) return true;
			return (
				k.kanji.includes(n) ||
				k.meaning.toLowerCase().includes(n) ||
				[...k.on, ...k.kun].some((r) => r.includes(n) || romajiFromKana(r).includes(n))
			);
		})
	);

	const pages = $derived(Math.max(1, Math.ceil(list.length / PER_PAGE)));
	const shown = $derived(list.slice((page - 1) * PER_PAGE, page * PER_PAGE));

	$effect(() => {
		q;
		level;
		page = 1;
	});

	function turned() {
		gridTop?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const current = $derived(open ? KANJI.find((x) => x.id === open) : null);
</script>

<svelte:head><title>Kanji · Zekocards</title></svelte:head>

<section class="kj">
	<Motif name="fan" size={130} rotate={-10} class="deco deco--a" opacity={0.4} />
	<Motif name="daruma" size={110} rotate={8} class="deco deco--b" opacity={0.45} />

	<div class="wrap wrap--wide">
		<div class="top">
			<div>
				<span class="eyebrow">Kanji · 漢字</span>
				<h1>{KANJI.length} characters,<br /><em>read through kana.</em></h1>
				<p class="lede">
					On readings in katakana, kun readings in hiragana — the way a Japanese dictionary prints
					them. Browsing is kana practice.
				</p>
			</div>

			<ZekoSpeak
				size={150}
				mood="think"
				align="end"
				lines={[
					'One kanji, many readings. That is normal.',
					'山 is やま alone and サン in compounds.',
					'Tap one. I will show you where it lives.',
					'Do not memorise stroke counts. Nobody asks.'
				]}
			/>
		</div>

		<div class="bar">
			<div class="searchbox">
				<Icon name="search" size={20} />
				<input class="field" bind:value={q} placeholder="mountain · やま · 山" />
			</div>

			<div class="seg">
				<button class="seg-btn" class:is-on={level === 'all'} onclick={() => (level = 'all')}>All</button>
				{#each KANJI_LEVELS as l}
					<button class="seg-btn" class:is-on={level === l} onclick={() => (level = l)}>{l}</button>
				{/each}
			</div>

			<a class="btn" href="/practice/kanji"><Icon name="seal" size={18} /> drill these</a>
		</div>

		<div class="grid" bind:this={gridTop}>
			{#each shown as k, i (k.id)}
				<Reveal from="scale" delay={Math.min(i, 12) * 30}>
					<button class="kt" class:is-on={open === k.id} onclick={() => (open = k.id)}>
						<span class="glyph jp">{k.kanji}</span>
						<span class="meaning">{k.meaning}</span>
						<span class="lvl">{k.level}{k.strokes ? ` · ${k.strokes}画` : ''}</span>
					</button>
				</Reveal>
			{/each}
		</div>

		<Pager bind:page {pages} onChange={turned} />
	</div>
</section>

<Modal open={!!current} label="Kanji detail" size={620} onClose={() => (open = null)}>
	{#if current}
		<div class="detail">
			<div class="dhead">
				<button class="dglyph jp" onclick={() => say(current.kanji)}>{current.kanji}</button>
				<div>
					<h2>{current.meaning}</h2>
					<p class="muted">{current.level}{current.strokes ? ` · ${current.strokes} strokes` : ''}</p>
					<div class="readings">
						<span class="rd"><small>音</small> <b class="jp">{current.on.join('・') || '—'}</b></span>
						<span class="rd"><small>訓</small> <b class="jp">{current.kun.join('・') || '—'}</b></span>
					</div>
				</div>
			</div>

			<ul class="examples">
				{#each current.examples as ex}
					<li>
						<button class="jp w" onclick={() => say(ex.reading)}>{ex.word}</button>
						<span class="jp reading">{ex.reading}</span>
						<span class="romaji">{romajiFromKana(ex.reading)}</span>
						<span class="muted en">{ex.en}</span>
					</li>
				{/each}
			</ul>

			<a class="btn btn--block" href="/practice/kanji">
				<Icon name="target" size={18} /> Drill kanji like this one
			</a>
		</div>
	{/if}
</Modal>

<style>
	.grid {
		scroll-margin-top: 110px;
	}

	.kj {
		position: relative;
		padding-block: var(--s-6) var(--s-8);
		overflow: hidden;
	}
	.kj :global(.deco--a) {
		position: absolute;
		left: 1%;
		bottom: 10%;
	}
	.kj :global(.deco--b) {
		position: absolute;
		right: 2%;
		bottom: 4%;
	}

	.top {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: var(--s-5);
		margin-bottom: var(--s-5);
	}
	.top h1 {
		font-size: var(--fs-3xl);
		line-height: 1.03;
		margin-block: var(--s-2) var(--s-3);
	}
	.top h1 em {
		font-style: normal;
		color: var(--wedge);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		flex-wrap: wrap;
		padding: var(--s-3);
		margin-bottom: var(--s-5);
		border-radius: var(--r-tile);
		border: 2px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: var(--edge);
	}
	.searchbox {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1 1 260px;
	}
	.searchbox :global(.icon) {
		position: absolute;
		left: 14px;
		color: var(--ink-muted);
	}
	.searchbox .field {
		padding-left: 3rem;
		font-family: var(--font-display);
	}
	.seg {
		display: flex;
		padding: 4px;
		gap: 4px;
		border-radius: var(--r-md);
		background: var(--bg-tint);
		border: 2px solid var(--surface-line);
	}
	.seg-btn {
		padding: 0.45em 0.95em;
		border: 0;
		border-radius: var(--r-tab);
		background: transparent;
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 800;
		color: var(--ink-muted);
		cursor: pointer;
	}
	.seg-btn.is-on {
		background: var(--cello);
		color: #fff;
		box-shadow: 0 3px 0 var(--cello-ink);
	}

	.grid {
		display: grid;
		gap: var(--s-3);
		grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
	}
	.kt {
		display: grid;
		place-items: center;
		gap: 2px;
		width: 100%;
		padding: var(--s-3) var(--s-2);
		background: var(--bg-raised);
		border: 3px solid var(--surface-line);
		border-radius: var(--r-md);
		box-shadow: 0 5px 0 var(--surface-line-strong);
		cursor: pointer;
		transition:
			transform 120ms var(--ease-spring),
			box-shadow 120ms var(--ease-out),
			border-color var(--t-fast) var(--ease-out);
	}
	.kt:hover {
		transform: translateY(-4px) rotate(-1deg);
		box-shadow: 0 9px 0 var(--surface-line-strong);
		border-color: var(--aqua-deep);
	}
	.kt:active {
		transform: translateY(3px);
		box-shadow: 0 2px 0 var(--surface-line-strong);
	}
	.kt.is-on {
		background: var(--aqua-soft);
		border-color: var(--cello);
		box-shadow: 0 5px 0 var(--cello);
	}
	.glyph {
		font-family: var(--font-jp);
		font-size: 2.9rem;
		line-height: 1.05;
		color: var(--ink-strong);
	}
	.meaning {
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 700;
		color: var(--ink);
		text-align: center;
	}
	.lvl {
		font-size: var(--fs-2xs);
		color: var(--ink-muted);
	}

	/* modal content */
	.dhead {
		display: flex;
		gap: var(--s-4);
		align-items: flex-start;
		padding-right: var(--s-7);
		margin-bottom: var(--s-4);
	}
	.dglyph {
		font-family: var(--font-jp);
		font-size: 5.4rem;
		line-height: 1;
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
	}
	.detail h2 {
		font-size: var(--fs-2xl);
	}
	.readings {
		display: flex;
		gap: var(--s-4);
		margin-top: var(--s-2);
		flex-wrap: wrap;
	}
	.rd {
		display: inline-flex;
		align-items: baseline;
		gap: 6px;
		padding: 0.3em 0.7em;
		border-radius: var(--r-tab);
		background: var(--bg-tint);
		border: 2px solid var(--surface-line);
	}
	.rd small {
		font-size: var(--fs-2xs);
		color: var(--ink-muted);
	}
	.rd b {
		font-size: var(--fs-md);
		color: var(--wedge-deep);
	}

	.examples {
		list-style: none;
		margin: 0 0 var(--s-4);
		padding: 0;
		display: grid;
		gap: 4px;
	}
	.examples li {
		display: flex;
		gap: var(--s-3);
		align-items: baseline;
		padding: var(--s-2) var(--s-3);
		border-radius: var(--r-sm);
		background: var(--bg-tint);
		font-size: var(--fs-sm);
		flex-wrap: wrap;
	}
	.w {
		font-family: var(--font-jp);
		font-size: var(--fs-lg);
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
	}
	.reading {
		font-family: var(--font-jp);
		color: var(--ink-muted);
	}
	.romaji {
		font-size: var(--fs-xs);
		font-weight: 800;
		color: var(--wedge);
	}
	.en {
		margin-left: auto;
	}

	@media (max-width: 900px) {
		.top {
			grid-template-columns: 1fr;
		}
		.kj :global(.deco--a),
		.kj :global(.deco--b) {
			display: none;
		}
	}
</style>
