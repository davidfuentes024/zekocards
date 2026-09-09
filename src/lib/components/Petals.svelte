<script>
	/* Falling sakura petals. Pure CSS shapes on a fixed, inert layer. */
	let { count = 14, opacity = 0.75 } = $props();

	const petals = $derived(
		Array.from({ length: count }, (_, i) => ({
		left: Math.round((i * 97) % 100),
		delay: +((i * 1.37) % 14).toFixed(2),
		dur: 13 + ((i * 3) % 9),
		scale: 0.55 + ((i * 7) % 10) / 14,
			drift: (i % 2 ? 1 : -1) * (30 + ((i * 13) % 90))
		}))
	);
</script>

<div class="petals" style="--o:{opacity}" aria-hidden="true">
	{#each petals as p}
		<span
			class="petal"
			style="left:{p.left}%; animation-delay:{p.delay}s; animation-duration:{p.dur}s; --drift:{p.drift}px; --s:{p.scale}"
		></span>
	{/each}
</div>

<style>
	.petals {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 2;
		overflow: hidden;
		opacity: var(--o);
	}

	.petal {
		position: absolute;
		top: 0;
		width: 14px;
		height: 12px;
		background: var(--aqua);
		border-radius: 100% 0 100% 0;
		transform-origin: center;
		animation-name: zk-petal-fall;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		scale: var(--s);
	}

	.petal:nth-child(3n) {
		background: var(--aqua-soft);
	}
	.petal:nth-child(4n) {
		background: var(--mint-shadow);
	}
	.petal:nth-child(5n) {
		background: var(--wedge-soft);
		opacity: 0.55;
	}
</style>
