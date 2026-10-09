<script>
	import Icon from './Icon.svelte';
	import Zeko from './Zeko.svelte';
	import Motif from './Motif.svelte';
	import Modal from './Modal.svelte';
	import DifficultyBoard from './DifficultyBoard.svelte';
	import { PRESETS, presetId, difficulty } from '$lib/stores/difficulty.js';

	let {
		title = 'Drill',
		jp = '',
		hint = '',
		asked = 0,
		correct = 0,
		streak = 0,
		best = 0,
		goal = 20,
		feedback = null,
		remainingMs = 0,
		budgetMs = 0,
		children,
		aside = null
	} = $props();

	let dialsOpen = $state(false);

	const clockPct = $derived(budgetMs ? Math.max(0, (remainingMs / budgetMs) * 100) : 0);
	const clockLow = $derived(clockPct < 30);
	const presetJp = $derived(PRESETS.find((p) => p.id === $presetId)?.jp ?? '自');

	const accuracy = $derived(asked ? Math.round((correct / asked) * 100) : 0);
	const pct = $derived(Math.min(100, Math.round((asked / Math.max(1, goal)) * 100)));
	const mood = $derived(
		feedback === 'ok' ? (streak >= 5 ? 'cheer' : 'happy') : feedback === 'bad' ? 'wrong' : 'think'
	);

	const CHEERS = ['そう！', 'Nice.', 'Again.', 'Good.'];
	const NOPES = ['ちがう', 'Not that one.', 'Type it again.'];
	const say = $derived(
		feedback === 'ok'
			? CHEERS[asked % CHEERS.length]
			: feedback === 'bad'
				? NOPES[asked % NOPES.length]
				: null
	);
</script>

