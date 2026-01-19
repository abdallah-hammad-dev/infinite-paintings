import type { Selection } from '@cropper/element-selection';

export interface Painting {
    id: string;
	title: string | null;
	image: string;
	croppedImage: string;
	selection : Selection;
	width: number;
	height: number;
	placeable: boolean;
}

export let paintingsStore = $state<Record<string, Painting>>({});
