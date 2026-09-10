<script>
	import Icon from './Icon.svelte';
	import Zeko from './Zeko.svelte';
	import Motif from './Motif.svelte';

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
		children,
		aside = null
	} = $props();

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
			<span class="stat" title="Best streak"><Icon name="star" size={15} />{best}</span>
		</div>

		<div class="meter" style="flex:1 1 120px">
			<i style="width:{pct}%"></i>
		</div>
	</header>

	{#if hint}
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
		border: 2px solid var(--surface-line);
		background: var(--bg-raised);
		box-shadow: var(--edge);
		position: sticky;
		top: calc(var(--header-h) + 8px);
		z-index: 5;
	}

	.quit {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border: 2px solid var(--surface-line);
		border-radius: var(--r-md);
		background: var(--bg-raised);
		color: var(--wedge-deep);
		box-shadow: 0 3px 0 var(--surface-line);
		transition: background var(--t-fast) var(--ease-out);
	}
	.quit:hover {
		background: var(--aqua);
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
		font-weight: 800;
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
		background: var(--bg-raised);
		border: 3px solid var(--surface-line);
		box-shadow: 0 8px 0 var(--surface-line-strong);
		transition:
			box-shadow var(--t-base) var(--ease-out),
			border-color var(--t-base) var(--ease-out);
	}

	.stage.flash-ok {
		border-color: var(--ok);
		box-shadow: 0 8px 0 var(--ok);
	}
	.stage.flash-bad {
		border-color: var(--bad);
		box-shadow: 0 8px 0 var(--bad);
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
		color: #fff;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: var(--fs-sm);
		box-shadow: 0 4px 0 var(--cello-ink);
		animation: zk-pop 260ms var(--ease-spring);
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
</style>
