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
		background: rgba(19, 39, 64, 0.42);
		backdrop-filter: blur(3px);
		animation: zk-rise 200ms var(--ease-out);
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
		background: var(--bg-raised);
		border: 3px solid var(--cello);
		border-radius: var(--r-xl);
		box-shadow: 0 10px 0 var(--cello-ink), var(--sh-3);
		animation: zk-pop 280ms var(--ease-spring);
	}

	.close {
		position: absolute;
		top: var(--s-3);
		right: var(--s-3);
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border: 2px solid var(--surface-line);
		border-radius: var(--r-md);
		background: var(--bg-raised);
		color: var(--cello);
		cursor: pointer;
		box-shadow: 0 3px 0 var(--surface-line);
		transition: transform 90ms var(--ease-out);
	}
	.close:active {
		transform: translateY(3px);
		box-shadow: none;
	}

	@media (max-width: 640px) {
		.box {
			padding: var(--s-5) var(--s-4);
		}
	}
</style>
