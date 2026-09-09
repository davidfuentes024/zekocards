<script>
	/* Ear training. Nothing is shown until you have committed an answer. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { activeSounds, readableWords, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { checkSound, checkWord } from '$lib/utils/answer.js';
	import { say, hasSpeech, japaneseVoice } from '$lib/utils/speech.js';
	import { settings } from '$lib/stores/settings.js';

	const drill = createDrill({ goal: 20 });

	let mode = $state('sounds'); // sounds | words
	let current = $state(null);
	let value = $state('');
	let status = $state(null);
	let revealed = $state(false);
	let echoing = $state(false);

	const wordPool = $derived($readableWords.filter((w) => w.script === $script));
	const pool = $derived(mode === 'sounds' ? $activeSounds : wordPool);

	function weight(item) {
		return item.soundIds
			? item.soundIds.reduce((s, id) => s + weightOf(id, $stats), 0) / item.soundIds.length
			: weightOf(item.id, $stats);
	}

	function speakCurrent() {
		if (!current) return;
		const text = mode === 'sounds' ? ($script === 'hiragana' ? current.h : current.k) : current.kana;
		say(text, { rate: $settings.speechRate });
	}

	function next() {
		if (!pool.length) return;
		current = nextPrompt(pool, weight, drill.recent, 5);
		drill.remember(current);
		drill.mark();
		value = '';
		status = null;
		revealed = false;
		echoing = false;
		drill.clearFeedback();
		setTimeout(speakCurrent, 220);
	}

	$effect(() => {
		if (!current && pool.length) next();
	});

	function submit() {
		if (!current) return;
		const ok = mode === 'sounds' ? checkSound(value, current) : checkWord(value, current);
		if (echoing) {
			if (ok) next();
			else {
				status = 'bad';
				value = '';
			}
			return;
		}
		drill.answer(mode === 'sounds' ? current.id : current.soundIds, ok);
		if (ok) {
			status = 'ok';
			revealed = true;
			setTimeout(next, 600);
		} else {
			status = 'bad';
			revealed = true;
			echoing = true;
			value = '';
		}
	}

	function switchMode(m) {
		mode = m;
		current = null;
	}
</script>

<DrillFrame
	title="Ear Training"
	jp="聞き取り"
	hint="Listen first. The kana only appears after you answer."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	{#if !hasSpeech() || !japaneseVoice()}
		<p class="warn">
			<Icon name="mute" size={16} /> This browser has no Japanese voice installed, so playback may
			be silent or accented. Everything else still works.
		</p>
	{/if}

	<div class="row modes">
		<button class="chip" aria-pressed={mode === 'sounds'} onclick={() => switchMode('sounds')}>
			Single sounds
		</button>
		<button class="chip" aria-pressed={mode === 'words'} onclick={() => switchMode('words')}>
			Whole words
		</button>
	</div>

	{#if current}
		<div class="prompt">
			<button class="speaker" onclick={speakCurrent} aria-label="Play again">
				<Icon name="sound" size={40} />
				<span class="ripple"></span>
			</button>
			<span class="tag">{echoing ? 'Type the correct reading' : 'Tap to hear it again'}</span>
			{#if revealed}
				<div class="reveal jp">
					{mode === 'sounds' ? ($script === 'hiragana' ? current.h : current.k) : current.kana}
					<small>{mode === 'sounds' ? current.r : `${current.romaji} · ${current.en}`}</small>
				</div>
			{/if}
		</div>

		<RomajiInput bind:value status={status} onsubmit={submit} />
	{:else}
		<p class="muted">Nothing available for this mode yet — select more sounds.</p>
	{/if}
</DrillFrame>

<style>
	.warn {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		font-size: var(--fs-xs);
		color: var(--bad);
		background: var(--bad-bg);
		padding: var(--s-2) var(--s-3);
		border-radius: var(--r-md);
		margin-bottom: var(--s-3);
	}
	.modes {
		justify-content: center;
		margin-bottom: var(--s-4);
	}
	.prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-3);
		margin-bottom: var(--s-5);
	}
	.speaker {
		position: relative;
		display: grid;
		place-items: center;
		width: 96px;
		height: 96px;
		border-radius: 50%;
		border: 0;
		background: var(--cello);
		color: var(--mint);
		cursor: pointer;
		transition: transform var(--t-fast) var(--ease-spring);
	}
	.speaker:hover {
		transform: scale(1.06);
	}
	.ripple {
		position: absolute;
		inset: -6px;
		border-radius: 50%;
		border: 2px solid var(--aqua);
		animation: zk-glow-ring 2.2s var(--ease-out) infinite;
	}
	.reveal {
		font-family: var(--font-jp);
		font-size: var(--fs-2xl);
		text-align: center;
		color: var(--ink-strong);
	}
	.reveal small {
		display: block;
		font-family: var(--font-ui);
		font-size: var(--fs-xs);
		color: var(--ink-muted);
	}
</style>
