<script>
	import Blind from '$lib/games/Blind.svelte';
	import Bridge from '$lib/games/Bridge.svelte';
	import Dictation from '$lib/games/Dictation.svelte';
	import WordBuild from '$lib/games/WordBuild.svelte';
	import WordRead from '$lib/games/WordRead.svelte';
	import LookAlike from '$lib/games/LookAlike.svelte';
	import Anchor from '$lib/games/Anchor.svelte';
	import Speed from '$lib/games/Speed.svelte';
	import KanjiDrill from '$lib/games/KanjiDrill.svelte';

	let { data } = $props();

	const REGISTRY = {
		blind: Blind,
		bridge: Bridge,
		dictation: Dictation,
		build: WordBuild,
		words: WordRead,
		lookalike: LookAlike,
		anchor: Anchor,
		speed: Speed,
		kanji: KanjiDrill
	};

	const Game = $derived(REGISTRY[data.game.id]);
</script>

<svelte:head><title>{data.game.title} · Zekocards</title></svelte:head>

<section class="section wrap">
	<Game />
</section>
