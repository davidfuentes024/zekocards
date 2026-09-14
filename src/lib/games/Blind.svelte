<script>
	/* Audio in, symbol out. Nothing is written on screen, the pad holds
	   every symbol in the script, and it is reshuffled every question. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import SoundPrompt from '$lib/components/SoundPrompt.svelte';
	import { activeSounds, script } from '$lib/stores/selection.js';
	import { scriptSounds, glyphOf } from '$lib/data/kana.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';

	const drill = createDrill({ goal: 30, seconds: 7 });

	let current = $state(null);
	let wrongId = $state(null);
	let okId = $state(null);
	let locked = $state(false);
	let missed = $state(false);
	let round = $state(0);

	const pad = $derived(scriptSounds($script));

	/* The clock is part of the question. Running out is a miss — and the
	   symbol still has to be produced before anything moves on. */
	drill.onTimeout = () => {
		if (!current || locked || missed) return;
		missed = true;
		drill.answer(current.id, false);
		okId = current.id;
	};

	function next() {
		const pool = $activeSounds;
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
		if (!current && $activeSounds.length) next();
	});

	function pick(s) {
		if (!current || locked) return;
		const right = s.r === current.r;

		if (right) {
			okId = s.id;
			locked = true;
			if (!missed) drill.answer(current.id, true);
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
	title="Blind Sound"
	jp="音のみ"
	hint="Pick the symbol you hear."
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
		{#key round}
			<SoundPrompt
				text={glyphOf(current, $script)}
				fallback={current.r}
				label="Which symbol is this?"
			/>
		{/key}

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
		<p class="muted">Pick some sounds on the Cards page first.</p>
	{/if}
</DrillFrame>
