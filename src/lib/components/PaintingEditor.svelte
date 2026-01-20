<script lang="ts">
    import { paintingsStore } from '$lib/paintingsStore.svelte';
    import ImageCropper from '$lib/components/ImageCropper.svelte';
    import { goto } from '$app/navigation';
    import "cropperjs";

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
        <div class="relative w-full h-full bg-white shadow-inner rounded-lg overflow-hidden border border-gray-300 flex flex-col">
            {#key [id, width, height]}
                <ImageCropper bind:this={cropper} {image} {width} {height} {selection} {selectionId}></ImageCropper>
            {/key}
        </div>
    </div>

    <aside class="w-80 bg-white shadow-xl z-10 flex flex-col border-l border-gray-200">
        <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-800">Painting Editor</h2>
            <p class="text-sm text-gray-500 mt-1">Adjust your painting details</p>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-8">
            <div class="space-y-4">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dimensions</h3>
                
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <label for="width" class="font-medium text-gray-700">Width</label>
                        <span class="text-gray-500 font-mono">{width} blocks</span>
                    </div>
                    <input id="width" type="range" min="1" max="16" bind:value={width} class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <label for="height" class="font-medium text-gray-700">Height</label>
                        <span class="text-gray-500 font-mono">{height} blocks</span>
                    </div>
                    <input id="height" type="range" min="1" max="16" bind:value={height} class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
                
                <div class="space-y-1">
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input id="title" type="text" placeholder="Untitled Masterpiece" bind:value={title} class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"/>
                </div>

                <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" bind:checked={placeable} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    <span class="text-sm font-medium text-gray-700">Placeable in Survival</span>
                </label>

                <div class="pt-4 border-t border-gray-100">
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Preview</h3>
                    <cropper-viewer selection={"#" + selectionId} style="width: 100%; min-height: 200px; display: block; border-radius: 0.5rem; overflow: hidden; background-color: #f3f4f6;"></cropper-viewer>
                </div>
            </div>
        </div>

        <div class="p-6 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-3">
            <button onclick={quit} class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                Cancel
            </button>
            <button onclick={savePainting} class="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Save Changes
            </button>
        </div>
    </aside>
</div>
