<script lang="ts">
</script>

<div class="min-h-full bg-white">
    <main class="mx-auto max-w-3xl px-6 py-16">
        <h1 class="text-3xl font-bold text-gray-900">About</h1>
        <p class="mt-3 text-lg text-gray-600">Learn about Infinite Paintings and how it works.</p>

        <div class="mt-12 space-y-12">
            <section>
                <h2 class="text-xl font-semibold text-gray-900">What is Infinite Paintings?</h2>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    Infinite Paintings is a free, open-source web tool that lets you create custom Minecraft paintings of any size (from 1×1 up to 16×16 blocks) from your own images.
                </p>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    Unlike older methods that required replacing existing Minecraft paintings, this tool leverages the new painting variant system introduced in Minecraft 1.21, allowing you to add unlimited new paintings without losing any of the originals.
                </p>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">How it works</h2>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    The tool generates two files for you:
                </p>
                <ul class="mt-3 text-gray-600 space-y-2">
                    <li><strong>Datapack</strong> — Defines the painting variants (dimensions, placement rules, etc.)</li>
                    <li><strong>Resource pack</strong> — Contains the actual image textures for your paintings</li>
                </ul>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    This approach uses Minecraft 1.21's native painting variant system with datapacks and texture packs, making it possible to add any number of paintings with any size up to 16×16 blocks.
                </p>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Privacy & Security</h2>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    <strong>Your images never leave your browser.</strong> Everything is processed locally using base64 encoding. No images are uploaded, stored, or sent to any server.
                </p>
                <div class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p class="text-sm text-green-800">
                        All image manipulation happens entirely in your browser. Your privacy is guaranteed.
                    </p>
                </div>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Technical Details</h2>
                <div class="mt-4 space-y-3">
                    <div>
                        <h3 class="text-base font-medium text-gray-900">Built with</h3>
                        <ul class="mt-2 text-gray-600 space-y-1">
                            <li>• <strong>SvelteKit</strong> — Modern web framework</li>
                            <li>• <strong>@sveltejs/adapter-static</strong> — Static site generation</li>
                            <li>• <strong>Cropper.js 2.0</strong> — Image cropping functionality</li>
                            <li>• <strong>JSZip</strong> — ZIP file generation</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-base font-medium text-gray-900">Hosting & Analytics</h3>
                        <ul class="mt-2 text-gray-600 space-y-1">
                            <li>• Hosted on <strong>Cloudflare Pages</strong> for fast, global distribution</li>
                            <li>• Uses <strong>Cloudflare Web Analytics</strong> (privacy-focused, no cookies or personal data tracking)</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-base font-medium text-gray-900">No Backend</h3>
                        <p class="mt-2 text-gray-600 leading-relaxed">
                            This is a fully static site with no server-side processing. Everything runs in your browser, making it fast, secure, and privacy-friendly.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Why Minecraft 1.21?</h2>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    Before Minecraft 1.21, custom paintings could only be added by replacing existing ones using resource packs. This was limiting and meant losing the original paintings.
                </p>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    Minecraft 1.21 introduced a new datapack-based painting variant system that allows you to:
                </p>
                <ul class="mt-3 text-gray-600 space-y-1">
                    <li>• Add unlimited new paintings without replacing vanilla ones</li>
                    <li>• Create paintings in any size from 1×1 to 16×16 blocks</li>
                    <li>• Define custom placement rules and metadata</li>
                </ul>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    This tool is built specifically for this new system, making it the easiest way to create custom paintings in modern Minecraft.
                </p>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Open Source</h2>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    Infinite Paintings is free and open source. You can view the source code, report issues, or contribute on GitHub:
                </p>
                <a
                    href="https://github.com/abdallah-hammad-dev/infinite-paintings"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-4 inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium"
                >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                    View on GitHub
                </a>
            </section>
        </div>

        <div class="mt-16 pt-8 border-t border-gray-200 flex gap-4">
            <a href="/create" class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors">
                Start Creating
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
            <a href="/guide" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Read the Guide
            </a>
        </div>
    </main>
</div>
