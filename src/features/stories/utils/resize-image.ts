export const MAX_STORY_WIDTH = 1080
export const MAX_STORY_HEIGHT = 1920

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    image.src = url
  })
}

function scaledDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const scale = Math.min(1, maxWidth / width, maxHeight / height)
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function canvasToDataUrl(canvas: HTMLCanvasElement, mimeType: string): string {
  const preferred =
    mimeType === 'image/png' || mimeType === 'image/webp' ? mimeType : 'image/jpeg'
  const quality = preferred === 'image/jpeg' ? 0.92 : undefined
  return canvas.toDataURL(preferred, quality)
}

/** Resize an image file to fit within 1080×1920 and return a base64 data URL. */
export async function fileToConstrainedBase64(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file')
  }

  const image = await loadImageFromFile(file)
  const { width, height } = scaledDimensions(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    MAX_STORY_WIDTH,
    MAX_STORY_HEIGHT,
  )

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not process image')
  }

  context.drawImage(image, 0, 0, width, height)
  return canvasToDataUrl(canvas, file.type)
}
