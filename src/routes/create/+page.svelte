<script lang="ts">
    import { paintingsStore } from '$lib/paintingsStore.svelte';
    import { newPaintingImage } from '$lib/newPaintingImage.svelte';
    import PaintingCard from '$lib/components/PaintingCard.svelte';
    import ExportButton from '$lib/components/ExportButton.svelte';
    import { goto } from '$app/navigation';

    let paintingIds = $derived(Object.keys(paintingsStore));
    let fileInput: HTMLInputElement;

    function editPainting(id: string) {
        goto(`/create/painting-editor/${id}`);
    }

    function newPainting() {
        fileInput.click();
    }

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                newPaintingImage.value = reader.result as string;
                goto('/create/painting-editor');
            };
            reader.readAsDataURL(file);
        }
        input.value = '';
    }
</script>

<input
    type="file"
    accept="image/*"
    bind:this={fileInput}
    onchange={handleFileSelect}
    class="hidden"
/>

<div class="min-h-screen bg-white pb-24">
    <main class="px-6 py-12">
        {#if paintingIds.length === 0}
            <div class="py-16 text-center">
                <p class="text-sm text-gray-400">No paintings yet</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {#each paintingIds as id (id)}
                    <button onclick={() => editPainting(id)} class="text-left">
                        <PaintingCard paintingId={id} />
                    </button>
                {/each}
            </div>

            <p class="mt-10 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
                {paintingIds.length} painting{paintingIds.length === 1 ? '' : 's'}
            </p>
        {/if}
    </main>

    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <button
            onclick={newPainting}
            class="flex items-center gap-3 rounded-full bg-black px-10 py-4 text-lg font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-gray-900 active:scale-95"
        >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Painting
        </button>
        <ExportButton />
    </div>
</div>
