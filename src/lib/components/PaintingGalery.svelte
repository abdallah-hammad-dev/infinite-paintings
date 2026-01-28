<script lang="ts"> 
    import PaintingCard from '$lib/components/PaintingCard.svelte';
    import { paintingsStore } from '$lib/paintingsStore.svelte';

</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
    {#each Object.keys(paintingsStore) as paintingId (paintingId)}
        <PaintingCard {paintingId} />
    {/each}
</div>
