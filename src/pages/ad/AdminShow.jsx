import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    LuArrowLeft,
    LuBike,
    LuCar,
    LuCheck,
    LuClock,
    LuExternalLink,
    LuPencil,
    LuUser,
    LuX,
} from "react-icons/lu";
import {
    Avatar,
    Badge,
    Button,
    ErrorState,
    NotFoundState,
} from "@/components/ui";
import { useAuth } from "@/contexts";
import { useFetchData } from "@/hooks";
import { AD_STATUS_COLOR } from "@/lib/enums";
import { formatBrand, formatCurrency, fuelLabel, txLabel } from "@/lib/format";
import { supabase } from "@/lib/supabase";

const fetchAd = async (id) => {
    const { data, error } = await supabase
        .from("vehicles")
        .select(
            `
            *,
            poster:users!user_id (id, email, name, role, created_at),
            approver:users!approved_by_id (id, email, name)
            `,
        )
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
};

const AdminShow = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [acting, setActing] = useState(false);
    const {
        data: vehicle,
        loading,
        error,
        refetch,
    } = useFetchData(() => fetchAd(id), [id]);

    const onApprove = () => handleAction("APPROVED");
    const onReject = () => {
        const next = vehicle?.status === "APPROVED" ? "TAKEN_DOWN" : "REJECTED";
        handleAction(next);
    };

    const handleAction = async (nextStatus) => {
        setActing(true);
        const { error: updateError } = await supabase
            .from("vehicles")
            .update({
                status: nextStatus,
                approved_by_id: user.id,
                approved_at: new Date().toISOString(),
            })
            .eq("id", id);
        setActing(false);
        if (updateError) {
            alert(`Failed: ${updateError.message}`);
            return;
        }
        refetch();
    };

    if (loading) return <Skeleton />;
    const backAction = (
        <Link
            to="/admin/ads"
            className="font-medium text-blue-600 hover:underline"
        >
            ← Back to Ad Approvals
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

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <Link
                to="/admin/ads"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back to Ad Approvals
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <ImageCard vehicle={vehicle} />
                    <OverviewCard vehicle={vehicle} />
                    <DescriptionCard vehicle={vehicle} />
                </div>

                <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
                    <StatusActionCard
                        vehicle={vehicle}
                        acting={acting}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                    <PosterCard poster={vehicle.poster} />
                    <AuditCard vehicle={vehicle} approver={vehicle.approver} />
                </div>
            </div>
        </div>
    );
};

const ImageCard = ({ vehicle }) => {
    const Icon = vehicle.type === "CAR" ? LuCar : LuBike;
    return (
        <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-200">
            <Icon className="h-32 w-32 text-slate-400" />
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

const StatusActionCard = ({ vehicle, acting, onApprove, onReject }) => {
    const brandLogo = `/images/brand-logo/${vehicle.brand.toLowerCase()}.png`;
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
                <Badge color={AD_STATUS_COLOR[vehicle.status]}>
                    {vehicle.status}
                </Badge>
                {vehicle.status === "APPROVED" && (
                    <Link
                        to={`/vehicle/${vehicle.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                    >
                        View public
                        <LuExternalLink className="h-3 w-3" />
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-3">
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

            <div className="mt-5 space-y-2">
                <StatusActions
                    status={vehicle.status}
                    acting={acting}
                    onApprove={onApprove}
                    onReject={onReject}
                />
                <Link
                    to={`/admin/ads/${vehicle.id}/edit`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    <LuPencil className="h-4 w-4" />
                    Edit Data Iklan
                </Link>
            </div>
        </div>
    );
};

const StatusActions = ({ status, acting, onApprove, onReject }) => {
    if (status === "PENDING") {
        return (
            <>
                <Button
                    type="button"
                    onClick={onApprove}
                    disabled={acting}
                    className="flex w-full items-center justify-center gap-1.5"
                >
                    <LuCheck className="h-4 w-4" />
                    Approve Ad
                </Button>
                <button
                    type="button"
                    onClick={onReject}
                    disabled={acting}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                    <LuX className="h-4 w-4" />
                    Reject Ad
                </button>
            </>
        );
    }
    if (status === "APPROVED") {
        return (
            <button
                type="button"
                onClick={onReject}
                disabled={acting}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-orange-300 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 disabled:opacity-50"
            >
                <LuX className="h-4 w-4" />
                Take Down
            </button>
        );
    }
    // REJECTED or TAKEN_DOWN
    return (
        <Button
            type="button"
            onClick={onApprove}
            disabled={acting}
            className="flex w-full items-center justify-center gap-1.5"
        >
            <LuCheck className="h-4 w-4" />
            {status === "TAKEN_DOWN" ? "Restore Ad" : "Approve Ad"}
        </Button>
    );
};

const PosterCard = ({ poster }) => {
    if (!poster) return null;
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                <LuUser className="h-4 w-4" />
                Posted by
            </h3>
            <div className="flex items-center gap-3">
                <Avatar name={poster.name} email={poster.email} size="md" />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {poster.name || poster.email}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                        {poster.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {poster.role} · Joined{" "}
                        {new Date(poster.created_at).toLocaleDateString(
                            "id-ID",
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

const AuditCard = ({ vehicle, approver }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
            <LuClock className="h-4 w-4" />
            Activity
        </h3>
        <dl className="space-y-2 text-xs">
            <Field
                label="Created"
                value={new Date(vehicle.created_at).toLocaleString("id-ID")}
            />
            <Field
                label="Last updated"
                value={new Date(vehicle.updated_at).toLocaleString("id-ID")}
            />
            {vehicle.approved_at && (
                <Field
                    label={actionLabel(vehicle.status, "at")}
                    value={new Date(vehicle.approved_at).toLocaleString(
                        "id-ID",
                    )}
                />
            )}
            {approver && (
                <Field
                    label={actionLabel(vehicle.status, "by")}
                    value={approver.name || approver.email}
                />
            )}
        </dl>
    </div>
);

const actionLabel = (status, suffix) => {
    const verb =
        status === "APPROVED"
            ? "Approved"
            : status === "TAKEN_DOWN"
              ? "Taken down"
              : "Rejected";
    return `${verb} ${suffix}`;
};

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

export default AdminShow;
