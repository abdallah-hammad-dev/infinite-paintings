import JSZip from 'jszip';
import { encodeApng } from '$lib/apng';
import { NAMESPACE } from '$lib/packFormat';
import type { Painting } from '$lib/paintingsStore.svelte';

export interface ImportResult {
	/** Paintings to add, with the ids they were exported with, so worlds that use them keep working. */
	paintings: Painting[];
	/** Found, but a painting with the same id is already in the list. That one is left as it is. */
	alreadyInList: number;
	/** Found, but their texture is missing or their files can't be read. */
	skipped: number;
}

type JsonObject = { [key: string]: unknown };
type ZipEntry = { path: string; file: JSZip.JSZipObject };
type PaintingImages = Pick<Painting, 'image' | 'croppedImage' | 'animation'>;

// Matched on the end of the path, so the packs can sit in any folder of the zip.
const VARIANT_PATH = new RegExp(`(?:^|/)data/${NAMESPACE}/painting_variant/([^/]+)\\.json$`);
const PLACEABLE_TAG_PATH = /(?:^|\/)data\/minecraft\/tags\/painting_variant\/placeable\.json$/;
const TEXTURE_PATH = /(?:^|\/)assets\/([^/]+)\/textures\/painting\/(.+)\.png(\.mcmeta)?$/;
// Exports hold the data pack and resource pack as zips inside a zip. People may also pick those
// two zips, or zip the unzipped folders again.
const MAX_ZIP_DEPTH = 3;

/** Reads back the paintings of packs exported by the site. isInList(id) tells which to leave out. */
export async function importPacks(files: File[], isInList: (id: string) => boolean): Promise<ImportResult> {
	const entries: ZipEntry[] = [];
	for (const file of files) entries.push(...(await listFiles(await JSZip.loadAsync(file))));

	const variants = new Map<string, JSZip.JSZipObject>();
	const textures = new Map<string, JSZip.JSZipObject>();
	const animations = new Map<string, JSZip.JSZipObject>();
	const placeable = new Set<string>();

	for (const { path, file } of entries) {
		const variant = VARIANT_PATH.exec(path);
		const texture = TEXTURE_PATH.exec(path);
		if (variant) {
			if (!variants.has(variant[1])) variants.set(variant[1], file);
		} else if (texture) {
			(texture[3] ? animations : textures).set(`${texture[1]}:${texture[2]}`, file);
		} else if (PLACEABLE_TAG_PATH.test(path)) {
			const values = asObject(await readJson(file))?.values;
			for (const value of Array.isArray(values) ? values : []) {
				const id = typeof value === 'string' ? value : asObject(value)?.id;
				if (typeof id === 'string') placeable.add(id);
			}
		}
	}

	const result: ImportResult = { paintings: [], alreadyInList: 0, skipped: 0 };

	for (const [id, file] of variants) {
		if (isInList(id)) {
			result.alreadyInList++;
			continue;
		}
		try {
			const variant = asObject(await readJson(file));
			const width = variant?.width;
			const height = variant?.height;
			if (!variant || !isBlockCount(width) || !isBlockCount(height)) {
				result.skipped++;
				continue;
			}

			const assetId = typeof variant.asset_id === 'string' ? variant.asset_id : `${NAMESPACE}:${id}`;
			const textureKey = assetId.includes(':') ? assetId : `minecraft:${assetId}`;
			const texture = textures.get(textureKey);
			if (!texture) {
				result.skipped++;
				continue;
			}

			const png = `data:image/png;base64,${await texture.async('base64')}`;
			const animationFile = animations.get(textureKey);
			const animation = animationFile ? asObject(asObject(await readJson(animationFile))?.animation) : null;

			result.paintings.push({
				id,
				title: readTitle(variant.title),
				width,
				height,
				placeable: placeable.has(`${NAMESPACE}:${id}`),
				selection: null,
				...(animation ? await readAnimation(png, animation) : { image: png, croppedImage: png, animation: null })
			});
		} catch (error) {
			console.error(`Couldn't import painting ${id}.`, error);
			result.skipped++;
		}
	}

	return result;
}

async function listFiles(zip: JSZip, depth = 0): Promise<ZipEntry[]> {
	const entries: ZipEntry[] = [];
	for (const file of Object.values(zip.files)) {
		// Skips folders, and the metadata files macOS adds to the zips it makes.
		if (file.dir || file.name.startsWith('__MACOSX/') || /(?:^|\/)\._/.test(file.name)) continue;
		if (/\.zip$/i.test(file.name)) {
			if (depth < MAX_ZIP_DEPTH) {
				entries.push(...(await listFiles(await JSZip.loadAsync(await file.async('uint8array')), depth + 1)));
			}
		} else {
			entries.push({ path: file.name, file });
		}
	}
	return entries;
}

