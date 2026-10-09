<script>
	/* Centred floating panel. Used for anything that used to be a drawer. */
	import Icon from './Icon.svelte';

	let { open = false, label = 'Dialog', size = 620, onClose = () => {}, children } = $props();

	function key(e) {
		if (e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={open ? key : null} />

{#if open}
	<div class="scrim" role="presentation" onclick={onClose}></div>
	<div class="shell" role="dialog" aria-modal="true" aria-label={label}>
		<div class="box scroll" style="--w:{size}px">
			<button class="close" onclick={onClose} aria-label="Close">
				<Icon name="cross" size={20} />
			</button>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: rgba(10, 20, 36, 0.4);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
		animation: zk-fade var(--t-base) var(--ease-ios);
	}

	.shell {
		position: fixed;
		inset: 0;
		z-index: 41;
		display: grid;
		place-items: center;
		padding: var(--s-4);
		pointer-events: none;
	}

	.box {
		position: relative;
		pointer-events: auto;
		width: min(var(--w), 100%);
		max-height: min(88dvh, 900px);
		padding: var(--s-6);
		background: var(--glass-fill);
		-webkit-backdrop-filter: saturate(180%) blur(30px);
		backdrop-filter: saturate(180%) blur(30px);
		border: 0.5px solid var(--glass-line);
		border-radius: var(--r-xl);
		box-shadow: var(--sh-3);
		animation: zk-sheet var(--t-slow) var(--ease-ios);
	}

	.close {
		position: absolute;
		top: var(--s-3);
		right: var(--s-3);
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border: 0;
		border-radius: var(--r-full);
		background: var(--bg-sunken);
		color: var(--ink-muted);
		cursor: pointer;
		transition: transform var(--t-base) var(--ease-ios);
	}
	.close:active {
		transform: scale(0.92);
	}

	@media (max-width: 640px) {
		.box {
			padding: var(--s-5) var(--s-4);
		}
	}
</style>
