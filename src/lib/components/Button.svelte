<script>
	import Icon from './Icon.svelte';

	let {
		variant = 'solid',
		size = 'md',
		icon = null,
		iconEnd = null,
		href = null,
		type = 'button',
		block = false,
		disabled = false,
		onclick = undefined,
		children,
		...rest
	} = $props();

	const cls = $derived(
		[
			'btn',
			variant !== 'solid' ? `btn--${variant}` : '',
			size !== 'md' ? `btn--${size}` : '',
			block ? 'btn--block' : ''
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if href}
	<a class={cls} {href} {...rest}>
		{#if icon}<Icon name={icon} size={17} />{/if}
		{@render children?.()}
		{#if iconEnd}<Icon name={iconEnd} size={17} />{/if}
	</a>
{:else}
	<button class={cls} {type} {disabled} {onclick} {...rest}>
		{#if icon}<Icon name={icon} size={17} />{/if}
		{@render children?.()}
		{#if iconEnd}<Icon name={iconEnd} size={17} />{/if}
	</button>
{/if}
