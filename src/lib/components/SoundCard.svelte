<script>
	import Icon from './Icon.svelte';
	import MasteryRing from './MasteryRing.svelte';
	import { say } from '$lib/utils/speech.js';

	let {
		sound,
		script = 'hiragana',
		selected = false,
		mastery = 0,
		anchor = null,
		examples = 0,
		showRomaji = true,
		onToggle = () => {},
		onOpen = null
	} = $props();

	const glyph = $derived(script === 'hiragana' ? sound.h : sound.k);
	const other = $derived(script === 'hiragana' ? sound.k : sound.h);
</script>

{#if glyph}
	<div class="card" class:is-on={selected}>
		<button
			class="face"
			aria-pressed={selected}
			aria-label="{sound.r} — {selected ? 'selected' : 'not selected'}"
			onclick={() => onToggle(sound.id)}
		>
			<span class="glyph jp">{glyph}</span>
			{#if showRomaji}<span class="romaji">{sound.r}</span>{/if}
			{#if other}<span class="alt jp">{other}</span>{/if}
		</button>

		<div class="meta">
			<MasteryRing value={mastery} size={26} label="mastery" />
			{#if anchor?.word}
				<span class="anchor" title={anchor.word}><Icon name="pencil" size={13} />{anchor.word}</span>
			{:else if examples}
				<span class="count"><Icon name="cards" size={13} />{examples}</span>
			{/if}
			<div class="tools">
				<button class="tool" title="Hear it" onclick={() => say(glyph)}>
					<Icon name="sound" size={15} />
				</button>
				{#if onOpen}
					<button class="tool" title="Open card" onclick={() => onOpen(sound)}>
						<Icon name="chevronRight" size={15} />
					</button>
				{/if}
			</div>
		</div>

		<span class="corner"></span>
	</div>
{/if}

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--bg-raised);
		border: 3px solid var(--surface-line);
		border-radius: var(--r-md);
		box-shadow: 0 5px 0 var(--surface-line-strong);
		overflow: hidden;
		transition:
			transform 130ms var(--ease-spring),
			border-color var(--t-fast) var(--ease-out),
			box-shadow 130ms var(--ease-out),
			background var(--t-fast) var(--ease-out);
	}

	.card:hover {
		transform: translateY(-4px) rotate(-0.8deg);
		box-shadow: 0 9px 0 var(--surface-line-strong), var(--sh-2);
		border-color: var(--aqua-deep);
	}

	.card:active {
		transform: translateY(2px);
		box-shadow: 0 2px 0 var(--surface-line-strong);
	}

	.card.is-on {
		background: var(--cello);
		border-color: var(--cello);
		box-shadow: 0 5px 0 var(--cello-ink);
	}
	.card.is-on:hover {
		box-shadow: 0 9px 0 var(--cello-ink), var(--sh-2);
	}

	.face {
		display: grid;
		place-items: center;
		padding: var(--s-4) var(--s-2) var(--s-3);
		background: none;
		border: 0;
		cursor: pointer;
		width: 100%;
	}

	.glyph {
		font-family: var(--font-jp);
		font-size: 3.1rem;
		line-height: 1;
		color: var(--ink-strong);
		transition: color var(--t-fast) var(--ease-out);
	}

	.romaji {
		margin-top: var(--s-2);
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 800;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--wedge);
	}

	.alt {
		font-family: var(--font-jp);
		font-size: var(--fs-xs);
		color: var(--ink-muted);
		opacity: 0.75;
	}

	.is-on .glyph {
		color: #fff;
	}
	.is-on .romaji {
		color: var(--aqua);
	}
	.is-on .alt {
		color: var(--aqua);
		opacity: 0.6;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-2) var(--s-3);
		border-top: 3px solid var(--surface-line);
		background: var(--bg-tint);
		font-size: var(--fs-2xs);
	}

	.is-on .meta {
		background: var(--cello-soft);
		border-top-color: var(--cello-soft);
		color: var(--aqua);
	}

	.anchor,
	.count {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--ink-muted);
		font-weight: 700;
	}
	.is-on .anchor,
	.is-on .count {
		color: var(--aqua);
	}

	.tools {
		margin-left: auto;
		display: flex;
		gap: 2px;
	}

	.tool {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border: 0;
		border-radius: var(--r-sm);
		background: transparent;
		color: inherit;
		cursor: pointer;
		transition:
			background var(--t-fast) var(--ease-out),
			transform 100ms var(--ease-spring);
	}
	.tool:hover {
		background: var(--aqua);
		color: var(--cello);
		transform: scale(1.1);
	}

	/* folded washi corner */
	.corner {
		position: absolute;
		right: 0;
		top: 0;
		width: 0;
		height: 0;
		border-top: 18px solid var(--aqua-soft);
		border-left: 18px solid transparent;
		transition: border-top-color var(--t-fast) var(--ease-out);
	}
	.is-on .corner {
		border-top-color: var(--aqua);
	}

	@media (max-width: 720px) {
		.glyph {
			font-size: 2.5rem;
		}
	}
</style>
