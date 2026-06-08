import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
);

const ADMIN_EMAIL = "admin@automarket.ai";
const ADMIN_PASSWORD = "password123";

const USER_EMAIL = "user@automarket.ai";
const USER_PASSWORD = "user123";

// Map raw dataset brand strings → Brand enum values
const BRAND_ALIASES = {
    "Mercedes Benz": "MERCEDES_BENZ",
    "Mercedes-Benz": "MERCEDES_BENZ",
    VW: "VOLKSWAGEN",
    "Range Rover": "RANGE_ROVER",
    "Royal Enfield": "ROYAL_ENFIELD",
    "Harley Davidson": "HARLEY_DAVIDSON",
    "Land Rover": "LAND_ROVER",
};

const normalizeBrand = (raw) => {
    if (BRAND_ALIASES[raw]) return BRAND_ALIASES[raw];
    return raw.toUpperCase().replace(/[\s-]+/g, "_");
};

const readJson = (relative) =>
    JSON.parse(readFileSync(resolve(__dirname, relative), "utf-8"));

const upsertAuthUser = async (email, password) => {
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
    const found = existing.users.find((u) => u.email === email);

    if (found) {
        console.log(`Auth user ${email} already exists (id: ${found.id})`);
        return found.id;
    }

    // Clean orphan public.users row with same email so trigger can insert cleanly
    await prisma.user.deleteMany({ where: { email } });

    console.log(`Creating auth user ${email}...`);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });
    if (error) throw error;
    return data.user.id;
};

const seed = async () => {
    console.log("Cleaning vehicles...");
    await prisma.vehicle.deleteMany();

    const adminId = await upsertAuthUser(ADMIN_EMAIL, ADMIN_PASSWORD);
    const userId = await upsertAuthUser(USER_EMAIL, USER_PASSWORD);

    console.log("Ensuring profiles in public.users...");
    await prisma.user.upsert({
        where: { id: adminId },
        update: { role: "ADMIN", name: "Automarket Admin" },
        create: {
            id: adminId,
            email: ADMIN_EMAIL,
            name: "Automarket Admin",
            role: "ADMIN",
        },
    });
    await prisma.user.upsert({
        where: { id: userId },
        update: { role: "USER", name: "Demo User" },
        create: {
            id: userId,
            email: USER_EMAIL,
            name: "Demo User",
            role: "USER",
        },
    });

    console.log("Loading source data...");
    const cars = readJson("../src/data/cars.json");
    const motors = readJson("../src/data/motors.json");

    console.log(`Seeding ${cars.length} cars...`);
    await prisma.vehicle.createMany({
        data: cars.map((car) => ({
            userId: adminId,
            type: "CAR",
            brand: normalizeBrand(car.brand),
            model: car.model,
            year: car.year,
            priceCash: BigInt(car.price_cash),
            bodyType: car.body_type,
            color: car.color,
            transmission: car.transmission,
            fuel: car.fuel,
            mileage: car.mileage,
            location: car.location,
            engineCc: car.engine_cc,
            status: "APPROVED",
            approvedById: adminId,
            approvedAt: new Date(),
        })),
    });

    console.log(`Seeding ${motors.length} motors...`);
    await prisma.vehicle.createMany({
        data: motors.map((motor) => ({
            userId: adminId,
            type: "MOTOR",
            brand: normalizeBrand(motor.brand),
            model: motor.model,
            year: motor.year,
            priceCash: BigInt(motor.price),
            bodyType: motor.body_type,
            color: null,
            transmission: motor.transmission,
            fuel: null,
            mileage: motor.mileage,
            location: null,
            engineCc: motor.engine_cc,
            status: "APPROVED",
            approvedById: adminId,
            approvedAt: new Date(),
        })),
    });

    const total = await prisma.vehicle.count();
    console.log(`\n✓ Done. Total vehicles in DB: ${total}`);
    console.log(`✓ Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log(`✓ User:  ${USER_EMAIL} / ${USER_PASSWORD}`);
};

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
