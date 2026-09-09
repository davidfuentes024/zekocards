<script>
	/* Whole words, made only of the sounds you selected. Type the full reading. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { readableWords, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { checkWord, romajiFromKana } from '$lib/utils/answer.js';
	import { say } from '$lib/utils/speech.js';

	const drill = createDrill({ goal: 20 });

	let current = $state(null);
	let value = $state('');
	let status = $state(null);
	let echoing = $state(false);
	let revealed = $state(false);

	const pool = $derived($readableWords.filter((w) => w.script === $script));

	function wordWeight(w) {
		return w.soundIds.reduce((sum, id) => sum + weightOf(id, $stats), 0) / w.soundIds.length;
	}

	function next() {
		if (!pool.length) return;
		current = nextPrompt(pool, wordWeight, drill.recent, 6);
		drill.remember(current);
		drill.mark();
		value = '';
		status = null;
		echoing = false;
		revealed = false;
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && pool.length) next();
	});

	function submit() {
		if (!current) return;
		const ok = checkWord(value, current);
		if (echoing) {
			if (ok) next();
			else {
				status = 'bad';
				value = '';
			}
			return;
		}
		drill.answer(current.soundIds, ok);
		if (ok) {
			status = 'ok';
			say(current.kana);
			setTimeout(next, 520);
		} else {
			status = 'bad';
			echoing = true;
			revealed = true;
			value = '';
		}
	}
</script>

<DrillFrame
	title="Word Reading"
	jp="単語読み"
	hint="Only words spelled entirely with your selected sounds appear here."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	{#if current}
		<div class="prompt">
			<button class="word jp" onclick={() => say(current.kana)} title="Hear it">{current.kana}</button>
			<div class="row center">
				<span class="tag">{echoing ? 'Type the reading to continue' : 'Read it aloud, then type it'}</span>
				<button class="ghost" onclick={() => say(current.kana)}>
					<Icon name="sound" size={15} /> replay
				</button>
			</div>
			{#if revealed}
				<div class="reveal">
					<strong>{romajiFromKana(current.kana)}</strong>
					<span>{current.en}</span>
					{#if current.kanji}<span class="jp kanji">{current.kanji}</span>{/if}
				</div>
			{/if}
		</div>

		<RomajiInput bind:value status={status} onsubmit={submit} />
	{:else}
		<p class="muted">
			No word in the dictionary can be written with your current selection yet. Add a few more
			columns — vowels plus one consonant row is usually enough.
		</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		text-align: center;
		margin-bottom: var(--s-5);
	}
	.word {
		font-family: var(--font-jp);
		font-size: clamp(2.4rem, 8vw, 4rem);
		line-height: 1.1;
		letter-spacing: 0.06em;
		background: none;
		border: 0;
		color: var(--ink-strong);
		cursor: pointer;
	}
	.center {
		justify-content: center;
		margin-top: var(--s-3);
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		background: none;
		border: 0;
		color: var(--wedge);
		font-size: var(--fs-xs);
		font-weight: 700;
		cursor: pointer;
	}
	.reveal {
		display: flex;
		justify-content: center;
		gap: var(--s-3);
		align-items: baseline;
		margin-top: var(--s-3);
		padding: var(--s-2) var(--s-3);
		background: var(--bad-bg);
		border-radius: var(--r-md);
		font-size: var(--fs-sm);
	}
	.reveal strong {
		font-family: var(--font-display);
		letter-spacing: 0.05em;
	}
	.kanji {
		font-family: var(--font-jp);
	}
</style>
