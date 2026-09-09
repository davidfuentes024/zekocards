<script>
	/* Kana → romaji, typed. Getting it wrong makes you type the right
	   answer before you may move on: the loop that actually sticks. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { activeSounds, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { checkSound } from '$lib/utils/answer.js';
	import { say } from '$lib/utils/speech.js';
	import { anchors } from '$lib/stores/associations.js';

	const drill = createDrill({ goal: 30 });

	let current = $state(null);
	let value = $state('');
	let status = $state(null);
	let echoing = $state(false);
	let message = $state('');

	function next() {
		const pool = $activeSounds;
		if (!pool.length) return;
		current = nextPrompt(pool, (s) => weightOf(s.id, $stats), drill.recent);
		drill.remember(current);
		drill.mark();
		value = '';
		status = null;
		echoing = false;
		message = '';
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && $activeSounds.length) next();
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
			message = '';
			setTimeout(next, 380);
		} else {
			status = 'bad';
			echoing = true;
			message = `${$script === 'hiragana' ? current.h : current.k} is “${current.r}”. Type it to lock it in.`;
			value = '';
		}
	}

	const glyph = $derived(current ? ($script === 'hiragana' ? current.h : current.k) : '');
	const anchor = $derived(current ? $anchors[current.id] : null);
</script>

<DrillFrame
	title="Sound Recall"
	jp="音読み"
	hint="Read the character out loud, then type the romaji. No options, no shortcuts."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	{#if current}
		<div class="prompt">
			<button class="glyph jp" onclick={() => say(glyph)} title="Hear it">{glyph}</button>
			<div class="under">
				<span class="tag">{echoing ? 'Repeat it' : 'What sound is this?'}</span>
				{#if anchor?.word}
					<span class="anchor"><Icon name="pencil" size={13} /> your anchor: {anchor.word}</span>
				{/if}
			</div>
		</div>

		<RomajiInput bind:value status={status} onsubmit={submit} placeholder={echoing ? current.r : 'romaji…'} />

		{#if message}<p class="msg">{message}</p>{/if}
	{:else}
		<p class="muted">Pick some sounds on the Cards page first.</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		text-align: center;
		margin-bottom: var(--s-5);
	}
	.glyph {
		font-family: var(--font-jp);
		font-size: var(--fs-kana);
		line-height: 1;
		background: none;
		border: 0;
		color: var(--ink-strong);
		cursor: pointer;
		animation: zk-pop var(--t-base) var(--ease-spring);
		transition: transform var(--t-fast) var(--ease-spring);
	}
	.glyph:hover {
		transform: scale(1.05);
	}
	.under {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--s-3);
		flex-wrap: wrap;
		margin-top: var(--s-3);
	}
	.anchor {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: var(--fs-xs);
		color: var(--ink-muted);
	}
	.msg {
		margin-top: var(--s-3);
		text-align: center;
		font-size: var(--fs-sm);
		color: var(--bad);
		font-weight: 600;
	}
</style>
