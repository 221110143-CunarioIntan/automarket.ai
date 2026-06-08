-- Create Brand enum
CREATE TYPE "Brand" AS ENUM (
    'DAIHATSU', 'DATSUN', 'HONDA', 'ISUZU', 'KAWASAKI', 'LEXUS',
    'MAZDA', 'MITSUBISHI', 'NISSAN', 'SUBARU', 'SUZUKI', 'TOYOTA',
    'YAMAHA', 'INFINITI', 'HINO',
    'HYUNDAI', 'KIA', 'SSANGYONG',
    'BYD', 'CHERY', 'DFSK', 'MAXUS', 'MG', 'WULING',
    'AUDI', 'BMW', 'MERCEDES_BENZ', 'MINI', 'PORSCHE', 'VOLKSWAGEN',
    'JAGUAR', 'LAND_ROVER', 'RANGE_ROVER', 'TRIUMPH',
    'CHEVROLET', 'CHRYSLER', 'FORD', 'HARLEY_DAVIDSON', 'JEEP', 'TESLA',
    'DUCATI', 'FERRARI', 'LAMBORGHINI', 'PIAGGIO', 'VESPA',
    'CITROEN', 'PEUGEOT', 'RENAULT',
    'ROYAL_ENFIELD', 'TVS',
    'VOLVO',
    'KTM',
    'KYMCO',
    'BENELLI'
);

-- Convert vehicles.brand from TEXT to Brand enum
-- Safe to run on empty table (migrate reset clears data before this runs)
ALTER TABLE "vehicles" ALTER COLUMN "brand" TYPE "Brand" USING brand::"Brand";

-- Add index for brand filter queries
CREATE INDEX "vehicles_brand_idx" ON "vehicles"("brand");
