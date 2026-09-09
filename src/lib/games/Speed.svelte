<script>
	/* Sixty seconds. Type readings until the sand runs out. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { activeSounds, script } from '$lib/stores/selection.js';
	import { stats, weightOf } from '$lib/stores/progress.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { checkSound } from '$lib/utils/answer.js';
	import { persisted } from '$lib/stores/persisted.js';

	const drill = createDrill({ goal: 60 });
	const record60 = persisted('speed-record', 0);

	const DURATION = 60;
	let left = $state(DURATION);
	let running = $state(false);
	let done = $state(false);
	let current = $state(null);
	let value = $state('');
	let status = $state(null);
	let timer;

	function next() {
		const pool = $activeSounds;
		if (!pool.length) return;
		current = nextPrompt(pool, (s) => weightOf(s.id, $stats), drill.recent, 3);
		drill.remember(current);
		drill.mark();
		value = '';
		status = null;
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

	function submit() {
		if (!current || !running) return;
		const ok = checkSound(value, current);
		drill.answer(current.id, ok);
		status = ok ? 'ok' : 'bad';
		if (ok) next();
		else value = '';
		setTimeout(() => (status = null), 260);
	}

	const glyph = $derived(current ? ($script === 'hiragana' ? current.h : current.k) : '');
</script>

<DrillFrame
	title="Sixty Seconds"
	jp="速読み"
	hint="Speed forces recognition instead of decoding. Mistakes cost you time, not lives."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={DURATION}
	feedback={drill.feedback}
>
	<div class="timer" class:low={left <= 10}>
		<Icon name="clock" size={18} />
		<strong>{left}s</strong>
		<span class="bar"><i style="width:{(left / DURATION) * 100}%"></i></span>
	</div>

	{#if running && current}
		<div class="prompt">
			<span class="glyph jp">{glyph}</span>
		</div>
		<RomajiInput bind:value status={status} onsubmit={submit} placeholder="go!" />
	{:else if done}
		<div class="result">
			<h3>{drill.correct} correct</h3>
			<p class="muted">
				{drill.asked} answered · {drill.asked ? Math.round((drill.correct / drill.asked) * 100) : 0}%
				accurate · best streak {drill.best}
			</p>
			<p class="record"><Icon name="star" size={16} /> personal record: {$record60}</p>
			<button class="btn" onclick={start}><Icon name="refresh" size={17} /> Run it again</button>
		</div>
	{:else}
		<div class="result">
			<p class="lede">One minute. Every sound you selected. Go as fast as you can read.</p>
			<button class="btn btn--lg" onclick={start} disabled={!$activeSounds.length}>
				<Icon name="flame" size={18} /> Start the minute
			</button>
			{#if $record60}<p class="record"><Icon name="star" size={16} /> record: {$record60}</p>{/if}
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
	}
	.timer.low {
		color: var(--bad);
	}
	.bar {
		flex: 1;
		height: 8px;
		border-radius: var(--r-full);
		background: var(--mint-shadow);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: currentColor;
		transition: width 1s linear;
	}
	.prompt {
		text-align: center;
		margin-bottom: var(--s-4);
	}
	.glyph {
		font-family: var(--font-jp);
		font-size: var(--fs-kana);
		line-height: 1;
		color: var(--ink-strong);
	}
	.result {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
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
