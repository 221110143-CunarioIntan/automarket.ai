import { useState } from "react";
import { Link } from "react-router-dom";
import {
    LuBike,
    LuCar,
    LuCheck,
    LuSquareCheckBig,
    LuX,
} from "react-icons/lu";
import { Badge, Button, EmptyState, Select } from "@/components/ui";
import { useAuth } from "@/contexts";
import { useFetchData } from "@/hooks";
import { AD_STATUS_COLOR, AD_STATUS_OPTIONS } from "@/lib/enums";
import { formatBrand, formatCurrency } from "@/lib/format";
import { supabase } from "@/lib/supabase";

const STATUS_FILTER_OPTIONS = [
    ...AD_STATUS_OPTIONS,
    { value: "ALL", label: "All Status" },
];

const fetchAds = async (status) => {
    let query = supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
    if (status !== "ALL") query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

const AdminList = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState("PENDING");
    const [actingId, setActingId] = useState(null);
    const { data, loading, error, refetch } = useFetchData(
        () => fetchAds(status),
        [status],
    );

    const handleApprove = (vehicle) => handleAction(vehicle, "APPROVED");
    const handleReject = (vehicle) => {
        const next = vehicle.status === "APPROVED" ? "TAKEN_DOWN" : "REJECTED";
        handleAction(vehicle, next);
    };

    const handleAction = async (vehicle, nextStatus) => {
        setActingId(vehicle.id);
        const { error: updateError } = await supabase
            .from("vehicles")
            .update({
                status: nextStatus,
                approved_by_id: user.id,
                approved_at: new Date().toISOString(),
            })
            .eq("id", vehicle.id);
        setActingId(null);
        if (updateError) {
            alert(`Failed: ${updateError.message}`);
            return;
        }
        refetch();
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                    <LuSquareCheckBig className="h-6 w-6 text-slate-700" />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Ad Approvals
                        </h1>
                        <p className="text-sm text-slate-500">
                            Review iklan yang di-submit user.
                        </p>
                    </div>
                </div>
                <div className="w-48">
                    <Select
                        options={STATUS_FILTER_OPTIONS}
                        value={status}
                        onChange={setStatus}
                    />
                </div>
            </div>

            {loading ? (
                <ListSkeleton />
            ) : error ? (
                <p className="text-sm text-red-600">
                    Failed to load: {error.message}
                </p>
            ) : !data?.length ? (
                <EmptyState
                    icon={<LuSquareCheckBig className="h-8 w-8" />}
                    title="No ads to review"
                    description={`Tidak ada iklan dengan status ${status === "ALL" ? "apapun" : status.toLowerCase()}.`}
                />
            ) : (
                <ul className="space-y-3">
                    {data.map((vehicle) => (
                        <AdRow
                            key={vehicle.id}
                            vehicle={vehicle}
                            acting={actingId === vehicle.id}
                            onApprove={() => handleApprove(vehicle)}
                            onReject={() => handleReject(vehicle)}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

const AdRow = ({ vehicle, acting, onApprove, onReject }) => {
    const Icon = vehicle.type === "CAR" ? LuCar : LuBike;
    return (
        <li className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
            <Link
                to={`/admin/ads/${vehicle.id}`}
                className="flex min-w-0 flex-1 items-center gap-4"
            >
                <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                    <Icon className="h-10 w-10 text-slate-400" />
                </div>

                <div className="min-w-0 flex-1">
                    <Badge
                        color={AD_STATUS_COLOR[vehicle.status]}
                        className="text-[10px] font-semibold tracking-wider uppercase"
                    >
                        {vehicle.status}
                    </Badge>
                    <h3 className="mt-1.5 font-semibold text-slate-900">
                        {formatBrand(vehicle.brand)} {vehicle.model}{" "}
                        <span className="font-bold">({vehicle.year})</span>
                    </h3>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">
                        {formatCurrency(vehicle.price_cash)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{vehicle.body_type}</span>
                        <span>·</span>
                        <span>{vehicle.transmission}</span>
                        {vehicle.mileage != null && (
                            <>
                                <span>·</span>
                                <span>
                                    {vehicle.mileage.toLocaleString("id-ID")} km
                                </span>
                            </>
                        )}
                        {vehicle.location && (
                            <>
                                <span>·</span>
                                <span>{vehicle.location}</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            <div className="flex shrink-0 gap-2">
                <RowActions
                    status={vehicle.status}
                    acting={acting}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            </div>
        </li>
    );
};

const RowActions = ({ status, acting, onApprove, onReject }) => {
    if (status === "PENDING") {
        return (
            <>
                <button
                    type="button"
                    onClick={onReject}
                    disabled={acting}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-red-300 px-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                    <LuX className="h-4 w-4" />
                    Reject
                </button>
                <Button
                    type="button"
                    onClick={onApprove}
                    disabled={acting}
                    className="flex h-9 items-center gap-1.5 px-3 text-sm"
                >
                    <LuCheck className="h-4 w-4" />
                    Approve
                </Button>
            </>
        );
    }
    if (status === "APPROVED") {
        return (
            <button
                type="button"
                onClick={onReject}
                disabled={acting}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-orange-300 px-3 text-sm font-medium text-orange-600 hover:bg-orange-50 disabled:opacity-50"
            >
                <LuX className="h-4 w-4" />
                Take Down
            </button>
        );
    }
    return (
        <Button
            type="button"
            onClick={onApprove}
            disabled={acting}
            className="flex h-9 items-center gap-1.5 px-3 text-sm"
        >
            <LuCheck className="h-4 w-4" />
            {status === "TAKEN_DOWN" ? "Restore" : "Approve"}
        </Button>
    );
};

const ListSkeleton = () => (
    <ul className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
            <li
                key={i}
                className="h-28 animate-pulse rounded-xl bg-slate-200"
            />
        ))}
    </ul>
);

export default AdminList;
