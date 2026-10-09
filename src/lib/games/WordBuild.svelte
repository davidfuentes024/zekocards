<script>
	/* English meaning in, Japanese spelling out. The pad is the entire
	   script, reshuffled per word — no romaji is ever shown. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { readableWords, script } from '$lib/stores/selection.js';
	import { scriptSounds, glyphOf } from '$lib/data/kana.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { play as say } from '$lib/utils/audio.js';

	const drill = createDrill({ goal: 15, seconds: 25 });

	let current = $state(null);
	let built = $state('');
	let nudge = $state(0);
	let solved = $state(false);
	let missed = $state(false);
	let round = $state(0);

	const pad = $derived(scriptSounds($script));
	const smalls = $derived($script === 'hiragana' ? ['っ', 'ー'] : ['ッ', 'ー']);
	const pool = $derived($readableWords.filter((w) => w.script === $script && w.units.length <= 7));

	function wordWeight(w) {
		return w.soundIds.reduce((s, id) => s + weightOf(id, $stats), 0) / w.soundIds.length;
	}

	/* Running out of time is a miss. The word still has to be spelled out. */
	drill.onTimeout = () => {
		if (!current || solved || missed) return;
		missed = true;
		drill.answer(current.soundIds, false);
		nudge += 1;
	};

	function next() {
		if (!pool.length) return;
		current = nextPrompt(pool, wordWeight, drill.recent, 5);
		drill.remember(current);
		drill.mark();
		built = '';
		solved = false;
		missed = false;
		round += 1;
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && pool.length) next();
	});

	function push(char) {
		if (!current || solved) return;
		const attempt = built + char;
		if (current.kana.startsWith(attempt)) {
			built = attempt;
			if (built === current.kana) {
				solved = true;
				if (missed) drill.setFeedback('ok');
				else drill.answer(current.soundIds, true);
				say(current.kana);
				setTimeout(next, 950);
			}
		} else {
			if (!missed) {
				missed = true;
				drill.answer(current.soundIds, false);
			}
			nudge += 1;
			drill.setFeedback('bad');
			setTimeout(() => drill.clearFeedback(), 380);
		}
	}

	function back() {
		if (solved) return;
		const chars = [...built];
		chars.pop();
		built = chars.join('');
	}
</script>

<DrillFrame
	title="Word Forge"
	jp="組み立て"
	hint="Spell the word from its meaning."
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
			<span class="tag">Write this word in {$script}</span>
			<strong class="en">{current.en}</strong>
			{#if current.kanji}<span class="jp kanji">{current.kanji}</span>{/if}
		</div>

		<div class="slots" class:solved class:nudge={nudge % 2 === 1}>
			{#each Array(current.units.length) as _, i}
				<span class="slot jp" class:filled={i < [...built].length}>{[...built][i] ?? ''}</span>
			{/each}
		</div>

		<div class="tools">
			<button class="tab" onclick={back} disabled={!built || solved}>
				<Icon name="arrowLeft" size={15} /> back
			</button>
			{#each smalls as c}
				<button class="tab jp" onclick={() => push(c)} disabled={solved}>{c}</button>
			{/each}
		</div>

		<KanaKeypad
			sounds={pad}
			script={$script}
			shuffleKey={round}
			disabled={solved}
			size="sm"
			onPick={(s) => push(glyphOf(s, $script))}
		/>
	{:else}
		<p class="muted">Select a few more columns to unlock buildable words.</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-2);
		margin-bottom: var(--s-4);
	}
	.en {
		font-family: var(--font-display);
		font-size: var(--fs-2xl);
		color: var(--ink-strong);
		text-align: center;
	}
	.kanji {
		font-family: var(--font-jp);
		font-size: var(--fs-lg);
		color: var(--ink-muted);
	}
	.slots {
		display: flex;
		justify-content: center;
		gap: var(--s-2);
		margin-bottom: var(--s-4);
		flex-wrap: wrap;
	}
	.nudge {
		animation: zk-shake 320ms var(--ease-in-out);
	}
	.slot {
		display: grid;
		place-items: center;
		width: 62px;
		height: 68px;
		font-family: var(--font-jp);
		font-size: 2.1rem;
		border-radius: var(--r-md);
		border: 3px dashed var(--surface-line);
		background: var(--bg-tint);
		color: var(--ink-strong);
	}
	.slot.filled {
		border-style: solid;
		border-color: var(--wedge);
		background: var(--bg-raised);
		box-shadow: 0 var(--lift-play) 0 var(--wedge-soft);
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.solved .slot {
		border-color: var(--ok);
		background: var(--ok-bg);
		box-shadow: 0 var(--lift-play) 0 var(--ok);
	}
	.tools {
		display: flex;
		justify-content: center;
		gap: var(--s-2);
		margin-bottom: var(--s-4);
	}
	@media (max-width: 620px) {
		.slot {
			width: 46px;
			height: 52px;
			font-size: 1.6rem;
		}
	}
</style>
