<script lang="ts">
    import { onMount } from 'svelte';

    const paintings = [
        { w: 2, h: 5, img: '/paintings/1.webp' },
        { w: 4, h: 3, img: '/paintings/2.webp' },
        { w: 1, h: 3, img: '/paintings/3.webp' },
        { w: 3, h: 4, img: '/paintings/4.webp' },
        { w: 2, h: 2, img: '/paintings/5.webp' },
        { w: 5, h: 3, img: '/paintings/6.webp' },
        { w: 1, h: 6, img: '/paintings/7.webp' },
        { w: 3, h: 2, img: '/paintings/8.webp' },
        { w: 4, h: 5, img: '/paintings/9.webp' },
        { w: 2, h: 3, img: '/paintings/10.webp' },
        { w: 3, h: 1, img: '/paintings/11.webp' },
        { w: 1, h: 4, img: '/paintings/12.webp' },
        { w: 4, h: 2, img: '/paintings/13.webp' },
        { w: 2, h: 4, img: '/paintings/14.webp' },
        { w: 3, h: 3, img: '/paintings/15.webp' },
        { w: 1, h: 2, img: '/paintings/16.webp' },
    ];

    const BLOCK = 48;

    let scrollContainer: HTMLDivElement;

    onMount(() => {
        let animationId: number;
        let pos = 0;

        const animate = () => {
            if (scrollContainer) {
                pos += 0.5;
                if (pos >= scrollContainer.scrollWidth / 2) pos = 0;
                scrollContainer.scrollLeft = pos;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    });
</script>

<div class="min-h-full">
    <section class="bg-linear-to-b from-gray-50 to-white py-20 lg:py-28">
        <div class="mx-auto max-w-7xl px-6 text-center">
            <h1 class="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                <span class="bg-clip-text text-transparent" style="background-image: linear-gradient(to right, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7);">Any Size.</span>
                <br />
                Any Image.
            </h1>
            <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
                Create custom Minecraft paintings from <strong>1×1</strong> up to <strong>16×16</strong> blocks.
                Tall banners, wide panoramas, or massive murals — your imagination is the only limit.
            </p>
            <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/create" class="rounded-lg bg-gray-900 px-8 py-4 font-semibold text-white shadow-lg hover:bg-gray-800 transition-colors">
                    Start Creating
                </a>
                <a href="/guide" class="rounded-lg border border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    How It Works
                </a>
            </div>
        </div>
    </section>

    <section class="pt-4 pb-16 overflow-hidden bg-linear-to-b from-white to-gray-50">
        <div
            bind:this={scrollContainer}
            class="flex items-end gap-4 overflow-x-hidden select-none px-4"
            style="mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);"
        >
            {#each [...paintings, ...paintings] as painting, i (i)}
                <div class="shrink-0" style="margin-bottom: {((i % paintings.length) * 17 % 5) * 16}px;">
                    <div class="p-1.5 bg-linear-to-br from-amber-700 via-amber-800 to-amber-950 rounded shadow-lg shadow-black/30">
                        <img
                            src={painting.img}
                            alt=""
                            class="rounded-sm object-cover"
                            style="width: {painting.w * BLOCK}px; height: {painting.h * BLOCK}px;"
                        />
                    </div>
                </div>
            {/each}
        </div>
        <p class="text-center text-sm text-gray-400 mt-8">256 possible dimensions — from tiny icons to massive murals</p>
    </section>
</div>