/**
 * The editor crops paintings out of their source image. For animated paintings that source is
 * rebuilt as an animated PNG of the frames, so editing one crops the animation again, like a GIF.
 * The strip is kept as it was, so exporting again without editing writes the same texture.
 */
async function readAnimation(strip: string, meta: JsonObject): Promise<PaintingImages> {
	const texture = await createImageBitmap(await (await fetch(strip)).blob());
	try {
		const { frameWidth, frameHeight } = frameSize(meta, texture.width, texture.height);
		const columns = Math.floor(texture.width / frameWidth);
		const frames = readFrames(meta, columns * Math.floor(texture.height / frameHeight));

		const canvas = createCanvas(frameWidth, frameHeight);
		const context = canvas.getContext('2d', { willReadFrequently: true })!;
		const drawFrame = (index: number, target = context, y = 0) => {
			if (target === context) context.clearRect(0, 0, frameWidth, frameHeight);
			target.drawImage(
				texture,
				(index % columns) * frameWidth, Math.floor(index / columns) * frameHeight, frameWidth, frameHeight,
				0, y, frameWidth, frameHeight
			);
		};

		drawFrame(frames[0]?.index ?? 0);
		const still = canvas.toDataURL('image/png');
		if (frames.length < 2) return { image: still, croppedImage: still, animation: null };

		const frameTimes = frames.map((frame) => frame.time);
		const source = await encodeApng(frameWidth, frameHeight, frameTimes, (index) => {
			drawFrame(frames[index].index);
			return context.getImageData(0, 0, frameWidth, frameHeight).data;
		});

		// The site exports one column of frames, played top to bottom. Other layouts are redrawn that way.
		let stripUrl = strip;
		if (columns !== 1 || frames.some((frame, row) => frame.index !== row)) {
			const stripCanvas = createCanvas(frameWidth, frameHeight * frames.length);
			const stripContext = stripCanvas.getContext('2d')!;
			frames.forEach((frame, row) => drawFrame(frame.index, stripContext, row * frameHeight));
			stripUrl = stripCanvas.toDataURL('image/png');
		}

		return {
			image: await blobToDataUrl(source),
			croppedImage: still,
			animation: { strip: stripUrl, frameWidth, frameHeight, frameTimes }
		};
	} finally {
		texture.close();
	}
}

/** Minecraft's rules for the frame size of an animated texture. */
function frameSize(meta: JsonObject, textureWidth: number, textureHeight: number) {
	const width = positiveInteger(meta.width);
	const height = positiveInteger(meta.height);
	if (width) return { frameWidth: width, frameHeight: height ?? textureHeight };
	if (height) return { frameWidth: textureWidth, frameHeight: height };
	const side = Math.min(textureWidth, textureHeight);
	return { frameWidth: side, frameHeight: side };
}

/** The frames Minecraft plays, in order, with their duration in ticks. */
function readFrames(meta: JsonObject, frameCount: number) {
	const defaultTime = positiveInteger(meta.frametime) ?? 1;
	const frames: { index: unknown; time: number }[] = Array.isArray(meta.frames)
		? meta.frames.map((frame) => {
				const entry = asObject(frame);
				return entry
					? { index: entry.index, time: positiveInteger(entry.time) ?? defaultTime }
					: { index: frame, time: defaultTime };
			})
		: Array.from({ length: frameCount }, (_, index) => ({ index, time: defaultTime }));
	return frames.filter(
		(frame): frame is { index: number; time: number } =>
			typeof frame.index === 'number' && Number.isInteger(frame.index) && frame.index >= 0 && frame.index < frameCount
	);
}

/** The site writes titles as plain text. Text components keep their text. */
function readTitle(title: unknown): string | null {
	const text = typeof title === 'string' ? title : asObject(title)?.text;
	return typeof text === 'string' && text !== '' ? text : null;
}

async function readJson(file: JSZip.JSZipObject): Promise<unknown> {
	try {
		return JSON.parse(await file.async('string'));
	} catch {
		return null;
	}
}

function asObject(value: unknown): JsonObject | null {
	return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as JsonObject) : null;
}

/** Paintings span 1 to 16 blocks each way. */
function isBlockCount(value: unknown): value is number {
	return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 16;
}

function positiveInteger(value: unknown) {
	return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined;
}

function createCanvas(width: number, height: number) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas;
}

function blobToDataUrl(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(blob);
	});
}
