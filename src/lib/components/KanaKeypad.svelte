<script>
	/* ============================================================
	   The answer pad.
	   It shows EVERY symbol of the script being studied — not the
	   learner's selection — and reshuffles on every question, so
	   position, order and grouping carry no information at all.
	   No labels, no romaji, no columns. Only symbols.
	   ============================================================ */
	import { shuffle } from '$lib/utils/random.js';

	let {
		sounds = [],
		script = 'hiragana',
		disabled = false,
		markedCorrect = null,
		markedWrong = null,
		dim = [],
		shuffleKey = 0,
		size = 'md',
		onPick = () => {}
	} = $props();

	const keys = $derived.by(() => {
		shuffleKey;
		return shuffle(sounds);
	});

	const dimSet = $derived(new Set(dim));
</script>

<div class="pad pad--{size} scroll" role="group" aria-label="Every symbol in this script">
	{#each keys as s (s.id)}
		<button
			class="key jp"
			class:wide={(script === 'hiragana' ? s.h : s.k).length > 1}
			class:ok={markedCorrect === s.id}
			class:bad={markedWrong === s.id}
			class:dim={dimSet.has(s.id)}
			{disabled}
			onclick={() => onPick(s)}
		>
			{script === 'hiragana' ? s.h : s.k}
		</button>
	{/each}
</div>

<style>
	.pad {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
		gap: 6px;
		max-height: 46vh;
		padding: var(--s-3);
		background: var(--bg-tint);
		border: 2px solid var(--surface-line);
		border-radius: var(--r-tile);
	}

	.pad--sm {
		grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
		max-height: 34vh;
	}

	.pad--lg {
		grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
	}

	.key {
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		font-size: 1.5rem;
		background: var(--bg-raised);
		border: 2px solid var(--surface-line);
		border-radius: var(--r-sm);
		box-shadow: 0 3px 0 var(--surface-line);
		color: var(--ink-strong);
		cursor: pointer;
		transition:
			transform 90ms var(--ease-out),
			box-shadow 90ms var(--ease-out),
			background var(--t-fast) var(--ease-out),
			border-color var(--t-fast) var(--ease-out);
	}

	/* contracted sounds are two glyphs — keep them on one line */
	.key.wide {
		font-size: 1.02rem;
		letter-spacing: -0.04em;
	}

	.key:hover:not(:disabled) {
		background: var(--aqua-soft);
		border-color: var(--aqua-deep);
	}

	.key:active:not(:disabled) {
		transform: translateY(3px);
		box-shadow: 0 0 0 var(--surface-line);
	}

	.key:disabled {
		cursor: default;
	}

	.key.dim {
		opacity: 0.35;
	}

	.key.ok {
		background: var(--ok-bg);
		border-color: var(--ok);
		box-shadow: 0 3px 0 var(--ok);
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.key.bad {
		background: var(--bad-bg);
		border-color: var(--bad);
		box-shadow: 0 3px 0 var(--bad);
		animation: zk-shake 360ms var(--ease-in-out);
	}

	@media (max-width: 720px) {
		.pad {
			grid-template-columns: repeat(auto-fill, minmax(46px, 1fr));
			max-height: 40vh;
		}
		.key {
			font-size: 1.25rem;
		}
		.key.wide {
			font-size: 0.85rem;
		}
	}
</style>
