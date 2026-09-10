<script>
	import Icon from '$lib/components/Icon.svelte';
	import ZekoSpeak from '$lib/components/ZekoSpeak.svelte';
	import Motif from '$lib/components/Motif.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import MasteryRing from '$lib/components/MasteryRing.svelte';
	import { ALL_COLUMNS, SOUND_BY_ID } from '$lib/data/kana.js';
	import { stats, totals, overall, dayStreak, last30, MAX_LEVEL } from '$lib/stores/progress.js';
	import { anchors, clearAnchor } from '$lib/stores/associations.js';
	import { settings, updateSetting } from '$lib/stores/settings.js';
	import { script } from '$lib/stores/selection.js';
	import { clearAll } from '$lib/stores/persisted.js';

	let confirming = $state(false);
	let panel = $state('weak'); // weak | map | anchors | settings

	const weakest = $derived(
		Object.entries($stats)
			.filter(([, s]) => s.seen >= 2)
			.map(([id, s]) => ({ sound: SOUND_BY_ID.get(id), s, acc: s.ok / s.seen }))
			.filter((x) => x.sound)
			.sort((a, b) => a.acc - b.acc || b.s.seen - a.s.seen)
			.slice(0, 12)
	);

	const maxDay = $derived(Math.max(1, ...$last30.map((d) => d.count)));

	const TABS = [
		{ id: 'weak', label: 'Weak spots', jp: '弱点', icon: 'target' },
		{ id: 'map', label: 'Mastery map', jp: '習得図', icon: 'grid' },
		{ id: 'anchors', label: 'Anchors', jp: '連想帳', icon: 'pencil' },
		{ id: 'settings', label: 'Settings', jp: '設定', icon: 'gear' }
	];

	function exportData() {
		const blob = new Blob(
			[
				JSON.stringify(
					{
						exported: new Date().toISOString(),
						stats: $stats,
						anchors: $anchors,
						totals: $totals,
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

<section class="pg">
	<Motif name="koi" size={130} rotate={-10} class="deco deco--a" opacity={0.35} />
	<Motif name="lantern" size={100} rotate={7} class="deco deco--b" opacity={0.45} />

	<div class="wrap wrap--wide">
		<div class="top">
			<div>
				<span class="eyebrow">Progress · 記録</span>
				<h1>Everything you drilled,<br /><em>kept in this browser.</em></h1>
			</div>
			<ZekoSpeak
				size={150}
				mood={$dayStreak > 0 ? 'cheer' : 'sleep'}
				align="end"
				lines={
					$dayStreak > 0
						? [`${$dayStreak} days in a row. Do not break it today.`, 'Weak spots first. Always.']
						: ['Nothing today yet.', 'Ten minutes is enough. Start.']
				}
			/>
		</div>

		<div class="scores">
			<Reveal from="tilt">
				<div class="score score--a">
					<Icon name="target" size={24} />
					<strong>{$overall.answers}</strong><span>answers</span>
					<small>{$overall.accuracy}% correct</small>
				</div>
			</Reveal>
			<Reveal from="tilt" delay={80}>
				<div class="score">
					<Icon name="star" size={24} />
					<strong>{$overall.mastered}</strong><span>mastered</span>
					<small>{$overall.learning} in progress</small>
				</div>
			</Reveal>
			<Reveal from="tilt" delay={160}>
				<div class="score score--b">
					<Icon name="flame" size={24} />
					<strong>{$dayStreak}</strong><span>day streak</span>
					<small>{$totals.sessions} sessions</small>
				</div>
			</Reveal>
			<Reveal from="tilt" delay={240}>
				<div class="score">
					<Icon name="pencil" size={24} />
					<strong>{Object.keys($anchors).length}</strong><span>anchors</span>
					<small>your own words</small>
				</div>
			</Reveal>
			<Reveal from="tilt" delay={320} class="days-wrap">
				<div class="score score--days">
					<span class="d-label">last 30 days</span>
					<div class="days">
						{#each $last30 as d}
							<span
								class="day"
								class:empty={!d.count}
								style="--h:{Math.max(8, (d.count / maxDay) * 100)}%"
								title="{d.key}: {d.count} answers"
							></span>
						{/each}
					</div>
				</div>
			</Reveal>
		</div>

		<div class="tabs">
			{#each TABS as t}
				<button class="tab" aria-pressed={panel === t.id} onclick={() => (panel = t.id)}>
					<Icon name={t.icon} size={17} />
					{t.label}
					<span class="jp">{t.jp}</span>
				</button>
			{/each}
		</div>

		<div class="board">
			{#if panel === 'weak'}
				{#if weakest.length}
					<div class="weak">
						{#each weakest as w}
							<div class="wcard">
								<span class="jp glyph">{$script === 'hiragana' ? (w.sound.h ?? w.sound.k) : (w.sound.k ?? w.sound.h)}</span>
								<div>
									<strong>{w.sound.r}</strong>
									<span class="muted">{Math.round(w.acc * 100)}% · {w.s.seen} tries</span>
								</div>
								<MasteryRing value={w.s.level / MAX_LEVEL} size={32} />
							</div>
						{/each}
					</div>
					<a class="btn btn--lg" href="/practice/blind">
						<Icon name="target" size={18} /> drill these now
					</a>
				{:else}
					<p class="muted">Answer a few rounds and your weak spots will surface here.</p>
				{/if}
			{:else if panel === 'map'}
				<div class="map">
					{#each ALL_COLUMNS as c (c.id)}
						<div class="mcol">
							<span class="clabel">{c.label}</span>
							<div class="dots">
								{#each c.sounds as s (s.id)}
									{@const lvl = $stats[s.id]?.level ?? 0}
									<span class="dot" style="--fill:{(lvl / MAX_LEVEL) * 100}%" title="{s.r}: level {lvl}/{MAX_LEVEL}">
										<i class="jp">{$script === 'hiragana' ? (s.h ?? s.k) : (s.k ?? s.h)}</i>
									</span>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{:else if panel === 'anchors'}
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
										<Icon name="trash" size={17} />
									</button>
								</li>
							{/if}
						{/each}
					</ul>
				{:else}
					<p class="muted">Nothing written yet. Open any card and write the word that makes it stick.</p>
				{/if}
			{:else}
				<div class="settings">
					<label class="opt">
						<input type="checkbox" checked={$settings.petals} onchange={(e) => updateSetting('petals', e.currentTarget.checked)} />
						<span>Falling petals</span>
					</label>
					<label class="opt">
						<input type="checkbox" checked={$settings.strictRomaji} onchange={(e) => updateSetting('strictRomaji', e.currentTarget.checked)} />
						<span>Strict romaji</span>
					</label>
					<label class="opt">
						<input type="checkbox" checked={$settings.showRomajiOnCards} onchange={(e) => updateSetting('showRomajiOnCards', e.currentTarget.checked)} />
						<span>Show romaji on cards</span>
					</label>
					<label class="opt range">
						<span>Speech speed · {$settings.speechRate.toFixed(2)}×</span>
						<input type="range" min="0.5" max="1.2" step="0.05" value={$settings.speechRate} oninput={(e) => updateSetting('speechRate', +e.currentTarget.value)} />
					</label>
				</div>

				<div class="danger-row">
					<button class="btn btn--ghost" onclick={exportData}>
						<Icon name="scroll" size={17} /> export my data
					</button>
					{#if confirming}
						<button class="btn danger" onclick={wipe}><Icon name="trash" size={17} /> yes, erase everything</button>
						<button class="btn btn--ghost" onclick={() => (confirming = false)}>cancel</button>
					{:else}
						<button class="btn btn--ghost" onclick={() => (confirming = true)}>
							<Icon name="trash" size={17} /> reset all progress
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.pg {
		position: relative;
		padding-block: var(--s-6) var(--s-8);
		overflow: hidden;
	}
	.pg :global(.deco--a) {
		position: absolute;
		left: 1%;
		bottom: 12%;
	}
	.pg :global(.deco--b) {
		position: absolute;
		right: 2%;
		bottom: 6%;
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
		margin-top: var(--s-2);
	}
	.top h1 em {
		font-style: normal;
		color: var(--wedge);
	}

	.scores {
		display: grid;
		grid-template-columns: repeat(4, 1fr) 1.6fr;
		gap: var(--s-3);
		margin-bottom: var(--s-6);
	}
	.scores > :global(*:nth-child(even)) {
		margin-top: var(--s-4);
	}
	.score {
		display: grid;
		justify-items: center;
		gap: 0;
		height: 100%;
		padding: var(--s-4) var(--s-3);
		border-radius: var(--r-tile);
		border: 2px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: var(--edge);
		color: var(--wedge-deep);
		text-align: center;
	}
	.score--a {
		background: var(--aqua-soft);
	}
	.score--b {
		background: var(--mint);
	}
	.score strong {
		font-family: var(--font-display);
		font-size: var(--fs-3xl);
		line-height: 1;
		color: var(--ink-strong);
	}
	.score span {
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 800;
		color: var(--ink);
	}
	.score small {
		font-size: var(--fs-2xs);
		color: var(--ink-muted);
	}
	.score--days {
		justify-items: stretch;
		align-content: space-between;
	}
	.d-label {
		font-size: var(--fs-2xs) !important;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
		color: var(--ink-muted) !important;
		text-align: left;
	}
	.days {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		height: 62px;
		margin-top: var(--s-2);
	}
	.day {
		flex: 1;
		height: var(--h);
		background: var(--wedge);
		border-radius: 3px;
	}
	.day.empty {
		background: var(--surface-line);
	}

	.tabs {
		display: flex;
		gap: var(--s-2);
		flex-wrap: wrap;
		margin-bottom: calc(var(--s-3) * -1);
		position: relative;
		z-index: 2;
	}
	.tabs .jp {
		font-family: var(--font-jp);
		font-size: var(--fs-2xs);
		opacity: 0.7;
	}

	.board {
		padding: var(--s-6) var(--s-5) var(--s-5);
		border-radius: var(--r-tile);
		border: 2px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: var(--edge);
	}

	.weak {
		display: grid;
		gap: var(--s-3);
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		margin-bottom: var(--s-4);
	}
	.wcard {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-2) var(--s-3);
		background: var(--bg-tint);
		border: 2px solid var(--surface-line);
		border-radius: var(--r-md);
	}
	.glyph {
		font-family: var(--font-jp);
		font-size: var(--fs-2xl);
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
		gap: var(--s-4);
		flex-wrap: wrap;
	}
	.mcol {
		display: grid;
		gap: 5px;
	}
	.clabel {
		font-family: var(--font-display);
		font-size: var(--fs-2xs);
		font-weight: 800;
		letter-spacing: var(--tracking-wide);
		color: var(--ink-muted);
	}
	.dots {
		display: flex;
		gap: 4px;
	}
	.dot {
		position: relative;
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: var(--r-sm);
		background: var(--bg-tint);
		border: 2px solid var(--surface-line);
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
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	}
	.anchors li {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-2) var(--s-3);
		background: var(--bg-tint);
		border: 2px solid var(--surface-line);
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
		width: 34px;
		height: 34px;
		border: 0;
		border-radius: var(--r-sm);
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
		gap: var(--s-4);
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		margin-bottom: var(--s-5);
	}
	.opt {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		font-size: var(--fs-sm);
		font-weight: 600;
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
		width: 20px;
		height: 20px;
		accent-color: var(--wedge);
	}
	.danger-row {
		display: flex;
		gap: var(--s-3);
		flex-wrap: wrap;
		padding-top: var(--s-4);
		border-top: 2px dashed var(--surface-line);
	}
	.danger {
		--btn-bg: var(--hanko);
		--btn-edge: #9d422f;
		--btn-fg: #fff;
	}

	@media (max-width: 1080px) {
		.scores {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 820px) {
		.top {
			grid-template-columns: 1fr;
		}
		.scores > :global(*) {
			margin-top: 0 !important;
		}
		.pg :global(.deco--a),
		.pg :global(.deco--b) {
			display: none;
		}
	}
</style>
