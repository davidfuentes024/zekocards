<script>
	/* The look-alikes: シ ツ ソ ン, ね れ わ, さ き ち …
	   Only characters that genuinely get confused, drilled back to back. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import { CONFUSION_SETS, KANA_INDEX } from '$lib/data/kana.js';
	import { selectedSounds, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt, pick } from '$lib/utils/random.js';
	import { checkSound } from '$lib/utils/answer.js';
	import { say } from '$lib/utils/speech.js';

	const drill = createDrill({ goal: 24 });

	let current = $state(null);
	let set = $state(null);
	let value = $state('');
	let status = $state(null);
	let echoing = $state(false);
	let compare = $state(false);

	const sets = $derived(
		CONFUSION_SETS.filter((s) => s.script === $script).map((s) => ({
			...s,
			available: s.glyphs.filter((g) => {
				const snd = KANA_INDEX.get(g);
				return snd && $selectedSounds.has(snd.id);
			})
		})).filter((s) => s.available.length >= 2)
	);

	function next() {
		if (!sets.length) return;
		set = pick(sets);
		const pool = set.available.map((g) => KANA_INDEX.get(g));
		current = nextPrompt(pool, (s) => weightOf(s.id, $stats), drill.recent, 2);
		drill.remember(current);
		drill.mark();
		value = '';
		status = null;
		echoing = false;
		compare = false;
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && sets.length) next();
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
			setTimeout(next, 360);
		} else {
			status = 'bad';
			echoing = true;
			compare = true;
			value = '';
		}
	}

	const glyph = $derived(current ? ($script === 'hiragana' ? current.h : current.k) : '');
</script>

<DrillFrame
	title="Look-alikes"
	jp="紛らわしい字"
	hint="These are the characters everyone mixes up. Same shapes, back to back, until they separate."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	{#if current}
		<div class="prompt">
			<button class="glyph jp" onclick={() => say(glyph)}>{glyph}</button>
			<span class="tag">{set.note}</span>
		</div>

		{#if compare}
			<div class="compare">
				{#each set.available as g}
					{@const snd = KANA_INDEX.get(g)}
					<div class="cmp" class:target={g === glyph}>
						<span class="jp">{g}</span>
						<small>{snd.r}</small>
					</div>
				{/each}
			</div>
		{/if}

		<RomajiInput bind:value status={status} onsubmit={submit} />
	{:else}
		<p class="muted">
			Select more of the tricky rows (さ / し / つ / ね / れ / わ and friends) to unlock this drill
			in {$script}.
		</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-3);
		margin-bottom: var(--s-4);
	}
	.glyph {
		font-family: var(--font-jp);
		font-size: var(--fs-kana);
		line-height: 1;
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.compare {
		display: flex;
		justify-content: center;
		gap: var(--s-3);
		margin-bottom: var(--s-4);
		flex-wrap: wrap;
	}
	.cmp {
		display: grid;
		place-items: center;
		min-width: 66px;
		padding: var(--s-2);
		border-radius: var(--r-md);
		background: var(--bg-sunken);
		border: 2px solid transparent;
	}
	.cmp .jp {
		font-family: var(--font-jp);
		font-size: 2rem;
	}
	.cmp small {
		font-size: var(--fs-2xs);
		font-weight: 700;
		letter-spacing: var(--tracking-wide);
		color: var(--ink-muted);
	}
	.cmp.target {
		border-color: var(--ok);
		background: var(--ok-bg);
	}
</style>
