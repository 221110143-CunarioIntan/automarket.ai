import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = resolve(__dirname, "../raw");
const OUT = resolve(__dirname, "../../src/data");

const readCsv = (path) =>
    parse(readFileSync(path, "utf-8"), {
        columns: true,
        skip_empty_lines: true,
        skip_records_with_error: true,
        trim: true,
    });

const writeJson = (path, data) =>
    writeFileSync(path, JSON.stringify(data, null, 4) + "\n");

const nullish = (v) => v === "NULL" || v === "" || v == null;

const processCars = () => {
    const rows = readCsv(resolve(RAW, "used_car_data_new.csv"));

    return rows.map((row, i) => ({
        id: `car-${i + 1}`,
        brand: row.id_merk,
        model: row.type,
        body_type: row.model,
        color: row.color,
        year: Number(row.year),
        transmission: row.id_transmission === "1" ? "Manual" : "Automatic",
        fuel: row.id_fuel_type,
        doors: Number(row.door),
        engine_cc: Number(row.cylinder_size),
        cylinders: Number(row.cylinder_total),
        turbo: row.turbo === "1",
        mileage: Number(row.mileage),
        price_cash: Number(row.price_cash),
        price_credit: Number(row.price_credit),
        location: row.showroom_regency,
        showroom: row.showroom_name,
    }));
};

const processMotors = () => {
    const rows = readCsv(resolve(RAW, "motor_second.csv"));

    return rows.map((row, i) => ({
        id: `motor-${i + 1}`,
        brand: "Honda",
        model: row.model,
        year: Number(row.tahun),
        price: Number(row.harga) * 1000,
        transmission: row.transmisi,
        mileage: Number(row.odometer),
        body_type: row.jenis,
        tax: nullish(row.pajak) ? null : Number(row.pajak) * 1000,
        fuel_consumption: Number(row.konsumsiBBM),
        engine_cc: Number(row.mesin),
    }));
};

const cars = processCars();
const motors = processMotors();

writeJson(resolve(OUT, "cars.json"), cars);
writeJson(resolve(OUT, "motors.json"), motors);

console.log(`✓ cars.json    ${cars.length} entries`);
console.log(`✓ motors.json  ${motors.length} entries`);
console.log(`\nSample car:`);
console.log(JSON.stringify(cars[0], null, 4));
console.log(`\nSample motor:`);
console.log(JSON.stringify(motors[0], null, 4));
