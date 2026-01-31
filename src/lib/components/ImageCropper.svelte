<script lang="ts">
    import "cropperjs"
    import type CropperCanvas from '@cropper/element-canvas';
    import type CropperImage from '@cropper/element-image';
    import type CropperSelection from '@cropper/element-selection';
    import type { Selection } from '@cropper/element-selection';
    import { onMount } from "svelte";

    let { image, width, height, selection, selectionId } : { image: string, width: number, height: number, selection: Selection | null, selectionId: string } = $props();

    let aspectRatio = $derived(width / height);

    let cropperCanvas: CropperCanvas;
    let cropperImage: CropperImage;
    let cropperSelection: CropperSelection;

    onMount(() => {
        cropperCanvas.scaleStep = 0;
    });

    export async function getCroppedImage(): Promise<string> {
	    const canvas = await cropperSelection.$toCanvas();
	    return canvas.toDataURL('image/png');
    }

    export function getCurrentSelection() {
        const selection: Selection = {
            x: cropperSelection.x,
            y: cropperSelection.y,
            width: cropperSelection.width,
            height: cropperSelection.height,
        }
        return selection;
    }

    function onchange(event: CustomEvent) {
        const cropperCanvasRect = cropperCanvas.getBoundingClientRect();
        const selection = event.detail as Selection;
        const maxSelection: Selection = {
            x: 0,
            y: 0,
            width: cropperCanvasRect.width,
            height: cropperCanvasRect.height,
        };
        const inBounds = (
            selection.x >= maxSelection.x
            && selection.y >= maxSelection.y
            && (selection.x + selection.width) <= (maxSelection.x + maxSelection.width)
            && (selection.y + selection.height) <= (maxSelection.y + maxSelection.height)
        );
        if (!inBounds) {
            event.preventDefault();
        }
    }

</script>

<cropper-canvas bind:this={cropperCanvas} class="block w-full h-full">
    <cropper-image bind:this={cropperImage} src={image} alt="Picture" initial-center-size="contain" translatable scalable></cropper-image>
    <cropper-selection bind:this={cropperSelection} id={selectionId} onchange={onchange} aspect-ratio={aspectRatio} {...(selection ?? { 'initial-coverage': "0.5" })} movable resizable precise keyboard>
        <cropper-grid covered rows={height} columns={width}></cropper-grid>
        <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
        <cropper-handle action="n-resize"></cropper-handle>
        <cropper-handle action="e-resize"></cropper-handle>
        <cropper-handle action="s-resize"></cropper-handle>
        <cropper-handle action="w-resize"></cropper-handle>
        {#if aspectRatio > 0.2}
            <cropper-handle action="ne-resize"></cropper-handle>
            <cropper-handle action="nw-resize"></cropper-handle>
            <cropper-handle action="se-resize"></cropper-handle>
            <cropper-handle action="sw-resize"></cropper-handle>
        {/if}
    </cropper-selection>
</cropper-canvas>