<div class="drill">
	<header class="bar">
		<a class="quit" href="/practice" aria-label="Back to the training hall">
			<Icon name="arrowLeft" size={18} />
		</a>

		<div class="who">
			<strong>{title}</strong>
			{#if jp}<span class="jp muted">{jp}</span>{/if}
		</div>

		<div class="stats">
			<span class="stat" title="Answered this session">
				<Icon name="target" size={15} />{asked}
			</span>
			<span class="stat" title="Accuracy"><Icon name="check" size={15} />{accuracy}%</span>
			<span class="stat" class:hot={streak >= 5} title="Current streak">
				<Icon name="flame" size={15} />{streak}
			</span>
		</div>

		<button class="dials" onclick={() => (dialsOpen = true)} title="Difficulty">
			<span class="jp">{presetJp}</span>
			{#if $difficulty.clock === 'off'}<span class="jp inf">∞</span>{/if}
			<Icon name="gear" size={14} />
		</button>

		<div class="meter" style="flex:1 1 120px">
			<i style="width:{pct}%"></i>
		</div>
	</header>

	{#if budgetMs}
		<div class="clock" class:low={clockLow}>
			<div class="meter"><i style="width:{clockPct}%"></i></div>
			<span>{(remainingMs / 1000).toFixed(1)}s</span>
		</div>
	{/if}

	{#if hint && asked === 0}
		<p class="hint muted">{hint}</p>
	{/if}

	<div class="stage" class:flash-ok={feedback === 'ok'} class:flash-bad={feedback === 'bad'}>
		<Motif name="wave" size={120} rotate={0} class="stage-deco" opacity={0.28} float={false} />
		<div class="content">
			{@render children?.()}
		</div>

		<div class="buddy">
			{#if say}<span class="say">{say}</span>{/if}
			<Zeko {mood} size={150} floating={feedback === null} />
			{#if aside}<div class="aside">{@render aside()}</div>{/if}
		</div>
	</div>
</div>

<Modal open={dialsOpen} label="Difficulty" onClose={() => (dialsOpen = false)}>
	<DifficultyBoard collapsible={false} />
</Modal>

<style>
	.drill {
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: var(--s-4);
		flex-wrap: wrap;
		padding: var(--s-3) var(--s-4);
		border-radius: var(--r-tile);
		border: 0.5px solid var(--glass-line);
		background: var(--glass-fill);
		-webkit-backdrop-filter: saturate(180%) blur(22px);
		backdrop-filter: saturate(180%) blur(22px);
		box-shadow: var(--sh-1);
		position: sticky;
		top: calc(var(--header-h) + 8px);
		z-index: 5;
	}

	.quit {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border-radius: var(--r-full);
		background: var(--bg-sunken);
		color: var(--wedge-deep);
		transition:
			background var(--t-base) var(--ease-ios),
			transform var(--t-base) var(--ease-ios);
	}
	.quit:hover {
		background: var(--aqua-soft);
	}
	.quit:active {
		transform: scale(0.92);
	}

	.who {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.who strong {
		font-family: var(--font-display);
		font-size: var(--fs-lg);
	}
	.who .jp {
		font-size: var(--fs-2xs);
	}

	.stats {
		display: flex;
		gap: var(--s-3);
		flex-wrap: wrap;
	}
	.stat {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 0.3em 0.6em;
		border-radius: var(--r-tab);
		background: var(--bg-tint);
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
	}
	.stat.hot {
		color: var(--hanko);
	}

	.hint {
		font-size: var(--fs-sm);
		max-width: min(70ch, 100%);
		padding-inline: var(--s-2);
	}

	.stage {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--s-5);
		align-items: end;
		padding: var(--s-6) var(--s-5) var(--s-5);
		border-radius: var(--r-xl);
		background: var(--glass-fill);
		-webkit-backdrop-filter: saturate(180%) blur(22px);
		backdrop-filter: saturate(180%) blur(22px);
		border: 0.5px solid var(--glass-line);
		box-shadow: var(--sh-2);
		transition:
			box-shadow var(--t-slow) var(--ease-ios),
			border-color var(--t-base) var(--ease-ios);
	}

	/* feedback is a soft ring that settles, not a heavy coloured slab */
	.stage.flash-ok {
		box-shadow: var(--sh-2), 0 0 0 3px color-mix(in srgb, var(--ok) 55%, transparent);
	}
	.stage.flash-bad {
		box-shadow: var(--sh-2), 0 0 0 3px color-mix(in srgb, var(--bad) 60%, transparent);
		animation: zk-shake 420ms var(--ease-in-out);
	}

	.content {
		min-width: 0;
		position: relative;
		z-index: 1;
	}

	.stage :global(.stage-deco) {
		position: absolute;
		left: -14px;
		bottom: -18px;
		z-index: 0;
	}

	.buddy {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-2);
	}

	.say {
		padding: 0.4em 0.9em;
		border-radius: var(--r-md);
		background: var(--cello);
		color: var(--on-accent);
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--fs-sm);
		animation: zk-pop var(--t-base) var(--ease-ios);
	}

	.aside {
		max-width: 190px;
		font-size: var(--fs-2xs);
		text-align: center;
		color: var(--ink-muted);
		background: var(--bg-sunken);
		border-radius: var(--r-md);
		padding: var(--s-2) var(--s-3);
	}

	@media (max-width: 860px) {
		.stage {
			grid-template-columns: 1fr;
		}
		.buddy {
			flex-direction: row;
			justify-content: center;
		}
	}

	.dials {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 9px;
		background: var(--bg-sunken);
		border: 0;
		border-radius: var(--r-sm);
		color: var(--ink-strong);
		cursor: pointer;
		font-size: 0.85rem;
	}

	.dials:hover {
		border-color: var(--aqua-deep);
	}

	.dials .inf {
		color: var(--wedge);
	}

	.clock {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: 0 var(--s-3) var(--s-2);
	}

	.clock .meter {
		flex: 1;
	}

	.clock span {
		min-width: 3.2rem;
		text-align: right;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--ink-soft);
	}

	.clock.low :global(i) {
		background: var(--hanko);
	}

	.clock.low span {
		color: var(--hanko);
	}
</style>
