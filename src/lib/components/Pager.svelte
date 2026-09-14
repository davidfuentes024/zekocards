<script>
	/* Numbered pagination: first, last, and a window around the current page. */
	import Icon from './Icon.svelte';

	let { page = $bindable(1), pages = 1, onChange = () => {} } = $props();

	const items = $derived.by(() => {
		const out = [];
		const around = new Set([1, pages, page - 1, page, page + 1]);
		let prev = 0;
		for (let n = 1; n <= pages; n += 1) {
			if (!around.has(n)) continue;
			if (n - prev > 1) out.push({ gap: true, key: `gap-${n}` });
			out.push({ n, key: `p-${n}` });
			prev = n;
		}
		return out;
	});

	function go(n) {
		const next = Math.max(1, Math.min(pages, n));
		if (next === page) return;
		page = next;
		onChange(next);
	}
</script>

{#if pages > 1}
	<nav class="pager" aria-label="Pagination">
		<button class="tab" onclick={() => go(page - 1)} disabled={page === 1} aria-label="Previous page">
			<Icon name="arrowLeft" size={16} />
		</button>
		{#each items as it (it.key)}
			{#if it.gap}
				<span class="gap">…</span>
			{:else}
				<button
					class="tab num"
					class:is-on={it.n === page}
					aria-current={it.n === page ? 'page' : undefined}
					onclick={() => go(it.n)}
				>
					{it.n}
				</button>
			{/if}
		{/each}
		<button class="tab" onclick={() => go(page + 1)} disabled={page === pages} aria-label="Next page">
			<Icon name="arrowRight" size={16} />
		</button>
	</nav>
{/if}

<style>
	.pager {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 6px;
		margin-top: var(--s-5);
	}

	.num {
		min-width: 2.6em;
		justify-content: center;
	}

	.tab:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.gap {
		padding: 0 4px;
		color: var(--ink-soft);
	}
</style>
