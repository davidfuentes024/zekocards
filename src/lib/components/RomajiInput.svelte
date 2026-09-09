<script>
	import Icon from './Icon.svelte';

	let {
		value = $bindable(''),
		status = null, // 'ok' | 'bad' | null
		placeholder = 'type the reading…',
		label = 'Your answer',
		disabled = false,
		autofocus = true,
		onsubmit = () => {}
	} = $props();

	let el = $state(null);

	export function focus() {
		el?.focus();
		el?.select?.();
	}

	$effect(() => {
		if (autofocus && el && !disabled) el.focus();
	});

	function key(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			onsubmit(value);
		}
	}
</script>

<div class="wrap">
	<label class="sr-only" for="romaji-input">{label}</label>
	<input
		id="romaji-input"
		bind:this={el}
		bind:value
		class="field field--answer"
		class:field--ok={status === 'ok'}
		class:field--bad={status === 'bad'}
		{placeholder}
		{disabled}
		autocomplete="off"
		autocapitalize="off"
		autocorrect="off"
		spellcheck="false"
		onkeydown={key}
	/>
	<button class="go" onclick={() => onsubmit(value)} {disabled} aria-label="Check answer">
		<Icon name="arrowRight" size={20} />
	</button>
</div>

<style>
	.wrap {
		position: relative;
		display: flex;
		align-items: center;
	}
	.field {
		padding-right: 3.4rem;
	}
	.go {
		position: absolute;
		right: 8px;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border: 0;
		border-radius: 50%;
		background: var(--cello);
		color: var(--mint);
		cursor: pointer;
		transition: transform var(--t-fast) var(--ease-spring);
	}
	.go:hover {
		transform: scale(1.08);
	}
	.go:disabled {
		opacity: 0.4;
	}
</style>
