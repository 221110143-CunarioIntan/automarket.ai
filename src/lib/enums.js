// Single source of truth for shared constants on the frontend.
// MIRROR Prisma enums from prisma/schema.prisma whenever you change the backend.
//
// Naming pattern per enum / constant set:
//   - X            → enum-like value object (use as constants, e.g. AD_STATUS.PENDING)
//   - X_LABEL      → user-facing display label (Indonesian where relevant)
//   - X_COLOR      → Badge component color name
//   - X_OPTIONS    → Select component options [{ value, label }]

const toOptions = (labelMap) =>
    Object.entries(labelMap).map(([value, label]) => ({ value, label }));

// ===== Role (Prisma enum) =====
export const ROLE = {
    USER: "USER",
    ADMIN: "ADMIN",
};

// ===== VehicleType (Prisma enum) =====
export const VEHICLE_TYPE = {
    CAR: "CAR",
    MOTOR: "MOTOR",
};

export const VEHICLE_TYPE_LABEL = {
    CAR: "Mobil",
    MOTOR: "Motor",
};

export const VEHICLE_TYPE_OPTIONS = toOptions(VEHICLE_TYPE_LABEL);

// ===== AdStatus (Prisma enum) =====
export const AD_STATUS = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    TAKEN_DOWN: "TAKEN_DOWN",
};

export const AD_STATUS_COLOR = {
    PENDING: "yellow",
    APPROVED: "green",
    REJECTED: "red",
    TAKEN_DOWN: "orange",
};

export const AD_STATUS_LABEL = {
    PENDING: "Menunggu Persetujuan",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
    TAKEN_DOWN: "Iklan Ditutup",
};

export const AD_STATUS_OPTIONS = toOptions({
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    TAKEN_DOWN: "Taken Down",
});

// ===== Brand (Prisma enum — 54 brands) =====
export const BRAND_LABEL = {
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

export const BRAND_OPTIONS = toOptions(BRAND_LABEL);

// ===== FE-only shared option lists (not Prisma enums but shared across pages) =====

export const CAR_BODY_OPTIONS = toOptions({
    SUV: "SUV",
    MPV: "MPV",
    Sedan: "Sedan",
    Hatchback: "Hatchback",
    Pickup: "Pickup",
    Van: "Van",
    Coupe: "Coupe",
    Convertible: "Convertible",
    MINIBUS: "MINIBUS",
    JEEP: "JEEP",
});

export const MOTOR_BODY_OPTIONS = toOptions({
    Bebek: "Bebek",
    Skuter: "Skuter",
    Sport: "Sport",
    Trail: "Trail",
    Naked: "Naked",
    Cruiser: "Cruiser",
});

export const TRANSMISSION_OPTIONS = toOptions({
    Manual: "Manual",
    Automatic: "Automatic",
    Kopling: "Kopling",
});

export const FUEL_OPTIONS = toOptions({
    Gasoline: "Gasoline",
    Diesel: "Diesel",
    Electric: "Electric",
    Hybrid: "Hybrid",
});
