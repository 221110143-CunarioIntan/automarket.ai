import { Link } from "react-router-dom";
import { LuCar } from "react-icons/lu";
import { formatBrand, fuelLabel, txLabel } from "@/lib/format";
import { getFirstImageUrl } from "@/lib/vehicleImages";
import VehicleCard from "./VehicleCard";

const CarCard = ({ car }) => (
    <Link to={`/vehicle/${car.id}`}>
        <VehicleCard
            title={`${formatBrand(car.brand)} ${car.model}`}
            year={car.year}
            price={car.price_cash}
            imageUrl={getFirstImageUrl(car)}
            icon={<LuCar className="h-12 w-12 text-slate-400" />}
            pills={[
                car.body_type,
                fuelLabel(car.fuel),
                txLabel(car.transmission),
            ]}
        />
    </Link>
);

export default CarCard;
