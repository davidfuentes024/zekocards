<script>
	import Icon from '$lib/components/Icon.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import { WORDS, TAGS, TAG_LABELS } from '$lib/data/dictionary.js';
	import { selectedSounds } from '$lib/stores/selection.js';
	import { say } from '$lib/utils/speech.js';
	import { romajiFromKana } from '$lib/utils/answer.js';

	let q = $state('');
	let tag = $state('all');
	let scriptFilter = $state('all');
	let onlyMine = $state(false);
	let limit = $state(60);

	const filtered = $derived.by(() => {
		const needle = q.trim().toLowerCase();
		return WORDS.filter((w) => {
			if (tag !== 'all' && !w.tags.includes(tag)) return false;
			if (scriptFilter !== 'all' && w.script !== scriptFilter) return false;
			if (onlyMine && !w.soundIds.every((id) => $selectedSounds.has(id))) return false;
			if (!needle) return true;
			return (
				w.kana.includes(needle) ||
				w.romaji.toLowerCase().includes(needle) ||
				w.en.toLowerCase().includes(needle) ||
				(w.kanji ?? '').includes(needle)
			);
		});
	});

	const shown = $derived(filtered.slice(0, limit));

	$effect(() => {
		q;
		tag;
		scriptFilter;
		onlyMine;
		limit = 60;
	});
</script>

<svelte:head><title>Dictionary · Zekocards</title></svelte:head>

<section class="section wrap">
	<div class="top">
		<div class="stack">
			<span class="eyebrow">Dictionary · 辞書</span>
			<h1>{WORDS.length} words, every one spelled out in kana.</h1>
			<p class="lede">
				Search in English, romaji, kana or kanji. Flip on “only my selection” and the list collapses
				to the words you can already read today.
			</p>
		</div>
		<Zeko mood="read" size={140} />
	</div>

	<div class="tools panel panel--quiet">
		<div class="search">
			<Icon name="search" size={18} />
			<input class="field" bind:value={q} placeholder="cat · ねこ · neko · 猫" />
		</div>
		<div class="row">
			<button class="chip" aria-pressed={scriptFilter === 'all'} onclick={() => (scriptFilter = 'all')}>
				both
			</button>
			<button
				class="chip"
				aria-pressed={scriptFilter === 'hiragana'}
				onclick={() => (scriptFilter = 'hiragana')}>ひらがな</button
			>
			<button
				class="chip"
				aria-pressed={scriptFilter === 'katakana'}
				onclick={() => (scriptFilter = 'katakana')}>カタカナ</button
			>
			<button class="chip" aria-pressed={onlyMine} onclick={() => (onlyMine = !onlyMine)}>
				<Icon name="target" size={14} /> only my selection
			</button>
		</div>
	</div>

	<div class="tags scroll">
		<button class="chip" aria-pressed={tag === 'all'} onclick={() => (tag = 'all')}>All</button>
		{#each TAGS as t}
			<button class="chip" aria-pressed={tag === t} onclick={() => (tag = t)}>
				{TAG_LABELS[t] ?? t}
			</button>
		{/each}
	</div>

	<p class="count muted">{filtered.length} entries</p>

	{#if shown.length}
		<div class="list">
			{#each shown as w (w.id)}
				<article class="entry">
					<button class="kana jp" onclick={() => say(w.kana)} title="Hear it">{w.kana}</button>
					<div class="body">
						<div class="line">
							<strong>{w.en}</strong>
							{#if w.kanji}<span class="jp kanji">{w.kanji}</span>{/if}
						</div>
						<div class="line sub">
							<span class="romaji">{romajiFromKana(w.kana)}</span>
							<span class="dot">·</span>
							<span class="muted">{w.tags.map((t) => TAG_LABELS[t] ?? t).join(' · ')}</span>
						</div>
					</div>
					<button class="speak" onclick={() => say(w.kana)} aria-label="Pronounce">
						<Icon name="sound" size={17} />
					</button>
				</article>
			{/each}
		</div>

		{#if filtered.length > shown.length}
			<div class="more">
				<button class="btn btn--ghost" onclick={() => (limit += 80)}>
					<Icon name="chevronDown" size={16} /> show more ({filtered.length - shown.length} left)
				</button>
			</div>
		{/if}
	{:else}
		<div class="empty panel">
			<Zeko mood="think" size={120} />
			<p class="lede">Nothing matches that yet.</p>
			<p class="muted">
				If “only my selection” is on, try adding a column or two on the Cards page — the dictionary
				grows every time you unlock a sound.
			</p>
		</div>
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
		position: sticky;
		top: calc(var(--header-h) + 6px);
		z-index: 10;
	}
	.search {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--s-2);
		flex: 1 1 260px;
	}
	.search :global(.icon) {
		position: absolute;
		left: 12px;
		color: var(--ink-muted);
	}
	.search .field {
		padding-left: 2.6rem;
	}

	.tags {
		display: flex;
		gap: var(--s-2);
		padding-block: var(--s-4) var(--s-2);
		flex-wrap: wrap;
	}

	.count {
		font-size: var(--fs-xs);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		margin-bottom: var(--s-3);
	}

	.list {
		display: grid;
		gap: var(--s-2);
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}

	.entry {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-3);
		background: var(--bg-raised);
		border: var(--border);
		border-radius: var(--r-md);
		transition:
			transform var(--t-fast) var(--ease-spring),
			border-color var(--t-fast) var(--ease-out);
	}
	.entry:hover {
		transform: translateY(-2px);
		border-color: var(--aqua-deep);
	}
	.kana {
		font-family: var(--font-jp);
		font-size: var(--fs-xl);
		line-height: 1.2;
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
		text-align: left;
		min-width: 0;
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.line {
		display: flex;
		gap: var(--s-2);
		align-items: baseline;
		flex-wrap: wrap;
	}
	.line strong {
		font-family: var(--font-display);
		font-size: var(--fs-sm);
		color: var(--ink-strong);
	}
	.kanji {
		font-family: var(--font-jp);
		color: var(--wedge);
	}
	.sub {
		font-size: var(--fs-2xs);
	}
	.romaji {
		font-weight: 700;
		letter-spacing: var(--tracking-wide);
		color: var(--wedge);
	}
	.dot {
		color: var(--surface-line);
	}
	.speak {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border: 0;
		border-radius: 50%;
		background: var(--bg-sunken);
		color: var(--wedge-deep);
		cursor: pointer;
		transition: background var(--t-fast) var(--ease-out);
	}
	.speak:hover {
		background: var(--aqua);
	}

	.more {
		display: flex;
		justify-content: center;
		margin-top: var(--s-5);
	}
	.empty {
		display: grid;
		justify-items: center;
		gap: var(--s-3);
		text-align: center;
		padding: var(--s-7);
	}
</style>
