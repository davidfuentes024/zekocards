<script>
	let { variant = '', title = '', jp = '', pad = true, class: klass = '', children, actions } = $props();
</script>

<section class="panel {variant ? `panel--${variant}` : ''} {klass}" class:flush={!pad}>
	{#if title}
		<header class="head">
			<div>
				<h3>{title}</h3>
				{#if jp}<span class="jp muted">{jp}</span>{/if}
			</div>
			{#if actions}<div class="row">{@render actions()}</div>{/if}
		</header>
	{/if}
	{@render children?.()}
</section>

<style>
	.flush {
		padding: 0;
	}
	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--s-4);
		margin-bottom: var(--s-4);
		flex-wrap: wrap;
	}
	h3 {
		font-size: var(--fs-lg);
	}
	.jp {
		font-size: var(--fs-xs);
		font-family: var(--font-jp);
	}
</style>
