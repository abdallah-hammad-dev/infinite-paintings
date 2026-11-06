<script lang="ts">
    import { paintingsStore } from "$lib/paintingsStore.svelte";
    import JSZip from "jszip";

    const NAMESPACE = "infinite-paintings";

    // Minecraft 1.21 formats: the oldest version that supports custom painting variants.
    const DATA_PACK_MIN_FORMAT = 48;
    const RESOURCE_PACK_MIN_FORMAT = 34;
    // Open-ended upper bound so the packs are never flagged as incompatible on newer versions.
    const MAX_FORMAT = 999;

    function packMcmeta(description: string, minFormat: number) {
        return JSON.stringify({
            pack: {
                description,
                // Read by 1.21.9 and later.
                min_format: minFormat,
                max_format: MAX_FORMAT,
                // Legacy fields read by 1.21 – 1.21.8. Required (and must match min/max_format)
                // because the supported range includes pre-1.21.9 formats.
                pack_format: minFormat,
                supported_formats: {
                    min_inclusive: minFormat,
                    max_inclusive: MAX_FORMAT
                }
            }
        }, null, 2);
    }

    async function exportPacks() {
        const paintings = Object.values(paintingsStore);
        if (paintings.length === 0) return;

        const datapack = new JSZip();

        datapack.file("pack.mcmeta", packMcmeta(
            "Infinite Paintings - Custom paintings data pack",
            DATA_PACK_MIN_FORMAT
        ));

        const placeableIds: string[] = [];

        for (const painting of paintings) {
            const variantData = {
                asset_id: `${NAMESPACE}:${painting.id}`,
                height: painting.height,
                width: painting.width,
                ...(painting.title && { title: painting.title })
            };

            datapack.file(
                `data/${NAMESPACE}/painting_variant/${painting.id}.json`,
                JSON.stringify(variantData, null, 2)
            );

            if (painting.placeable) {
                placeableIds.push(`${NAMESPACE}:${painting.id}`);
            }
        }

        if (placeableIds.length > 0) {
            datapack.file(
                `data/minecraft/tags/painting_variant/placeable.json`,
                JSON.stringify({ values: placeableIds }, null, 2)
            );
        }

        const resourcepack = new JSZip();

        resourcepack.file("pack.mcmeta", packMcmeta(
            "Infinite Paintings - Custom paintings resource pack",
            RESOURCE_PACK_MIN_FORMAT
        ));

        for (const painting of paintings) {
            const texturePath = `assets/${NAMESPACE}/textures/painting/${painting.id}.png`;
            const texture = painting.animation?.strip ?? painting.croppedImage;
            resourcepack.file(texturePath, texture.split(',')[1], { base64: true });

            if (painting.animation) {
                const { frameWidth, frameHeight, frameTimes } = painting.animation;
                resourcepack.file(`${texturePath}.mcmeta`, JSON.stringify({
                    animation: {
                        // Without these, Minecraft assumes square frames.
                        width: frameWidth,
                        height: frameHeight,
                        frames: frameTimes.map((time, index) => ({ index, time }))
                    }
                }, null, 2));
            }
        }

        const datapackZip = datapack.generateAsync({ type: "blob" });
        const resourcepackZip = resourcepack.generateAsync({ type: "blob" });

        const mainZip = new JSZip();
        mainZip.file(`${NAMESPACE}_data_pack.zip`, await datapackZip);
        mainZip.file(`${NAMESPACE}_resource_pack.zip`, await resourcepackZip);

        const a = document.createElement("a");
        const url = URL.createObjectURL(await mainZip.generateAsync({ type: "blob" }));
        a.href = url;
        a.download = `${NAMESPACE}_packs.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }
</script>

<button
    onclick={exportPacks}
    disabled={Object.keys(paintingsStore).length === 0}
    class="flex items-center gap-2 whitespace-nowrap rounded-full bg-black px-6 py-3 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-gray-900 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 sm:gap-3 sm:px-10 sm:py-4 sm:text-lg"
>
    <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
    </svg>
    Export
</button>
