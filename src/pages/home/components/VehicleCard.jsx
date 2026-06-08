import { LuHeart } from "react-icons/lu";
import { formatCurrency } from "@/lib/format";
import Pill from "./Pill";

const VehicleCard = ({ title, year, price, icon, pills }) => (
    <div className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md">
        <div className="relative flex aspect-4/3 items-center justify-center bg-slate-200">
            {icon}
            <button
                type="button"
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-400 hover:text-red-500"
                aria-label="Favorite"
            >
                <LuHeart className="h-4 w-4" />
            </button>
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-slate-900">
                {title} <span className="font-bold">({year})</span>
            </h3>
            <p className="mt-1 font-bold text-slate-900">
                {formatCurrency(price)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                {pills.map((p) => (
                    <Pill key={p}>{p}</Pill>
                ))}
            </div>
        </div>
    </div>
);

export default VehicleCard;
