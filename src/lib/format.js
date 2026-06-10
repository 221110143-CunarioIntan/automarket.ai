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
