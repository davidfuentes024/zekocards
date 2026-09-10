<script>
	/* Two ways in: meaning (typed in English) and reading (built in kana
	   from the full grid — never romaji). */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import KanaKeypad from '$lib/components/KanaKeypad.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { KANJI, KANJI_LEVELS } from '$lib/data/kanji.js';
	import { scriptSounds, glyphOf } from '$lib/data/kana.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { checkMeaning } from '$lib/utils/answer.js';
	import { say } from '$lib/utils/speech.js';
	import { persisted } from '$lib/stores/persisted.js';

	const drill = createDrill({ goal: 20 });
	const kanjiStats = persisted('kanji-stats', {});

	let level = $state('N5');
	let mode = $state('meaning'); // meaning | reading
	let current = $state(null);
	let value = $state('');
	let status = $state(null);
	let revealed = $state(false);
	let built = $state('');
	let nudge = $state(0);
	let missed = $state(false);
	let round = $state(0);

	const pool = $derived(
		KANJI.filter((k) => k.level === level).filter(
			(k) => mode === 'meaning' || k.kun.length || k.on.length
		)
	);

	/* readings: kun is hiragana, on is katakana — the drill follows suit */
	const target = $derived(current ? (current.kun[0] ?? current.on[0] ?? '') : '');
	const readingScript = $derived(current && current.kun.length ? 'hiragana' : 'katakana');
	const pad = $derived(scriptSounds(readingScript));

	function weight(k) {
		const s = $kanjiStats[k.id];
		if (!s) return 8;
		return 1 + (s.bad ?? 0) * 3 - Math.min(4, s.ok ?? 0) * 0.5;
	}

	function next() {
		if (!pool.length) return;
		current = nextPrompt(pool, weight, drill.recent, 6);
		drill.remember(current);
		drill.mark();
		value = '';
		status = null;
		revealed = false;
		built = '';
		missed = false;
		round += 1;
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && pool.length) next();
	});

	function score(ok) {
		kanjiStats.update((all) => {
			const s = all[current.id] ?? { ok: 0, bad: 0 };
			return { ...all, [current.id]: { ok: s.ok + (ok ? 1 : 0), bad: s.bad + (ok ? 0 : 1) } };
		});
	}

	function submitMeaning() {
		if (!current || revealed) return;
		const ok = checkMeaning(value, current.meaning);
		score(ok);
		drill.answer([], ok);
		status = ok ? 'ok' : 'bad';
		revealed = true;
		say(current.kanji);
		setTimeout(next, ok ? 900 : 2400);
	}

	function push(char) {
		if (!current || revealed) return;
		const attempt = built + char;
		if (target.startsWith(attempt)) {
			built = attempt;
			if (built === target) {
				score(!missed);
				drill.answer([], !missed);
				revealed = true;
				say(current.kanji);
				setTimeout(next, 1300);
			}
		} else {
			missed = true;
			nudge += 1;
			drill.setFeedback('bad');
			setTimeout(() => drill.clearFeedback(), 380);
		}
	}

	function back() {
		const chars = [...built];
		chars.pop();
		built = chars.join('');
	}

	function switchMode(m) {
		mode = m;
		current = null;
	}
</script>

