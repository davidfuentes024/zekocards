<script>
	/* The card's back: everything known about one sound, plus the blank
	   line where the learner writes their own anchor word. */
	import Icon from './Icon.svelte';
	import MasteryRing from './MasteryRing.svelte';
	import { anchors, setAnchor, clearAnchor } from '$lib/stores/associations.js';
	import { stats, MAX_LEVEL } from '$lib/stores/progress.js';
	import { selectedSounds } from '$lib/stores/selection.js';
	import { wordsUsing } from '$lib/data/dictionary.js';
	import { say } from '$lib/utils/speech.js';

	let { sound = null, script = 'hiragana', onClose = () => {}, onToggle = () => {} } = $props();

	let onlySelected = $state(true);

	const anchor = $derived(sound ? ($anchors[sound.id] ?? { word: '', note: '' }) : null);
	const stat = $derived(sound ? ($stats[sound.id] ?? { seen: 0, ok: 0, bad: 0, level: 0, best: 0 }) : null);
	const examples = $derived(
		sound ? wordsUsing(sound.id, onlySelected ? $selectedSounds : null).slice(0, 40) : []
	);
	const isOn = $derived(sound ? $selectedSounds.has(sound.id) : false);

	function saveWord(e) {
		setAnchor(sound.id, { word: e.currentTarget.value });
	}
	function saveNote(e) {
		setAnchor(sound.id, { note: e.currentTarget.value });
	}
</script>

