import { LuBike } from "react-icons/lu";
import { txLabel } from "@/lib/format";
import VehicleCard from "./VehicleCard";

const MotorCard = ({ motor }) => (
    <VehicleCard
        title={`${motor.brand} ${motor.model}`}
        year={motor.year}
        price={motor.price}
        icon={<LuBike className="h-12 w-12 text-slate-400" />}
        pills={[
            motor.body_type,
            `${motor.engine_cc}cc`,
            txLabel(motor.transmission),
        ]}
    />
);

export default MotorCard;
