<script>
	/* Romaji → kana. The pad shows every sound you selected, so the answer
	   can never be reached by elimination. A miss forces the right pick. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import { activeSounds, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { say } from '$lib/utils/speech.js';

	const drill = createDrill({ goal: 30 });

	let current = $state(null);
	let wrongId = $state(null);
	let okId = $state(null);
	let locked = $state(false);
	let message = $state('');

	function next() {
		const pool = $activeSounds;
		if (!pool.length) return;
		current = nextPrompt(pool, (s) => weightOf(s.id, $stats), drill.recent);
		drill.remember(current);
		drill.mark();
		wrongId = null;
		okId = null;
		locked = false;
		message = '';
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && $activeSounds.length) next();
	});

	function pick(s) {
		if (!current || locked) return;
		const right = s.id === current.id || s.r === current.r;

		if (message) {
			// second chance: only the correct key moves you on
			if (right) {
				okId = s.id;
				locked = true;
				setTimeout(next, 420);
			} else {
				wrongId = s.id;
				setTimeout(() => (wrongId = null), 420);
			}
			return;
		}

		drill.answer(current.id, right);
		if (right) {
			okId = s.id;
			locked = true;
			say($script === 'hiragana' ? current.h : current.k);
			setTimeout(next, 420);
		} else {
			wrongId = s.id;
			okId = current.id;
			message = `That was “${s.r}”. Now tap ${current.r}.`;
		}
	}
</script>

<DrillFrame
	title="Kana Production"
	jp="書き取り"
	hint="Every sound you study is on the pad. Find the exact one — thinking is the point."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	{#if current}
		<div class="prompt">
			<span class="tag">Write this sound</span>
			<strong class="romaji">{current.r}</strong>
			{#if current.alt.length}<span class="alts">also written {current.alt.join(', ')}</span>{/if}
		</div>

		<KanaKeypad
			sounds={$activeSounds}
			script={$script}
			markedCorrect={okId}
			markedWrong={wrongId}
			onPick={pick}
		/>

		{#if message}<p class="msg">{message}</p>{/if}
	{:else}
		<p class="muted">Pick some sounds on the Cards page first.</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-2);
		margin-bottom: var(--s-5);
	}
	.romaji {
		font-family: var(--font-display);
		font-size: var(--fs-3xl);
		letter-spacing: 0.08em;
		color: var(--ink-strong);
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.alts {
		font-size: var(--fs-xs);
		color: var(--ink-muted);
	}
	.msg {
		margin-top: var(--s-3);
		text-align: center;
		font-weight: 600;
		color: var(--bad);
		font-size: var(--fs-sm);
	}
</style>
