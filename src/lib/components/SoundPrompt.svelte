<script>
	/* ============================================================
	   An audio-only question.
	   Nothing is written on screen: you hear the sound and you find
	   the symbol. The reading is shown ONLY when the browser has no
	   Japanese voice at all, because otherwise the drill would be
	   impossible rather than hard.
	   ============================================================ */
	import Icon from './Icon.svelte';
	import { play as say, hasClip, audioReady } from '$lib/utils/audio.js';
	import { hasJapaneseVoice } from '$lib/utils/speech.js';
	import { settings } from '$lib/stores/settings.js';

	let { text = '', label = 'Listen', fallback = '', big = true, autoplay = true } = $props();

	let plays = $state(0);
	/* The drill only has to reveal the answer when there is genuinely no
	   way to hear it: no pre-rendered clip AND no Japanese system voice. */
	const mute = $derived($audioReady ? !hasClip(text) && !hasJapaneseVoice() : !hasJapaneseVoice());

	function play() {
		plays += 1;
		say(text, { rate: $settings.speechRate });
	}

	$effect(() => {
		if (autoplay && text) {
			const t = setTimeout(play, 180);
			return () => clearTimeout(t);
		}
	});
</script>

<div class="prompt">
	<button class="speaker" class:big onclick={play} aria-label="Play the sound">
		<Icon name="sound" size={big ? 46 : 30} />
		<span class="ripple"></span>
		<span class="ripple ripple--2"></span>
	</button>

	<div class="under">
		<span class="tag">{label}</span>
		<button class="again" onclick={play}>
			<Icon name="refresh" size={15} /> play again
		</button>
	</div>

	{#if mute}
		<p class="fallback">
			<Icon name="mute" size={16} />
			No Japanese voice in this browser — showing the reading instead:
			<strong>{fallback || text}</strong>
		</p>
	{/if}
</div>

<style>
	.prompt {
		display: grid;
		justify-items: center;
		gap: var(--s-3);
		margin-bottom: var(--s-5);
	}

	.speaker {
		position: relative;
		display: grid;
		place-items: center;
		width: 84px;
		height: 84px;
		border: 0;
		border-radius: var(--r-lg);
		background: var(--cello);
		color: var(--mint);
		cursor: pointer;
		box-shadow: 0 7px 0 var(--cello-ink);
		transition:
			transform 100ms var(--ease-out),
			box-shadow 100ms var(--ease-out);
	}
	.speaker.big {
		width: 118px;
		height: 118px;
	}
	.speaker:active {
		transform: translateY(6px);
		box-shadow: 0 1px 0 var(--cello-ink);
	}

	.ripple {
		position: absolute;
		inset: -8px;
		border-radius: var(--r-xl);
		border: 3px solid var(--aqua);
		opacity: 0.5;
		animation: zk-glow-ring 2.4s var(--ease-out) infinite;
		pointer-events: none;
	}
	.ripple--2 {
		animation-delay: 1.2s;
	}

	.under {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		flex-wrap: wrap;
		justify-content: center;
	}

	.again {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 0.35em 0.8em;
		border: 2px solid var(--surface-line);
		border-radius: var(--r-tab);
		background: var(--bg-raised);
		box-shadow: 0 3px 0 var(--surface-line);
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 800;
		color: var(--wedge-deep);
		cursor: pointer;
	}
	.again:active {
		transform: translateY(3px);
		box-shadow: none;
	}

	.fallback {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-2) var(--s-3);
		border-radius: var(--r-md);
		background: var(--bad-bg);
		color: var(--bad);
		font-size: var(--fs-xs);
		font-weight: 600;
	}
	.fallback strong {
		font-family: var(--font-display);
		font-size: var(--fs-md);
		letter-spacing: 0.05em;
	}
</style>
