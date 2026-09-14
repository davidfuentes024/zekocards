<script>
	/* Three dials and a preset. Folded by default: the summary line says
	   what is set, and each dial explains itself only when tapped. */
	import { slide } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import {
		CLOCKS,
		ORDERS,
		SCOPES,
		PRESETS,
		DIAL_INFO,
		difficulty,
		presetId,
		setDial,
		setPreset
	} from '$lib/stores/difficulty.js';

	/* `collapsible` false renders the board already open, with no header
	   (used inside the drill's own difficulty modal). */
	let { collapsible = true } = $props();

	let open = $state(false);
	let info = $state(null);

	const dials = [
		{ key: 'clock', label: 'Clock', jp: '時間', options: CLOCKS },
		{ key: 'order', label: 'Pad order', jp: '並び', options: ORDERS },
		{ key: 'scope', label: 'Pad scope', jp: '範囲', options: SCOPES }
	];

	const labelOf = (list, id) => list.find((o) => o.id === id)?.label ?? id;
	const preset = $derived(PRESETS.find((p) => p.id === $presetId));
	const summary = $derived(
		[
			`${labelOf(CLOCKS, $difficulty.clock)} clock`,
			labelOf(ORDERS, $difficulty.order),
			labelOf(SCOPES, $difficulty.scope)
		].join(' · ')
	);
</script>

<div class="board">
	{#if collapsible}
		<button class="head" aria-expanded={open} onclick={() => (open = !open)}>
			<span class="eyebrow">Difficulty <span class="jp">難度</span></span>
			<span class="tab is-on preset">{preset?.label ?? 'Custom'} <span class="jp">{preset?.jp ?? '自'}</span></span>
			<span class="summary">{summary}</span>
			<span class="chev" class:up={open}><Icon name="chevronDown" size={18} /></span>
		</button>
	{/if}

	{#if open || !collapsible}
		<div class="body" transition:slide={{ duration: 180 }}>
			<div class="rail">
				{#each PRESETS as p (p.id)}
					<button
						class="tab"
						class:is-on={$presetId === p.id}
						title={p.blurb}
						onclick={() => setPreset(p.id)}
					>
						{p.label} <span class="jp">{p.jp}</span>
					</button>
				{/each}
				{#if $presetId === 'custom'}
					<span class="tab is-on">Custom <span class="jp">自</span></span>
				{/if}
			</div>

			{#each dials as d (d.key)}
				<div class="dial">
					<button
						class="dial-head"
						aria-expanded={info === d.key}
						onclick={() => (info = info === d.key ? null : d.key)}
					>
						<span class="eyebrow">{d.label} <span class="jp">{d.jp}</span></span>
						<span class="chev" class:up={info === d.key}><Icon name="chevronDown" size={14} /></span>
					</button>
					{#if info === d.key}
						<ul class="note" transition:slide={{ duration: 150 }}>
							<li class="what">{DIAL_INFO[d.key].what}</li>
							{#each d.options as o (o.id)}
								<li class:cur={$difficulty[d.key] === o.id}>
									<strong>{o.label}</strong> — {DIAL_INFO[d.key].options[o.id]}
								</li>
							{/each}
						</ul>
					{/if}
					<div class="rail">
						{#each d.options as o (o.id)}
							<button
								class="tab"
								class:is-on={$difficulty[d.key] === o.id}
								onclick={() => setDial(d.key, o.id)}
							>
								{o.label} <span class="jp">{o.jp}</span>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.board {
		display: grid;
		gap: var(--s-3);
	}

	.head,
	.dial-head {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		width: 100%;
		padding: 0;
		background: none;
		border: 0;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.head {
		flex-wrap: wrap;
	}

	.head .summary {
		flex: 1;
		min-width: 12rem;
		font-size: var(--fs-xs);
		font-weight: 700;
		color: var(--ink-soft);
	}

	.head .preset {
		pointer-events: none;
		font-size: var(--fs-2xs);
	}

	.dial-head {
		width: auto;
		gap: 6px;
	}

	.chev {
		display: inline-flex;
		color: var(--ink-soft);
		transition: transform 0.18s ease;
	}

	.chev.up {
		transform: rotate(180deg);
	}

	.body {
		display: grid;
		gap: var(--s-4);
	}

	.rail {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.dial {
		display: grid;
		gap: 8px;
		padding-top: var(--s-3);
		border-top: 2px solid var(--surface-line);
	}

	.note {
		display: grid;
		gap: 4px;
		margin: 0;
		padding: var(--s-3);
		list-style: none;
		background: var(--bg-sunken);
		border-radius: var(--r-sm);
		font-size: var(--fs-xs);
		line-height: 1.5;
		color: var(--ink-soft);
	}

	.note .what {
		color: var(--ink);
		font-weight: 700;
	}

	.note .cur strong {
		color: var(--cello);
	}

	.jp {
		font-size: 0.85em;
		opacity: 0.75;
	}
</style>
