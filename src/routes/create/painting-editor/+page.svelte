<script lang="ts">
    import PaintingEditor from '$lib/components/PaintingEditor.svelte';
    import { newPaintingImage } from '$lib/newPaintingImage.svelte';
    import { goto } from '$app/navigation';

    $effect(() => {
        if (!newPaintingImage.value) goto('/create');
    });
</script>

{#if newPaintingImage.value}
    <PaintingEditor paintingImage={newPaintingImage.value} />
{/if}
