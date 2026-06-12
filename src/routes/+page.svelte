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

<svelte:head>
	<title>Custom Minecraft Painting Generator for 1.21+ | Infinite Paintings</title>
	<meta name="description" content="Free custom Minecraft painting generator. Turn any image into a custom painting and download a ready-to-use datapack & resource pack for Minecraft 1.21+, from 1×1 up to 16×16 blocks." />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Infinite Paintings" />
	<meta property="og:title" content="Custom Minecraft Painting Generator for 1.21+" />
	<meta property="og:description" content="Turn any image into a custom Minecraft painting and download a ready-to-use datapack & resource pack for Minecraft 1.21+." />
	<meta property="og:url" content="https://infinite-paintings.com/" />
	<meta property="og:image" content="https://infinite-paintings.com/logo.png" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Custom Minecraft Painting Generator for 1.21+" />
	<meta name="twitter:description" content="Turn any image into a custom Minecraft painting and download a ready-to-use datapack for Minecraft 1.21+." />
	<meta name="twitter:image" content="https://infinite-paintings.com/logo.png" />

</svelte:head>

<div class="min-h-full">
    <section class="bg-linear-to-b from-gray-50 to-white py-20 lg:py-28">
        <div class="mx-auto max-w-7xl px-6 text-center">
            <h1 class="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                <span class="bg-clip-text text-transparent" style="background-image: linear-gradient(to right, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7);">Custom Minecraft Paintings</span>
            </h1>
            <p class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">Any Size. Any Image.</p>
            <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
                A free <strong>custom Minecraft painting generator</strong>. Upload any image, crop it from
                <strong>1×1</strong> up to <strong>16×16</strong> blocks, and download a ready-to-use
                <strong>datapack</strong> and resource pack for <strong>Minecraft 1.21+</strong> — without replacing
                any of the vanilla paintings.
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
