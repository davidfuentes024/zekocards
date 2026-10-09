<script>
	/* Zeko with something to say. Click him and he answers back.
	   Used across the app so he behaves like a character, not a logo. */
	import Zeko from './Zeko.svelte';
	import Motif from './Motif.svelte';

	let {
		lines = ['Pick a column and we start.'],
		mood = 'idle',
		size = 160,
		motif = null,
		motifSize = 70,
		align = 'center',
		always = false,
		class: klass = ''
	} = $props();

	let index = $state(0);
	let override = $state(null);
	let poked = $state(0);
	/* Zeko stays quiet until he is poked: no permanent speech on every screen. */
	let spoken = $state(false);
	let hideTimer;
	const live = $derived(override ?? mood);

	const MOODS = ['happy', 'cheer', 'think', 'read'];

	function poke() {
		poked += 1;
		spoken = true;
		clearTimeout(hideTimer);
		hideTimer = setTimeout(() => (spoken = false), 4500);
		index = (index + 1) % lines.length;
		override = MOODS[poked % MOODS.length];
		setTimeout(() => (override = null), 1400);
	}
</script>

<div class="zs zs--{align} {klass}">
	{#if lines.length && (always || spoken)}
		<p class="bubble" aria-live="polite">{lines[index]}</p>
	{/if}
	<div class="row">
		<button class="poke" onclick={poke} aria-label="Talk to Zeko">
			<Zeko mood={live} {size} />
		</button>
		{#if motif}
			<Motif name={motif} size={motifSize} rotate={-8} class="prop" />
		{/if}
	</div>
</div>

<style>
	.zs {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
	}
	.zs--center {
		align-items: center;
	}
	.zs--start {
		align-items: flex-start;
	}
	.zs--end {
		align-items: flex-end;
	}

	.bubble {
		max-width: 26ch;
		animation: zk-pop var(--t-base) var(--ease-ios);
	}

	.row {
		display: flex;
		align-items: flex-end;
		gap: var(--s-2);
	}

	.poke {
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		transition: transform 120ms var(--ease-spring);
	}
	.poke:hover {
		transform: scale(1.04) rotate(-2deg);
	}
	.poke:active {
		transform: scale(0.97);
	}

	.row :global(.prop) {
		margin-bottom: 6px;
	}
</style>
