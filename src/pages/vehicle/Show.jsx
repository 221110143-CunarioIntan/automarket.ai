import { Link, useParams } from "react-router-dom";
import {
    LuArrowLeft,
    LuArrowRight,
    LuBike,
    LuCar,
    LuExternalLink,
    LuHeart,
    LuShare2,
} from "react-icons/lu";
import { Button, ErrorState, NotFoundState } from "@/components/ui";
import { useFetchData } from "@/hooks";
import {
    formatBrand,
    formatCurrency,
    fuelLabel,
    txLabel,
} from "@/lib/format";
import { sampleRandom } from "@/lib/random";
import { supabase } from "@/lib/supabase";
import { CarCard, MotorCard } from "@/pages/home/components";

const fetchVehicleById = async (id) => {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
};

const fetchSimilarVehicles = async (type, excludeId, limit = 4) => {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "APPROVED")
        .eq("type", type)
        .neq("id", excludeId);
    if (error) throw error;
    return sampleRandom(data, limit);
};

const Show = () => {
    const { id } = useParams();
    const { data: vehicle, loading, error } = useFetchData(
        () => fetchVehicleById(id),
        [id],
    );

    if (loading) return <ShowSkeleton />;
    if (error)
        return (
            <div className="mx-auto max-w-7xl px-6 py-16">
                <ErrorState
                    title="Failed to load vehicle"
                    description={error.message}
                    action={
                        <Link
                            to="/"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            ← Back to home
                        </Link>
                    }
                />
            </div>
        );
    if (!vehicle)
        return (
            <div className="mx-auto max-w-7xl px-6 py-16">
                <NotFoundState
                    title="Vehicle not found"
                    description="The vehicle you are looking for might have been removed or never existed."
                    action={
                        <Link
                            to="/"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            ← Back to home
                        </Link>
                    }
                />
            </div>
        );

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <ImageGallery vehicle={vehicle} />
                    <OverviewCard vehicle={vehicle} />
                    <DescriptionCard vehicle={vehicle} />
                </div>

                <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    <PurchaseCard vehicle={vehicle} />
                    <LocationCard vehicle={vehicle} />
                </div>
            </div>

            <SimilarVehiclesSection
                type={vehicle.type}
                excludeId={vehicle.id}
            />
        </div>
    );
};

const SimilarVehiclesSection = ({ type, excludeId }) => {
    const { data, loading, error } = useFetchData(
        () => fetchSimilarVehicles(type, excludeId, 4),
        [type, excludeId],
    );

    const title =
        type === "CAR" ? "Car Recommendation" : "Motor Recommendation";

    return (
        <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>
            {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-4/3 animate-pulse rounded-xl bg-slate-200"
                        />
                    ))}
                </div>
            ) : error ? (
                <p className="text-sm text-red-600">
                    Failed to load: {error.message}
                </p>
            ) : !data?.length ? (
                <p className="text-sm text-slate-500">
                    No other vehicles found.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {data.map((item) =>
                        type === "CAR" ? (
                            <CarCard key={item.id} car={item} />
                        ) : (
                            <MotorCard key={item.id} motor={item} />
                        ),
                    )}
                </div>
            )}
        </section>
    );
};

const ImageGallery = ({ vehicle }) => {
    const Icon = vehicle.type === "CAR" ? LuCar : LuBike;
    return (
        <div className="space-y-3">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
                <Icon className="h-32 w-32 text-slate-400" />
                <button
                    type="button"
                    className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-md"
                    aria-label="Previous"
                >
                    <LuArrowLeft className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-md"
                    aria-label="Next"
                >
                    <LuArrowRight className="h-4 w-4" />
                </button>
            </div>
            <div className="flex gap-3 overflow-x-auto">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex aspect-video w-32 shrink-0 items-center justify-center rounded-lg bg-slate-200"
                    >
                        <Icon className="h-8 w-8 text-slate-400" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const OverviewCard = ({ vehicle }) => {
    const items = [
        {
            label: vehicle.type === "CAR" ? "Car Type" : "Bike Type",
            value: vehicle.body_type,
        },
        { label: "Engine Capacity", value: `${vehicle.engine_cc} cc` },
        {
            label: "Transmission",
            value: `${vehicle.transmission} (${txLabel(vehicle.transmission)})`,
        },
        { label: "Fuel", value: vehicle.fuel ? fuelLabel(vehicle.fuel) : "-" },
        { label: "Production Year", value: vehicle.year },
        {
            label: "Mileage",
            value: `${vehicle.mileage.toLocaleString("id-ID")} km`,
        },
        { label: "Color", value: vehicle.color || "-" },
        { label: "Location", value: vehicle.location || "-" },
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-slate-900">Overview</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-lg border border-slate-200 p-3"
                    >
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className="mt-1 font-semibold text-slate-900">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DescriptionCard = ({ vehicle }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 font-bold text-slate-900">Description</h2>
        <p className="text-sm whitespace-pre-line text-slate-600">
            {vehicle.description?.trim() ? (
                vehicle.description
            ) : (
                <>
                    {formatBrand(vehicle.brand)} {vehicle.model} {vehicle.year}.
                    {vehicle.body_type ? ` ${vehicle.body_type}.` : ""}
                    {vehicle.transmission
                        ? ` ${vehicle.transmission} transmission.`
                        : ""}
                    {vehicle.fuel ? ` ${fuelLabel(vehicle.fuel)} fuel.` : ""}
                    {vehicle.color ? ` Color: ${vehicle.color}.` : ""}
                    {vehicle.mileage
                        ? ` ${vehicle.mileage.toLocaleString("id-ID")} km mileage.`
                        : ""}
                </>
            )}
        </p>
    </div>
);

const PurchaseCard = ({ vehicle }) => {
    const brandLogo = `/images/brand-logo/${vehicle.brand.toLowerCase()}.png`;
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
                <img
                    src={brandLogo}
                    alt={formatBrand(vehicle.brand)}
                    className="h-12 w-12 object-contain mix-blend-multiply"
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
                <span className="font-medium text-slate-700">
                    {formatBrand(vehicle.brand)}
                </span>
            </div>

            <h1 className="mt-4 text-2xl font-bold text-slate-900">
                {formatBrand(vehicle.brand)} {vehicle.model}
            </h1>

            <p className="mt-4 text-xs text-slate-500">Price</p>
            <p className="text-xl font-bold text-slate-900">
                {formatCurrency(vehicle.price_cash)}
            </p>

            <div className="mt-5 space-y-2">
                <Button className="w-full">Booking</Button>
                <Button variant="outline" className="w-full">
                    Seller Contact
                </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    <LuHeart className="h-4 w-4" />
                    Favorite
                </button>
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    <LuShare2 className="h-4 w-4" />
                    Share
                </button>
            </div>
        </div>
    );
};

const LocationCard = ({ vehicle }) => {
    if (!vehicle.location) return null;
    const query = encodeURIComponent(vehicle.location);
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between p-4">
                <div>
                    <h3 className="font-bold text-slate-900">Location</h3>
                    <p className="text-sm text-slate-500">{vehicle.location}</p>
                </div>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${query}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                >
                    Open in Maps
                    <LuExternalLink className="h-3.5 w-3.5" />
                </a>
            </div>
            <iframe
                src={`https://www.google.com/maps?q=${query}&output=embed`}
                title="Vehicle location"
                className="h-56 w-full border-0"
                loading="lazy"
            />
        </div>
    );
};

const ShowSkeleton = () => (
    <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <div className="aspect-video animate-pulse rounded-2xl bg-slate-200" />
                <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
            </div>
            <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
        </div>
    </div>
);


export default Show;
