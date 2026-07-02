import { Link } from "react-router-dom";
import { LuBike } from "react-icons/lu";
import { formatBrand, txLabel } from "@/lib/format";
import { getFirstImageUrl } from "@/lib/vehicleImages";
import VehicleCard from "./VehicleCard";

const MotorCard = ({ motor }) => (
    <Link to={`/vehicle/${motor.id}`}>
        <VehicleCard
            title={`${formatBrand(motor.brand)} ${motor.model}`}
            year={motor.year}
            price={motor.price_cash}
            imageUrl={getFirstImageUrl(motor)}
            icon={<LuBike className="h-12 w-12 text-slate-400" />}
            pills={[
                motor.body_type,
                `${motor.engine_cc}cc`,
                txLabel(motor.transmission),
            ]}
        />
    </Link>
);

export default MotorCard;
