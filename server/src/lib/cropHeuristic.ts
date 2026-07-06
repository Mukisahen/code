import sharp from 'sharp'

const SAMPLE_SIZE = 32
const VEGETATION_RATIO_THRESHOLD = 0.18

/**
 * Crude color-histogram gate to reject "obviously not a plant" photos before
 * running the (also simulated) diagnosis pool. This is a placeholder for a
 * real computer-vision model — see README "Known limitations".
 */
export async function looksLikeCropPhoto(imageBuffer: Buffer): Promise<boolean> {
  const { data, info } = await sharp(imageBuffer)
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const channels = info.channels
  let matching = 0
  const totalPixels = data.length / channels

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const isGreenish = g > r * 1.05 && g > b * 1.05 && g > 40
    const isEarthyOrDryMaize = r > 90 && r > b * 1.15 && g > b * 1.3

    if (isGreenish || isEarthyOrDryMaize) matching += 1
  }

  return matching / totalPixels > VEGETATION_RATIO_THRESHOLD
}
