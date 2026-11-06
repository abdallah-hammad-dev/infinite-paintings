import type { Selection } from '@cropper/element-selection';
import type { PaintingAnimation } from '$lib/animatedImage';

export interface Painting {
    id: string;
	title: string | null;
	image: string;
	/** Still image: the texture of static paintings, the preview of animated ones. */
	croppedImage: string;
	animation: PaintingAnimation | null;
	selection : Selection;
	width: number;
	height: number;
	placeable: boolean;
}

export let paintingsStore = $state<Record<string, Painting>>({});
