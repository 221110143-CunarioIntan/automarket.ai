import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    LuArrowLeft,
    LuArrowRight,
    LuBike,
    LuCar,
    LuClock,
} from "react-icons/lu";
import {
    Badge,
    Button,
    ErrorState,
    ForbiddenState,
    NotFoundState,
} from "@/components/ui";
import { useAuth } from "@/contexts";
import { useFetchData } from "@/hooks";
import { AD_STATUS_COLOR, AD_STATUS_LABEL } from "@/lib/enums";
import {
    formatBrand,
    formatCurrency,
    fuelLabel,
    txLabel,
} from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { getSortedImages } from "@/lib/vehicleImages";

const STATUS_HINT = {
    PENDING:
        "Iklan Anda sedang menunggu persetujuan admin. Belum tampil di marketplace.",
    APPROVED: "Iklan Anda aktif dan tampil di marketplace.",
    REJECTED:
        "Iklan Anda ditolak oleh admin. Cek kembali ketentuan posting iklan.",
    TAKEN_DOWN:
        "Iklan Anda telah diturunkan oleh admin dari marketplace.",
};

const fetchAd = async (id) => {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*, vehicle_images(*)")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
};

const UserShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const {
        data: vehicle,
        loading,
        error,
    } = useFetchData(() => fetchAd(id), [id]);

    if (authLoading || loading) return <Skeleton />;
    if (!user) {
        navigate("/login");
        return null;
    }
    const backAction = (
        <Link
            to="/ads/mine"
            className="font-medium text-blue-600 hover:underline"
        >
            ← Back to My Iklan
        </Link>
    );
    if (error)
        return (
            <div className="mx-auto max-w-7xl px-6 py-16">
                <ErrorState
                    title="Failed to load ad"
                    description={error.message}
                    action={backAction}
                />
            </div>
        );
    if (!vehicle)
        return (
            <div className="mx-auto max-w-7xl px-6 py-16">
                <NotFoundState title="Ad not found" action={backAction} />
            </div>
        );
    if (vehicle.user_id !== user.id)
        return (
            <div className="mx-auto max-w-7xl px-6 py-16">
                <ForbiddenState
                    title="Access denied"
                    description="Anda tidak memiliki akses ke iklan ini."
                    action={backAction}
                />
            </div>
        );

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <Link
                to="/ads/mine"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back to My Iklan
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <ImageCard vehicle={vehicle} />
                    <OverviewCard vehicle={vehicle} />
                    <DescriptionCard vehicle={vehicle} />
                </div>

                <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    <SummaryCard vehicle={vehicle} />
                    <ActivityCard vehicle={vehicle} />
                </div>
            </div>
        </div>
    );
};

const ImageCard = ({ vehicle }) => {
    const Icon = vehicle.type === "CAR" ? LuCar : LuBike;
    const images = getSortedImages(vehicle);
    const [current, setCurrent] = useState(0);

    if (!images.length) {
        return (
            <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-200">
                <Icon className="h-32 w-32 text-slate-400" />
            </div>
        );
    }

    const prev = () =>
        setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    return (
        <div className="space-y-3">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
                <img
                    src={images[current].original_url}
                    alt={`${formatBrand(vehicle.brand)} ${vehicle.model} — ${current + 1}`}
                    className="h-full w-full object-cover"
                />
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700"
                            aria-label="Previous"
                        >
                            <LuArrowLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700"
                            aria-label="Next"
                        >
                            <LuArrowRight className="h-4 w-4" />
                        </button>
                        <span className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                            {current + 1} / {images.length}
                        </span>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            type="button"
                            onClick={() => setCurrent(i)}
                            className={`aspect-video w-32 shrink-0 overflow-hidden rounded-lg transition ${
                                i === current
                                    ? "ring-2 ring-blue-600"
                                    : "opacity-70 hover:opacity-100"
                            }`}
                            aria-label={`Show image ${i + 1}`}
                        >
                            <img
                                src={img.webp_url}
                                alt={`Thumbnail ${i + 1}`}
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const OverviewCard = ({ vehicle }) => {
    const items = [
        {
            label: vehicle.type === "CAR" ? "Car Type" : "Bike Type",
            value: vehicle.body_type,
        },
        { label: "Engine Capacity", value: `${vehicle.engine_cc ?? "-"} cc` },
        {
            label: "Transmission",
            value: `${vehicle.transmission} (${txLabel(vehicle.transmission)})`,
        },
        { label: "Fuel", value: vehicle.fuel ? fuelLabel(vehicle.fuel) : "-" },
        { label: "Production Year", value: vehicle.year },
        {
            label: "Mileage",
            value: `${vehicle.mileage?.toLocaleString("id-ID") ?? 0} km`,
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

const SummaryCard = ({ vehicle }) => {
    const brandLogo = `/images/brand-logo/${vehicle.brand.toLowerCase()}.png`;
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Badge color={AD_STATUS_COLOR[vehicle.status]}>
                {AD_STATUS_LABEL[vehicle.status]}
            </Badge>
            <p className="mt-2 text-xs text-slate-500">
                {STATUS_HINT[vehicle.status]}
            </p>

            <div className="mt-4 flex items-center gap-3">
                <img
                    src={brandLogo}
                    alt={formatBrand(vehicle.brand)}
                    className="h-10 w-10 object-contain mix-blend-multiply"
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
                <span className="font-medium text-slate-700">
                    {formatBrand(vehicle.brand)}
                </span>
            </div>

            <h1 className="mt-3 text-xl font-bold text-slate-900">
                {formatBrand(vehicle.brand)} {vehicle.model}
            </h1>

            <p className="mt-3 text-xs text-slate-500">Price</p>
            <p className="text-lg font-bold text-slate-900">
                {formatCurrency(vehicle.price_cash)}
            </p>

            {vehicle.status === "APPROVED" && (
                <Link
                    to={`/vehicle/${vehicle.id}`}
                    className="mt-5 block"
                >
                    <Button variant="outline" className="w-full">
                        Lihat di Marketplace
                    </Button>
                </Link>
            )}
        </div>
    );
};

const ActivityCard = ({ vehicle }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
            <LuClock className="h-4 w-4" />
            Activity
        </h3>
        <dl className="space-y-2 text-xs">
            <Field
                label="Diposting"
                value={new Date(vehicle.created_at).toLocaleString("id-ID")}
            />
            <Field
                label="Update terakhir"
                value={new Date(vehicle.updated_at).toLocaleString("id-ID")}
            />
            {vehicle.approved_at && (
                <Field
                    label={
                        vehicle.status === "APPROVED"
                            ? "Disetujui pada"
                            : vehicle.status === "TAKEN_DOWN"
                              ? "Diturunkan pada"
                              : "Ditolak pada"
                    }
                    value={new Date(vehicle.approved_at).toLocaleString(
                        "id-ID",
                    )}
                />
            )}
        </dl>
    </div>
);

const Field = ({ label, value }) => (
    <div className="flex justify-between gap-3">
        <dt className="text-slate-500">{label}</dt>
        <dd className="text-right font-medium text-slate-900">{value}</dd>
    </div>
);

const Skeleton = () => (
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

export default UserShow;
