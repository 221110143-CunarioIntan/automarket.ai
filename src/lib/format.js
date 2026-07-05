import { BRAND_LABEL } from "./enums";

export const formatCurrency = (n) =>
    `Rp. ${new Intl.NumberFormat("id-ID").format(Number(n))},-`;

export const fuelLabel = (f) => (f === "Gasoline" ? "Bensin" : f);

export const txLabel = (t) => {
    if (t === "Manual") return "MT";
    if (t === "Automatic") return "AT";
    return t;
};

export const formatBrand = (raw) => BRAND_LABEL[raw] ?? raw;

// "0812..." / "+6281..." / "62812..." → "62812..." (wa.me-ready).
export const normalizeWhatsapp = (raw) => {
    if (!raw) return null;
    const digits = String(raw).replace(/\D/g, "");
    if (!digits) return null;
    if (digits.startsWith("62")) return digits;
    if (digits.startsWith("0")) return `62${digits.slice(1)}`;
    if (digits.startsWith("8")) return `62${digits}`;
    return digits;
};

// Force UTC — Postgres TIMESTAMP (no tz) omits Z, JS Date() would treat it as local.
const asUtcDate = (raw) => {
    if (!raw) return null;
    const hasTz = /Z|[+-]\d\d:?\d\d$/.test(raw);
    return new Date(hasTz ? raw : `${raw}Z`);
};

export const formatRelativeTime = (dateString) => {
    const date = asUtcDate(dateString);
    if (!date) return "";
    const diff = Math.max(0, (Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${Math.floor(diff)} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
    return date.toLocaleDateString("id-ID");
};
