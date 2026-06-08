export const formatCurrency = (n) =>
    `Rp. ${new Intl.NumberFormat("id-ID").format(n)},-`;

export const fuelLabel = (f) => (f === "Gasoline" ? "Bensin" : f);

export const txLabel = (t) => {
    if (t === "Manual") return "MT";
    if (t === "Automatic") return "AT";
    return t;
};
