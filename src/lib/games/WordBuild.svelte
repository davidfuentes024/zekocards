<script>
	/* Build the word one kana at a time from the full pad. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { readableWords, activeSounds, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { say } from '$lib/utils/speech.js';

	const drill = createDrill({ goal: 15 });

	let current = $state(null);
	let built = $state('');
	let shakeKey = $state(0);
	let solved = $state(false);
	let missed = $state(false);

	const pool = $derived($readableWords.filter((w) => w.script === $script && w.units.length <= 7));
	const smallKeys = $derived($script === 'hiragana' ? ['っ', 'ー'] : ['ッ', 'ー']);

	function wordWeight(w) {
		return w.soundIds.reduce((s, id) => s + weightOf(id, $stats), 0) / w.soundIds.length;
	}

	function next() {
		if (!pool.length) return;
		current = nextPrompt(pool, wordWeight, drill.recent, 5);
		drill.remember(current);
		drill.mark();
		built = '';
		solved = false;
		missed = false;
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
				drill.answer(current.soundIds, !missed);
				say(current.kana);
				setTimeout(next, 900);
			}
		} else {
			missed = true;
			shakeKey += 1;
			drill.setFeedback('bad');
			setTimeout(() => drill.clearFeedback(), 400);
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
	hint="Spell the word kana by kana. A wrong key simply refuses — the word never fills itself in."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	{#if current}
		<div class="prompt">
			<span class="tag">Build this word</span>
			<strong class="en">{current.en}</strong>
			<span class="romaji">{current.romaji}</span>
		</div>

		<div class="slots" class:solved class:nudge={shakeKey % 2 === 1}>
			{#each Array(current.units.length) as _, i}
				<span class="slot jp" class:filled={i < [...built].length}>{[...built][i] ?? ''}</span>
			{/each}
		</div>

		<div class="row tools">
			<button class="btn btn--ghost btn--sm" onclick={back} disabled={!built || solved}>
				<Icon name="arrowLeft" size={15} /> back
			</button>
			{#each smallKeys as c}
				<button class="btn btn--soft btn--sm jp" onclick={() => push(c)} disabled={solved}>{c}</button>
			{/each}
			<button class="btn btn--ghost btn--sm" onclick={() => say(current.kana)}>
				<Icon name="sound" size={15} /> hear
			</button>
		</div>

		<KanaKeypad sounds={$activeSounds} script={$script} disabled={solved} onPick={(s) => push($script === 'hiragana' ? s.h : s.k)} />
	{:else}
		<p class="muted">Select a few more columns to unlock buildable words.</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-1);
		margin-bottom: var(--s-4);
	}
	.en {
		font-family: var(--font-display);
		font-size: var(--fs-2xl);
		color: var(--ink-strong);
	}
	.romaji {
		font-size: var(--fs-sm);
		letter-spacing: 0.14em;
		text-transform: lowercase;
		color: var(--ink-muted);
	}
	.slots {
		display: flex;
		justify-content: center;
		gap: var(--s-2);
		margin-bottom: var(--s-4);
		flex-wrap: wrap;
	}
	.slot {
		display: grid;
		place-items: center;
		width: 56px;
		height: 62px;
		font-family: var(--font-jp);
		font-size: 2rem;
		border-radius: var(--r-md);
		border: 2px dashed var(--surface-line);
		background: var(--bg-sunken);
		color: var(--ink-strong);
	}
	.slot.filled {
		border-style: solid;
		border-color: var(--wedge);
		background: var(--bg-raised);
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.nudge {
		animation: zk-shake 320ms var(--ease-in-out);
	}
	.solved .slot {
		border-color: var(--ok);
		background: var(--ok-bg);
	}
	.tools {
		justify-content: center;
		margin-bottom: var(--s-4);
	}
	@media (max-width: 620px) {
		.slot {
			width: 44px;
			height: 50px;
			font-size: 1.5rem;
		}
	}
</style>
