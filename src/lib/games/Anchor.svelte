<script>
	/* Your own note is the only clue, and the answer is the symbol itself. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { anchors } from '$lib/stores/associations.js';
	import { SOUND_BY_ID, scriptSounds, glyphOf } from '$lib/data/kana.js';
	import { selectedSounds, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { play as say } from '$lib/utils/audio.js';

	const drill = createDrill({ goal: 20, seconds: 10 });

	let current = $state(null);
	let wrongId = $state(null);
	let okId = $state(null);
	let locked = $state(false);
	let missed = $state(false);
	let round = $state(0);

	const pad = $derived(scriptSounds($script));
	const pool = $derived(
		Object.keys($anchors[$script] ?? {})
			.map((id) => SOUND_BY_ID.get(id))
			.filter(Boolean)
			.filter((s) => $selectedSounds.has(s.id))
			.filter((s) => glyphOf(s, $script))
	);

	/* The clock is part of the question. Running out is a miss — and the
	   symbol still has to be produced before anything moves on. */
	drill.onTimeout = () => {
		if (!current || locked || missed) return;
		missed = true;
		drill.answer(current.id, false);
		okId = current.id;
	};

	function next() {
		if (!pool.length) return;
		current = nextPrompt(pool, (s) => weightOf(s.id, $stats), drill.recent, 3);
		drill.remember(current);
		drill.mark();
		wrongId = null;
		okId = null;
		locked = false;
		missed = false;
		round += 1;
		drill.clearFeedback();
	}

	$effect(() => {
		/* Switching script swaps the whole anchor set: a question from the
		   other script has no note here, so it is dropped. */
		if (current && !pool.some((s) => s.id === current.id)) current = null;
		if (!current && pool.length) next();
	});

	function pick(s) {
		if (!current || locked) return;
		if (s.r === current.r) {
			okId = s.id;
			locked = true;
			if (!missed) drill.answer(current.id, true);
			say(glyphOf(current, $script));
			setTimeout(next, 520);
			return;
		}
		if (!missed) {
			missed = true;
			drill.answer(current.id, false);
		}
		wrongId = s.id;
		setTimeout(() => (wrongId = null), 420);
	}

	const note = $derived(current ? ($anchors[$script]?.[current.id] ?? null) : null);
</script>

<DrillFrame
	title="Anchor Recall"
	jp="連想"
	hint="Your note is the clue."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
	remainingMs={drill.remainingMs}
	budgetMs={drill.budgetMs}
>
	{#if current && note}
		<blockquote>
			<Icon name="brush" size={22} />
			<div>
				<strong>{note.word}</strong>
				{#if note.note}<p>{note.note}</p>{/if}
			</div>
		</blockquote>

		<KanaKeypad
			sounds={pad}
			script={$script}
			shuffleKey={round}
			markedCorrect={okId}
			markedWrong={wrongId}
			disabled={locked}
			onPick={pick}
		/>
	{:else}
		<div class="empty">
			<p class="lede">You have not written any anchors for the sounds you are studying.</p>
			<p class="muted">
				Open a card, write the word that makes the shape stick, and it becomes this drill.
			</p>
			<a class="btn" href="/cards"><Icon name="cards" size={18} /> Go write some anchors</a>
		</div>
	{/if}
</DrillFrame>

<style>
	blockquote {
		display: flex;
		gap: var(--s-3);
		align-items: flex-start;
		margin: 0 auto var(--s-5);
		max-width: min(48ch, 100%);
		padding: var(--s-4) var(--s-5);
		background: var(--bg-tint);
		border: 1.5px solid var(--surface-line);
		border-left: 8px solid var(--aqua);
		border-radius: var(--r-md);
		color: var(--ink);
	}
	blockquote strong {
		font-family: var(--font-display);
		font-size: var(--fs-2xl);
		line-height: 1.15;
	}
	blockquote p {
		font-size: var(--fs-sm);
		color: var(--ink-muted);
	}
	.empty {
		display: grid;
		gap: var(--s-3);
		justify-items: flex-start;
	}
</style>
