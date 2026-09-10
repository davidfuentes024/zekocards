<script>
	import Icon from './Icon.svelte';
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
			<span class="line">
				{#if showRomaji}<span class="romaji">{sound.r}</span>{/if}
				{#if other}<span class="alt jp">{other}</span>{/if}
			</span>
		</button>

		{#if anchor?.word}
    <span class="ribbon" class:is-empty={!anchor?.word}>
	    {#if anchor?.word}
		    <Icon name="pencil" size={12} />
		    <em title={anchor.word}>{anchor.word}</em>
	    {/if}
    </span>
					{/if}

		<div class="meta">
			<span class="bar" aria-label="mastery">
				<i style="width:{Math.round(mastery * 100)}%"></i>
			</span>
			<button class="tool" title="Hear it" onclick={() => say(glyph)}>
				<Icon name="sound" size={16} />
			</button>
			{#if onOpen}
				<button class="tool" title="Open card" onclick={() => onOpen(sound)}>
					<Icon name="plus" size={16} />
				</button>
			{/if}
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
		justify-items: center;
		gap: var(--s-1);
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
	}

	.line {
		display: flex;
		align-items: baseline;
		gap: var(--s-2);
		min-height: 1.1em;
	}

	.romaji {
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
		opacity: 0.7;
	}

	.is-on .glyph {
		color: #fff;
	}
	.is-on .romaji {
		color: var(--aqua);
	}
	.is-on .alt {
		color: var(--aqua);
		opacity: 0.55;
	}

 /* anchor ribbon — always present, reserves the same height whether or not
   there's an anchor, so cards in the same row stay aligned. Text wraps
   instead of truncating, so nothing is ever hidden. */
  .ribbon {
	  display: flex;
	  align-items: flex-start;
	  gap: 4px;
	  padding: 3px var(--s-3);
	  background: var(--aqua-soft);
	  color: var(--cello);
	  font-size: var(--fs-2xs);
	  font-weight: 700;
	  min-height: calc(1.3em * 2 + 6px); /* room for ~2 lines before growing */
    }

  .ribbon em {
	  font-style: normal;
	  overflow-wrap: break-word;
	  word-break: break-word;
  }

  .ribbon.is-empty {
	  visibility: hidden;
  }

  .is-on .ribbon.is-empty {
	  background: var(--cello-soft); /* keep bg consistent even when hidden-but-reserved */
  }

	/* bottom bar: mastery meter + two fixed-width tools, never overflowing */
	.meta {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-2);
		border-top: 3px solid var(--surface-line);
		background: var(--bg-tint);
	}

	.is-on .meta {
		background: var(--cello-soft);
		border-top-color: var(--cello-soft);
	}

	.bar {
		display: block;
		height: 7px;
		border-radius: var(--r-full);
		background: var(--surface-line);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: var(--wedge);
		border-radius: inherit;
		transition: width var(--t-slow) var(--ease-out);
	}
	.is-on .bar {
		background: var(--cello-ink);
	}
	.is-on .bar i {
		background: var(--aqua);
	}

	.tool {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		flex: none;
		border: 2px solid var(--surface-line);
		border-radius: var(--r-sm);
		background: var(--bg-raised);
		color: var(--wedge-deep);
		cursor: pointer;
		transition:
			background var(--t-fast) var(--ease-out),
			transform 100ms var(--ease-spring);
	}
	.tool:hover {
		background: var(--aqua);
		color: var(--cello);
		transform: scale(1.08);
	}
	.is-on .tool {
		background: var(--cello);
		border-color: var(--cello-ink);
		color: var(--aqua);
	}
	.is-on .tool:hover {
		background: var(--aqua);
		color: var(--cello);
	}

	.corner {
		position: absolute;
		right: 0;
		top: 0;
		width: 0;
		height: 0;
		border-top: 18px solid var(--aqua-soft);
		border-left: 18px solid transparent;
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
