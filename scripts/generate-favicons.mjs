/**
 * Generate PNG favicons from SVG source
 * Run: node scripts/generate-favicons.mjs
 * 
 * Requires: npm install sharp
 */

import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

// New AI Agent Guide favicon design - agent hub with 4 directional connections
const lightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="28" fill="none" stroke="#171717" stroke-width="4"/>
  <line x1="32" y1="32" x2="32" y2="14" stroke="#171717" stroke-width="4" stroke-linecap="round"/>
  <line x1="32" y1="32" x2="50" y2="32" stroke="#171717" stroke-width="4" stroke-linecap="round"/>
  <line x1="32" y1="32" x2="32" y2="50" stroke="#171717" stroke-width="4" stroke-linecap="round"/>
  <line x1="32" y1="32" x2="14" y2="32" stroke="#171717" stroke-width="4" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="6" fill="#171717"/>
  <circle cx="32" cy="14" r="4" fill="#171717"/>
  <circle cx="50" cy="32" r="4" fill="#171717"/>
  <circle cx="32" cy="50" r="4" fill="#171717"/>
  <circle cx="14" cy="32" r="4" fill="#171717"/>
</svg>`

const darkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="28" fill="none" stroke="#fafafa" stroke-width="4"/>
  <line x1="32" y1="32" x2="32" y2="14" stroke="#fafafa" stroke-width="4" stroke-linecap="round"/>
  <line x1="32" y1="32" x2="50" y2="32" stroke="#fafafa" stroke-width="4" stroke-linecap="round"/>
  <line x1="32" y1="32" x2="32" y2="50" stroke="#fafafa" stroke-width="4" stroke-linecap="round"/>
  <line x1="32" y1="32" x2="14" y2="32" stroke="#fafafa" stroke-width="4" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="6" fill="#fafafa"/>
  <circle cx="32" cy="14" r="4" fill="#fafafa"/>
  <circle cx="50" cy="32" r="4" fill="#fafafa"/>
  <circle cx="32" cy="50" r="4" fill="#fafafa"/>
  <circle cx="14" cy="32" r="4" fill="#fafafa"/>
</svg>`

const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="40" fill="#fafafa"/>
  <g transform="translate(26, 26) scale(2)">
    <circle cx="32" cy="32" r="28" fill="none" stroke="#171717" stroke-width="4"/>
    <line x1="32" y1="32" x2="32" y2="14" stroke="#171717" stroke-width="4" stroke-linecap="round"/>
    <line x1="32" y1="32" x2="50" y2="32" stroke="#171717" stroke-width="4" stroke-linecap="round"/>
    <line x1="32" y1="32" x2="32" y2="50" stroke="#171717" stroke-width="4" stroke-linecap="round"/>
    <line x1="32" y1="32" x2="14" y2="32" stroke="#171717" stroke-width="4" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="6" fill="#171717"/>
    <circle cx="32" cy="14" r="4" fill="#171717"/>
    <circle cx="50" cy="32" r="4" fill="#171717"/>
    <circle cx="32" cy="50" r="4" fill="#171717"/>
    <circle cx="14" cy="32" r="4" fill="#171717"/>
  </g>
</svg>`

async function generateFavicons() {
  console.log('Generating PNG favicons...')

  // Generate light mode favicons
  await sharp(Buffer.from(lightSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'))
  console.log('✓ favicon-32x32.png')

  await sharp(Buffer.from(lightSvg))
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'))
  console.log('✓ favicon-16x16.png')

  await sharp(Buffer.from(lightSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'icon-light-32x32.png'))
  console.log('✓ icon-light-32x32.png')

  // Generate dark mode favicon
  await sharp(Buffer.from(darkSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'icon-dark-32x32.png'))
  console.log('✓ icon-dark-32x32.png')

  // Generate Apple touch icon
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))
  console.log('✓ apple-touch-icon.png')

  // Also update apple-icon.png
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-icon.png'))
  console.log('✓ apple-icon.png')

  console.log('\nDone! All favicons generated.')
}

generateFavicons().catch(console.error)
