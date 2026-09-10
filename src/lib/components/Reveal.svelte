<script>
	/* Scroll-in choreography. Blocks drift onto the page and settle,
	   instead of simply being there like paragraphs in a document. */
	let {
		from = 'up', // up | down | left | right | scale | tilt
		delay = 0,
		distance = 42,
		once = true,
		class: klass = '',
		children
	} = $props();

	let el = $state(null);
	let shown = $state(false);

	function inView(node) {
		const r = node.getBoundingClientRect();
		const h = window.innerHeight || document.documentElement.clientHeight;
		return r.top < h * 0.92 && r.bottom > 0;
	}

	$effect(() => {
		if (!el) return;
		const node = el;

		/* immediate check: anything already on screen shows without waiting */
		if (inView(node)) shown = true;

		/* safety net — content must never stay invisible if observers misbehave */
		const safety = setTimeout(() => (shown = true), 2500);

		if (typeof IntersectionObserver === 'undefined') {
			shown = true;
			return () => clearTimeout(safety);
		}

		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						shown = true;
						if (once) io.unobserve(e.target);
					} else if (!once) {
						shown = false;
					}
				}
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
		);
		io.observe(node);

		const onScroll = () => {
			if (inView(node)) {
				shown = true;
				if (once) window.removeEventListener('scroll', onScroll);
			}
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			clearTimeout(safety);
			io.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<div
	bind:this={el}
	class="reveal reveal--{from} {klass}"
	class:is-in={shown}
	style="--d:{delay}ms; --dist:{distance}px"
>
	{@render children?.()}
</div>

<style>
	.reveal {
		opacity: 0;
		will-change: transform, opacity;
		transition:
			opacity 620ms var(--ease-out) var(--d),
			transform 720ms var(--ease-spring) var(--d);
	}

	.reveal--up {
		transform: translateY(var(--dist));
	}
	.reveal--down {
		transform: translateY(calc(var(--dist) * -1));
	}
	.reveal--left {
		transform: translateX(calc(var(--dist) * -1)) rotate(-3deg);
	}
	.reveal--right {
		transform: translateX(var(--dist)) rotate(3deg);
	}
	.reveal--scale {
		transform: scale(0.86);
	}
	.reveal--tilt {
		transform: translateY(var(--dist)) rotate(-4deg) scale(0.94);
	}

	.is-in {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal {
			opacity: 1;
			transform: none;
		}
	}
</style>
