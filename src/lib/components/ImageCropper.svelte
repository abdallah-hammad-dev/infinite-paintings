<script lang="ts">
    import "cropperjs"
    import type CropperCanvas from '@cropper/element-canvas';
    import type CropperImage from '@cropper/element-image';
    import type CropperSelection from '@cropper/element-selection';
    import type { Selection } from '@cropper/element-selection';
    import { onMount } from "svelte";
    import { cropAnimation, type PaintingAnimation } from '$lib/animatedImage';

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

    /** Null when the image isn't animated. Frames have the same size as getCroppedImage(). */
    export async function getCroppedAnimation(): Promise<PaintingAnimation | null> {
        // Canvas sizes truncate, which is what $toCanvas relies on for the static image.
        const frameWidth = Math.max(1, Math.floor(cropperSelection.width));
        const frameHeight = Math.max(1, Math.floor(cropperSelection.height));
        try {
            return await cropAnimation(image, frameWidth, frameHeight, (context, frame, offsetY) =>
                drawCroppedFrame(context, frame, offsetY, frameWidth, frameHeight));
        } catch (error) {
            console.error("Couldn't extract the animation frames, saving a still image instead.", error);
            return null;
        }
    }

    // Same math as CropperSelection.$toCanvas, but for any frame, drawn into one row of a strip.
    function drawCroppedFrame(context: CanvasRenderingContext2D, frame: CanvasImageSource, offsetY: number, frameWidth: number, frameHeight: number) {
        const [a, b, c, d, e, f] = cropperImage.$getTransform();
        const offsetX = -cropperSelection.x;
        const selectionOffsetY = -cropperSelection.y;
        const determinant = a * d - c * b;
        const translateX = (offsetX * d - c * selectionOffsetY) / determinant;
        const translateY = (selectionOffsetY * a - b * offsetX) / determinant;
        const { naturalWidth, naturalHeight } = cropperImage.$image;
        const centerX = naturalWidth / 2;
        const centerY = naturalHeight / 2;

        context.save();
        // The image overflows the selection; keep it from bleeding into neighbouring frames.
        context.beginPath();
        context.rect(0, offsetY, frameWidth, frameHeight);
        context.clip();
        context.translate(centerX, offsetY + centerY);
        context.transform(a, b, c, d, a * translateX + c * translateY + e, b * translateX + d * translateY + f);
        context.translate(-centerX, -centerY);
        context.drawImage(frame, 0, 0, naturalWidth, naturalHeight);
        context.restore();
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
        // The selection already fires while it initialises, before bind:this has run.
        if (!cropperCanvas) return;
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