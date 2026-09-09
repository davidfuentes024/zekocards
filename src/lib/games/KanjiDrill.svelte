<script>
	/* Kanji, but always routed back through kana readings. */
	import DrillFrame from '$lib/components/DrillFrame.svelte';
	import RomajiInput from '$lib/components/RomajiInput.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { KANJI, KANJI_LEVELS } from '$lib/data/kanji.js';
	import { createDrill } from '$lib/utils/drill.svelte.js';
	import { nextPrompt } from '$lib/utils/random.js';
	import { checkMeaning, normalize } from '$lib/utils/answer.js';
	import { romajiFromKana } from '$lib/utils/answer.js';
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
	let echoing = $state(false);

	const pool = $derived(KANJI.filter((k) => k.level === level));

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
		echoing = false;
		drill.clearFeedback();
	}

	$effect(() => {
		if (!current && pool.length) next();
	});

	function readingOk(input) {
		const n = normalize(input);
		const all = [...current.on, ...current.kun].map((r) => normalize(romajiFromKana(r)));
		return all.includes(n);
	}

	function score(ok) {
		kanjiStats.update((all) => {
			const s = all[current.id] ?? { ok: 0, bad: 0 };
			return { ...all, [current.id]: { ok: s.ok + (ok ? 1 : 0), bad: s.bad + (ok ? 0 : 1) } };
		});
	}

	function submit() {
		if (!current) return;
		const ok = mode === 'meaning' ? checkMeaning(value, current.meaning) : readingOk(value);
		if (echoing) {
			if (ok) next();
			else {
				status = 'bad';
				value = '';
			}
			return;
		}
		score(ok);
		drill.answer([], ok);
		revealed = true;
		if (ok) {
			status = 'ok';
			setTimeout(next, 700);
		} else {
			status = 'bad';
			echoing = true;
			value = '';
		}
	}
</script>

<DrillFrame
	title="Kanji Grind"
	jp="漢字"
	hint="Readings are written in kana on purpose — every kanji answer is also kana practice."
	asked={drill.asked}
	correct={drill.correct}
	streak={drill.streak}
	best={drill.best}
	goal={drill.goal}
	feedback={drill.feedback}
>
	<div class="row modes">
		{#each KANJI_LEVELS as l}
			<button class="chip" aria-pressed={level === l} onclick={() => { level = l; current = null; }}>
				{l}
			</button>
		{/each}
		<span class="sep"></span>
		<button class="chip" aria-pressed={mode === 'meaning'} onclick={() => (mode = 'meaning')}>
			Meaning
		</button>
		<button class="chip" aria-pressed={mode === 'reading'} onclick={() => (mode = 'reading')}>
			Reading
		</button>
	</div>

	{#if current}
		<div class="prompt">
			<button class="kanji jp" onclick={() => say(current.kanji)}>{current.kanji}</button>
			<span class="tag">
				{mode === 'meaning' ? 'What does it mean?' : 'Type any reading in romaji'}
			</span>
			<span class="strokes">{current.strokes} strokes</span>

			{#if revealed}
				<div class="reveal">
					<p><strong>{current.meaning}</strong></p>
					<p class="jp readings">
						<span>音 {current.on.join('・') || '—'}</span>
						<span>訓 {current.kun.join('・') || '—'}</span>
					</p>
					<ul>
						{#each current.examples as ex}
							<li>
								<span class="jp">{ex.word}</span>
								<span class="jp muted">{ex.reading}</span>
								<span class="muted">{ex.en}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

		<RomajiInput
			bind:value
			status={status}
			onsubmit={submit}
			placeholder={mode === 'meaning' ? 'english meaning…' : 'romaji reading…'}
		/>
	{/if}
</DrillFrame>

<style>
	.modes {
		justify-content: center;
		margin-bottom: var(--s-4);
	}
	.sep {
		width: 1px;
		height: 20px;
		background: var(--surface-line);
	}
	.prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
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
	.strokes {
		font-size: var(--fs-2xs);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.reveal {
		margin-top: var(--s-3);
		padding: var(--s-3) var(--s-4);
		background: var(--bg-sunken);
		border-radius: var(--r-md);
		text-align: center;
		max-width: min(46ch, 100%);
	}
	.readings {
		display: flex;
		gap: var(--s-4);
		justify-content: center;
		font-size: var(--fs-sm);
		color: var(--wedge-deep);
	}
	.reveal ul {
		list-style: none;
		margin: var(--s-2) 0 0;
		padding: 0;
		display: grid;
		gap: 4px;
		font-size: var(--fs-sm);
	}
	.reveal li {
		display: flex;
		gap: var(--s-2);
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
