<script>
	import Icon from './Icon.svelte';
	import Zeko from './Zeko.svelte';

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
</script>

<div class="drill">
	<header class="bar panel panel--quiet">
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
		<div class="content">
			{@render children?.()}
		</div>

		<div class="buddy">
			<Zeko {mood} size={120} floating={feedback === null} />
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
		position: sticky;
		top: calc(var(--header-h) + 8px);
		z-index: 5;
	}

	.quit {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--bg-sunken);
		color: var(--wedge-deep);
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
		gap: 4px;
		font-size: var(--fs-xs);
		font-weight: 700;
		color: var(--ink-muted);
	}
	.stat.hot {
		color: var(--hanko);
	}

	.hint {
		font-size: var(--fs-sm);
		max-width: min(70ch, 100%);
	}

	.stage {
		position: relative;
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--s-5);
		align-items: end;
		padding: var(--s-5);
		border-radius: var(--r-xl);
		background: var(--bg-raised);
		border: var(--border);
		box-shadow: var(--sh-2);
		transition: box-shadow var(--t-base) var(--ease-out);
	}

	.stage.flash-ok {
		box-shadow: 0 0 0 4px var(--ok-bg), var(--sh-2);
	}
	.stage.flash-bad {
		box-shadow: 0 0 0 4px var(--bad-bg), var(--sh-2);
	}

	.content {
		min-width: 0;
	}

	.buddy {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-2);
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
