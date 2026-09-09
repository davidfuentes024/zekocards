<script>
	import Icon from '$lib/components/Icon.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import { KANJI, KANJI_LEVELS } from '$lib/data/kanji.js';
	import { say } from '$lib/utils/speech.js';
	import { romajiFromKana } from '$lib/utils/answer.js';

	let q = $state('');
	let level = $state('all');
	let open = $state(null);

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
</script>

<svelte:head><title>Kanji · Zekocards</title></svelte:head>

<section class="section wrap">
	<div class="top">
		<div class="stack">
			<span class="eyebrow">Kanji · 漢字</span>
			<h1>{KANJI.length} characters, read through the kana you know.</h1>
			<p class="lede">
				Every reading here is printed in hiragana and katakana rather than romaji, so browsing the
				kanji list is itself kana practice. On readings are katakana, kun readings hiragana — the
				convention Japanese dictionaries use.
			</p>
		</div>
		<Zeko mood="think" size={140} />
	</div>

	<div class="tools panel panel--quiet">
		<div class="search">
			<Icon name="search" size={18} />
			<input class="field" bind:value={q} placeholder="mountain · やま · 山" />
		</div>
		<div class="row">
			<button class="chip" aria-pressed={level === 'all'} onclick={() => (level = 'all')}>all</button>
			{#each KANJI_LEVELS as l}
				<button class="chip" aria-pressed={level === l} onclick={() => (level = l)}>{l}</button>
			{/each}
			<a class="btn btn--sm" href="/practice/kanji"><Icon name="seal" size={15} /> drill these</a>
		</div>
	</div>

	<div class="grid">
		{#each list as k (k.id)}
			<button class="tile" class:open={open === k.id} onclick={() => (open = open === k.id ? null : k.id)}>
				<span class="glyph jp">{k.kanji}</span>
				<span class="meaning">{k.meaning}</span>
				<span class="lvl">{k.level} · {k.strokes}画</span>
			</button>
		{/each}
	</div>

	{#if open}
		{@const k = KANJI.find((x) => x.id === open)}
		<aside class="detail panel">
			<div class="dhead">
				<button class="dglyph jp" onclick={() => say(k.kanji)}>{k.kanji}</button>
				<div>
					<h3>{k.meaning}</h3>
					<p class="muted">{k.level} · {k.strokes} strokes</p>
					<p class="readings jp">
						<span><small>音</small> {k.on.join('・') || '—'}</span>
						<span><small>訓</small> {k.kun.join('・') || '—'}</span>
					</p>
				</div>
				<button class="close" onclick={() => (open = null)} aria-label="Close">
					<Icon name="cross" size={18} />
				</button>
			</div>
			<ul>
				{#each k.examples as ex}
					<li>
						<button class="jp" onclick={() => say(ex.reading)}>{ex.word}</button>
						<span class="jp muted">{ex.reading}</span>
						<span class="romaji">{romajiFromKana(ex.reading)}</span>
						<span class="muted en">{ex.en}</span>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</section>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--s-5);
		margin-bottom: var(--s-5);
		flex-wrap: wrap;
	}
	.tools {
		display: flex;
		gap: var(--s-4);
		align-items: center;
		flex-wrap: wrap;
		padding: var(--s-3) var(--s-4);
		margin-bottom: var(--s-5);
	}
	.search {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1 1 240px;
	}
	.search :global(.icon) {
		position: absolute;
		left: 12px;
		color: var(--ink-muted);
	}
	.search .field {
		padding-left: 2.6rem;
	}

	.grid {
		display: grid;
		gap: var(--s-2);
		grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
	}
	.tile {
		display: grid;
		gap: 2px;
		place-items: center;
		padding: var(--s-3) var(--s-2);
		background: var(--bg-raised);
		border: 2px solid var(--surface-line);
		border-radius: var(--r-md);
		cursor: pointer;
		transition:
			transform var(--t-fast) var(--ease-spring),
			border-color var(--t-fast) var(--ease-out);
	}
	.tile:hover {
		transform: translateY(-3px);
		border-color: var(--aqua-deep);
	}
	.tile.open {
		border-color: var(--cello);
		background: var(--aqua-soft);
	}
	.glyph {
		font-family: var(--font-jp);
		font-size: 2.2rem;
		line-height: 1.1;
		color: var(--ink-strong);
	}
	.meaning {
		font-size: var(--fs-xs);
		font-weight: 600;
		color: var(--ink);
		text-align: center;
	}
	.lvl {
		font-size: var(--fs-2xs);
		color: var(--ink-muted);
	}

	.detail {
		position: sticky;
		bottom: var(--s-4);
		margin-top: var(--s-5);
		box-shadow: var(--sh-3);
	}
	.dhead {
		display: flex;
		gap: var(--s-4);
		align-items: flex-start;
	}
	.dglyph {
		font-family: var(--font-jp);
		font-size: 4rem;
		line-height: 1;
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
	}
	.readings {
		display: flex;
		gap: var(--s-4);
		font-family: var(--font-jp);
		color: var(--wedge-deep);
	}
	.readings small {
		font-family: var(--font-ui);
		font-size: var(--fs-2xs);
		color: var(--ink-muted);
	}
	.close {
		margin-left: auto;
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 0;
		border-radius: 50%;
		background: var(--bg-sunken);
		color: var(--cello);
		cursor: pointer;
	}
	.detail ul {
		list-style: none;
		margin: var(--s-4) 0 0;
		padding: 0;
		display: grid;
		gap: 2px;
	}
	.detail li {
		display: flex;
		gap: var(--s-3);
		align-items: baseline;
		padding: var(--s-2);
		border-radius: var(--r-sm);
		font-size: var(--fs-sm);
		flex-wrap: wrap;
	}
	.detail li:nth-child(odd) {
		background: var(--bg-sunken);
	}
	.detail li button {
		font-family: var(--font-jp);
		font-size: var(--fs-lg);
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
	}
	.romaji {
		font-size: var(--fs-xs);
		font-weight: 700;
		color: var(--wedge);
	}
	.en {
		margin-left: auto;
	}
</style>
