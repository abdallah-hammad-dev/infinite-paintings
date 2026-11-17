<script lang="ts">
    import { paintingsStore } from "$lib/paintingsStore.svelte";
    import { importPacks, type ImportResult } from "$lib/importPacks";

    let fileInput: HTMLInputElement;
    let importing = $state(false);
    let message = $state<{ text: string; error: boolean } | null>(null);
    let messageTimer: ReturnType<typeof setTimeout> | undefined;

    function showMessage(text: string, error: boolean) {
        clearTimeout(messageTimer);
        message = { text, error };
        messageTimer = setTimeout(() => (message = null), 8000);
    }

    async function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = [...(input.files ?? [])];
        input.value = "";
        if (files.length === 0 || importing) return;

        importing = true;
        try {
            const result = await importPacks(files, (id) => id in paintingsStore);
            for (const painting of result.paintings) paintingsStore[painting.id] = painting;
            const { text, error } = summarize(result);
            showMessage(text, error);
        } catch (error) {
            console.error("Couldn't import the packs.", error);
            showMessage("Couldn't read this file. Choose the .zip you exported from Infinite Paintings.", true);
        } finally {
            importing = false;
        }
    }

    function summarize({ paintings, alreadyInList, skipped }: ImportResult) {
        const count = (n: number) => `${n} painting${n === 1 ? "" : "s"}`;
        if (paintings.length + alreadyInList + skipped === 0) {
            return { text: "No paintings found in this file. Choose the .zip you exported from Infinite Paintings.", error: true };
        }
        const parts: string[] = [];
        if (paintings.length > 0) parts.push(`Imported ${count(paintings.length)}.`);
        if (alreadyInList > 0) parts.push(`${count(alreadyInList)} ${alreadyInList === 1 ? "was" : "were"} already in your list.`);
        if (skipped > 0) parts.push(`${count(skipped)} couldn't be imported because their texture or data is missing: choose the whole exported .zip, or both packs.`);
        return { text: parts.join(" "), error: paintings.length === 0 && skipped > 0 };
    }
</script>

<!-- Accepts the exported .zip, or its data pack and resource pack zips picked together. -->
<input
    type="file"
    accept=".zip,application/zip,application/x-zip-compressed"
    multiple
    bind:this={fileInput}
    onchange={handleFileSelect}
    class="hidden"
/>

<button
    onclick={() => fileInput.click()}
    disabled={importing}
    title="Import a .zip you exported before, to edit its paintings or add new ones"
    class="flex items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white p-3 text-base max-[360px]:p-2.5 font-semibold text-gray-900 shadow-2xl transition-all hover:scale-105 hover:bg-gray-50 active:scale-95 disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100 sm:gap-3 sm:px-10 sm:py-4 sm:text-lg"
>
    <svg class="h-5 w-5 sm:h-6 sm:w-6" class:animate-pulse={importing} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 8l5-5m0 0l5 5m-5-5v12" />
    </svg>
    <!-- Icon only on phones, where three labelled buttons don't fit side by side. -->
    <span class="sr-only sm:not-sr-only">{importing ? "Importing…" : "Import"}</span>
</button>

<!-- Fixed to the screen like the button bar, just above it. -->
<div aria-live="polite" class="fixed inset-x-4 bottom-22 mx-auto max-w-md sm:bottom-28">
    {#if message}
        <div class="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg {message.error ? 'border-red-200 bg-red-50 text-red-800' : 'border-gray-200 bg-white text-gray-800'}">
            <p class="flex-1">{message.text}</p>
            <button onclick={() => (message = null)} aria-label="Dismiss" class="shrink-0 text-gray-400 hover:text-gray-600">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    {/if}
</div>
