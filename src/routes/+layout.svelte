<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    let { children } = $props();

</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex flex-col h-screen">
    <header class="shrink-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <nav class="flex items-center justify-between px-6 py-4">
            <a href="/" class="flex items-center gap-4">
                <img src="/logo.png" alt="Logo" class="h-14" />
                <div class="flex items-baseline gap-1.5">
                    <span class="text-2xl font-bold bg-clip-text text-transparent" style="background-image: linear-gradient(to right, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7);">Infinite</span>
                    <span class="text-2xl font-light text-gray-400">Paintings</span>
                </div>
            </a>
            <div class="flex items-center gap-1">
                <a href="/create" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">CREATE</a>
                <a href="/guide" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">GUIDE</a>
            </div>
        </nav>
    </header>

    <main class="flex-1 overflow-auto">
        {@render children()}
    </main>
</div>
