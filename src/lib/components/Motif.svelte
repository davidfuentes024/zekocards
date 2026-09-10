<script>
	/* ============================================================
	   Japanese motifs drawn with CSS boxes only. Scattered around the
	   pages at odd angles so no screen reads as a document.
	   Every motif is drawn on a 100 × 100 stage and scaled.
	   ============================================================ */
	let {
		name = 'torii',
		size = 120,
		rotate = 0,
		opacity = 1,
		float = true,
		class: klass = ''
	} = $props();
</script>

<div
	class="motif motif--{name} {klass}"
	class:float
	style="--k:{size / 100}; width:{size}px; height:{size}px; --rot:{rotate}deg; opacity:{opacity}"
	aria-hidden="true"
>
	<div class="stage">
		{#if name === 'torii'}
			<span class="p cap"></span><span class="p lintel"></span><span class="p tie"></span>
			<span class="p post l"></span><span class="p post r"></span>
		{:else if name === 'koi'}
			<span class="p body"></span><span class="p tail"></span><span class="p fin"></span>
			<span class="p eye"></span><span class="p spot a"></span><span class="p spot b"></span>
		{:else if name === 'lantern'}
			<span class="p hook"></span><span class="p top"></span><span class="p paper"></span>
			<span class="p bar b1"></span><span class="p bar b2"></span><span class="p bar b3"></span>
			<span class="p bottom"></span><span class="p tassel"></span>
		{:else if name === 'sakura'}
			<span class="p branch"></span>
			<span class="p petal p1"></span><span class="p petal p2"></span>
			<span class="p petal p3"></span><span class="p petal p4"></span>
			<span class="p bud b1"></span><span class="p bud b2"></span>
		{:else if name === 'fan'}
			<span class="p leaf"></span><span class="p rib r1"></span><span class="p rib r2"></span>
			<span class="p rib r3"></span><span class="p pivot"></span>
		{:else if name === 'daruma'}
			<span class="p shell"></span><span class="p face"></span>
			<span class="p eye l"></span><span class="p eye r"></span><span class="p brow"></span>
		{:else if name === 'cloud'}
			<span class="p c1"></span><span class="p c2"></span><span class="p c3"></span>
			<span class="p base"></span>
		{:else if name === 'onigiri'}
			<span class="p rice"></span><span class="p nori"></span>
			<span class="p eye l"></span><span class="p eye r"></span><span class="p mouth"></span>
		{:else if name === 'wave'}
			<span class="p w w1"></span><span class="p w w2"></span><span class="p w w3"></span>
		{/if}
	</div>
</div>

<style>
	.motif {
		position: relative;
		flex: none;
		pointer-events: none;
		transform: rotate(var(--rot));
	}
	.motif.float .stage {
		animation: zk-float-soft 7s var(--ease-in-out) infinite;
	}
	.stage {
		position: absolute;
		top: 0;
		left: 0;
		width: 100px;
		height: 100px;
		transform: scale(var(--k));
		transform-origin: top left;
	}
	.p {
		position: absolute;
		display: block;
	}

	/* ---- torii ---- */
	.motif--torii .cap {
		left: 2px;
		top: 16px;
		width: 96px;
		height: 9px;
		background: var(--cello);
		border-radius: var(--r-full);
	}
	.motif--torii .lintel {
		left: 12px;
		top: 33px;
		width: 76px;
		height: 7px;
		background: var(--cello);
	}
	.motif--torii .tie {
		left: 45px;
		top: 24px;
		width: 10px;
		height: 12px;
		background: var(--cello);
	}
	.motif--torii .post {
		top: 22px;
		width: 11px;
		height: 66px;
		background: var(--cello);
		border-radius: 3px;
	}
	.motif--torii .post.l {
		left: 18px;
	}
	.motif--torii .post.r {
		right: 18px;
	}

	/* ---- koi ---- */
	.motif--koi .body {
		left: 20px;
		top: 34px;
		width: 62px;
		height: 30px;
		background: var(--wedge);
		border-radius: 60% 42% 60% 42%;
	}
	.motif--koi .tail {
		left: 4px;
		top: 36px;
		width: 24px;
		height: 26px;
		background: var(--wedge-soft);
		clip-path: polygon(100% 50%, 0 0, 18% 50%, 0 100%);
	}
	.motif--koi .fin {
		left: 46px;
		top: 24px;
		width: 20px;
		height: 14px;
		background: var(--wedge-deep);
		border-radius: 70% 70% 0 0;
	}
	.motif--koi .eye {
		right: 22px;
		top: 42px;
		width: 6px;
		height: 6px;
		background: var(--mint);
		border-radius: 50%;
	}
	.motif--koi .spot {
		background: var(--aqua);
		border-radius: 50%;
	}
	.motif--koi .spot.a {
		left: 40px;
		top: 40px;
		width: 14px;
		height: 12px;
	}
	.motif--koi .spot.b {
		left: 58px;
		top: 50px;
		width: 9px;
		height: 8px;
	}

	/* ---- lantern ---- */
	.motif--lantern .hook {
		left: 48px;
		top: 0;
		width: 4px;
		height: 12px;
		background: var(--cello);
	}
	.motif--lantern .top,
	.motif--lantern .bottom {
		left: 32px;
		width: 36px;
		height: 8px;
		background: var(--cello);
		border-radius: 3px;
	}
	.motif--lantern .top {
		top: 10px;
	}
	.motif--lantern .bottom {
		top: 74px;
	}
	.motif--lantern .paper {
		left: 22px;
		top: 16px;
		width: 56px;
		height: 60px;
		background: var(--aqua);
		border-radius: 42% 42% 42% 42% / 30% 30% 30% 30%;
		animation: zk-lantern-glow 4.4s var(--ease-in-out) infinite;
	}
	.motif--lantern .bar {
		left: 24px;
		width: 52px;
		height: 3px;
		background: var(--aqua-deep);
		border-radius: var(--r-full);
	}
	.motif--lantern .b1 {
		top: 30px;
	}
	.motif--lantern .b2 {
		top: 45px;
	}
	.motif--lantern .b3 {
		top: 60px;
	}
	.motif--lantern .tassel {
		left: 47px;
		top: 82px;
		width: 6px;
		height: 16px;
		background: var(--wedge);
		border-radius: 0 0 var(--r-full) var(--r-full);
	}

	/* ---- sakura branch ---- */
	.motif--sakura .branch {
		left: 4px;
		top: 62px;
		width: 92px;
		height: 7px;
		background: var(--wedge-deep);
		border-radius: var(--r-full);
		transform: rotate(-12deg);
	}
	.motif--sakura .petal {
		width: 26px;
		height: 26px;
		background: var(--aqua);
		border-radius: 100% 0 100% 0;
	}
	.motif--sakura .p1 {
		left: 12px;
		top: 30px;
	}
	.motif--sakura .p2 {
		left: 40px;
		top: 20px;
		background: var(--aqua-soft);
		transform: rotate(40deg);
	}
	.motif--sakura .p3 {
		left: 64px;
		top: 34px;
		transform: rotate(-30deg);
	}
	.motif--sakura .p4 {
		left: 30px;
		top: 46px;
		background: var(--mint-shadow);
		transform: rotate(70deg);
	}
	.motif--sakura .bud {
		width: 10px;
		height: 10px;
		background: var(--wedge-soft);
		border-radius: 50%;
	}
	.motif--sakura .b1 {
		left: 58px;
		top: 58px;
	}
	.motif--sakura .b2 {
		left: 22px;
		top: 62px;
	}

	/* ---- folding fan ---- */
	.motif--fan .leaf {
		left: 6px;
		top: 14px;
		width: 88px;
		height: 44px;
		background: var(--aqua);
		border-radius: 88px 88px 0 0;
		clip-path: polygon(0 100%, 50% 0, 100% 100%);
	}
	.motif--fan .rib {
		left: 49px;
		top: 20px;
		width: 3px;
		height: 46px;
		background: var(--wedge-deep);
		transform-origin: bottom center;
	}
	.motif--fan .r1 {
		transform: rotate(-34deg);
	}
	.motif--fan .r3 {
		transform: rotate(34deg);
	}
	.motif--fan .pivot {
		left: 44px;
		top: 62px;
		width: 12px;
		height: 12px;
		background: var(--cello);
		border-radius: 50%;
	}

	/* ---- daruma ---- */
	.motif--daruma .shell {
		left: 16px;
		top: 16px;
		width: 68px;
		height: 74px;
		background: var(--wedge);
		border-radius: 50% 50% 46% 46%;
	}
	.motif--daruma .face {
		left: 28px;
		top: 30px;
		width: 44px;
		height: 38px;
		background: var(--mint);
		border-radius: 50%;
	}
	.motif--daruma .eye {
		top: 42px;
		width: 11px;
		height: 11px;
		border: 3px solid var(--cello);
		border-radius: 50%;
	}
	.motif--daruma .eye.l {
		left: 32px;
	}
	.motif--daruma .eye.r {
		right: 32px;
		background: var(--cello);
	}
	.motif--daruma .brow {
		left: 40px;
		top: 58px;
		width: 20px;
		height: 6px;
		background: var(--cello);
		border-radius: var(--r-full);
	}

	/* ---- cloud ---- */
	.motif--cloud .p {
		background: var(--bg-raised);
		border-radius: var(--r-full);
		border: 3px solid var(--aqua-soft);
	}
	.motif--cloud .c1 {
		left: 6px;
		top: 42px;
		width: 40px;
		height: 30px;
	}
	.motif--cloud .c2 {
		left: 28px;
		top: 26px;
		width: 48px;
		height: 40px;
	}
	.motif--cloud .c3 {
		right: 4px;
		top: 44px;
		width: 34px;
		height: 26px;
	}
	.motif--cloud .base {
		left: 8px;
		top: 58px;
		width: 84px;
		height: 18px;
		border-radius: var(--r-full);
	}

	/* ---- onigiri ---- */
	.motif--onigiri .rice {
		left: 12px;
		top: 16px;
		width: 76px;
		height: 68px;
		background: var(--bg-raised);
		border: 3px solid var(--mint-shadow);
		border-radius: 34% 34% 22% 22%;
	}
	.motif--onigiri .nori {
		left: 26px;
		top: 56px;
		width: 48px;
		height: 26px;
		background: var(--cello);
		border-radius: 0 0 18px 18px;
	}
	.motif--onigiri .eye {
		top: 44px;
		width: 8px;
		height: 8px;
		background: var(--cello);
		border-radius: 50%;
	}
	.motif--onigiri .eye.l {
		left: 32px;
	}
	.motif--onigiri .eye.r {
		right: 32px;
	}
	.motif--onigiri .mouth {
		left: 46px;
		top: 52px;
		width: 8px;
		height: 4px;
		border-bottom: 3px solid var(--wedge);
		border-radius: 0 0 8px 8px;
	}

	/* ---- wave ---- */
	.motif--wave .w {
		left: 0;
		width: 100px;
		height: 22px;
		border: 4px solid var(--aqua-deep);
		border-color: var(--aqua-deep) transparent transparent transparent;
		border-radius: 50% 50% 0 0 / 100% 100% 0 0;
	}
	.motif--wave .w1 {
		top: 30px;
	}
	.motif--wave .w2 {
		top: 46px;
		opacity: 0.7;
	}
	.motif--wave .w3 {
		top: 62px;
		opacity: 0.45;
	}
</style>
