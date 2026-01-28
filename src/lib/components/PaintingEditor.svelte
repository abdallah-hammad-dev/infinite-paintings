<script lang="ts">
    import { paintingsStore } from '$lib/paintingsStore.svelte';
    import ImageCropper from '$lib/components/ImageCropper.svelte';
    import PaintingPreview from '$lib/components/PaintingPreview.svelte';
    import { goto } from '$app/navigation';


    type Props = { paintingId: string; paintingImage?: never } | { paintingImage: string; paintingId?: never };
    let { paintingId, paintingImage } : Props = $props();

    let cropper: ImageCropper | undefined = $state();

    let id = $derived(paintingId ? paintingId : crypto.randomUUID());
    let title = $derived(paintingId ? paintingsStore[paintingId].title : null);
    let image = $derived(paintingId ? paintingsStore[paintingId].image : paintingImage!);
    let width = $derived(paintingId ? paintingsStore[paintingId].width : 4);
    let height = $derived(paintingId ? paintingsStore[paintingId].height : 4);
    let selection = $derived(paintingId ? paintingsStore[paintingId].selection : null);
    let placeable = $derived(paintingId ? paintingsStore[paintingId].placeable : true);
    const selectionId = $derived(`cropper-${id}`);

    function quit() {
        goto('/');
    }

    function resetSelection() {
        selection = null;
    }

    async function savePainting() {
        if (!cropper) return;
        const croppedImage = await cropper.getCroppedImage();
        const currentSelection = cropper.getCurrentSelection();
        paintingsStore[id] = {
            id,
            title,
            image,
            croppedImage,
            width,
            height,
            selection: currentSelection,
            placeable
        };
        quit();
    }
</script>

<div class="flex h-screen w-full bg-gray-100 overflow-hidden">
        <div class="flex-1 flex items-center justify-center p-8">
        <div class="relative w-full h-full rounded-lg overflow-hidden border border-gray-300 bg-white shadow-inner flex flex-col">
            {#key [id, width, height]}
                <ImageCropper bind:this={cropper} {image} {width} {height} {selection} {selectionId}></ImageCropper>
            {/key}
        </div>
    </div>

    <aside class="w-80 bg-white shadow-2xl z-10 flex flex-col">
        <div class="p-5 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800">Painting Editor</h2>
            <p class="text-sm text-gray-500 mt-0.5">Configure your masterpiece</p>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div class="p-4 border-b border-gray-200">
                <div class="relative rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white">
                    <div class="p-3 flex items-center justify-center min-h-35">
                        {#key [id, width, height]}
                            <PaintingPreview {width} {height} {selectionId} />
                        {/key}
                    </div>
                    <!-- Dimension badge on preview -->
                    <div class="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-mono text-white">
                        {width}×{height}
                    </div>
                </div>
            </div>

            <div class="p-4 space-y-4 border-b border-gray-100">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dimensions (blocks)</h3>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <label for="width" class="text-sm font-medium text-gray-600">Width</label>
                            <span class="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{width}</span>
                        </div>
                        <input id="width" type="range" min="1" max="16" bind:value={width} oninput={resetSelection} class="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"/>
                    </div>

                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <label for="height" class="text-sm font-medium text-gray-600">Height</label>
                            <span class="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{height}</span>
                        </div>
                        <input id="height" type="range" min="1" max="16" bind:value={height} oninput={resetSelection} class="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"/>
                    </div>
                </div>
            </div>

            <div class="p-4 space-y-4">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</h3>

                <div class="space-y-1.5">
                    <label for="title" class="block text-sm font-medium text-gray-600">Title</label>
                    <input id="title" type="text" placeholder="none" bind:value={title} class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:italic placeholder:text-gray-400"/>
                </div>

                <label class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <input type="checkbox" bind:checked={placeable} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0">
                    <div class="flex-1">
                        <span class="text-sm font-medium text-gray-700">Placeable in Survival</span>
                        <p class="text-xs text-gray-500 mt-0.5">Allow placing without Creative mode</p>
                    </div>
                    {#if placeable}
                        <span class="flex items-center gap-1 text-xs font-medium text-green-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    {:else}
                        <span class="flex items-center gap-1 text-xs font-medium text-amber-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </span>
                    {/if}
                </label>
            </div>
        </div>

        <div class="p-4 border-t border-gray-200 flex gap-3">
            <button onclick={quit} class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all">
                Cancel
            </button>
            <button onclick={savePainting} class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                Save
            </button>
        </div>
    </aside>
</div>
