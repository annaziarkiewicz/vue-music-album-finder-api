const fallbackVinylColors: [string, string] = [
    'rgb(80,80,80)',
    'rgb(60,60,60)'
]

export const useVinylColors = () => {
    const getVinylColors = (
        image: HTMLImageElement
    ): [string, string] => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) {
            return fallbackVinylColors
        }

        try {
            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight
            context.drawImage(image, 0, 0)

            const imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            ).data
            const colorBuckets: Record<string, number> = {}

            for (let index = 0; index < imageData.length; index += 40) {
                const red = Math.round(imageData[index] / 32) * 32
                const green = Math.round(imageData[index + 1] / 32) * 32
                const blue = Math.round(imageData[index + 2] / 32) * 32
                const color = `${red},${green},${blue}`

                colorBuckets[color] = (colorBuckets[color] || 0) + 1
            }

            const colors = Object.entries(colorBuckets)
                .sort((colorA, colorB) => colorB[1] - colorA[1])
                .slice(0, 2)
                .map(([color]) => `rgb(${color})`)

            return [
                colors[0] || fallbackVinylColors[0],
                colors[1] || colors[0] || fallbackVinylColors[1]
            ]
        } catch {
            return fallbackVinylColors
        }
    }

    return {
        getVinylColors
    }
}