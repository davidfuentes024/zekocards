<script>
	let { value = 0, size = 34, label = '' } = $props();
	const R = 15.5;
	const C = 2 * Math.PI * R;
	const dash = $derived(C * Math.min(1, Math.max(0, value)));
</script>

<div class="ring" style="--sz:{size}px" title={label}>
	<svg viewBox="0 0 36 36" width={size} height={size}>
		<circle cx="18" cy="18" r={R} fill="none" stroke="var(--mint-shadow)" stroke-width="3.4" />
		<circle
			cx="18"
			cy="18"
			r={R}
			fill="none"
			stroke="var(--wedge)"
			stroke-width="3.4"
			stroke-linecap="round"
			stroke-dasharray="{dash} {C}"
			transform="rotate(-90 18 18)"
		/>
	</svg>
</div>

<style>
	.ring {
		width: var(--sz);
		height: var(--sz);
		display: grid;
		place-items: center;
	}
	circle {
		transition: stroke-dasharray var(--t-slow) var(--ease-out);
	}
</style>
