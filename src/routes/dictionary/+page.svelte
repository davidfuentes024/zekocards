<script>
	import Icon from '$lib/components/Icon.svelte';
	import ZekoSpeak from '$lib/components/ZekoSpeak.svelte';
	import Motif from '$lib/components/Motif.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Pager from '$lib/components/Pager.svelte';
	import { WORDS, TAGS, TAG_LABELS } from '$lib/data/dictionary.js';
	import { selectedSounds } from '$lib/stores/selection.js';
	import { play as say } from '$lib/utils/audio.js';
	import { romajiFromKana } from '$lib/utils/answer.js';

	let q = $state('');
	let tag = $state('all');
	let scriptFilter = $state('all');
	let onlyMine = $state(false);
	let level = $state('all');
	let page = $state(1);
	const PER_PAGE = 60;
	let listTop;

	const LEVELS = ['all', 'n5', 'n4', 'n3', 'n2', 'n1'];

	const TAG_MOTIF = {
		nature: 'sakura',
		animal: 'koi',
		food: 'onigiri',
		culture: 'lantern',
		loanword: 'cloud',
		school: 'daruma'
	};

	const counts = (() => {
		const m = {};
		for (const w of WORDS) for (const t of w.tags) m[t] = (m[t] ?? 0) + 1;
		return m;
	})();

	const filtered = $derived.by(() => {
		const needle = q.trim().toLowerCase();
		return WORDS.filter((w) => {
			if (tag !== 'all' && !w.tags.includes(tag)) return false;
			if (level !== 'all' && !w.tags.includes(level)) return false;
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

	const pages = $derived(Math.max(1, Math.ceil(filtered.length / PER_PAGE)));
	const shown = $derived(filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE));

	function turned() {
		listTop?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	$effect(() => {
		q;
		tag;
		level;
		scriptFilter;
		onlyMine;
		page = 1;
	});
</script>

<svelte:head><title>Dictionary · Zekocards</title></svelte:head>

<section class="dict">
	<Motif name="sakura" size={130} rotate={-12} class="deco deco--a" opacity={0.4} />
	<Motif name="onigiri" size={110} rotate={9} class="deco deco--b" opacity={0.5} />

	<div class="wrap wrap--wide">
		<div class="top">
			<div>
				<span class="eyebrow">辞書</span>
				<h1>Dictionary</h1>
			</div>

			<div class="searchbox">
				<Icon name="search" size={22} />
				<input class="field" bind:value={q} placeholder="cat · ねこ · neko · 猫" />
			</div>

			<ZekoSpeak
				size={140}
				mood="read"
				align="end"
				lines={[
					'Every word here breaks down into cards.',
					'Try “only my selection”. It shrinks fast.',
					'Tap a word and I read it out loud.',
					'コーヒー is katakana. Loanwords always are.'
				]}
			/>
		</div>

		<div class="filters">
			<div class="seg">
				<button class="seg-btn" class:is-on={scriptFilter === 'all'} onclick={() => (scriptFilter = 'all')}>
					Both
				</button>
				<button
					class="seg-btn"
					class:is-on={scriptFilter === 'hiragana'}
					onclick={() => (scriptFilter = 'hiragana')}
				>
					<span class="jp">ひらがな</span>
				</button>
				<button
					class="seg-btn"
					class:is-on={scriptFilter === 'katakana'}
					onclick={() => (scriptFilter = 'katakana')}
				>
					<span class="jp">カタカナ</span>
				</button>
			</div>

			<div class="seg">
				{#each LEVELS as l}
					<button class="seg-btn" class:is-on={level === l} onclick={() => (level = l)}>
						{l === 'all' ? 'All levels' : l.toUpperCase()}
					</button>
				{/each}
			</div>

			<button class="tab tab--aqua" aria-pressed={onlyMine} onclick={() => (onlyMine = !onlyMine)}>
				<Icon name="target" size={16} /> only my selection
			</button>

			<span class="result">{filtered.length} entries</span>
		</div>

		<div class="rail tags">
			<button class="topic" class:is-on={tag === 'all'} onclick={() => (tag = 'all')}>
				<Icon name="grid" size={22} />
				<span>All</span>
				<small>{WORDS.length}</small>
			</button>
			{#each TAGS.filter((t) => !/^n[1-5]$/.test(t)) as t}
				<button class="topic" class:is-on={tag === t} onclick={() => (tag = t)}>
					{#if TAG_MOTIF[t]}
						<Motif name={TAG_MOTIF[t]} size={34} float={false} />
					{:else}
						<Icon name="scroll" size={22} />
					{/if}
					<span>{TAG_LABELS[t] ?? t}</span>
					<small>{counts[t]}</small>
				</button>
			{/each}
		</div>

		{#if shown.length}
			<div class="list" bind:this={listTop}>
				{#each shown as w, i (w.id)}
					<Reveal from="up" delay={Math.min(i, 8) * 40} distance={26}>
						<article class="entry" class:kata={w.script === 'katakana'}>
							<button class="kana jp" onclick={() => say(w.kana)} title="Hear it">{w.kana}</button>
							<div class="body">
								<strong>{w.en}</strong>
								<div class="sub">
									<span class="romaji">{romajiFromKana(w.kana)}</span>
									{#if w.kanji}<span class="jp kanji">{w.kanji}</span>{/if}
								</div>
							</div>
							<button class="speak" onclick={() => say(w.kana)} aria-label="Pronounce">
								<Icon name="sound" size={18} />
							</button>
						</article>
					</Reveal>
				{/each}
			</div>

			<Pager bind:page {pages} onChange={turned} />
		{:else}
			<div class="empty panel">
				<ZekoSpeak size={130} mood="think" always lines={['Nothing matches that yet.']} />
				<p class="muted">
					If “only my selection” is on, add a column or two on the Cards page — the dictionary grows
					every time you unlock a sound.
				</p>
				<a class="btn" href="/cards"><Icon name="cards" size={18} /> Open the cards</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.list {
		scroll-margin-top: 110px;
	}

	.dict {
		position: relative;
		padding-block: var(--s-6) var(--s-8);
		overflow: hidden;
	}
	.dict :global(.deco--a) {
		position: absolute;
		right: 2%;
		bottom: 6%;
	}
	.dict :global(.deco--b) {
		position: absolute;
		left: 1%;
		bottom: 26%;
	}

	.top {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(260px, 420px) auto;
		align-items: end;
		gap: var(--s-5);
		margin-bottom: var(--s-5);
	}
	.top h1 {
		font-size: var(--fs-3xl);
		line-height: 1.03;
		margin-top: var(--s-2);
	}
	.searchbox {
		position: relative;
		display: flex;
		align-items: center;
	}
	.searchbox :global(.icon) {
		position: absolute;
		left: 16px;
		color: var(--ink-muted);
	}
	.searchbox .field {
		padding-left: 3.2rem;
		font-family: var(--font-display);
		font-size: var(--fs-md);
		border-width: 3px;
		box-shadow: var(--sh-1);
	}

	.filters {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		flex-wrap: wrap;
		margin-bottom: var(--s-3);
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
	.result {
		margin-left: auto;
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 800;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	/* topic rail */
	.tags {
		gap: var(--s-2);
		margin-bottom: var(--s-4);
	}
	.topic {
		display: grid;
		justify-items: center;
		align-content: center;
		gap: 2px;
		width: 104px;
		height: 104px;
		padding: var(--s-2);
		border-radius: var(--r-md);
		border: 1px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: var(--sh-1);
		color: var(--wedge-deep);
		cursor: pointer;
		transition:
			transform 120ms var(--ease-spring),
			box-shadow 120ms var(--ease-out),
			background var(--t-fast) var(--ease-out);
	}
	.topic:hover {
		transform: translateY(-3px);
		box-shadow: var(--sh-1);
	}
	.topic:active {
		transform: scale(0.97);
		box-shadow: var(--sh-1);
	}
	.topic span {
		font-family: var(--font-display);
		font-size: var(--fs-2xs);
		font-weight: 800;
		color: var(--ink-strong);
		text-align: center;
	}
	.topic small {
		font-size: var(--fs-2xs);
		color: var(--ink-muted);
	}
	.topic.is-on {
		background: var(--aqua);
		border-color: var(--aqua-deep);
		box-shadow: var(--sh-1);
	}

	/* entries */
	.list {
		display: grid;
		gap: var(--s-3);
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}
	.entry {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-3) var(--s-4);
		background: var(--bg-raised);
		border: 1px solid var(--surface-line);
		border-radius: var(--r-md);
		box-shadow: var(--sh-1);
		transition:
			transform 120ms var(--ease-spring),
			box-shadow 120ms var(--ease-out),
			border-color var(--t-fast) var(--ease-out);
	}
	.entry:hover {
		transform: translateY(-3px);
		box-shadow: var(--sh-1);
		border-color: var(--aqua-deep);
	}
	.entry.kata {
		background: var(--bg-tint);
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
	.body strong {
		display: block;
		font-family: var(--font-display);
		font-size: var(--fs-sm);
		color: var(--ink-strong);
		line-height: 1.25;
	}
	.sub {
		display: flex;
		gap: var(--s-2);
		align-items: baseline;
		font-size: var(--fs-2xs);
	}
	.romaji {
		font-weight: 800;
		letter-spacing: var(--tracking-wide);
		color: var(--wedge);
	}
	.kanji {
		font-family: var(--font-jp);
		color: var(--ink-muted);
	}
	.speak {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		flex: none;
		border: 1px solid var(--surface-line);
		border-radius: var(--r-sm);
		background: var(--bg-raised);
		color: var(--wedge-deep);
		cursor: pointer;
		box-shadow: var(--sh-1);
		transition: transform 100ms var(--ease-out);
	}
	.speak:active {
		transform: scale(0.97);
		box-shadow: none;
	}

	.empty {
		display: grid;
		justify-items: center;
		gap: var(--s-4);
		text-align: center;
		padding: var(--s-7);
	}

	@media (max-width: 1100px) {
		.top {
			grid-template-columns: 1fr auto;
		}
		.searchbox {
			grid-column: 1 / -1;
		}
	}
	@media (max-width: 820px) {
		.top {
			grid-template-columns: 1fr;
		}
		.dict :global(.deco--a),
		.dict :global(.deco--b) {
			display: none;
		}
	}
</style>
