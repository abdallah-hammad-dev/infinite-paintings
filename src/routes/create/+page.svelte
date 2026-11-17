<script lang="ts">
    import { paintingsStore } from '$lib/paintingsStore.svelte';
    import { newPaintingImage } from '$lib/newPaintingImage.svelte';
    import PaintingCard from '$lib/components/PaintingCard.svelte';
    import ExportButton from '$lib/components/ExportButton.svelte';
    import ImportButton from '$lib/components/ImportButton.svelte';
    import { goto } from '$app/navigation';
    import { VERSION_RANGE } from '$lib/minecraftVersions';

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

<svelte:head>
	<title>Custom & Animated Minecraft Painting Datapack Generator | Infinite Paintings</title>
	<meta name="description" content="Create and add your own custom paintings to Minecraft, still or animated. Design paintings from 1×1 up to 16×16 blocks and generate a ready-to-use datapack for Minecraft {VERSION_RANGE}." />
</svelte:head>

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
                <p class="mt-1 text-sm text-gray-400">Add one, or import a .zip you exported before to keep working on it.</p>
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

    <!-- inset-x-0 + mx-auto centres it without left-1/2, which capped its width at half the screen. -->
    <div class="fixed inset-x-0 bottom-6 mx-auto flex w-fit gap-2 max-[360px]:gap-1.5 sm:bottom-8 sm:gap-4">
        <button
            onclick={newPainting}
            class="flex items-center gap-2 whitespace-nowrap rounded-full bg-black px-4 py-3 text-base max-[360px]:px-3 font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-gray-900 active:scale-95 sm:gap-3 sm:px-10 sm:py-4 sm:text-lg"
        >
            <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Painting
        </button>
        <ImportButton />
        <ExportButton />
    </div>
</div>