{#if sound}
	<div class="scrim" role="presentation" onclick={onClose}></div>
	<aside class="drawer scroll" aria-label="Card detail">
		<header>
			<button class="close" onclick={onClose} aria-label="Close"><Icon name="cross" size={18} /></button>
		</header>

		<div class="hero">
			<div class="glyphs">
				<button class="big jp" onclick={() => say(script === 'hiragana' ? sound.h : sound.k)}>
					{script === 'hiragana' ? sound.h : sound.k}
				</button>
				<div class="pair">
					{#if sound.h}<span class="jp">{sound.h}<small>hiragana</small></span>{/if}
					{#if sound.k}<span class="jp">{sound.k}<small>katakana</small></span>{/if}
				</div>
			</div>
			<div class="idcol">
				<strong class="romaji">{sound.r}</strong>
				{#if sound.alt.length}<span class="muted">also: {sound.alt.join(', ')}</span>{/if}
				<div class="row">
					<button class="btn btn--sm" onclick={() => onToggle(sound.id)}>
						<Icon name={isOn ? 'check' : 'plus'} size={15} />
						{isOn ? 'In your set' : 'Add to set'}
					</button>
					<button class="btn btn--ghost btn--sm" onclick={() => say(script === 'hiragana' ? sound.h : sound.k)}>
						<Icon name="sound" size={15} /> hear
					</button>
				</div>
			</div>
		</div>

		<div class="mastery">
			<MasteryRing value={stat.level / MAX_LEVEL} size={44} />
			<div class="nums">
				<span><strong>{stat.seen}</strong> seen</span>
				<span><strong>{stat.ok}</strong> right</span>
				<span><strong>{stat.bad}</strong> wrong</span>
				<span><strong>{stat.best}</strong> best streak</span>
			</div>
		</div>

		<section class="block">
			<h4><Icon name="pencil" size={16} /> Your anchor</h4>
			<p class="muted hint">
				Write the word this character lives in for you. It shows up on the card, and the Anchor
				drill will hand it back with the character hidden.
			</p>
			<input
				class="field"
				placeholder="a word, a shape, anything that sticks…"
				value={anchor.word}
				oninput={saveWord}
			/>
			<textarea
				class="field"
				rows="2"
				placeholder="why it sticks (optional)"
				value={anchor.note}
				oninput={saveNote}
			></textarea>
			{#if anchor.word || anchor.note}
				<button class="btn btn--ghost btn--sm" onclick={() => clearAnchor(sound.id)}>
					<Icon name="trash" size={15} /> clear anchor
				</button>
			{/if}
		</section>

		<section class="block">
			<div class="spread">
				<h4><Icon name="scroll" size={16} /> Words with {sound.r}</h4>
				<button class="chip" aria-pressed={onlySelected} onclick={() => (onlySelected = !onlySelected)}>
					only my selection
				</button>
			</div>
			{#if examples.length}
				<ul class="words">
					{#each examples as w (w.id)}
						<li>
							<button class="jp w" onclick={() => say(w.kana)}>{w.kana}</button>
							<span class="r">{w.romaji}</span>
							<span class="muted en">{w.en}</span>
							{#if w.kanji}<span class="jp kanji muted">{w.kanji}</span>{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">
					No word in the dictionary is spelled only with sounds you have selected yet. Turn off the
					filter to see where this character appears.
				</p>
			{/if}
		</section>
	</aside>
{/if}

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 30;
		background: rgba(29, 54, 88, 0.32);
		backdrop-filter: blur(2px);
		animation: zk-rise var(--t-base) var(--ease-out);
	}
	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 31;
		width: min(460px, 100%);
		padding: var(--s-5);
		background: var(--bg-raised);
		border-left: var(--border);
		box-shadow: var(--sh-3);
		animation: zk-rise var(--t-base) var(--ease-out);
	}
	header {
		display: flex;
		justify-content: flex-end;
	}
	.close {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border: 0;
		border-radius: 50%;
		background: var(--bg-sunken);
		color: var(--cello);
		cursor: pointer;
	}

	.hero {
		display: flex;
		gap: var(--s-5);
		align-items: center;
		margin-bottom: var(--s-4);
	}
	.big {
		font-family: var(--font-jp);
		font-size: 5rem;
		line-height: 1;
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
	}
	.pair {
		display: flex;
		gap: var(--s-3);
		margin-top: var(--s-2);
	}
	.pair span {
		display: grid;
		font-family: var(--font-jp);
		font-size: var(--fs-lg);
		color: var(--ink-muted);
	}
	.pair small {
		font-family: var(--font-ui);
		font-size: var(--fs-2xs);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
	}
	.idcol {
		display: grid;
		gap: var(--s-2);
	}
	.romaji {
		font-family: var(--font-display);
		font-size: var(--fs-2xl);
		letter-spacing: 0.06em;
		color: var(--wedge-deep);
	}

	.mastery {
		display: flex;
		align-items: center;
		gap: var(--s-4);
		padding: var(--s-3);
		background: var(--bg-sunken);
		border-radius: var(--r-md);
		margin-bottom: var(--s-5);
	}
	.nums {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-3);
		font-size: var(--fs-xs);
		color: var(--ink-muted);
	}
	.nums strong {
		font-family: var(--font-display);
		color: var(--ink-strong);
	}

	.block {
		margin-bottom: var(--s-5);
	}
	.block h4 {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: var(--fs-md);
		margin-bottom: var(--s-2);
	}
	.hint {
		font-size: var(--fs-xs);
		margin-bottom: var(--s-3);
	}
	.block .field + .field {
		margin-top: var(--s-2);
	}
	textarea.field {
		resize: vertical;
		font-family: inherit;
	}
	.block .btn {
		margin-top: var(--s-2);
	}

	.words {
		list-style: none;
		margin: var(--s-2) 0 0;
		padding: 0;
		display: grid;
		gap: 2px;
	}
	.words li {
		display: flex;
		align-items: baseline;
		gap: var(--s-2);
		padding: var(--s-2);
		border-radius: var(--r-sm);
		font-size: var(--fs-sm);
	}
	.words li:nth-child(odd) {
		background: var(--bg-sunken);
	}
	.w {
		font-family: var(--font-jp);
		font-size: var(--fs-lg);
		border: 0;
		background: none;
		color: var(--ink-strong);
		cursor: pointer;
	}
	.r {
		font-size: var(--fs-xs);
		font-weight: 700;
		color: var(--wedge);
	}
	.en {
		margin-left: auto;
		text-align: right;
	}
	.kanji {
		font-family: var(--font-jp);
	}
</style>
