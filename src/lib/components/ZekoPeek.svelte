<script>
	/* Zeko leaning into the layout from an edge. Purely decorative. */
	import Zeko from './Zeko.svelte';

	let {
		side = 'right', // right | left
		mood = 'idle',
		size = 150,
		offset = '-18%',
		class: klass = ''
	} = $props();
</script>

<div class="peek peek--{side} {klass}" style="--off:{offset}" aria-hidden="true">
	<Zeko {mood} {size} />
</div>

<style>
	.peek {
		position: absolute;
		bottom: var(--off);
		pointer-events: none;
		z-index: 2;
	}
	.peek--right {
		right: var(--s-5);
		transform: rotate(6deg);
	}
	.peek--left {
		left: var(--s-5);
		transform: rotate(-6deg) scaleX(-1);
	}

	@media (max-width: 820px) {
		.peek {
			display: none;
		}
	}
</style>
