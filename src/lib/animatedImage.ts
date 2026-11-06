export interface PaintingAnimation {
	/** PNG data URL with every frame stacked vertically, the layout Minecraft expects. */
	strip: string;
	frameWidth: number;
	frameHeight: number;
	/** Duration of each frame of the strip, in game ticks. */
	frameTimes: number[];
}

/** Draws one source frame, cropped, into the strip row starting at offsetY. */
export type DrawCroppedFrame = (
	context: CanvasRenderingContext2D,
	frame: CanvasImageSource,
	offsetY: number
) => void;

const TICK_MS = 50;
// Browsers play frames declaring 10 ms or less at 100 ms; GIFs are authored against that.
const MIN_FRAME_MS = 11;
const DEFAULT_FRAME_MS = 100;
// Keeps the strip within browser canvas limits and the texture size every player's GPU supports.
const MAX_STRIP_HEIGHT = 16384;
const MAX_STRIP_PIXELS = 32 * 1024 * 1024;

/**
 * Crops every frame of an animated image (GIF, animated WebP, APNG) into a Minecraft animation strip.
 * Returns null when the image isn't animated or the browser can't decode its frames.
 */
export async function cropAnimation(
	imageUrl: string,
	frameWidth: number,
	frameHeight: number,
	drawCroppedFrame: DrawCroppedFrame
): Promise<PaintingAnimation | null> {
	if (typeof ImageDecoder === 'undefined') return null;

	const blob = await (await fetch(imageUrl)).blob();
	if (!(await ImageDecoder.isTypeSupported(blob.type))) return null;

	const maxFrames = Math.min(
		Math.floor(MAX_STRIP_HEIGHT / frameHeight),
		Math.floor(MAX_STRIP_PIXELS / (frameWidth * frameHeight))
	);
	if (maxFrames < 2) return null;

	const decoder = new ImageDecoder({ data: await blob.arrayBuffer(), type: blob.type });
	try {
		await decoder.tracks.ready;
		await decoder.completed;
		const track = decoder.tracks.selectedTrack;
		if (!track?.animated || track.frameCount < 2) return null;

		const durations: number[] = [];
		for (let index = 0; index < track.frameCount; index++) {
			const { image } = await decoder.decode({ frameIndex: index });
			durations.push(frameDurationMs(image.duration));
			image.close();
		}

		const frames = scheduleFrames(durations, maxFrames);
		if (frames.length < 2) return null;

		const canvas = document.createElement('canvas');
		canvas.width = frameWidth;
		canvas.height = frameHeight * frames.length;
		const context = canvas.getContext('2d');
		if (!context) return null;

		for (const [row, frame] of frames.entries()) {
			const { image } = await decoder.decode({ frameIndex: frame.index });
			drawCroppedFrame(context, image, row * frameHeight);
			image.close();
		}

		return {
			strip: canvas.toDataURL('image/png'),
			frameWidth,
			frameHeight,
			frameTimes: frames.map((frame) => frame.ticks)
		};
	} finally {
		decoder.close();
	}
}

function frameDurationMs(durationUs: number | null) {
	const ms = (durationUs ?? 0) / 1000;
	return ms < MIN_FRAME_MS ? DEFAULT_FRAME_MS : ms;
}

/**
 * Minecraft can't show a frame for less than a game tick, so the loop is resampled on a grid of
 * `step` ticks: each cell shows the frame visible at its middle, and neighbouring cells showing
 * the same frame merge. The grid widens until at most maxFrames remain.
 * The loop keeps its total duration, hence its speed.
 */
export function scheduleFrames(durationsMs: number[], maxFrames: number) {
	const totalMs = durationsMs.reduce((sum, duration) => sum + duration, 0);
	const totalTicks = Math.max(1, Math.round(totalMs / TICK_MS));
	// Maps ticks onto the source timeline, so rounding totalTicks doesn't shift the last frames.
	const msPerTick = totalMs / totalTicks;
	// Once step reaches totalTicks there's a single cell, so the loop ends even if maxFrames < 1.
	const limit = Math.max(1, maxFrames);
	for (let step = 1; ; step++) {
		const frames: { index: number; ticks: number }[] = [];
		let index = 0;
		let frameEndMs = durationsMs[0];
		for (let tick = 0; tick < totalTicks; tick += step) {
			const ticks = Math.min(step, totalTicks - tick);
			const timeMs = (tick + ticks / 2) * msPerTick;
			while (timeMs >= frameEndMs && index < durationsMs.length - 1) {
				frameEndMs += durationsMs[++index];
			}
			const last = frames[frames.length - 1];
			if (last?.index === index) last.ticks += ticks;
			else frames.push({ index, ticks });
		}
		if (frames.length <= limit) return frames;
	}
}
