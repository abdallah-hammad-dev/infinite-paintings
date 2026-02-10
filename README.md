# Infinite Paintings

A free, open-source web tool for creating custom Minecraft paintings of any size (1×1 to 16×16 blocks) from your own images.

🎨 **[Try it now](https://infinite-paintings.pages.dev)**

## Features

- **Any size**: Create paintings from 1×1 up to 16×16 blocks
- **Unlimited paintings**: Add as many as you want without replacing vanilla paintings
- **Privacy-first**: All processing happens in your browser — no uploads, no tracking
- **Minecraft 1.21+**: Uses the new painting variant system with datapacks
- **No backend**: Fully static site, fast and secure

## How it works

This tool generates two files:

1. **Datapack** — Defines painting variants (dimensions, placement rules)
2. **Resource pack** — Contains the image textures

Unlike older methods that replaced existing paintings, this uses Minecraft 1.21's native painting variant system, allowing you to add unlimited paintings without losing the originals.

## Why Minecraft 1.21?

Before 1.21, custom paintings required replacing existing ones using resource packs. Minecraft 1.21 introduced a datapack-based painting variant system that lets you:

- Add new paintings without replacing vanilla ones
- Create paintings in any size (1×1 to 16×16)
- Define custom placement rules

## Privacy & Security

**Your images never leave your browser.** All image manipulation is done locally using base64 encoding. No images are uploaded, stored, or sent to any server.

## Technical Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Build**: Static site generation with `@sveltejs/adapter-static`
- **Dependencies**:
  - [Cropper.js 2.0](https://github.com/fengyuanchen/cropperjs) — Image cropping
  - [JSZip](https://stuk.github.io/jszip/) — ZIP file generation
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Analytics**: Cloudflare Web Analytics (privacy-focused, no cookies)

## Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tutorial

Watch the [video tutorial on YouTube](https://www.youtube.com/watch?v=m65MRgwcaLI) to see how to use Infinite Paintings.

## License

This project is open source. See the [LICENSE](LICENSE) file for details.

## Links

- **Website**: [infinite-paintings.pages.dev](https://infinite-paintings.pages.dev)
- **GitHub**: [abdallah-hammad-dev/infinite-paintings](https://github.com/abdallah-hammad-dev/infinite-paintings)
- **Tutorial**: [YouTube](https://www.youtube.com/watch?v=m65MRgwcaLI)
