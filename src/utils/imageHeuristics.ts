/**
 * Lightweight client-side heuristic that estimates whether a photo shows
 * vegetation/crop material (greenish leaves, or dry maize/soil tones) versus
 * something else entirely (people, documents, indoor scenes, etc). This is
 * not real computer vision — it's a stand-in until a trained model is wired
 * up on the backend — but it stops the AI Crop Doctor from confidently
 * "diagnosing" photos that clearly aren't crops.
 */
export async function looksLikeCropPhoto(file: File): Promise<boolean> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = dataUrl
  })

  const canvas = document.createElement('canvas')
  const size = 32
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return true

  ctx.drawImage(image, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  let vegetationLikePixels = 0
  const totalPixels = size * size

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const isGreenish = g > r * 1.05 && g > b * 1.05 && g > 40
    // Dry maize/cob and soil tones are more yellow than skin tones: green sits
    // well above blue (not just barely), which skin tones rarely do.
    const isEarthyOrDryMaize = r > 90 && r > b * 1.15 && g > b * 1.3

    if (isGreenish || isEarthyOrDryMaize) vegetationLikePixels++
  }

  const ratio = vegetationLikePixels / totalPixels
  return ratio > 0.18
}
