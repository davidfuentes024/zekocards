<script>
	/* ============================================================
	   The anti-guessing answer pad.
	   It always shows EVERY sound the learner has selected — never a
	   shortlist of four. Elimination is impossible by construction.
	   ============================================================ */
	import { COLUMN_BY_ID } from '$lib/data/kana.js';

	let {
		sounds = [],
		script = 'hiragana',
		disabled = false,
		markedCorrect = null,
		markedWrong = null,
		onPick = () => {}
	} = $props();

	const groups = $derived(
		[...new Set(sounds.map((s) => s.column))].map((cid) => ({
			column: COLUMN_BY_ID.get(cid),
			items: sounds.filter((s) => s.column === cid)
		}))
	);
</script>

<div class="pad scroll" role="group" aria-label="All available sounds">
	{#each groups as g (g.column.id)}
		<div class="grp">
			<span class="grp-label">{g.column.label}</span>
			<div class="keys">
				{#each g.items as s (s.id)}
					<button
						class="key jp"
						class:ok={markedCorrect === s.id}
						class:bad={markedWrong === s.id}
						{disabled}
						onclick={() => onPick(s)}
					>
						{script === 'hiragana' ? s.h : s.k}
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.pad {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-3) var(--s-4);
		max-height: 42vh;
		padding: var(--s-3);
		background: var(--bg-sunken);
		border-radius: var(--r-lg);
		border: var(--border);
	}

	.grp {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}

	.grp-label {
		font-size: var(--fs-2xs);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		color: var(--ink-muted);
	}

	.keys {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.key {
		width: 46px;
		height: 46px;
		display: grid;
		place-items: center;
		font-size: 1.4rem;
		background: var(--bg-raised);
		border: 2px solid var(--surface-line);
		border-radius: var(--r-sm);
		color: var(--ink-strong);
		cursor: pointer;
		transition:
			transform var(--t-fast) var(--ease-spring),
			background var(--t-fast) var(--ease-out),
			border-color var(--t-fast) var(--ease-out);
	}

	.key:hover:not(:disabled) {
		transform: translateY(-2px);
		border-color: var(--wedge);
		background: var(--aqua-soft);
	}

	.key:disabled {
		cursor: default;
		opacity: 0.75;
	}

	.key.ok {
		background: var(--ok-bg);
		border-color: var(--ok);
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.key.bad {
		background: var(--bad-bg);
		border-color: var(--bad);
		animation: zk-shake 360ms var(--ease-in-out);
	}

	@media (max-width: 720px) {
		.key {
			width: 40px;
			height: 40px;
			font-size: 1.2rem;
		}
		.pad {
			max-height: 38vh;
		}
	}
</style>
