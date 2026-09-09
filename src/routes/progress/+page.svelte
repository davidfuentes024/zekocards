<script>
	import Icon from '$lib/components/Icon.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import MasteryRing from '$lib/components/MasteryRing.svelte';
	import { ALL_COLUMNS, SOUND_BY_ID } from '$lib/data/kana.js';
	import { stats, totals, overall, dayStreak, last30, MAX_LEVEL } from '$lib/stores/progress.js';
	import { anchors, clearAnchor } from '$lib/stores/associations.js';
	import { settings, updateSetting } from '$lib/stores/settings.js';
	import { script, selectedSounds } from '$lib/stores/selection.js';
	import { clearAll } from '$lib/stores/persisted.js';

	let confirming = $state(false);

	const weakest = $derived(
		Object.entries($stats)
			.filter(([, s]) => s.seen >= 2)
			.map(([id, s]) => ({ sound: SOUND_BY_ID.get(id), s, acc: s.ok / s.seen }))
			.filter((x) => x.sound)
			.sort((a, b) => a.acc - b.acc || b.s.seen - a.s.seen)
			.slice(0, 12)
	);

	const maxDay = $derived(Math.max(1, ...$last30.map((d) => d.count)));

	function exportData() {
		const blob = new Blob(
			[
				JSON.stringify(
					{
						exported: new Date().toISOString(),
						stats: $stats,
						anchors: $anchors,
						totals: $totals,
						selection: [...$selectedSounds],
						settings: $settings
					},
					null,
					2
				)
			],
			{ type: 'application/json' }
		);
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `zekocards-${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function wipe() {
		clearAll();
		location.reload();
	}
</script>

<svelte:head><title>Progress · Zekocards</title></svelte:head>

<section class="section wrap">
	<div class="top">
		<div class="stack">
			<span class="eyebrow">Progress · 記録</span>
			<h1>Everything you have drilled, kept in this browser.</h1>
			<p class="lede">
				No account holds this — it lives in local storage on this device. Export it if you want a
				copy.
			</p>
		</div>
		<Zeko mood={$dayStreak > 0 ? 'cheer' : 'sleep'} size={140} />
	</div>

	<div class="grid-auto" style="--min:210px">
		<Panel>
			<span class="eyebrow">Answers</span>
			<strong class="big">{$overall.answers}</strong>
			<p class="muted">{$overall.accuracy}% correct all time</p>
		</Panel>
		<Panel>
			<span class="eyebrow">Mastered sounds</span>
			<strong class="big">{$overall.mastered}</strong>
			<p class="muted">{$overall.learning} still in progress</p>
		</Panel>
		<Panel>
			<span class="eyebrow">Day streak</span>
			<strong class="big">{$dayStreak}</strong>
			<p class="muted">{$totals.sessions} sessions started</p>
		</Panel>
		<Panel>
			<span class="eyebrow">Anchors written</span>
			<strong class="big">{Object.keys($anchors).length}</strong>
			<p class="muted">your own mnemonics</p>
		</Panel>
	</div>

	<Panel title="Last 30 days" jp="三十日" class="mt">
		<div class="days">
			{#each $last30 as d}
				<span
					class="day"
					style="--h:{Math.max(6, (d.count / maxDay) * 100)}%"
					title="{d.key}: {d.count} answers"
					class:empty={!d.count}
				></span>
			{/each}
		</div>
	</Panel>

	<Panel title="Needs the most repetition" jp="弱点" class="mt">
		{#if weakest.length}
			<div class="weak">
				{#each weakest as w}
					<div class="wcard">
						<span class="jp glyph">{$script === 'hiragana' ? w.sound.h : w.sound.k}</span>
						<div>
							<strong>{w.sound.r}</strong>
							<span class="muted">{Math.round(w.acc * 100)}% · {w.s.seen} tries</span>
						</div>
						<MasteryRing value={w.s.level / MAX_LEVEL} size={28} />
					</div>
				{/each}
			</div>
			<a class="btn btn--sm mt2" href="/practice/recall">
				<Icon name="target" size={15} /> drill these now
			</a>
		{:else}
			<p class="muted">Answer a few rounds and your weak spots will surface here.</p>
		{/if}
	</Panel>

	<Panel title="Mastery map" jp="習得図" class="mt">
		<div class="map">
			{#each ALL_COLUMNS as c (c.id)}
				<div class="mcol">
					<span class="clabel">{c.label}</span>
					<div class="dots">
						{#each c.sounds as s (s.id)}
							{@const lvl = $stats[s.id]?.level ?? 0}
							<span
								class="dot"
								style="--fill:{(lvl / MAX_LEVEL) * 100}%"
								title="{s.r}: level {lvl}/{MAX_LEVEL}"
							>
								<i class="jp">{$script === 'hiragana' ? (s.h ?? s.k) : (s.k ?? s.h)}</i>
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</Panel>

	<Panel title="Your anchors" jp="連想帳" class="mt">
		{#if Object.keys($anchors).length}
			<ul class="anchors">
				{#each Object.entries($anchors) as [id, a] (id)}
					{@const s = SOUND_BY_ID.get(id)}
					{#if s}
						<li>
							<span class="jp glyph">{$script === 'hiragana' ? (s.h ?? s.k) : (s.k ?? s.h)}</span>
							<div>
								<strong>{a.word}</strong>
								{#if a.note}<p class="muted">{a.note}</p>{/if}
							</div>
							<button class="icon-btn" onclick={() => clearAnchor(id)} aria-label="Delete anchor">
								<Icon name="trash" size={16} />
							</button>
						</li>
					{/if}
				{/each}
			</ul>
		{:else}
			<p class="muted">Nothing written yet. Open any card and write the word that makes it stick.</p>
		{/if}
	</Panel>

	<Panel title="Settings" jp="設定" class="mt">
		<div class="settings">
			<label class="opt">
				<input
					type="checkbox"
					checked={$settings.petals}
					onchange={(e) => updateSetting('petals', e.currentTarget.checked)}
				/>
				<span>Falling petals</span>
			</label>
			<label class="opt">
				<input
					type="checkbox"
					checked={$settings.strictRomaji}
					onchange={(e) => updateSetting('strictRomaji', e.currentTarget.checked)}
				/>
				<span>Strict romaji (no long-vowel shortcuts)</span>
			</label>
			<label class="opt">
				<input
					type="checkbox"
					checked={$settings.showRomajiOnCards}
					onchange={(e) => updateSetting('showRomajiOnCards', e.currentTarget.checked)}
				/>
				<span>Show romaji on cards</span>
			</label>
			<label class="opt range">
				<span>Speech speed · {$settings.speechRate.toFixed(2)}×</span>
				<input
					type="range"
					min="0.5"
					max="1.2"
					step="0.05"
					value={$settings.speechRate}
					oninput={(e) => updateSetting('speechRate', +e.currentTarget.value)}
				/>
			</label>
		</div>

		<hr class="rule" />

		<div class="row">
			<button class="btn btn--ghost btn--sm" onclick={exportData}>
				<Icon name="scroll" size={15} /> export my data
			</button>
			{#if confirming}
				<button class="btn btn--sm danger" onclick={wipe}>
					<Icon name="trash" size={15} /> yes, erase everything
				</button>
				<button class="btn btn--ghost btn--sm" onclick={() => (confirming = false)}>cancel</button>
			{:else}
				<button class="btn btn--ghost btn--sm" onclick={() => (confirming = true)}>
					<Icon name="trash" size={15} /> reset all progress
				</button>
			{/if}
		</div>
	</Panel>
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
	.big {
		display: block;
		font-family: var(--font-display);
		font-size: var(--fs-3xl);
		line-height: 1;
		color: var(--ink-strong);
	}
	:global(.mt) {
		margin-top: var(--s-5);
	}
	.mt2 {
		margin-top: var(--s-4);
	}

	.days {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		height: 90px;
	}
	.day {
		flex: 1;
		height: var(--h);
		background: var(--wedge);
		border-radius: var(--r-xs);
		transition: height var(--t-slow) var(--ease-out);
	}
	.day.empty {
		background: var(--mint-shadow);
	}

	.weak {
		display: grid;
		gap: var(--s-2);
		grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
	}
	.wcard {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-2) var(--s-3);
		background: var(--bg-sunken);
		border-radius: var(--r-md);
	}
	.glyph {
		font-family: var(--font-jp);
		font-size: var(--fs-xl);
		color: var(--ink-strong);
	}
	.wcard strong {
		display: block;
		font-family: var(--font-display);
	}
	.wcard span.muted {
		font-size: var(--fs-2xs);
	}
	.wcard :global(.ring) {
		margin-left: auto;
	}

	.map {
		display: flex;
		gap: var(--s-3);
		flex-wrap: wrap;
	}
	.mcol {
		display: grid;
		gap: 4px;
	}
	.clabel {
		font-size: var(--fs-2xs);
		font-weight: 700;
		letter-spacing: var(--tracking-wide);
		color: var(--ink-muted);
	}
	.dots {
		display: flex;
		gap: 3px;
	}
	.dot {
		position: relative;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: var(--r-sm);
		background: var(--mint-shadow);
		overflow: hidden;
	}
	.dot::before {
		content: '';
		position: absolute;
		inset: auto 0 0 0;
		height: var(--fill);
		background: var(--aqua);
	}
	.dot i {
		position: relative;
		font-family: var(--font-jp);
		font-style: normal;
		font-size: var(--fs-sm);
		color: var(--cello);
	}

	.anchors {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--s-2);
	}
	.anchors li {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-2) var(--s-3);
		background: var(--bg-sunken);
		border-radius: var(--r-md);
	}
	.anchors strong {
		font-family: var(--font-display);
	}
	.anchors p {
		font-size: var(--fs-xs);
	}
	.icon-btn {
		margin-left: auto;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--ink-muted);
		cursor: pointer;
	}
	.icon-btn:hover {
		background: var(--bad-bg);
		color: var(--bad);
	}

	.settings {
		display: grid;
		gap: var(--s-3);
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	}
	.opt {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		font-size: var(--fs-sm);
		cursor: pointer;
	}
	.opt.range {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--s-1);
	}
	.opt.range input {
		width: 100%;
		accent-color: var(--wedge);
	}
	.opt input[type='checkbox'] {
		width: 18px;
		height: 18px;
		accent-color: var(--wedge);
	}
	.danger {
		--btn-bg: var(--hanko);
		--btn-bd: var(--hanko);
		--btn-fg: var(--mint);
	}
</style>
