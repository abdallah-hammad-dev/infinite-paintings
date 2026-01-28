<script lang="ts">
    import { paintingsStore } from '$lib/paintingsStore.svelte';

    let { paintingId } : { paintingId: string } = $props();
    let painting = $derived(paintingsStore[paintingId]);
    let displayTitle = $derived(painting.title || 'none');

</script>

<div class="group bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer h-full flex flex-col">
    <div class="relative w-full aspect-square bg-white overflow-hidden shrink-0">
        <img
            src={painting.croppedImage}
            alt={displayTitle}
            class="absolute inset-0 w-full h-full object-contain p-3"
        />

        <div class="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-white">
            {painting.width}×{painting.height}
        </div>

        {#if !painting.placeable}
            <div class="absolute top-2 left-2 px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded text-xs font-medium text-white">
                Creative Only
            </div>
        {/if}
    </div>

    <div class="p-3 border-t border-gray-100 shrink-0 space-y-1.5 text-sm">
        <div class="flex justify-between">
            <span class="text-gray-500">Title</span>
            <span class="font-medium text-gray-800 truncate ml-2" class:italic={!painting.title} class:text-gray-400={!painting.title}>
                {displayTitle}
            </span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-500">Dimensions</span>
            <span class="font-medium text-gray-800 font-mono">{painting.width} × {painting.height}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-500">Placeable</span>
            {#if painting.placeable}
                <span class="font-medium text-green-600">Yes</span>
            {:else}
                <span class="font-medium text-amber-600">No</span>
            {/if}
        </div>
    </div>
</div>
