<script>
	import Icon from '$lib/components/Icon.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import KanaColumn from '$lib/components/KanaColumn.svelte';
	import CardDetail from '$lib/components/CardDetail.svelte';
	import { GROUPS, SCRIPTS, ALL_SOUNDS } from '$lib/data/kana.js';
	import { WORDS } from '$lib/data/dictionary.js';
	import {
		selectedSounds,
		script,
		toggleSound,
		toggleColumn,
		setGroup,
		selectAll,
		clearSelection,
		selectionSummary
	} from '$lib/stores/selection.js';
	import { stats } from '$lib/stores/progress.js';
	import { anchors } from '$lib/stores/associations.js';
	import { settings, updateSetting } from '$lib/stores/settings.js';

	let openSound = $state(null);

	/* how many dictionary words touch each sound — shown on the cards */
	const exampleCounts = (() => {
		const map = {};
		for (const w of WORDS) for (const id of w.soundIds) map[id] = (map[id] ?? 0) + 1;
		return map;
	})();

	const PRESETS = [
		{ id: 'starter', label: 'Vowels + K', icon: 'sakura', ids: () => cols(['gojuon-a', 'gojuon-k']) },
		{ id: 'base', label: 'All gojūon', icon: 'torii', ids: () => group('gojuon') },
		{ id: 'voiced', label: 'Gojūon + dakuten', icon: 'wave', ids: () => [...group('gojuon'), ...group('dakuten')] },
		{ id: 'everything', label: 'Everything', icon: 'fuji', ids: () => ALL_SOUNDS.map((s) => s.id) }
	];

	function cols(ids) {
		return GROUPS.flatMap((g) => g.columns)
			.filter((c) => ids.includes(c.id))
			.flatMap((c) => c.sounds.map((s) => s.id));
	}
	function group(id) {
		return GROUPS.find((g) => g.id === id).columns.flatMap((c) => c.sounds.map((s) => s.id));
	}
	function applyPreset(p) {
		selectedSounds.set(new Set(p.ids()));
	}

	function groupState(g) {
		const ids = g.columns.flatMap((c) => c.sounds.map((s) => s.id));
		const on = ids.filter((i) => $selectedSounds.has(i)).length;
		return { on, total: ids.length, all: on === ids.length };
	}
</script>

<svelte:head><title>Cards · Zekocards</title></svelte:head>

<section class="section wrap">
	<div class="top">
		<div class="stack">
			<span class="eyebrow">The deck · 五十音図</span>
			<h1>Choose what you are learning today.</h1>
			<p class="lede">
				Tap a card to add its sound to your set, or tap a column header to take the whole row.
				Everything else in Zekocards — words, drills, dictionary — is rebuilt from this selection.
			</p>
		</div>
		<Zeko mood="happy" size={140} />
	</div>

	<div class="toolbar panel panel--quiet">
		<div class="row">
			{#each SCRIPTS as s}
				<button class="chip" aria-pressed={$script === s.id} onclick={() => script.set(s.id)}>
					{s.label} <span class="jp">{s.jp}</span>
				</button>
			{/each}
		</div>

		<div class="row">
			{#each PRESETS as p}
				<button class="chip" onclick={() => applyPreset(p)}>
					<Icon name={p.icon} size={14} />{p.label}
				</button>
			{/each}
			<button class="chip" onclick={selectAll}><Icon name="plus" size={14} />all</button>
			<button class="chip" onclick={clearSelection}><Icon name="cross" size={14} />none</button>
		</div>

		<div class="row right">
			<button
				class="chip"
				aria-pressed={$settings.showRomajiOnCards === false}
				onclick={() => updateSetting('showRomajiOnCards', !$settings.showRomajiOnCards)}
			>
				<Icon name={$settings.showRomajiOnCards ? 'eye' : 'eyeOff'} size={14} />
				romaji {$settings.showRomajiOnCards ? 'shown' : 'hidden'}
			</button>
			<span class="summary">
				<strong>{$selectionSummary.sounds}</strong> sounds ·
				<strong>{$selectionSummary.words}</strong> words unlocked
			</span>
			<a class="btn btn--sm" href="/practice">
				<Icon name="target" size={15} /> train
			</a>
		</div>
	</div>

	{#each GROUPS as g (g.id)}
		{@const gs = groupState(g)}
		<div class="group">
			<div class="group-head">
				<div>
					<h2>{g.label} <span class="jp muted">{g.jp}</span></h2>
					<p class="muted">{g.blurb}</p>
				</div>
				<div class="row">
					<span class="tag">{gs.on}/{gs.total}</span>
					<button class="btn btn--ghost btn--sm" onclick={() => setGroup(g.id, !gs.all)}>
						<Icon name={gs.all ? 'minus' : 'plus'} size={15} />
						{gs.all ? 'remove group' : 'add group'}
					</button>
				</div>
			</div>

			<div class="columns scroll">
				{#each g.columns as column (column.id)}
					<KanaColumn
						{column}
						script={$script}
						selectedIds={$selectedSounds}
						statsMap={$stats}
						anchorsMap={$anchors}
						{exampleCounts}
						showRomaji={$settings.showRomajiOnCards}
						onToggleSound={toggleSound}
						onToggleColumn={toggleColumn}
						onOpen={(s) => (openSound = s)}
					/>
				{/each}
			</div>
		</div>
	{/each}
</section>

<CardDetail
	sound={openSound}
	script={$script}
	onClose={() => (openSound = null)}
	onToggle={toggleSound}
/>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--s-5);
		margin-bottom: var(--s-5);
		flex-wrap: wrap;
	}
	.toolbar {
		position: sticky;
		top: calc(var(--header-h) + 6px);
		z-index: 10;
		display: flex;
		gap: var(--s-4);
		align-items: center;
		flex-wrap: wrap;
		padding: var(--s-3) var(--s-4);
		margin-bottom: var(--s-6);
	}
	.toolbar .right {
		margin-left: auto;
	}
	.summary {
		font-size: var(--fs-xs);
		color: var(--ink-muted);
	}
	.summary strong {
		font-family: var(--font-display);
		color: var(--ink-strong);
	}

	.group {
		margin-bottom: var(--s-8);
	}
	.group-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--s-4);
		margin-bottom: var(--s-4);
		flex-wrap: wrap;
	}
	.group-head h2 {
		font-size: var(--fs-xl);
	}
	.group-head .jp {
		font-size: var(--fs-sm);
	}
	.group-head p {
		font-size: var(--fs-sm);
		max-width: min(60ch, 100%);
	}

	.columns {
		display: flex;
		gap: var(--s-4);
		padding-bottom: var(--s-3);
		align-items: flex-start;
	}
	.columns > :global(*) {
		flex: 1 1 148px;
	}

	@media (max-width: 900px) {
		.columns {
			overflow-x: auto;
		}
		.columns > :global(*) {
			flex: 0 0 132px;
		}
	}
</style>
