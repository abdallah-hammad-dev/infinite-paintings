<script lang="ts">
    import { paintingsStore } from "$lib/paintingsStore.svelte";
    import JSZip from "jszip";

    const NAMESPACE = "infinite-paintings";

    async function exportPacks() {
        const paintings = Object.values(paintingsStore);
        if (paintings.length === 0) return;

        const datapack = new JSZip();

        datapack.file("pack.mcmeta", JSON.stringify({
            pack: {
                description: "Infinite Paintings - Custom paintings data pack",
                pack_format: 48,
                supported_formats: {
                    min_inclusive: 48,
                    max_inclusive: 80
                }
            }
        }, null, 2));

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

        resourcepack.file("pack.mcmeta", JSON.stringify({
            pack: {
                description: "Infinite Paintings - Custom paintings resource pack",
                pack_format: 34,
                supported_formats: {
                    min_inclusive: 34,
                    max_inclusive: 63
                }
            }
        }, null, 2));

        for (const painting of paintings) {
            const base64Data = painting.croppedImage.split(',')[1];
            resourcepack.file(
                `assets/${NAMESPACE}/textures/painting/${painting.id}.png`,
                base64Data,
                { base64: true }
            );
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
    class="flex items-center gap-3 rounded-full bg-black px-10 py-4 text-lg font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-gray-900 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
>
    <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
    </svg>
    Export
</button>
