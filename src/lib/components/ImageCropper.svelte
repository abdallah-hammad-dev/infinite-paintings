<script lang="ts">
    import "cropperjs"
    import type CropperCanvas from '@cropper/element-canvas';
    import type CropperImage from '@cropper/element-image';
    import type CropperSelection from '@cropper/element-selection';
    import type { Selection } from '@cropper/element-selection';
    import { onMount } from "svelte";
    import { cropAnimation, type PaintingAnimation } from '$lib/animatedImage';

    let { image, width, height, selection, selectionId, fitToImage = false } : { image: string, width: number, height: number, selection: Selection | null, selectionId: string, fitToImage?: boolean } = $props();

    let aspectRatio = $derived(width / height);

    let cropperCanvas: CropperCanvas;
    let cropperImage: CropperImage;
    let cropperSelection: CropperSelection;

    // cropperjs 2.3.1 can size the initial selection from the image before fitting it into the canvas
    // (its $ready() resolves as soon as the image is decoded), so the coverage is only set once it's fitted.
    let imageFitted = $state(false);

    onMount(() => {
        cropperCanvas.scaleStep = 0;
        // cropper-image fits the image when it loads (or right away if it already had), with a listener
        // added before this one.
        const imageElement = cropperImage.$image;
        if (imageElement.complete && imageElement.naturalWidth > 0) imageFitted = true;
        else imageElement.addEventListener('load', () => (imageFitted = true), { once: true });
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

</script>

<cropper-canvas bind:this={cropperCanvas} class="block w-full h-full">
    <cropper-image bind:this={cropperImage} src={image} alt="Picture" initial-fit="contain" translatable scalable></cropper-image>
    <!-- initial-coverage is a share of the image, measured once it has loaded: 1 selects all of it.
         min-inset="0" keeps the selection inside the canvas. -->
    <cropper-selection bind:this={cropperSelection} id={selectionId} aspect-ratio={aspectRatio} {...(selection ?? (imageFitted ? { 'initial-coverage': fitToImage ? "1" : "0.5" } : {}))} min-inset="0" movable resizable precise keyboard>
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