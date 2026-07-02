import { compressToWebP } from "./imageCompression";
import { supabase } from "./supabase";

const BUCKET = "vehicle-images";

export const getSortedImages = (vehicle) => {
    const images = vehicle?.vehicle_images;
    if (!images?.length) return [];
    return [...images].sort((a, b) => a.order - b.order);
};

export const getFirstImageUrl = (vehicle) => {
    const images = getSortedImages(vehicle);
    return images[0]?.webp_url ?? null;
};

const getExt = (filename, mime) => {
    const fromName = filename?.split(".").pop()?.toLowerCase();
    if (fromName && /^(jpe?g|png|webp)$/.test(fromName)) return fromName;
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/png") return "png";
    if (mime === "image/webp") return "webp";
    return "jpg";
};

const publicUrl = (path) =>
    supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

export const uploadVehicleImage = async (vehicleId, file, order) => {
    const imageUuid = crypto.randomUUID();
    const ext = getExt(file.name, file.type);

    const webpBlob = await compressToWebP(file);

    const originalPath = `originals/${vehicleId}/${imageUuid}.${ext}`;
    const { error: origErr } = await supabase.storage
        .from(BUCKET)
        .upload(originalPath, file, {
            contentType: file.type || `image/${ext}`,
        });
    if (origErr) throw new Error(`Upload original gagal: ${origErr.message}`);

    const webpPath = `webps/${vehicleId}/${imageUuid}.webp`;
    const { error: webpErr } = await supabase.storage
        .from(BUCKET)
        .upload(webpPath, webpBlob, { contentType: "image/webp" });
    if (webpErr) throw new Error(`Upload WebP gagal: ${webpErr.message}`);

    const { error: rowErr } = await supabase.from("vehicle_images").insert({
        vehicle_id: vehicleId,
        order,
        original_url: publicUrl(originalPath),
        webp_url: publicUrl(webpPath),
        original_size_bytes: file.size,
        webp_size_bytes: webpBlob.size,
        mime_type: file.type || null,
    });
    if (rowErr) throw new Error(`Insert row gagal: ${rowErr.message}`);
};

export const uploadVehicleImages = async (vehicleId, items) => {
    await Promise.all(
        items.map((item, i) => uploadVehicleImage(vehicleId, item.file, i)),
    );
};
