<script lang="ts">
</script>

<div class="min-h-full bg-white">
    <main class="mx-auto max-w-3xl px-6 py-16">
        <h1 class="text-3xl font-bold text-gray-900">Guide</h1>
        <p class="mt-3 text-lg text-gray-600">Learn how to create and install custom Minecraft paintings.</p>

        <div class="mt-8 aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/m65MRgwcaLI"
                title="Infinite Paintings Tutorial"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            ></iframe>
        </div>

        <div class="mt-12 space-y-12">
            <section>
                <h2 class="text-xl font-semibold text-gray-900">What this tool does</h2>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    This tool lets you create custom Minecraft paintings from your own images.
                </p>
                <p class="mt-3 text-gray-600 leading-relaxed">
                    It is designed for <strong>Minecraft 1.21 and later</strong>, which introduced a new datapack-based system for defining custom painting variants.
                    With this system, you can add new paintings with custom sizes, up to 16×16 blocks, without replacing any existing Minecraft paintings.
                </p>
                <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="text-sm font-medium text-gray-900 mb-2">The tool handles:</p>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Image upload</li>
                        <li>• Cropping to valid painting dimensions</li>
                        <li>• Generating a ready-to-use datapack</li>
                        <li>• Generating the associated resource pack for textures</li>
                    </ul>
                </div>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Why this requires Minecraft 1.21+</h2>
                
                <div class="mt-4 space-y-6">
                    <div>
                        <h3 class="text-base font-medium text-gray-900">Before 1.21 (old system)</h3>
                        <p class="mt-2 text-gray-600 leading-relaxed">
                            Before Minecraft 1.21, it was not possible to add new paintings.
                        </p>
                        <p class="mt-2 text-gray-600 leading-relaxed">To use custom images, players had to:</p>
                        <ul class="mt-2 text-gray-600 space-y-1">
                            <li>• Create a resource pack</li>
                            <li>• Replace textures of existing Minecraft paintings</li>
                            <li>• Lose the original paintings in the process</li>
                            <li>• Coordinate resource packs manually on servers</li>
                        </ul>
                        <p class="mt-3 text-gray-600 leading-relaxed">
                            This worked, but it was a hack, not a real feature.
                        </p>
                        <div class="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <p class="text-sm text-amber-800">
                                If you are playing Minecraft 1.20 or earlier, you should use a tool designed for that system, such as:
                                <a href="https://www.mcpaintings.com/" target="_blank" rel="noopener noreferrer" class="underline font-medium hover:text-amber-900">mcpaintings.com</a>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-base font-medium text-gray-900">Since 1.21 (new system)</h3>
                        <p class="mt-2 text-gray-600 leading-relaxed">
                            Minecraft 1.21 introduced painting variants via datapacks.
                        </p>
                        <p class="mt-2 text-gray-600 leading-relaxed">This means:</p>
                        <ul class="mt-2 text-gray-600 space-y-1">
                            <li>• You can add new paintings instead of replacing old ones</li>
                            <li>• Paintings can have custom dimensions (up to 16×16)</li>
                            <li>• Paintings are defined in datapacks</li>
                            <li>• Images are provided through a resource pack</li>
                        </ul>
                        <p class="mt-3 text-gray-600 leading-relaxed">
                            This tool is built specifically around this new system.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Installing custom paintings in a singleplayer world</h2>
                
                <ol class="mt-4 space-y-4">
                    <li class="flex gap-3">
                        <span class="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                        <p class="text-gray-600">Use this tool to generate your datapack and resource pack.</p>
                    </li>
                    <li class="flex gap-3">
                        <span class="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                        <div class="text-gray-600">
                            <p>Open your Minecraft world folder:</p>
                            <code class="mt-1 block text-sm bg-gray-100 px-3 py-2 rounded font-mono">.minecraft/saves/&lt;your_world&gt;/</code>
                        </div>
                    </li>
                    <li class="flex gap-3">
                        <span class="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                        <div class="text-gray-600">
                            <p>Copy the generated datapack into:</p>
                            <code class="mt-1 block text-sm bg-gray-100 px-3 py-2 rounded font-mono">datapacks/</code>
                        </div>
                    </li>
                    <li class="flex gap-3">
                        <span class="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                        <div class="text-gray-600">
                            <p>Copy the generated resource pack into:</p>
                            <code class="mt-1 block text-sm bg-gray-100 px-3 py-2 rounded font-mono">.minecraft/resourcepacks/</code>
                        </div>
                    </li>
                    <li class="flex gap-3">
                        <span class="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
                        <p class="text-gray-600">Launch Minecraft and open your world.</p>
                    </li>
                    <li class="flex gap-3">
                        <span class="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">6</span>
                        <p class="text-gray-600">In <strong>Options → Resource Packs</strong>, enable the generated resource pack.</p>
                    </li>
                    <li class="flex gap-3">
                        <span class="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">7</span>
                        <div class="text-gray-600">
                            <p>Run <code class="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">/reload</code> or rejoin the world.</p>
                        </div>
                    </li>
                </ol>
                
                <p class="mt-4 text-gray-600">Your custom paintings will now be available in-game.</p>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Installing custom paintings on a server</h2>
                
                <div class="mt-4 space-y-6">
                    <div>
                        <h3 class="text-base font-medium text-gray-900">Step 1: Add the datapack</h3>
                        <ol class="mt-3 space-y-2 text-gray-600">
                            <li>1. Stop your server.</li>
                            <li>2. Open your world folder on the server.</li>
                            <li>
                                3. Copy the generated datapack into:
                                <code class="mt-1 block text-sm bg-gray-100 px-3 py-2 rounded font-mono">&lt;world_name&gt;/datapacks/</code>
                            </li>
                            <li>4. Start the server or run <code class="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">/reload</code>.</li>
                        </ol>
                    </div>

                    <div>
                        <h3 class="text-base font-medium text-gray-900">Step 2: Host the resource pack</h3>
                        <p class="mt-2 text-gray-600 leading-relaxed">
                            Minecraft servers cannot directly store resource packs for clients. You must host the resource pack online.
                        </p>
                        <p class="mt-3 text-gray-600">Common options:</p>
                        <ul class="mt-2 text-gray-600 space-y-1">
                            <li>• Dropbox</li>
                            <li>• GitHub Releases</li>
                            <li>• Any static file hosting</li>
                        </ul>
                        <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p class="text-sm text-blue-800">
                                <strong>Important:</strong> The file must be publicly accessible and the download link must point directly to the ZIP file.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-base font-medium text-gray-900">Step 3: Configure server.properties</h3>
                        <p class="mt-2 text-gray-600">In your <code class="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">server.properties</code> file, add or update:</p>
                        <code class="mt-2 block text-sm bg-gray-100 px-3 py-2 rounded font-mono">resource-pack=&lt;direct_download_url&gt;</code>
                        
                        <p class="mt-4 text-gray-600">To force all players to use the resource pack (recommended), also add:</p>
                        <code class="mt-2 block text-sm bg-gray-100 px-3 py-2 rounded font-mono">require-resource-pack=true</code>
                        
                        <p class="mt-4 text-gray-600">Then restart the server.</p>
                        
                        <p class="mt-3 text-gray-600">When players join, Minecraft will automatically download the resource pack and custom paintings will render correctly for everyone.</p>
                    </div>
                </div>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Painting options explained</h2>

                <div class="mt-4 space-y-6">
                    <div>
                        <h3 class="text-base font-medium text-gray-900">Title</h3>
                        <p class="mt-2 text-gray-600 leading-relaxed">
                            The title is displayed on the painting item in your inventory. It helps you identify your paintings, especially when you have many.
                        </p>
                        <p class="mt-2 text-gray-600 leading-relaxed">
                            In Creative mode, you can search for a painting by its title in the search bar, making it easy to find specific paintings.
                        </p>
                        <p class="mt-2 text-gray-600 leading-relaxed">
                            If left empty, no title will be shown on the item.
                        </p>
                    </div>

                    <div>
                        <h3 class="text-base font-medium text-gray-900">Placeable in Survival</h3>
                        <p class="mt-2 text-gray-600 leading-relaxed">
                            This option controls whether the painting can appear when placing paintings in Survival mode.
                        </p>
                        <ul class="mt-2 text-gray-600 space-y-1">
                            <li>• <strong>Enabled:</strong> The painting can randomly appear when placing a painting in Survival or Creative mode.</li>
                            <li>• <strong>Disabled:</strong> The painting can only be placed using the specific painting item in Creative mode.</li>
                        </ul>
                        <p class="mt-3 text-gray-600 leading-relaxed">
                            Disabling this is useful for special paintings you want to keep exclusive, or for very large paintings that shouldn't randomly appear.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 class="text-xl font-semibold text-gray-900">Notes & limitations</h2>
                <ul class="mt-4 space-y-2 text-gray-600">
                    <li>• Maximum painting size is 16×16 blocks (Minecraft limitation)</li>
                    <li>• All players must use the resource pack to see the paintings correctly</li>
                    <li>• Datapacks control what exists, resource packs control how it looks</li>
                </ul>
            </section>
        </div>

        <div class="mt-16 pt-8 border-t border-gray-200">
            <a href="/create" class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors">
                Start Creating
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </div>
    </main>
</div>
