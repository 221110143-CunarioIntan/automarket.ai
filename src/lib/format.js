export const formatCurrency = (n) =>
    `Rp. ${new Intl.NumberFormat("id-ID").format(Number(n))},-`;

export const fuelLabel = (f) => (f === "Gasoline" ? "Bensin" : f);

export const txLabel = (t) => {
    if (t === "Manual") return "MT";
    if (t === "Automatic") return "AT";
    return t;
};

const BRAND_DISPLAY = {
    // Japanese
    DAIHATSU: "Daihatsu",
    DATSUN: "Datsun",
    HONDA: "Honda",
    ISUZU: "Isuzu",
    KAWASAKI: "Kawasaki",
    LEXUS: "Lexus",
    MAZDA: "Mazda",
    MITSUBISHI: "Mitsubishi",
    NISSAN: "Nissan",
    SUBARU: "Subaru",
    SUZUKI: "Suzuki",
    TOYOTA: "Toyota",
    YAMAHA: "Yamaha",
    INFINITI: "Infiniti",
    HINO: "Hino",

    // Korean
    HYUNDAI: "Hyundai",
    KIA: "KIA",
    SSANGYONG: "SsangYong",

    // Chinese
    BYD: "BYD",
    CHERY: "Chery",
    DFSK: "DFSK",
    MAXUS: "Maxus",
    MG: "MG",
    WULING: "Wuling",

    // German
    AUDI: "Audi",
    BMW: "BMW",
    MERCEDES_BENZ: "Mercedes-Benz",
    MINI: "MINI",
    PORSCHE: "Porsche",
    VOLKSWAGEN: "Volkswagen",

    // British
    JAGUAR: "Jaguar",
    LAND_ROVER: "Land Rover",
    RANGE_ROVER: "Range Rover",
    TRIUMPH: "Triumph",

    // American
    CHEVROLET: "Chevrolet",
    CHRYSLER: "Chrysler",
    FORD: "Ford",
    HARLEY_DAVIDSON: "Harley-Davidson",
    JEEP: "Jeep",
    TESLA: "Tesla",

    // Italian
    DUCATI: "Ducati",
    FERRARI: "Ferrari",
    LAMBORGHINI: "Lamborghini",
    PIAGGIO: "Piaggio",
    VESPA: "Vespa",

    // French
    CITROEN: "Citroën",
    PEUGEOT: "Peugeot",
    RENAULT: "Renault",

    // Indian
    ROYAL_ENFIELD: "Royal Enfield",
    TVS: "TVS",

    // Other
    BENELLI: "Benelli",
    KTM: "KTM",
    KYMCO: "Kymco",
    VOLVO: "Volvo",
};

export const formatBrand = (raw) => BRAND_DISPLAY[raw] ?? raw;
