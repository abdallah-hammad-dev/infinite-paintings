<script lang="ts">
    import PaintingEditor from '$lib/components/PaintingEditor.svelte';
    import type { PageProps } from './$types';

    let { params }: PageProps = $props();
</script>

<PaintingEditor paintingId={params.id} />
