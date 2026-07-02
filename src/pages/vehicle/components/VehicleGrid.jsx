import { CarCard, MotorCard } from "@/pages/home/components";

const VehicleGrid = ({ vehicles, isCar, loading, error, compact }) => {
    const gridClass = compact
        ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

    if (loading) {
        return (
            <div className={gridClass}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-4/3 animate-pulse rounded-xl bg-slate-200"
                    />
                ))}
            </div>
        );
    }
    if (error) {
        return (
            <p className="text-sm text-red-600">
                Gagal memuat: {error.message}
            </p>
        );
    }
    if (!vehicles.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                <p className="text-sm text-slate-500">
                    Tidak ada {isCar ? "mobil" : "motor"} yang cocok dengan
                    filter kamu.
                </p>
            </div>
        );
    }
    return (
        <div className={gridClass}>
            {vehicles.map((v) =>
                isCar ? (
                    <CarCard key={v.id} car={v} />
                ) : (
                    <MotorCard key={v.id} motor={v} />
                ),
            )}
        </div>
    );
};

export default VehicleGrid;
