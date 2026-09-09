<script>
	/* Your own words, quizzed back at you.
	   Write "ねこ – the cat's tail" on the ね card and this drill will
	   show your note and ask for the character it belongs to. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { anchors } from '$lib/stores/associations.js';
	import { SOUND_BY_ID } from '$lib/data/kana.js';
	import { selectedSounds, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { checkSound } from '$lib/utils/answer.js';

	const drill = createDrill({ goal: 20 });

	let current = $state(null);
	let value = $state('');
	let status = $state(null);
	let revealed = $state(false);
	let echoing = $state(false);

	const pool = $derived(
		Object.keys($anchors)
			.map((id) => SOUND_BY_ID.get(id))
			.filter(Boolean)
			.filter((s) => $selectedSounds.has(s.id))
			.filter((s) => ($script === 'hiragana' ? s.h : s.k))
	);

	function next() {
		if (!pool.length) return;
		current = nextPrompt(pool, (s) => weightOf(s.id, $stats), drill.recent, 3);
		drill.remember(current);
		drill.mark();
		value = '';
		status = null;
		revealed = false;
		echoing = false;
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && pool.length) next();
	});

	function submit() {
		if (!current) return;
		const ok = checkSound(value, current);
		if (echoing) {
			if (ok) next();
			else {
				status = 'bad';
				value = '';
			}
			return;
		}
		drill.answer(current.id, ok);
		if (ok) {
			status = 'ok';
			revealed = true;
			setTimeout(next, 520);
		} else {
			status = 'bad';
			revealed = true;
			echoing = true;
			value = '';
		}
	}

	const note = $derived(current ? $anchors[current.id] : null);
</script>

<DrillFrame
	title="Anchor Recall"
	jp="連想"
	hint="Your own associations, replayed. The memory you wrote is the only clue you get."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	{#if current}
		<div class="prompt">
			<span class="tag">Which sound did you anchor to this?</span>
			<blockquote>
				<Icon name="brush" size={20} />
				<div>
					<strong>{note.word}</strong>
					{#if note.note}<p>{note.note}</p>{/if}
				</div>
			</blockquote>
			{#if revealed}
				<div class="answer jp">
					{$script === 'hiragana' ? current.h : current.k}
					<small>{current.r}</small>
				</div>
			{/if}
		</div>
		<RomajiInput bind:value status={status} onsubmit={submit} />
	{:else}
		<div class="empty">
			<p class="lede">
				You have not written any anchors yet for the sounds you are studying.
			</p>
			<p class="muted">
				Open a card on the Cards page and write the word that makes the shape stick. Those notes
				become this drill.
			</p>
			<a class="btn" href="/cards"><Icon name="cards" size={17} /> Go write some anchors</a>
		</div>
	{/if}
</DrillFrame>

<style>
	.prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-3);
		margin-bottom: var(--s-5);
	}
	blockquote {
		display: flex;
		gap: var(--s-3);
		align-items: flex-start;
		margin: 0;
		max-width: min(46ch, 100%);
		padding: var(--s-4);
		background: var(--bg-sunken);
		border-left: 5px solid var(--aqua);
		border-radius: var(--r-md);
		color: var(--ink);
	}
	blockquote strong {
		font-family: var(--font-display);
		font-size: var(--fs-xl);
	}
	blockquote p {
		font-size: var(--fs-sm);
		color: var(--ink-muted);
	}
	.answer {
		font-family: var(--font-jp);
		font-size: var(--fs-2xl);
		text-align: center;
	}
	.answer small {
		display: block;
		font-family: var(--font-ui);
		font-size: var(--fs-xs);
		color: var(--ink-muted);
	}
	.empty {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		align-items: flex-start;
	}
</style>
