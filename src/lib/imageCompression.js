const DEFAULT_MAX_DIM = 1920;
const DEFAULT_MAX_BYTES = 500 * 1024;

export const compressToWebP = async (
    file,
    {
        maxDim = DEFAULT_MAX_DIM,
        maxBytes = DEFAULT_MAX_BYTES,
        initialQuality = 0.85,
    } = {},
) => {
    const bitmap = await createImageBitmap(file);

    const ratio = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * ratio);
    const height = Math.round(bitmap.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    let quality = initialQuality;
    let blob = await canvasToBlob(canvas, "image/webp", quality);
    while (blob.size > maxBytes && quality > 0.4) {
        quality -= 0.1;
        blob = await canvasToBlob(canvas, "image/webp", quality);
    }
    return blob;
};

const canvasToBlob = (canvas, type, quality) =>
    new Promise((resolve, reject) => {
        canvas.toBlob(
            (b) =>
                b ? resolve(b) : reject(new Error("Canvas blob conversion failed")),
            type,
            quality,
        );
    });
