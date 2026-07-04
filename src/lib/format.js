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

export const formatRelativeTime = (dateString) => {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
    return new Date(dateString).toLocaleDateString("id-ID");
};
