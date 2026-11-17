const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const TICKS_PER_SECOND = 20;

/**
 * Encodes frames as an animated PNG, which browsers play like a GIF and ImageDecoder reads frame
 * by frame. Every frame covers the whole image as 8-bit RGBA and replaces the previous one.
 * drawFrame(index) returns the pixels of a frame; frames are encoded one at a time to keep memory low.
 */
export async function encodeApng(
	width: number,
	height: number,
	frameTicks: number[],
	drawFrame: (index: number) => Uint8ClampedArray
): Promise<Blob> {
	const parts: Uint8Array<ArrayBuffer>[] = [new Uint8Array(SIGNATURE)];

	const header = new DataView(new ArrayBuffer(13));
	header.setUint32(0, width);
	header.setUint32(4, height);
	header.setUint8(8, 8); // bit depth
	header.setUint8(9, 6); // colour type: RGBA. Compression, filter and interlace methods stay 0.
	parts.push(chunk('IHDR', header));

	const animationControl = new DataView(new ArrayBuffer(8));
	animationControl.setUint32(0, frameTicks.length);
	animationControl.setUint32(4, 0); // loop forever
	parts.push(chunk('acTL', animationControl));

	// fcTL and fdAT chunks share one sequence.
	let sequence = 0;
	for (const [index, ticks] of frameTicks.entries()) {
		const frameControl = new DataView(new ArrayBuffer(26));
		frameControl.setUint32(0, sequence++);
		frameControl.setUint32(4, width);
		frameControl.setUint32(8, height);
		// Offsets (8 and 12) stay 0. The delay is a fraction of a second: ticks / 20.
		frameControl.setUint16(20, Math.min(Math.max(1, Math.round(ticks)), 0xffff));
		frameControl.setUint16(22, TICKS_PER_SECOND);
		// dispose_op (24) and blend_op (25) stay 0: the frame replaces the previous one, transparent pixels included.
		parts.push(chunk('fcTL', frameControl));

		const data = await zlib(scanlines(drawFrame(index), width, height));
		if (index === 0) {
			// The first frame is the regular image data, shown by decoders that don't animate PNGs.
			parts.push(chunk('IDAT', data));
		} else {
			const frameData = new Uint8Array(4 + data.length);
			new DataView(frameData.buffer).setUint32(0, sequence++);
			frameData.set(data, 4);
			parts.push(chunk('fdAT', frameData));
		}
	}

	parts.push(chunk('IEND', new Uint8Array(0)));
	return new Blob(parts, { type: 'image/png' });
}

/** Rows of pixels, each preceded by filter type 0 (none). */
function scanlines(pixels: Uint8ClampedArray, width: number, height: number) {
	const rowLength = width * 4;
	const rows = new Uint8Array((rowLength + 1) * height);
	for (let y = 0; y < height; y++) {
		rows.set(pixels.subarray(y * rowLength, (y + 1) * rowLength), y * (rowLength + 1) + 1);
	}
	return rows;
}

/** PNG image data is a zlib stream, which is what CompressionStream calls 'deflate'. */
async function zlib(bytes: Uint8Array<ArrayBuffer>) {
	const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

function chunk(type: string, data: ArrayBufferView<ArrayBuffer>) {
	const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	const chunk = new Uint8Array(12 + bytes.length);
	const view = new DataView(chunk.buffer);
	view.setUint32(0, bytes.length);
	for (let i = 0; i < 4; i++) chunk[4 + i] = type.charCodeAt(i);
	chunk.set(bytes, 8);
	// The checksum covers the type and the data.
	view.setUint32(8 + bytes.length, crc32(chunk.subarray(4, 8 + bytes.length)));
	return chunk;
}

let crcTable: Uint32Array | undefined;

function crc32(bytes: Uint8Array) {
	crcTable ??= Uint32Array.from({ length: 256 }, (_, n) => {
		for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
		return n >>> 0;
	});
	let crc = 0xffffffff;
	for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}
