<script>
	/* Hear a whole word, spell it out of the complete symbol grid.
	   Nothing is written until the word is finished. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import SoundPrompt from '$lib/components/SoundPrompt.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { readableWords, script } from '$lib/stores/selection.js';
	import { scriptSounds, glyphOf } from '$lib/data/kana.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { play as say } from '$lib/utils/audio.js';

	const drill = createDrill({ goal: 15, seconds: 20 });

	let current = $state(null);
	let built = $state('');
	let solved = $state(false);
	let missed = $state(false);
	let nudge = $state(0);
	let round = $state(0);

	const pad = $derived(scriptSounds($script));
	const smalls = $derived($script === 'hiragana' ? ['っ', 'ー'] : ['ッ', 'ー']);
	const pool = $derived($readableWords.filter((w) => w.script === $script && w.units.length <= 6));

	function weight(w) {
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
		current = nextPrompt(pool, weight, drill.recent, 5);
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
				setTimeout(next, 1100);
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
	title="Word Dictation"
	jp="書き取り"
	hint="Spell the word you hear."
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
			<SoundPrompt text={current.kana} fallback={current.romaji} label="Spell what you hear" big={false} />
		{/key}

		<div class="slots" class:solved class:nudge={nudge % 2 === 1}>
			{#each Array(current.units.length) as _, i}
				<span class="slot jp" class:filled={i < [...built].length}>{[...built][i] ?? ''}</span>
			{/each}
		</div>

		{#if solved}
			<p class="reveal">
				<strong class="jp">{current.kana}</strong>
				<span>{current.en}</span>
				{#if current.kanji}<span class="jp k">{current.kanji}</span>{/if}
			</p>
		{/if}

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
		<p class="muted">Select a few more columns to unlock words for dictation.</p>
	{/if}
</DrillFrame>

<style>
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
		width: 64px;
		height: 70px;
		font-family: var(--font-jp);
		font-size: 2.2rem;
		border-radius: var(--r-md);
		border: 3px dashed var(--surface-line);
		background: var(--bg-tint);
		color: var(--ink-strong);
	}
	.slot.filled {
		border-style: solid;
		border-color: var(--wedge);
		background: var(--bg-raised);
		box-shadow: 0 4px 0 var(--wedge-soft);
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.solved .slot {
		border-color: var(--ok);
		background: var(--ok-bg);
		box-shadow: 0 4px 0 var(--ok);
	}
	.reveal {
		display: flex;
		justify-content: center;
		align-items: baseline;
		gap: var(--s-3);
		margin-bottom: var(--s-4);
		font-size: var(--fs-sm);
		color: var(--ink-muted);
	}
	.reveal strong {
		font-family: var(--font-jp);
		font-size: var(--fs-xl);
		color: var(--ink-strong);
	}
	.tools {
		display: flex;
		justify-content: center;
		gap: var(--s-2);
		margin-bottom: var(--s-4);
	}
	@media (max-width: 620px) {
		.slot {
			width: 48px;
			height: 54px;
			font-size: 1.6rem;
		}
	}
</style>
