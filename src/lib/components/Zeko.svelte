<script>
	/* ============================================================
	   ZEKO · the Japanese macaque, built entirely from CSS boxes.
	   No SVG, no images. Drawn on a fixed 200x220 stage and scaled,
	   so one component works from a 40px chip to a hero portrait.
	   Moods: idle | happy | wrong | think | cheer | sleep | read
	   ============================================================ */
	let {
		mood = 'idle',
		size = 200,
		headband = true,
		floating = true,
		class: klass = ''
	} = $props();

	const k = $derived(size / 200);
</script>

<div
	class="zeko zeko--{mood} {klass}"
	class:zeko--float={floating}
	style="--k:{k}; width:{200 * k}px; height:{220 * k}px;"
	aria-hidden="true"
>
	<div class="stage">
		<div class="tail"><i></i></div>

		<div class="legs">
			<div class="leg leg--l"></div>
			<div class="leg leg--r"></div>
		</div>

		<div class="body">
			<div class="belly"></div>
		</div>

		<div class="arm arm--l"><i></i></div>
		<div class="arm arm--r"><i></i></div>

		<div class="head">
			<div class="ear ear--l"><i></i></div>
			<div class="ear ear--r"><i></i></div>
			<div class="skull">
				{#if headband}<div class="band"><span></span></div>{/if}
				<div class="tuft"></div>
				<div class="face">
					<div class="brow brow--l"></div>
					<div class="brow brow--r"></div>
					<div class="eye eye--l"><b></b></div>
					<div class="eye eye--r"><b></b></div>
					<div class="cheek cheek--l"></div>
					<div class="cheek cheek--r"></div>
					<div class="muzzle">
						<div class="nose"></div>
						<div class="mouth"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="zzz"><span>Z</span><span>Z</span><span>Z</span></div>
	</div>
</div>

<style>
	.zeko {
		position: relative;
		flex: none;
	}

	.stage {
		position: absolute;
		inset: 0;
		width: 200px;
		height: 220px;
		transform: scale(var(--k));
		transform-origin: top left;
	}

	.zeko--float {
		animation: zk-float 4.6s var(--ease-in-out) infinite;
	}

	/* ---------- tail ---------- */
	.tail {
		position: absolute;
		left: 146px;
		top: 120px;
		width: 66px;
		height: 66px;
		transform-origin: 0 20%;
		animation: zk-tail 3.4s var(--ease-in-out) infinite;
	}
	.tail i {
		position: absolute;
		inset: 0;
		border: 10px solid var(--wedge-soft);
		border-radius: 50%;
		border-color: var(--wedge-soft) var(--wedge-soft) transparent transparent;
		transform: rotate(28deg);
	}

	/* ---------- legs ---------- */
	.leg {
		position: absolute;
		bottom: 8px;
		width: 34px;
		height: 30px;
		background: var(--wedge-soft);
		border-radius: 40% 40% 46% 46%;
	}
	.leg--l {
		left: 52px;
	}
	.leg--r {
		right: 52px;
	}

	/* ---------- body ---------- */
	.body {
		position: absolute;
		left: 44px;
		top: 108px;
		width: 112px;
		height: 96px;
		background: var(--aqua);
		border-radius: 48% 48% 42% 42%;
		box-shadow: inset -10px -8px 0 rgba(68, 122, 156, 0.16);
	}
	.belly {
		position: absolute;
		left: 50%;
		top: 22px;
		width: 64px;
		height: 62px;
		transform: translateX(-50%);
		background: var(--mint);
		border-radius: 50%;
	}

	/* ---------- arms ---------- */
	.arm {
		position: absolute;
		top: 118px;
		width: 26px;
		height: 62px;
		transform-origin: 50% 8%;
	}
	.arm i {
		position: absolute;
		inset: 0;
		background: var(--aqua);
		border-radius: var(--r-full);
	}
	.arm i::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: -3px;
		width: 32px;
		height: 26px;
		background: var(--wedge-soft);
		border-radius: 50%;
	}
	.arm--l {
		left: 26px;
		transform: rotate(12deg);
	}
	.arm--r {
		right: 26px;
		transform: rotate(-12deg);
	}

	/* ---------- head ---------- */
	.head {
		position: absolute;
		left: 50%;
		top: 8px;
		width: 132px;
		height: 118px;
		margin-left: -66px;
		transform-origin: 50% 90%;
		animation: zk-sway 5.2s var(--ease-in-out) infinite;
	}

	.skull {
		position: absolute;
		inset: 0;
		background: var(--aqua);
		border-radius: 50% 50% 46% 46%;
		box-shadow: inset -8px -6px 0 rgba(68, 122, 156, 0.14);
	}

	.ear {
		position: absolute;
		top: 34px;
		width: 34px;
		height: 34px;
	}
	.ear i {
		position: absolute;
		inset: 0;
		background: var(--aqua);
		border-radius: 50%;
	}
	.ear i::after {
		content: '';
		position: absolute;
		inset: 9px;
		background: var(--wedge-soft);
		border-radius: 50%;
	}
	.ear--l {
		left: -18px;
		animation: zk-sway 3.1s var(--ease-in-out) infinite;
	}
	.ear--r {
		right: -18px;
		animation: zk-sway 3.4s var(--ease-in-out) infinite reverse;
	}

	.tuft {
		position: absolute;
		left: 50%;
		top: -12px;
		width: 30px;
		height: 26px;
		margin-left: -15px;
		background: var(--wedge);
		border-radius: 60% 60% 40% 40%;
		transform: rotate(-8deg);
	}

	.band {
		position: absolute;
		left: -6px;
		right: -6px;
		top: 16px;
		height: 15px;
		background: var(--cello);
		border-radius: var(--r-full);
	}
	.band span {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 9px;
		height: 9px;
		margin: -4.5px 0 0 -4.5px;
		background: var(--mint);
		border-radius: 50%;
	}

	/* ---------- face ---------- */
	.face {
		position: absolute;
		left: 50%;
		top: 40px;
		width: 108px;
		height: 74px;
		margin-left: -54px;
		background: var(--mint);
		border-radius: 48% 48% 50% 50%;
	}

	.eye {
		position: absolute;
		top: 18px;
		width: 17px;
		height: 19px;
		background: var(--cello);
		border-radius: 50%;
		animation: zk-blink 5.4s infinite;
	}
	.eye b {
		position: absolute;
		left: 4px;
		top: 3px;
		width: 6px;
		height: 6px;
		background: var(--mint);
		border-radius: 50%;
	}
	.eye--l {
		left: 20px;
	}
	.eye--r {
		right: 20px;
		animation-delay: 0.06s;
	}

	.brow {
		position: absolute;
		top: 9px;
		width: 20px;
		height: 4px;
		background: var(--cello);
		border-radius: var(--r-full);
		opacity: 0;
		transition: all var(--t-base) var(--ease-out);
	}
	.brow--l {
		left: 18px;
	}
	.brow--r {
		right: 18px;
	}

	.cheek {
		position: absolute;
		top: 34px;
		width: 16px;
		height: 9px;
		background: var(--aqua-deep);
		border-radius: 50%;
		opacity: 0.75;
	}
	.cheek--l {
		left: 8px;
	}
	.cheek--r {
		right: 8px;
	}

	.muzzle {
		position: absolute;
		left: 50%;
		bottom: 4px;
		width: 52px;
		height: 32px;
		margin-left: -26px;
		background: var(--mint-deep);
		border-radius: 50%;
	}
	.nose {
		position: absolute;
		left: 50%;
		top: 6px;
		width: 14px;
		height: 8px;
		margin-left: -7px;
		background: var(--wedge);
		border-radius: 50%;
	}
	.mouth {
		position: absolute;
		left: 50%;
		top: 16px;
		width: 22px;
		height: 11px;
		margin-left: -11px;
		border-bottom: 3px solid var(--cello);
		border-radius: 0 0 50% 50%;
		transition: all var(--t-base) var(--ease-out);
	}

	/* ---------- sleep bubbles ---------- */
	.zzz {
		position: absolute;
		right: 6px;
		top: 4px;
		display: none;
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--wedge);
	}
	.zzz span {
		position: absolute;
		animation: zk-steam 2.6s var(--ease-out) infinite;
	}
	.zzz span:nth-child(1) {
		font-size: 14px;
		right: 0;
	}
	.zzz span:nth-child(2) {
		font-size: 18px;
		right: 14px;
		top: -12px;
		animation-delay: 0.5s;
	}
	.zzz span:nth-child(3) {
		font-size: 22px;
		right: 32px;
		top: -26px;
		animation-delay: 1s;
	}

	/* ============ MOODS ============ */

	/* happy — eyes arch, mouth opens, arms lift */
	.zeko--happy .eye {
		height: 8px;
		border-radius: 50% 50% 0 0;
		animation: none;
		top: 22px;
	}
	.zeko--happy .eye b {
		display: none;
	}
	.zeko--happy .mouth {
		width: 28px;
		height: 16px;
		margin-left: -14px;
		background: var(--cello);
		border-radius: 0 0 40px 40px;
		border: 0;
	}
	.zeko--happy .arm--l {
		transform: rotate(46deg);
	}
	.zeko--happy .arm--r {
		transform: rotate(-46deg);
	}
	.zeko--happy {
		animation: zk-hop 700ms var(--ease-spring) 1;
	}

	/* cheer — full celebration loop */
	.zeko--cheer .arm--l {
		animation: zk-bob-arm 620ms var(--ease-in-out) infinite;
		transform: rotate(52deg);
	}
	.zeko--cheer .arm--r {
		animation: zk-bob-arm 620ms var(--ease-in-out) infinite reverse;
		transform: rotate(-52deg);
	}
	.zeko--cheer {
		animation: zk-hop 780ms var(--ease-spring) infinite;
	}
	.zeko--cheer .mouth {
		width: 26px;
		height: 18px;
		margin-left: -13px;
		background: var(--cello);
		border: 0;
		border-radius: 0 0 40px 40px;
	}
	.zeko--cheer .eye {
		height: 8px;
		border-radius: 50% 50% 0 0;
		animation: none;
		top: 22px;
	}
	.zeko--cheer .eye b {
		display: none;
	}

	/* wrong — brows down, flat mouth, shake */
	.zeko--wrong .brow {
		opacity: 1;
	}
	.zeko--wrong .brow--l {
		transform: rotate(16deg);
	}
	.zeko--wrong .brow--r {
		transform: rotate(-16deg);
	}
	.zeko--wrong .mouth {
		width: 20px;
		margin-left: -10px;
		height: 0;
		border-radius: 0;
		border-bottom-color: var(--hanko);
	}
	.zeko--wrong {
		animation: zk-shake 460ms var(--ease-in-out) 1;
	}
	.zeko--wrong .cheek {
		background: var(--hanko-soft);
	}

	/* think — looks up, one brow raised, hand to chin */
	.zeko--think .head {
		transform: rotate(-7deg);
		animation: none;
	}
	.zeko--think .eye {
		top: 14px;
		animation: none;
	}
	.zeko--think .eye b {
		left: 8px;
		top: 2px;
	}
	.zeko--think .brow--l {
		opacity: 1;
		top: 4px;
	}
	.zeko--think .brow--r {
		opacity: 1;
	}
	.zeko--think .mouth {
		width: 14px;
		margin-left: -7px;
		height: 6px;
		border-radius: 50%;
		border: 3px solid var(--cello);
	}
	.zeko--think .arm--r {
		transform: rotate(-104deg) translateY(-4px);
	}

	/* read — head tilted down over a book */
	.zeko--read .head {
		transform: rotate(4deg) translateY(6px);
		animation: none;
	}
	.zeko--read .eye {
		height: 7px;
		border-radius: 0 0 50% 50%;
		animation: none;
		top: 26px;
	}
	.zeko--read .eye b {
		display: none;
	}
	.zeko--read .arm--l {
		transform: rotate(-62deg);
	}
	.zeko--read .arm--r {
		transform: rotate(62deg);
	}

	/* sleep */
	.zeko--sleep .eye {
		height: 5px;
		border-radius: var(--r-full);
		animation: none;
		top: 26px;
	}
	.zeko--sleep .eye b {
		display: none;
	}
	.zeko--sleep .head {
		transform: rotate(11deg);
		animation: none;
	}
	.zeko--sleep .mouth {
		width: 12px;
		margin-left: -6px;
		height: 8px;
		border-radius: 50%;
		border: 3px solid var(--cello);
	}
	.zeko--sleep .zzz {
		display: block;
	}
	.zeko--sleep {
		animation: zk-breathe 3.6s var(--ease-in-out) infinite;
	}
</style>
