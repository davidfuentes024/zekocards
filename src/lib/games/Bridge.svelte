<script>
	/* One script in, the other script out. No romaji anywhere: the only
	   way through is knowing what the symbol sounds like. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { activeSounds, script } from '$lib/stores/selection.js';
	import { scriptSounds, glyphOf } from '$lib/data/kana.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { play as say } from '$lib/utils/audio.js';

	const drill = createDrill({ goal: 30, seconds: 8 });

	let current = $state(null);
	let wrongId = $state(null);
	let okId = $state(null);
	let locked = $state(false);
	let missed = $state(false);
	let round = $state(0);

	/* the pad is the script you are studying; the prompt is the other one */
	const answerScript = $derived($script);
	const promptScript = $derived($script === 'hiragana' ? 'katakana' : 'hiragana');
	const pad = $derived(scriptSounds(answerScript));
	const pool = $derived($activeSounds.filter((s) => s.h && s.k));

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
		current = nextPrompt(pool, (s) => weightOf(s.id, $stats), drill.recent);
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
		if (!current && pool.length) next();
	});

	function pick(s) {
		if (!current || locked) return;
		if (s.r === current.r) {
			okId = s.id;
			locked = true;
			if (!missed) drill.answer(current.id, true);
			say(glyphOf(current, answerScript));
			setTimeout(next, 480);
			return;
		}
		if (!missed) {
			missed = true;
			drill.answer(current.id, false);
		}
		wrongId = s.id;
		setTimeout(() => (wrongId = null), 420);
	}
</script>

<DrillFrame
	title="Script Bridge"
	jp="対応"
	hint="Find the same sound in the other script."
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
			<span class="from jp">{glyphOf(current, promptScript)}</span>
			<Icon name="arrowRight" size={28} />
			<span class="to jp">？</span>
		</div>

		<KanaKeypad
			sounds={pad}
			script={answerScript}
			shuffleKey={round}
			markedCorrect={okId}
			markedWrong={wrongId}
			disabled={locked}
			onPick={pick}
		/>
	{:else}
		<p class="muted">Select sounds that exist in both scripts to use this drill.</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--s-4);
		margin-bottom: var(--s-5);
		color: var(--aqua-deep);
	}
	.from,
	.to {
		display: grid;
		place-items: center;
		width: 120px;
		height: 120px;
		font-family: var(--font-jp);
		font-size: 4rem;
		border-radius: var(--r-lg);
		border: 1.5px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: 0 var(--lift-play) 0 var(--surface-line-strong);
		color: var(--ink-strong);
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.to {
		background: var(--bg-tint);
		color: var(--ink-muted);
		border-style: dashed;
	}
	@media (max-width: 600px) {
		.from,
		.to {
			width: 92px;
			height: 92px;
			font-size: 3rem;
		}
	}
</style>