<DrillFrame
	title="Kanji Grind"
	jp="漢字"
	hint="Meanings in English, readings in kana. Readings are spelled out on the full grid, never romanised."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	<div class="modes">
		{#each KANJI_LEVELS as l}
			<button class="tab" aria-pressed={level === l} onclick={() => { level = l; current = null; }}>
				{l}
			</button>
		{/each}
		<span class="sep"></span>
		<button class="tab" aria-pressed={mode === 'meaning'} onclick={() => switchMode('meaning')}>
			Meaning
		</button>
		<button class="tab" aria-pressed={mode === 'reading'} onclick={() => switchMode('reading')}>
			Reading
		</button>
	</div>

	{#if current}
		<div class="prompt">
			<button class="kanji jp" onclick={() => say(current.kanji)}>{current.kanji}</button>
			<span class="tag">
				{mode === 'meaning' ? 'What does it mean?' : `Spell the ${readingScript === 'hiragana' ? 'kun' : 'on'} reading`}
			</span>
		</div>

		{#if mode === 'meaning'}
			{#if revealed}
				<div class="reveal" class:ok={status === 'ok'}>
					<strong>{current.meaning}</strong>
					<span class="jp">音 {current.on.join('・') || '—'} · 訓 {current.kun.join('・') || '—'}</span>
				</div>
			{/if}
			<RomajiInput
				bind:value
				status={status}
				onsubmit={submitMeaning}
				placeholder="meaning in English…"
				label="Meaning"
				disabled={revealed}
			/>
		{:else}
			<div class="slots" class:solved={revealed} class:nudge={nudge % 2 === 1}>
				{#each Array([...target].length) as _, i}
					<span class="slot jp" class:filled={i < [...built].length}>{[...built][i] ?? ''}</span>
				{/each}
			</div>

			{#if revealed}
				<p class="reveal ok">
					<strong class="jp">{current.kanji} · {target}</strong>
					<span>{current.meaning}</span>
				</p>
			{/if}

			<div class="tools">
				<button class="tab" onclick={back} disabled={!built || revealed}>
					<Icon name="arrowLeft" size={15} /> back
				</button>
			</div>

			<KanaKeypad
				sounds={pad}
				script={readingScript}
				shuffleKey={round}
				disabled={revealed}
				size="sm"
				onPick={(s) => push(glyphOf(s, readingScript))}
			/>
		{/if}

		{#if revealed && current.examples.length}
			<ul class="ex">
				{#each current.examples as e}
					<li><span class="jp">{e.word}</span> <span class="jp muted">{e.reading}</span> <span class="muted">{e.en}</span></li>
				{/each}
			</ul>
		{/if}
	{/if}
</DrillFrame>

<style>
	.modes {
		display: flex;
		justify-content: center;
		gap: var(--s-2);
		flex-wrap: wrap;
		margin-bottom: var(--s-4);
	}
	.sep {
		width: 2px;
		height: 24px;
		background: var(--surface-line);
	}
	.prompt {
		display: grid;
		justify-items: center;
		gap: var(--s-2);
		margin-bottom: var(--s-4);
	}
	.kanji {
		font-family: var(--font-jp);
		font-size: clamp(4rem, 14vw, 6.5rem);
		line-height: 1;
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
		animation: zk-pop var(--t-base) var(--ease-spring);
	}
	.reveal {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--s-3);
		flex-wrap: wrap;
		margin-bottom: var(--s-3);
		padding: var(--s-2) var(--s-4);
		border-radius: var(--r-md);
		background: var(--bad-bg);
		font-size: var(--fs-sm);
	}
	.reveal.ok {
		background: var(--ok-bg);
	}
	.reveal strong {
		font-family: var(--font-display);
		font-size: var(--fs-md);
	}
	.slots {
		display: flex;
		justify-content: center;
		gap: var(--s-2);
		margin-bottom: var(--s-3);
	}
	.nudge {
		animation: zk-shake 320ms var(--ease-in-out);
	}
	.slot {
		display: grid;
		place-items: center;
		width: 58px;
		height: 64px;
		font-family: var(--font-jp);
		font-size: 2rem;
		border-radius: var(--r-md);
		border: 3px dashed var(--surface-line);
		background: var(--bg-tint);
	}
	.slot.filled {
		border-style: solid;
		border-color: var(--wedge);
		background: var(--bg-raised);
		box-shadow: 0 4px 0 var(--wedge-soft);
	}
	.solved .slot {
		border-color: var(--ok);
		background: var(--ok-bg);
	}
	.tools {
		display: flex;
		justify-content: center;
		margin-bottom: var(--s-3);
	}
	.ex {
		list-style: none;
		margin: var(--s-4) 0 0;
		padding: 0;
		display: grid;
		gap: 4px;
		font-size: var(--fs-sm);
	}
	.ex li {
		display: flex;
		gap: var(--s-3);
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
