// One-off generator for public/icons/*. Not part of the app build.
// Run with: npm i -D sharp && node scripts/generate-icons.mjs && npm uninstall sharp
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const iconSvg = readFileSync(new URL('./icon-source.svg', import.meta.url))
const maskableSvg = readFileSync(new URL('./icon-maskable-source.svg', import.meta.url))

const outDir = fileURLToPath(new URL('../public/icons/', import.meta.url))

async function render(svgBuffer, size, filename) {
  await sharp(svgBuffer, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(outDir + filename)
  console.log('wrote', filename)
}

await render(iconSvg, 192, 'icon-192.png')
await render(iconSvg, 512, 'icon-512.png')
await render(maskableSvg, 512, 'icon-512-maskable.png')
await render(iconSvg, 180, 'apple-touch-icon.png')
await render(iconSvg, 32, 'favicon-32.png')
