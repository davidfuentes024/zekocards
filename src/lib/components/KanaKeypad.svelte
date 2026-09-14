<script>
	/* ============================================================
	   The answer pad.

	   Whatever the settings, it holds a COMPLETE, publicly-defined
	   section of the script — never a shortlist, and never just the
	   learner's selection. That is what makes elimination impossible.

	   Two things about it are adjustable, and neither gives an
	   answer away:

	     · order — the gojūon grid is a stable layout, so finding き
	       is recall rather than visual search. Knowing that き sits
	       in the か row, い column is itself Japanese literacy: it
	       is how dictionaries, conjugation tables and the Japanese
	       keyboard are organised. Shuffling removes those landmarks.

	     · scope — how many whole groups the pad covers. It grows
	       with the selection by a public rule, so a beginner holding
	       five vowels is not made to hunt through 104 symbols they
	       have never seen. `selected` narrows it to exactly the
	       learner's own symbols, in either order.

	   `required` lists sound ids the current answer needs. They are
	   always on the pad, whatever the scope, so a drill whose answer
	   is not bound to the selection (kanji readings) stays solvable.
	   ============================================================ */
	import { shuffle } from '$lib/utils/random.js';
	import { padGroups, gridRows, glyphOf } from '$lib/data/kana.js';
	import { selectedSounds } from '$lib/stores/selection.js';
	import { difficulty } from '$lib/stores/difficulty.js';

	let {
		sounds = [],
		script = 'hiragana',
		disabled = false,
		markedCorrect = null,
		markedWrong = null,
		dim = [],
		shuffleKey = 0,
		size = 'md',
		required = [],
		onPick = () => {}
	} = $props();

	const inScope = $derived.by(() => {
		const need = new Set(required);
		if ($difficulty.scope === 'selected') {
			return sounds.filter((s) => $selectedSounds.has(s.id) || need.has(s.id));
		}
		const groups = new Set(padGroups([...$selectedSounds, ...need], $difficulty.scope));
		return sounds.filter((s) => groups.has(s.group));
	});

	const keys = $derived.by(() => {
		shuffleKey;
		return shuffle(inScope);
	});
	const rows = $derived(gridRows(inScope, script));

	const dimSet = $derived(new Set(dim));
</script>

{#if $difficulty.order === 'grid'}
	<div class="table scroll" role="group" aria-label="The kana table, complete">
		{#each rows as row (row.id)}
			<div class="row">
				<span class="rowlabel jp muted">{row.label}</span>
				{#each row.slots as s, i (i)}
					{#if s}
						<button
							class="key jp"
							class:wide={glyphOf(s, script).length > 1}
							class:ok={markedCorrect === s.id}
							class:bad={markedWrong === s.id}
							class:dim={dimSet.has(s.id)}
							{disabled}
							onclick={() => onPick(s)}
						>
							{glyphOf(s, script)}
						</button>
					{:else}
						<span class="gap"></span>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
{:else}
	<div class="pad pad--{size} scroll" role="group" aria-label="Every symbol in this script">
		{#each keys as s (s.id)}
			<button
				class="key jp"
				class:wide={glyphOf(s, script).length > 1}
				class:ok={markedCorrect === s.id}
				class:bad={markedWrong === s.id}
				class:dim={dimSet.has(s.id)}
				{disabled}
				onclick={() => onPick(s)}
			>
				{glyphOf(s, script)}
			</button>
		{/each}
	</div>
{/if}

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

	/* the kana table itself: five vowel columns and a named row */
	.table {
		display: flex;
		flex-direction: column;
		gap: 6px;
		max-height: 46vh;
		padding: var(--s-3);
		background: var(--bg-tint);
		border: 2px solid var(--surface-line);
		border-radius: var(--r-tile);
	}

	.row {
		display: grid;
		grid-template-columns: 2.4rem repeat(5, 1fr);
		gap: 6px;
		align-items: center;
	}

	.rowlabel {
		font-size: 0.75rem;
		text-align: right;
		white-space: nowrap;
	}

	.gap {
		aspect-ratio: 1;
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
		.table {
			max-height: 42vh;
		}
		.row {
			grid-template-columns: 2rem repeat(5, 1fr);
			gap: 5px;
		}
		.key {
			font-size: 1.25rem;
		}
		.key.wide {
			font-size: 0.85rem;
		}
	}
</style>
