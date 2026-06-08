import { LuCar } from "react-icons/lu";
import { fuelLabel, txLabel } from "@/lib/format";
import VehicleCard from "./VehicleCard";

const CarCard = ({ car }) => (
    <VehicleCard
        title={`${car.brand} ${car.model}`}
        year={car.year}
        price={car.price_cash}
        icon={<LuCar className="h-12 w-12 text-slate-400" />}
        pills={[
            car.body_type,
            fuelLabel(car.fuel),
            txLabel(car.transmission),
        ]}
    />
);

export default CarCard;
