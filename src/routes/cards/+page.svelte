<script>
	import Icon from '$lib/components/Icon.svelte';
	import ZekoSpeak from '$lib/components/ZekoSpeak.svelte';
	import Motif from '$lib/components/Motif.svelte';
	import KanaColumn from '$lib/components/KanaColumn.svelte';
	import CardDetail from '$lib/components/CardDetail.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
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
	let activeGroup = $state('gojuon');

	const exampleCounts = (() => {
		const map = {};
		for (const w of WORDS) for (const id of w.soundIds) map[id] = (map[id] ?? 0) + 1;
		return map;
	})();

	const PRESETS = [
		{ id: 'starter', label: 'Vowels + K', sub: '10 sounds', motif: 'sakura', ids: () => cols(['gojuon-a', 'gojuon-k']) },
		{ id: 'base', label: 'All gojūon', sub: '46 sounds', motif: 'torii', ids: () => group('gojuon') },
		{ id: 'voiced', label: '+ dakuten', sub: '71 sounds', motif: 'lantern', ids: () => [...group('gojuon'), ...group('dakuten')] },
		{ id: 'everything', label: 'Everything', sub: '128 sounds', motif: 'daruma', ids: () => ALL_SOUNDS.map((s) => s.id) }
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

	const current = $derived(GROUPS.find((g) => g.id === activeGroup));
	const currentState = $derived(groupState(current));
</script>

<svelte:head><title>Cards · Zekocards</title></svelte:head>

<section class="deck">
	<Motif name="torii" size={130} rotate={-7} class="deco deco--a" opacity={0.35} />
	<Motif name="wave" size={150} rotate={0} class="deco deco--b" opacity={0.4} />

	<div class="wrap wrap--wide">
		<!-- ===== HUD ===== -->
		<div class="hud">
			<div class="hud-title">
				<span class="eyebrow">The deck · 五十音図</span>
				<h1>Choose what you<br />are learning today.</h1>
			</div>

			<div class="hud-counts">
				<div class="count count--a">
					<strong>{$selectionSummary.sounds}</strong><span>sounds</span>
				</div>
				<div class="count count--b">
					<strong>{$selectionSummary.words}</strong><span>words unlocked</span>
				</div>
				<a class="btn btn--lg train" href="/practice">
					<Icon name="target" size={20} /> Train now
				</a>
			</div>

			<ZekoSpeak
				class="hud-zeko"
				size={130}
				align="end"
				lines={[
					'Two columns is plenty. Really.',
					'Tap a header to take the whole row.',
					'Cards you pick are the only thing I will ever ask you.',
					'Write an anchor on a card — I will use it later.'
				]}
			/>
		</div>

		<!-- ===== PRESET RAIL ===== -->
		<div class="rail presets">
			{#each PRESETS as p}
				<button class="preset" onclick={() => applyPreset(p)}>
					<Motif name={p.motif} size={54} rotate={-6} float={false} />
					<span class="p-label">{p.label}</span>
					<span class="p-sub">{p.sub}</span>
				</button>
			{/each}
			<button class="preset preset--ghost" onclick={selectAll}>
				<Icon name="plus" size={26} /><span class="p-label">Select all</span>
			</button>
			<button class="preset preset--ghost" onclick={clearSelection}>
				<Icon name="cross" size={26} /><span class="p-label">Clear</span>
			</button>
		</div>

		<!-- ===== CONTROL BAR ===== -->
		<div class="bar">
			<div class="seg">
				{#each SCRIPTS as s}
					<button class="seg-btn" class:is-on={$script === s.id} onclick={() => script.set(s.id)}>
						<span class="jp">{s.jp}</span>
						{s.label}
					</button>
				{/each}
			</div>

			<div class="tabs">
				{#each GROUPS as g}
					{@const gs = groupState(g)}
					<button class="tab" aria-pressed={activeGroup === g.id} onclick={() => (activeGroup = g.id)}>
						{g.label}
						<span class="pill">{gs.on}/{gs.total}</span>
					</button>
				{/each}
			</div>

			<button
				class="tab"
				aria-pressed={!$settings.showRomajiOnCards}
				onclick={() => updateSetting('showRomajiOnCards', !$settings.showRomajiOnCards)}
			>
				<Icon name={$settings.showRomajiOnCards ? 'eye' : 'eyeOff'} size={16} />
				romaji
			</button>
		</div>

		<!-- ===== THE TABLE ===== -->
		{#key activeGroup}
			<div class="group anim-rise">
				<div class="group-head">
					<div>
						<h2>{current.label} <span class="jp">{current.jp}</span></h2>
						<p>{current.blurb}</p>
					</div>
					<button
						class="btn btn--ghost"
						onclick={() => setGroup(current.id, !currentState.all)}
					>
						<Icon name={currentState.all ? 'minus' : 'plus'} size={17} />
						{currentState.all ? 'remove group' : 'add whole group'}
					</button>
				</div>

				<div class="table scroll">
					{#each current.columns as column (column.id)}
						<KanaColumn
							{column}
							script={$script}
							selectedIds={$selectedSounds}
							statsMap={$stats}
							anchorsMap={$anchors[$script] ?? {}}
							{exampleCounts}
							showRomaji={$settings.showRomajiOnCards}
							onToggleSound={toggleSound}
							onToggleColumn={toggleColumn}
							onOpen={(s) => (openSound = s)}
						/>
					{/each}
				</div>
			</div>
		{/key}
	</div>
</section>

<Modal
	open={!!openSound}
	label="Card detail"
	size={640}
	onClose={() => (openSound = null)}
>
	<CardDetail sound={openSound} script={$script} onToggle={toggleSound} />
</Modal>

<style>
	.deck {
		position: relative;
		padding-block: var(--s-6) var(--s-8);
		overflow: hidden;
	}
	.deck :global(.deco--a) {
		position: absolute;
		right: 3%;
		top: 8%;
	}
	.deck :global(.deco--b) {
		position: absolute;
		left: -20px;
		bottom: 6%;
	}

	/* ===== HUD ===== */
	.hud {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		align-items: end;
		gap: var(--s-5);
		margin-bottom: var(--s-5);
	}
	.hud h1 {
		font-size: var(--fs-3xl);
		line-height: 1.02;
		margin-top: var(--s-2);
	}
	.hud-counts {
		display: flex;
		align-items: center;
		gap: var(--s-3);
	}
	.count {
		display: grid;
		justify-items: center;
		padding: var(--s-3) var(--s-4);
		border-radius: var(--r-md);
		border: 2px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: 0 5px 0 var(--surface-line);
		min-width: 108px;
	}
	.count--a {
		background: var(--aqua-soft);
		border-color: var(--aqua-deep);
		box-shadow: 0 5px 0 var(--aqua-deep);
	}
	.count strong {
		font-family: var(--font-display);
		font-size: var(--fs-2xl);
		line-height: 1;
		color: var(--ink-strong);
	}
	.count span {
		font-size: var(--fs-2xs);
		font-weight: 700;
		color: var(--ink-muted);
	}
	.hud :global(.hud-zeko) {
		align-self: end;
	}

	/* ===== PRESETS ===== */
	.presets {
		gap: var(--s-3);
	}
	.preset {
		display: grid;
		justify-items: center;
		gap: 2px;
		width: 150px;
		padding: var(--s-3) var(--s-3) var(--s-4);
		border-radius: var(--r-tile);
		border: 3px solid var(--cello);
		background: var(--bg-raised);
		box-shadow: 0 6px 0 var(--cello);
		cursor: pointer;
		transition:
			transform 130ms var(--ease-spring),
			box-shadow 130ms var(--ease-out);
	}
	.preset:hover {
		transform: translateY(-4px) rotate(-1deg);
		box-shadow: 0 10px 0 var(--cello);
	}
	.preset:active {
		transform: translateY(3px);
		box-shadow: 0 2px 0 var(--cello);
	}
	.preset--ghost {
		border-color: var(--surface-line-strong);
		box-shadow: 0 6px 0 var(--surface-line-strong);
		color: var(--wedge-deep);
		align-content: center;
		width: 124px;
	}
	.preset--ghost:hover,
	.preset--ghost:active {
		box-shadow: 0 10px 0 var(--surface-line-strong);
	}
	.p-label {
		font-family: var(--font-display);
		font-size: var(--fs-sm);
		font-weight: 800;
		color: var(--ink-strong);
	}
	.p-sub {
		font-size: var(--fs-2xs);
		font-weight: 700;
		color: var(--ink-muted);
	}

	/* ===== BAR ===== */
	.bar {
		display: flex;
		align-items: center;
		gap: var(--s-4);
		flex-wrap: wrap;
		padding: var(--s-3);
		margin-bottom: var(--s-5);
		border-radius: var(--r-tile);
		border: 2px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: var(--edge);
		position: sticky;
		top: calc(var(--header-h) + 8px);
		z-index: 12;
	}

	.seg {
		display: flex;
		padding: 4px;
		gap: 4px;
		border-radius: var(--r-md);
		background: var(--bg-tint);
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
		transition: all var(--t-fast) var(--ease-out);
	}
	.seg-btn .jp {
		font-family: var(--font-jp);
		font-size: var(--fs-sm);
	}
	.seg-btn.is-on {
		background: var(--cello);
		color: #fff;
		box-shadow: 0 3px 0 var(--cello-ink);
	}

	.tabs {
		display: flex;
		gap: var(--s-2);
		flex-wrap: wrap;
	}
	.tabs .pill {
		font-size: var(--fs-2xs);
		opacity: 0.75;
	}
	.bar > .tab:last-child {
		margin-left: auto;
	}

	/* ===== TABLE ===== */
	.group-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--s-4);
		margin-bottom: var(--s-4);
		flex-wrap: wrap;
	}
	.group-head h2 {
		font-size: var(--fs-2xl);
	}
	.group-head .jp {
		font-family: var(--font-jp);
		font-size: var(--fs-md);
		color: var(--ink-muted);
	}
	.group-head p {
		font-size: var(--fs-sm);
		color: var(--ink-muted);
		max-width: min(64ch, 100%);
		margin-top: 4px;
	}

	.table {
		display: flex;
		gap: var(--s-4);
		align-items: flex-start;
		padding-bottom: var(--s-4);
		overflow-x: auto;
	}

	@media (max-width: 1080px) {
		.hud {
			grid-template-columns: 1fr;
			align-items: start;
		}
		.hud :global(.hud-zeko) {
			display: none;
		}
	}
	@media (max-width: 720px) {
		.deck :global(.deco--a),
		.deck :global(.deco--b) {
			display: none;
		}
		.bar {
			position: static;
		}
		.hud-counts {
			flex-wrap: wrap;
		}
	}
</style>
