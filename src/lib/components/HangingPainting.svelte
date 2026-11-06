<script lang="ts">
    // Intrinsic size of the animation. Only its aspect ratio matters: the frame, the wire and
    // the caption all follow the image, which is DISPLAY_WIDTH pixels wide.
    const IMAGE = { src: '/paintings/hanging.webp', width: 360, height: 399 };
    const DISPLAY_WIDTH = 180;
</script>

<!--
    A crooked animated painting hanging from a nail, announcing animation support.
    Everything rotates around the nail, at the top centre: .tilt sets the crooked angle and
    .sway swings the painting on its wire, while the caption stays still under it.
-->
<a href="/guide#animated-paintings" class="group block w-fit">
    <div class="tilt relative">
        <div class="sway relative pt-[30px]">
            <!--
                Out of the flow so only the image sizes the painting (an SVG without a width would
                stretch it to 300px). Percentages keep the nail centred and the wire attached.
            -->
            <svg class="absolute inset-x-0 top-0 h-[30px] w-full" aria-hidden="true">
                <g stroke="#6b7280" stroke-width="1.5" stroke-linecap="round">
                    <line x1="20%" y1="30" x2="50%" y2="6" />
                    <line x1="80%" y1="30" x2="50%" y2="6" />
                </g>
                <circle cx="50%" cy="6" r="4.5" fill="#9ca3af" stroke="#4b5563" stroke-width="1.5" />
                <circle cx="50%" cy="4.5" r="1.5" fill="#fff" fill-opacity="0.6" />
            </svg>
            <div class="p-1.5 bg-linear-to-br from-amber-700 via-amber-800 to-amber-950 rounded shadow-xl shadow-black/30">
                <img
                    src={IMAGE.src}
                    alt="Animated painting of a man dancing next to motorcycles"
                    width={IMAGE.width}
                    height={IMAGE.height}
                    style:width="{DISPLAY_WIDTH}px"
                    class="block h-auto rounded-sm"
                />
            </div>
        </div>
        <!-- Out of the flow so a caption wider than the painting overflows it evenly. -->
        <p class="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap font-hand text-2xl font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
            Now supports animated GIFs!
        </p>
    </div>
</a>

<style>
    .tilt,
    .sway {
        /* The nail: both elements are as wide as the frame. */
        transform-origin: 50% 6px;
    }

    .tilt {
        rotate: -10deg;
    }

    @media (prefers-reduced-motion: no-preference) {
        .sway {
            animation: sway 3.5s ease-in-out infinite alternate;
        }
    }

    @keyframes sway {
        from { rotate: -2deg; }
        to { rotate: 2deg; }
    }
</style>
