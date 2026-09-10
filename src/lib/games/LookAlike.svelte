<script>
	/* The confusable families. You see one of them and must produce the
	   same sound in the other script, from the complete grid — so telling
	   シ from ツ is the only way through. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { CONFUSION_SETS, KANA_INDEX, scriptSounds, glyphOf } from '$lib/data/kana.js';
	import { selectedSounds, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt, pick as pickOne } from '$lib/utils/random.js';
	import { say } from '$lib/utils/speech.js';

	const drill = createDrill({ goal: 24 });

	let current = $state(null);
	let family = $state(null);
	let wrongId = $state(null);
	let okId = $state(null);
	let locked = $state(false);
	let missed = $state(false);
	let round = $state(0);

	const answerScript = $derived($script);
	const promptScript = $derived($script === 'hiragana' ? 'katakana' : 'hiragana');
	const pad = $derived(scriptSounds(answerScript));

	/* families are defined per script; use the ones the learner has unlocked */
	const families = $derived(
		CONFUSION_SETS.map((set) => ({
			...set,
			available: set.glyphs
				.map((g) => KANA_INDEX.get(g))
				.filter((s) => s && s.h && s.k && $selectedSounds.has(s.id))
		})).filter((set) => set.available.length >= 2)
	);

	function next() {
		if (!families.length) return;
		family = pickOne(families);
		current = nextPrompt(family.available, (s) => weightOf(s.id, $stats), drill.recent, 2);
		drill.remember(current);
		drill.mark();
		wrongId = null;
		okId = null;
		locked = false;
		missed = false;
		round += 1;
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && families.length) next();
	});

	function pick(s) {
		if (!current || locked) return;
		if (s.r === current.r) {
			okId = s.id;
			locked = true;
			if (!missed) drill.answer(current.id, true);
			say(glyphOf(current, answerScript));
			setTimeout(next, 520);
			return;
		}
		if (!missed) {
			missed = true;
			drill.answer(current.id, false);
		}
		wrongId = s.id;
		setTimeout(() => (wrongId = null), 420);
	}
</script>

<DrillFrame
	title="Look-alikes"
	jp="紛らわしい字"
	hint="These are the shapes everyone confuses. Identify the one you are shown, then produce it in the other script."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	{#if current && family}
		<div class="prompt">
			<div class="family">
				{#each family.available as s (s.id)}
					<span class="fg jp" class:target={s.id === current.id}>{glyphOf(s, promptScript)}</span>
				{/each}
			</div>
			<p class="note"><Icon name="target" size={15} /> {family.note}</p>
			<div class="ask">
				<span class="from jp">{glyphOf(current, promptScript)}</span>
				<Icon name="arrowRight" size={26} />
				<span class="to jp">？</span>
			</div>
		</div>

		<KanaKeypad
			sounds={pad}
			script={answerScript}
			shuffleKey={round}
			markedCorrect={okId}
			markedWrong={wrongId}
			disabled={locked}
			onPick={pick}
		/>
	{:else}
		<p class="muted">
			Select more of the tricky rows (さ し つ ね れ わ and friends) to unlock this drill.
		</p>
	{/if}
</DrillFrame>

<style>
	.prompt {
		display: grid;
		justify-items: center;
		gap: var(--s-3);
		margin-bottom: var(--s-5);
	}
	.family {
		display: flex;
		gap: var(--s-2);
		flex-wrap: wrap;
		justify-content: center;
	}
	.fg {
		display: grid;
		place-items: center;
		width: 58px;
		height: 58px;
		font-family: var(--font-jp);
		font-size: 1.9rem;
		border-radius: var(--r-sm);
		background: var(--bg-tint);
		border: 2px solid var(--surface-line);
		color: var(--ink-muted);
	}
	.note {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: var(--fs-xs);
		color: var(--ink-muted);
	}
	.ask {
		display: flex;
		align-items: center;
		gap: var(--s-4);
		color: var(--aqua-deep);
	}
	.from,
	.to {
		display: grid;
		place-items: center;
		width: 108px;
		height: 108px;
		font-family: var(--font-jp);
		font-size: 3.6rem;
		border-radius: var(--r-lg);
		border: 3px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: 0 6px 0 var(--surface-line-strong);
		color: var(--ink-strong);
	}
	.to {
		background: var(--bg-tint);
		color: var(--ink-muted);
		border-style: dashed;
	}
</style>
