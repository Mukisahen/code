import sharp from 'sharp'

const SAMPLE_SIZE = 32
const VEGETATION_RATIO_THRESHOLD = 0.32

/**
 * Crude color-histogram gate to reject "obviously not a plant" photos before
 * running the (also simulated) diagnosis pool. This is a placeholder for a
 * real computer-vision model — see README "Known limitations".
 *
 * The "dry maize" branch previously matched r > b*1.15 && g > b*1.3 with no
 * floor on g or constraint between r and g — that's satisfied by most warm
 * brownish colors (skin tones, wood, dirt, tan walls), so everyday photos
 * were passing the gate. Dry maize is a fairly saturated gold where red and
 * green sit close together and both clear blue by a wide margin; skin/wood
 * tend to have red well ahead of green instead. Tightened both branches and
 * raised the pass threshold so a photo needs to be plant-or-grain-colored
 * across a clear majority of its pixels, not just a third or so.
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

    const isGreenish = g > r * 1.08 && g > b * 1.08 && g > 50
    const isGoldenDryMaize = r > 120 && g > 100 && r > b * 1.5 && g > b * 1.5 && Math.abs(r - g) < r * 0.22

    if (isGreenish || isGoldenDryMaize) matching += 1
  }

  return matching / totalPixels > VEGETATION_RATIO_THRESHOLD
}
