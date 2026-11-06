<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.ico';
    import { page } from '$app/state';
    import { afterNavigate } from '$app/navigation';

    let { children } = $props();

    let main: HTMLElement;

    // Pages scroll inside <main>, not the window, so SvelteKit's scroll reset doesn't reach them.
    // Back/forward and #anchor links keep the position SvelteKit gives them. The first load
    // ('enter') has nothing to reset, and fires before <main> is bound: throwing there breaks
    // hydration, which leaves a second copy of the layout on the page and blocks navigation.
    afterNavigate(({ type, to }) => {
        if (type === 'enter' || type === 'popstate' || to?.url.hash) return;
        main.scrollTo(0, 0);
    });

</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link rel="canonical" href={`https://infinite-paintings.com${page.url.pathname}`} />
</svelte:head>

<!-- dvh rather than vh: on mobile, vh includes the space under the browser's address bar. -->
<div class="flex flex-col h-dvh">
    <header class="shrink-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <nav class="flex items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
            <a href="/" aria-label="Infinite Paintings" class="flex shrink-0 items-center gap-4">
                <img src="/logo.png" alt="" class="h-10 sm:h-14" />
                <!-- The name doesn't fit next to the links on phones; the logo stands in for it. -->
                <div class="hidden items-baseline gap-1.5 sm:flex">
                    <span class="text-2xl font-bold bg-clip-text text-transparent" style="background-image: linear-gradient(to right, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7);">Infinite</span>
                    <span class="text-2xl font-light text-gray-400">Paintings</span>
                </div>
            </a>
            <div class="flex items-center sm:gap-1">
                <a href="/create" class="px-2.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors sm:px-4">CREATE</a>
                <a href="/guide" class="px-2.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors sm:px-4">GUIDE</a>
                <a href="/about" class="px-2.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors sm:px-4">ABOUT</a>
            </div>
        </nav>
    </header>

    <main bind:this={main} class="flex-1 overflow-auto">
        {@render children()}
    </main>
</div>
