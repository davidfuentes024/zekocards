<script>
	import '@fontsource/zen-maru-gothic/400.css';
	import '@fontsource/zen-maru-gothic/700.css';
	import '@fontsource/zen-kaku-gothic-new/400.css';
	import '@fontsource/zen-kaku-gothic-new/500.css';
	import '@fontsource/zen-kaku-gothic-new/700.css';
	import '$lib/styles/tokens.css';
	import '$lib/styles/base.css';
	import '$lib/styles/components.css';
	import '$lib/styles/animations.css';

  import { dev } from '$app/environment';

	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Petals from '$lib/components/Petals.svelte';
	import Zeko from '$lib/components/Zeko.svelte';
	import { settings } from '$lib/stores/settings.js';
	import { selectionSummary } from '$lib/stores/selection.js';
	import { dayStreak } from '$lib/stores/progress.js';
	import { preload } from '$lib/utils/audio.js';

	/* The kana sprite is smaller than one photograph and every audio drill
	   depends on it, so it is warmed once for the whole session. Word and
	   kanji sprites stay lazy. */
	$effect(() => {
		preload('kana');
	});

	let { children } = $props();
	let open = $state(false);

	const NAV = [
		{ href: '/', label: 'Home', icon: 'home' },
		{ href: '/cards', label: 'Cards', icon: 'cards' },
		{ href: '/practice', label: 'Training hall', icon: 'target' },
		{ href: '/dictionary', label: 'Dictionary', icon: 'scroll' },
		{ href: '/kanji', label: 'Kanji', icon: 'brush' },
		{ href: '/progress', label: 'Progress', icon: 'chart' }
	];

	const path = $derived($page.url.pathname.replace(/\/$/, '') || '/');
	function isActive(href) {
		return href === '/' ? path === '/' : path.startsWith(href);
	}
</script>

{#if $settings.petals}
	<Petals count={12} opacity={0.5} />
{/if}

<a class="skip" href="#main">Skip to content</a>

<header class="site-head">
	<div class="wrap bar">
		<a class="brand" href="/">
			<Zeko size={42} mood="idle" headband={true} floating={false} />
			<span class="name">
				<strong>zekocards</strong>
				<small class="jp">ゼコカード</small>
			</span>
		</a>

		<nav class="nav" class:open aria-label="Main">
			{#each NAV as item}
				<a href={item.href} class:active={isActive(item.href)} onclick={() => (open = false)}>
					<Icon name={item.icon} size={17} />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>

		<div class="right">
			<span class="pill" title="Sounds selected">
				<Icon name="target" size={15} />{$selectionSummary.sounds}
			</span>
			<span class="pill" title="Day streak">
				<Icon name="flame" size={15} />{$dayStreak}
			</span>
			<button class="burger" onclick={() => (open = !open)} aria-label="Menu" aria-expanded={open}>
				<Icon name={open ? 'cross' : 'grid'} size={20} />
			</button>
		</div>
	</div>
</header>

<main id="main">
	{@render children?.()}
</main>

<footer class="site-foot">
	<div class="wrap foot">
		<div class="stack">
			<span class="eyebrow">zekocards · ゼコカード</span>
			<p class="muted small">
				Built for the long, boring middle of learning kana — the part where repetition is the
				only thing that works.
			</p>
			<a class="letter-link" href="/#letter">
				<Icon name="seal" size={16} /> read the letter
			</a>
		</div>
		<div class="links">
			{#each NAV.slice(1) as item}
				<a href={item.href}>{item.label}</a>
			{/each}
		</div>
	</div>
	<div class="ground"></div>
</footer>

<style>
	.skip {
		position: absolute;
		left: -9999px;
		top: 0;
		z-index: 100;
		padding: var(--s-3);
		background: var(--cello);
		color: var(--mint);
	}
	.skip:focus {
		left: var(--s-3);
		top: var(--s-3);
	}

	.site-head {
		position: sticky;
		top: 0;
		z-index: 20;
		background: color-mix(in srgb, var(--mint) 88%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1.5px solid var(--surface-line);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: var(--s-4);
		height: var(--header-h);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		color: var(--ink-strong);
	}
	.name {
		display: flex;
		flex-direction: column;
		line-height: 1.05;
	}
	.name strong {
		font-family: var(--font-display);
		font-size: var(--fs-lg);
		letter-spacing: -0.02em;
	}
	.name small {
		font-size: var(--fs-2xs);
		color: var(--wedge);
	}

	.nav {
		display: flex;
		gap: 2px;
		margin-left: auto;
	}
	.nav a {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 0.48em 0.9em;
		border-radius: var(--r-tab);
		font-family: var(--font-display);
		font-size: var(--fs-xs);
		font-weight: 700;
		color: var(--ink-muted);
		transition:
			background var(--t-fast) var(--ease-out),
			color var(--t-fast) var(--ease-out);
	}
	.nav a:hover {
		background: var(--aqua-soft);
		color: var(--cello);
	}
	.nav a.active {
		background: var(--cello);
		color: #fff;
		box-shadow: 0 3px 0 var(--cello-ink);
	}

	.right {
		display: flex;
		align-items: center;
		gap: var(--s-2);
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 0.3em 0.7em;
		border-radius: var(--r-tab);
		background: var(--bg-raised);
		border: 2px solid var(--surface-line);
		box-shadow: 0 3px 0 var(--surface-line);
		font-family: var(--font-display);
		font-size: var(--fs-2xs);
		font-weight: 800;
		color: var(--wedge-deep);
	}

	.burger {
		display: none;
		place-items: center;
		width: 38px;
		height: 38px;
		border: 0;
		border-radius: var(--r-sm);
		background: var(--bg-raised);
		color: var(--cello);
		cursor: pointer;
	}

	main {
		position: relative;
		z-index: 1;
		min-height: 60vh;
	}

	.site-foot {
		position: relative;
		z-index: 1;
		margin-top: var(--s-9);
		border-top: 1.5px solid var(--surface-line);
		background: var(--bg-sunken);
	}
	.foot {
		display: flex;
		justify-content: space-between;
		gap: var(--s-5);
		padding-block: var(--s-6);
		flex-wrap: wrap;
	}
	.small {
		font-size: var(--fs-sm);
		max-width: min(46ch, 100%);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-4);
		font-size: var(--fs-sm);
		font-weight: 700;
	}

	.letter-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: var(--fs-xs);
		font-weight: 700;
		color: var(--wedge);
	}
	.ground {
		height: 16px;
		background: repeating-linear-gradient(90deg, var(--aqua) 0 20px, var(--aqua-deep) 20px 40px);
		opacity: 0.45;
	}

	@media (max-width: 900px) {
		.burger {
			display: grid;
		}
		.nav {
			position: absolute;
			top: var(--header-h);
			left: 0;
			right: 0;
			flex-direction: column;
			gap: 0;
			padding: var(--s-3);
			background: var(--bg-raised);
			border-bottom: 1.5px solid var(--surface-line);
			box-shadow: var(--sh-2);
			display: none;
		}
		.nav.open {
			display: flex;
			animation: zk-rise var(--t-base) var(--ease-out);
		}
		.nav a {
			padding: 0.7em 0.9em;
			border-radius: var(--r-md);
		}
	}
</style>
