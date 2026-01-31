<script lang="ts">
    import PaintingEditor from '$lib/components/PaintingEditor.svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    let paintingId = $derived(page.url.searchParams.get('id'));
    let image = $derived(page.url.searchParams.get('image'));

    $effect(() => {
        if (!paintingId && !image) {
            goto('/create');
        }
    });
</script>

{#if paintingId}
    <PaintingEditor {paintingId} />
{:else if image}
    <PaintingEditor paintingImage={image} />
{/if}
