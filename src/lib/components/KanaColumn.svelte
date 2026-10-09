<script>
	import SoundCard from './SoundCard.svelte';
	import Icon from './Icon.svelte';

	let {
		column,
		script = 'hiragana',
		selectedIds,
		statsMap = {},
		anchorsMap = {},
		exampleCounts = {},
		showRomaji = true,
		onToggleSound,
		onToggleColumn,
		onOpen = null
	} = $props();

	const visible = $derived(column.sounds.filter((s) => (script === 'hiragana' ? s.h : s.k)));
	const onCount = $derived(visible.filter((s) => selectedIds.has(s.id)).length);
	const allOn = $derived(visible.length > 0 && onCount === visible.length);
</script>

{#if visible.length}
	<div class="col">
		<button class="col-head" class:is-on={allOn} onclick={() => onToggleColumn(column.id)}>
			<span class="label">{column.label}</span>
			<span class="jp">{column.jp}</span>
			<span class="mark"><Icon name={allOn ? 'check' : 'plus'} size={14} /></span>
			<span class="count">{onCount}/{visible.length}</span>
		</button>

		<div class="cards">
			{#each visible as sound (sound.id)}
				<SoundCard
					{sound}
					{script}
					{showRomaji}
					selected={selectedIds.has(sound.id)}
					mastery={(statsMap[sound.id]?.level ?? 0) / 5}
					anchor={anchorsMap[sound.id]}
					examples={exampleCounts[sound.id] ?? 0}
					onToggle={onToggleSound}
					{onOpen}
				/>
			{/each}
		</div>
	</div>
{/if}

<style>
	.col {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		width: 172px;
	}

	.col-head {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 2px var(--s-2);
		padding: var(--s-3);
		background: var(--bg-raised);
		border: 1px solid var(--surface-line);
		border-radius: var(--r-md);
		box-shadow: var(--sh-1);
		cursor: pointer;
		text-align: left;
		transition:
			background var(--t-fast) var(--ease-out),
			border-color var(--t-fast) var(--ease-out),
			transform 120ms var(--ease-spring),
			box-shadow 120ms var(--ease-out);
	}
	.col-head:hover {
		transform: translateY(-3px);
		border-color: var(--aqua-deep);
		box-shadow: var(--sh-1);
	}
	.col-head:active {
		transform: scale(0.97);
		box-shadow: var(--sh-1);
	}
	.col-head.is-on {
		background: var(--aqua);
		border-color: var(--aqua-deep);
		box-shadow: var(--sh-1);
	}

	.label {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: var(--fs-md);
		letter-spacing: var(--tracking-wide);
		color: var(--ink-strong);
	}
	.jp {
		grid-column: 1;
		font-family: var(--font-jp);
		font-size: var(--fs-2xs);
		color: var(--ink-muted);
	}
	.is-on .jp {
		color: var(--cello);
	}
	.mark {
		grid-row: 1;
		grid-column: 2;
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: var(--r-sm);
		background: var(--bg-tint);
		color: var(--wedge-deep);
	}
	.is-on .mark {
		background: var(--cello);
		color: var(--on-accent);
	}
	.count {
		grid-row: 2;
		grid-column: 2;
		font-family: var(--font-display);
		font-size: var(--fs-2xs);
		font-weight: 800;
		color: var(--ink-muted);
		text-align: right;
	}

	.cards {
		display: grid;
		gap: var(--s-3);
	}

	@media (max-width: 720px) {
		.col {
			width: 146px;
		}
	}
</style>
