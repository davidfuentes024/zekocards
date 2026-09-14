<script>
	/* Read the Japanese, say what it means. The answer is English —
	   the interface language — never a romaji transcription. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { readableWords, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { checkMeaning } from '$lib/utils/answer.js';
	import { play as say } from '$lib/utils/audio.js';

	const drill = createDrill({ goal: 20, seconds: 15 });

	let current = $state(null);
	let value = $state('');
	let status = $state(null);
	let revealed = $state(false);

	const pool = $derived($readableWords.filter((w) => w.script === $script));

	function wordWeight(w) {
		return w.soundIds.reduce((sum, id) => sum + weightOf(id, $stats), 0) / w.soundIds.length;
	}

	/* Out of time is a wrong answer; the meaning is then shown, and the
	   question still does not move on until it is typed. */
	drill.onTimeout = () => {
		if (!current || revealed) return;
		drill.answer(current.soundIds, false);
		status = 'bad';
		revealed = true;
		say(current.kana);
		setTimeout(next, 2200);
	};

	function next() {
		if (!pool.length) return;
		current = nextPrompt(pool, wordWeight, drill.recent, 6);
		drill.remember(current);
		drill.mark();
		value = '';
		status = null;
		revealed = false;
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && pool.length) next();
	});

	function submit() {
		if (!current || revealed) return;
		const ok = checkMeaning(value, current.en);
		drill.answer(current.soundIds, ok);
		status = ok ? 'ok' : 'bad';
		revealed = true;
		say(current.kana);
		setTimeout(next, ok ? 900 : 2200);
	}
</script>

<DrillFrame
	title="Reading → Meaning"
	jp="意味"
	hint="Type what it means in English."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
	remainingMs={drill.remainingMs}
	budgetMs={drill.budgetMs}
>
	{#if current}
		<div class="prompt">
			<span class="word jp">{current.kana}</span>
			{#if revealed}
				<div class="reveal" class:ok={status === 'ok'}>
					<strong>{current.en}</strong>
					{#if current.kanji}<span class="jp">{current.kanji}</span>{/if}
					<button class="hear" onclick={() => say(current.kana)}>
						<Icon name="sound" size={16} /> hear it
					</button>
				</div>
			{/if}
		</div>

		<RomajiInput
			bind:value
			status={status}
			onsubmit={submit}
			placeholder="meaning in English…"
			label="Meaning"
			disabled={revealed}
		/>
	{:else}
		<p class="muted">
			No word can be written with your current selection yet. Add a column or two.
		</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		display: grid;
		justify-items: center;
		gap: var(--s-3);
		margin-bottom: var(--s-5);
	}
	.word {
		font-family: var(--font-jp);
		font-size: clamp(2.8rem, 9vw, 4.6rem);
		line-height: 1.1;
		letter-spacing: 0.06em;
		color: var(--ink-strong);
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.reveal {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-2) var(--s-4);
		border-radius: var(--r-md);
		background: var(--bad-bg);
		font-size: var(--fs-sm);
	}
	.reveal.ok {
		background: var(--ok-bg);
	}
	.reveal strong {
		font-family: var(--font-display);
		font-size: var(--fs-md);
	}
	.hear {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border: 0;
		background: none;
		color: var(--wedge-deep);
		font-weight: 700;
		font-size: var(--fs-xs);
		cursor: pointer;
	}
</style>
