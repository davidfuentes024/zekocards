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
		border: 2px solid var(--surface-line);
		border-radius: var(--r-md);
		overflow: hidden;
		transition:
			transform var(--t-fast) var(--ease-spring),
			border-color var(--t-fast) var(--ease-out),
			box-shadow var(--t-fast) var(--ease-out),
			background var(--t-fast) var(--ease-out);
	}

	.card:hover {
		transform: translateY(-3px);
		box-shadow: var(--sh-2);
		border-color: var(--aqua-deep);
	}

	.card.is-on {
		background: var(--cello);
		border-color: var(--cello);
	}

	.face {
		display: grid;
		place-items: center;
		gap: 0;
		padding: var(--s-4) var(--s-2) var(--s-2);
		background: none;
		border: 0;
		cursor: pointer;
		width: 100%;
	}

	.glyph {
		font-family: var(--font-jp);
		font-size: 2.4rem;
		line-height: 1;
		color: var(--ink-strong);
		transition: color var(--t-fast) var(--ease-out);
	}

	.romaji {
		margin-top: var(--s-2);
		font-size: var(--fs-xs);
		font-weight: 700;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.alt {
		font-family: var(--font-jp);
		font-size: var(--fs-xs);
		color: color-mix(in srgb, var(--ink-muted) 65%, transparent);
	}

	.is-on .glyph {
		color: var(--mint);
	}
	.is-on .romaji {
		color: var(--aqua);
	}
	.is-on .alt {
		color: color-mix(in srgb, var(--aqua) 55%, transparent);
	}

	.meta {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-2) var(--s-3);
		border-top: 1.5px solid var(--surface-line);
		background: var(--bg-sunken);
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
		gap: 3px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--ink-muted);
		font-weight: 600;
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
		width: 24px;
		height: 24px;
		border: 0;
		border-radius: var(--r-sm);
		background: transparent;
		color: inherit;
		cursor: pointer;
		transition: background var(--t-fast) var(--ease-out);
	}
	.tool:hover {
		background: var(--aqua-soft);
		color: var(--cello);
	}

	/* folded washi corner */
	.corner {
		position: absolute;
		right: 0;
		top: 0;
		width: 0;
		height: 0;
		border-top: 14px solid var(--aqua-soft);
		border-left: 14px solid transparent;
		transition: border-top-color var(--t-fast) var(--ease-out);
	}
	.is-on .corner {
		border-top-color: var(--aqua);
	}
</style>
