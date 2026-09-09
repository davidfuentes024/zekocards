<script>
	/* ============================================================
	   A Japanese landscape band drawn only with CSS boxes and
	   gradients: Fuji, a torii, a pagoda, bamboo, drifting clouds,
	   a koi and a rolling seigaiha sea.
	   Used as a horizon under headers and between sections.
	   ============================================================ */
	let { height = 260, koi = true, pagoda = true } = $props();
</script>

<div class="scene" style="--h:{height}px" aria-hidden="true">
	<div class="sun"></div>

	<div class="cloud cloud--1"><i></i><i></i><i></i></div>
	<div class="cloud cloud--2"><i></i><i></i><i></i></div>
	<div class="cloud cloud--3"><i></i><i></i><i></i></div>

	<div class="fuji">
		<div class="snow"></div>
	</div>
	<div class="hill hill--l"></div>
	<div class="hill hill--r"></div>

	{#if pagoda}
		<div class="pagoda">
			<span class="roof roof--3"></span>
			<span class="tier"></span>
			<span class="roof roof--2"></span>
			<span class="tier"></span>
			<span class="roof roof--1"></span>
			<span class="base"></span>
		</div>
	{/if}

	<div class="bamboo bamboo--a"><i></i><i></i><i></i></div>
	<div class="bamboo bamboo--b"><i></i><i></i><i></i></div>

	<div class="torii">
		<span class="cap"></span>
		<span class="lintel"></span>
		<span class="tie"></span>
		<span class="post post--l"></span>
		<span class="post post--r"></span>
	</div>

	<div class="sea">
		<div class="seigaiha"></div>
		{#if koi}
			<div class="koi"><span class="fin"></span><span class="tail"></span></div>
		{/if}
	</div>
</div>

<style>
	.scene {
		position: relative;
		width: 100%;
		height: var(--h);
		overflow: hidden;
		pointer-events: none;
	}

	/* ---- sky objects ---- */
	.sun {
		position: absolute;
		right: 12%;
		top: 12%;
		width: 74px;
		height: 74px;
		border-radius: 50%;
		background: var(--mint-deep);
		border: 4px solid var(--aqua-soft);
		animation: zk-breathe 9s var(--ease-in-out) infinite;
	}

	.cloud {
		position: absolute;
		display: flex;
		align-items: flex-end;
		gap: 0;
		opacity: 0.85;
	}
	.cloud i {
		display: block;
		background: var(--bg-raised);
		border-radius: var(--r-full);
	}
	.cloud i:nth-child(1) {
		width: 46px;
		height: 22px;
	}
	.cloud i:nth-child(2) {
		width: 62px;
		height: 30px;
		margin-inline: -14px;
	}
	.cloud i:nth-child(3) {
		width: 40px;
		height: 20px;
	}
	.cloud--1 {
		top: 14%;
		animation: zk-drift 46s linear infinite;
	}
	.cloud--2 {
		top: 30%;
		scale: 0.72;
		opacity: 0.6;
		animation: zk-drift 66s linear infinite;
		animation-delay: -20s;
	}
	.cloud--3 {
		top: 6%;
		scale: 1.15;
		opacity: 0.5;
		animation: zk-drift 88s linear infinite;
		animation-delay: -50s;
	}

	/* ---- mountains ---- */
	.fuji {
		position: absolute;
		left: 50%;
		bottom: 34%;
		width: 0;
		height: 0;
		margin-left: -150px;
		border-left: 150px solid transparent;
		border-right: 150px solid transparent;
		border-bottom: 152px solid var(--wedge);
	}
	.snow {
		position: absolute;
		left: -34px;
		top: 22px;
		width: 68px;
		height: 34px;
		background: var(--mint);
		clip-path: polygon(50% 0, 100% 100%, 84% 74%, 64% 100%, 46% 66%, 26% 100%, 0 100%);
	}

	.hill {
		position: absolute;
		bottom: 34%;
		width: 300px;
		height: 92px;
		background: var(--wedge-soft);
		border-radius: 50% 50% 0 0;
		opacity: 0.85;
	}
	.hill--l {
		left: 2%;
	}
	.hill--r {
		right: 0;
		width: 340px;
		height: 74px;
	}

	/* ---- pagoda ---- */
	.pagoda {
		position: absolute;
		right: 16%;
		bottom: 34%;
		width: 96px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pagoda .roof {
		display: block;
		height: 0;
		border-bottom: 14px solid var(--cello);
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
	}
	.roof--3 {
		width: 34px;
	}
	.roof--2 {
		width: 54px;
	}
	.roof--1 {
		width: 74px;
	}
	.pagoda .tier {
		display: block;
		width: 26px;
		height: 12px;
		background: var(--cello-soft);
	}
	.pagoda .base {
		display: block;
		width: 40px;
		height: 20px;
		background: var(--cello-soft);
	}

	/* ---- bamboo ---- */
	.bamboo {
		position: absolute;
		bottom: 20%;
		display: flex;
		align-items: flex-end;
		gap: 8px;
		transform-origin: bottom center;
		animation: zk-sway 7s var(--ease-in-out) infinite;
	}
	.bamboo i {
		display: block;
		width: 9px;
		background: var(--wedge-deep);
		border-radius: var(--r-full);
		background-image: repeating-linear-gradient(
			to bottom,
			transparent 0 22px,
			rgba(242, 250, 239, 0.5) 22px 24px
		);
	}
	.bamboo i:nth-child(1) {
		height: 120px;
	}
	.bamboo i:nth-child(2) {
		height: 160px;
	}
	.bamboo i:nth-child(3) {
		height: 96px;
	}
	.bamboo--a {
		left: 4%;
	}
	.bamboo--b {
		right: 5%;
		scale: 0.8;
		animation-delay: -2s;
	}

	/* ---- torii ---- */
	.torii {
		position: absolute;
		left: 18%;
		bottom: 26%;
		width: 118px;
		height: 108px;
	}
	.torii .cap {
		position: absolute;
		left: -6px;
		right: -6px;
		top: 0;
		height: 11px;
		background: var(--cello);
		border-radius: var(--r-full);
	}
	.torii .lintel {
		position: absolute;
		left: 6px;
		right: 6px;
		top: 22px;
		height: 9px;
		background: var(--cello);
	}
	.torii .tie {
		position: absolute;
		left: 50%;
		top: 9px;
		width: 12px;
		height: 16px;
		margin-left: -6px;
		background: var(--cello);
	}
	.torii .post {
		position: absolute;
		top: 8px;
		bottom: 0;
		width: 13px;
		background: var(--cello);
		border-radius: 3px;
	}
	.post--l {
		left: 16px;
	}
	.post--r {
		right: 16px;
	}

	/* ---- sea ---- */
	.sea {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 34%;
		background: var(--aqua-soft);
		overflow: hidden;
	}
	.seigaiha {
		position: absolute;
		inset: 0;
		width: 200%;
		background-image: radial-gradient(
			circle at 50% 100%,
			transparent 0 8px,
			var(--aqua) 8px 10px,
			transparent 10px 16px,
			var(--aqua) 16px 18px,
			transparent 18px 24px,
			var(--aqua) 24px 26px,
			transparent 26px
		);
		background-size: 52px 26px;
		opacity: 0.9;
		animation: zk-wave 26s linear infinite;
	}
	.koi {
		position: absolute;
		bottom: 26%;
		width: 46px;
		height: 18px;
		background: var(--wedge);
		border-radius: 60% 30% 60% 30%;
		animation: zk-koi-swim 22s var(--ease-in-out) infinite;
	}
	.koi .fin {
		position: absolute;
		left: 18px;
		top: -6px;
		width: 14px;
		height: 10px;
		background: var(--wedge-deep);
		border-radius: 60% 60% 0 0;
	}
	.koi .tail {
		position: absolute;
		left: -12px;
		top: 1px;
		width: 16px;
		height: 16px;
		background: var(--wedge);
		clip-path: polygon(100% 50%, 0 0, 0 100%);
	}

	@media (max-width: 720px) {
		.pagoda,
		.bamboo--b {
			display: none;
		}
		.fuji {
			margin-left: -110px;
			border-left-width: 110px;
			border-right-width: 110px;
			border-bottom-width: 112px;
		}
		.torii {
			left: 6%;
			scale: 0.8;
		}
	}
</style>
