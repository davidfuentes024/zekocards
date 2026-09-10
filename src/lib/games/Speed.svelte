<script>
	/* Sixty seconds of audio → symbol, at full grid size. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import SoundPrompt from '$lib/components/SoundPrompt.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { activeSounds, script } from '$lib/stores/selection.js';
	import { scriptSounds, glyphOf } from '$lib/data/kana.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { persisted } from '$lib/stores/persisted.js';

	const drill = createDrill({ goal: 60 });
	const record60 = persisted('speed-record', 0);

	const DURATION = 60;
	let left = $state(DURATION);
	let running = $state(false);
	let done = $state(false);
	let current = $state(null);
	let wrongId = $state(null);
	let okId = $state(null);
	let round = $state(0);
	let timer;

	const pad = $derived(scriptSounds($script));

	function next() {
		const pool = $activeSounds;
		if (!pool.length) return;
		current = nextPrompt(pool, (s) => weightOf(s.id, $stats), drill.recent, 3);
		drill.remember(current);
		drill.mark();
		wrongId = null;
		okId = null;
		round += 1;
	}

	function start() {
		running = true;
		done = false;
		left = DURATION;
		next();
		timer = setInterval(() => {
			left -= 1;
			if (left <= 0) stop();
		}, 1000);
	}

	function stop() {
		clearInterval(timer);
		running = false;
		done = true;
		current = null;
		if (drill.correct > $record60) record60.set(drill.correct);
	}

	$effect(() => () => clearInterval(timer));

	function pick(s) {
		if (!current || !running) return;
		const right = s.r === current.r;
		drill.answer(current.id, right);
		if (right) {
			okId = s.id;
			setTimeout(next, 130);
		} else {
			wrongId = s.id;
			setTimeout(() => (wrongId = null), 260);
		}
		setTimeout(() => drill.clearFeedback(), 240);
	}
</script>

<DrillFrame
	title="Sixty Seconds"
	jp="速読み"
	hint="Audio only, full grid, one minute. Speed leaves no room for reasoning it out."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={DURATION}
	feedback={drill.feedback}
>
	<div class="timer" class:low={left <= 10}>
		<Icon name="clock" size={20} />
		<strong>{left}s</strong>
		<span class="bar"><i style="width:{(left / DURATION) * 100}%"></i></span>
	</div>

	{#if running && current}
		{#key round}
			<SoundPrompt text={glyphOf(current, $script)} fallback={current.r} label="Go" big={false} />
		{/key}
		<KanaKeypad
			sounds={pad}
			script={$script}
			shuffleKey={round}
			markedCorrect={okId}
			markedWrong={wrongId}
			size="sm"
			onPick={pick}
		/>
	{:else if done}
		<div class="result">
			<h3>{drill.correct} correct</h3>
			<p class="muted">
				{drill.asked} answered · {drill.asked ? Math.round((drill.correct / drill.asked) * 100) : 0}%
				accurate · best streak {drill.best}
			</p>
			<p class="record"><Icon name="star" size={17} /> personal record: {$record60}</p>
			<button class="btn btn--lg" onclick={start}><Icon name="refresh" size={18} /> Run it again</button>
		</div>
	{:else}
		<div class="result">
			<p class="lede">One minute. Sound in, symbol out, no reading on screen.</p>
			<button class="btn btn--xl" onclick={start} disabled={!$activeSounds.length}>
				<Icon name="flame" size={20} /> Start the minute
			</button>
			{#if $record60}<p class="record"><Icon name="star" size={17} /> record: {$record60}</p>{/if}
		</div>
	{/if}
</DrillFrame>

<style>
	.timer {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		margin-bottom: var(--s-4);
		color: var(--wedge-deep);
		font-family: var(--font-display);
		font-size: var(--fs-lg);
	}
	.timer.low {
		color: var(--bad);
	}
	.bar {
		flex: 1;
		height: 10px;
		border-radius: var(--r-full);
		background: var(--surface-line);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: currentColor;
		transition: width 1s linear;
	}
	.result {
		display: grid;
		justify-items: flex-start;
		gap: var(--s-3);
	}
	.record {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: var(--fs-sm);
		color: var(--ink-muted);
	}
</style>
