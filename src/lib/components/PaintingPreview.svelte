<script lang="ts">
    import "cropperjs"

    let { width, height, selectionId }: { width: number, height: number, selectionId: string } = $props();

    const previewDimensions = $derived.by(() => {
        const maxW = 288;
        const maxH = 380;
        const aspectRatio = width / height;

        let w = maxH * aspectRatio;
        let h = maxH;

        if (w > maxW) {
            w = maxW;
            h = maxW / aspectRatio;
        }

        return { width: Math.round(w), height: Math.round(h) };
    });
</script>

<div style="display: flex; justify-content: center; align-items: center; height: 380px;">
    <cropper-viewer
        selection={"#" + selectionId}
        style="
            display: block;
            width: {previewDimensions.width}px;
            height: {previewDimensions.height}px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            overflow: hidden;
        "
    ></cropper-viewer>
</div>
