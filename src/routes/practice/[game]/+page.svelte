<script>
	import Recall from '$lib/games/Recall.svelte';
	import Produce from '$lib/games/Produce.svelte';
	import WordRead from '$lib/games/WordRead.svelte';
	import WordBuild from '$lib/games/WordBuild.svelte';
	import Listen from '$lib/games/Listen.svelte';
	import LookAlike from '$lib/games/LookAlike.svelte';
	import Anchor from '$lib/games/Anchor.svelte';
	import Speed from '$lib/games/Speed.svelte';
	import KanjiDrill from '$lib/games/KanjiDrill.svelte';

	let { data } = $props();

	const REGISTRY = {
		recall: Recall,
		produce: Produce,
		words: WordRead,
		build: WordBuild,
		listen: Listen,
		lookalike: LookAlike,
		anchor: Anchor,
		speed: Speed,
		kanji: KanjiDrill
	};

	const Game = $derived(REGISTRY[data.game.id]);
</script>

<svelte:head><title>{data.game.title} · Zekocards</title></svelte:head>

<section class="section wrap wrap--narrow">
	<Game />
</section>
