import { Link, useNavigate } from "react-router-dom";
import { LuBike, LuCar, LuInbox, LuPlus } from "react-icons/lu";
import { Badge, Button, EmptyState } from "@/components/ui";
import { useAuth } from "@/contexts";
import { useFetchData } from "@/hooks";
import { AD_STATUS_COLOR, AD_STATUS_LABEL } from "@/lib/enums";
import { formatBrand, formatCurrency } from "@/lib/format";
import { supabase } from "@/lib/supabase";

const fetchMyVehicles = async (userId) => {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};

const UserList = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    if (authLoading) return null;
    if (!user) {
        navigate("/login");
        return null;
    }

    return <UserListContent userId={user.id} />;
};

const UserListContent = ({ userId }) => {
    const { data, loading, error } = useFetchData(
        () => fetchMyVehicles(userId),
        [userId],
    );

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Iklan
                    </h1>
                    <p className="text-sm text-slate-500">
                        Iklan yang sudah Anda posting di marketplace.
                    </p>
                </div>
                <Link to="/ads/create">
                    <Button className="flex items-center gap-2">
                        <LuPlus className="h-4 w-4" />
                        Post Iklan Baru
                    </Button>
                </Link>
            </div>

            {loading ? (
                <ListSkeleton />
            ) : error ? (
                <p className="text-sm text-red-600">
                    Failed to load: {error.message}
                </p>
            ) : !data?.length ? (
                <EmptyState
                    icon={<LuInbox className="h-8 w-8" />}
                    title="Belum ada iklan"
                    description="Mulai posting iklan kendaraan pertama Anda. Iklan akan tampil di marketplace setelah disetujui admin."
                    action={
                        <Link to="/ads/create">
                            <Button className="flex items-center gap-2">
                                <LuPlus className="h-4 w-4" />
                                Post Iklan Pertama
                            </Button>
                        </Link>
                    }
                />
            ) : (
                <ul className="space-y-3">
                    {data.map((vehicle) => (
                        <VehicleRow key={vehicle.id} vehicle={vehicle} />
                    ))}
                </ul>
            )}
        </div>
    );
};

const VehicleRow = ({ vehicle }) => {
    const Icon = vehicle.type === "CAR" ? LuCar : LuBike;
    return (
        <li>
            <Link
                to={`/ads/mine/${vehicle.id}`}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
            >
                <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                    <Icon className="h-10 w-10 text-slate-400" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold text-slate-900">
                                {formatBrand(vehicle.brand)} {vehicle.model}{" "}
                                <span className="font-bold">
                                    ({vehicle.year})
                                </span>
                            </h3>
                            <p className="mt-0.5 text-sm font-bold text-slate-900">
                                {formatCurrency(vehicle.price_cash)}
                            </p>
                        </div>
                        <Badge
                            color={AD_STATUS_COLOR[vehicle.status]}
                            className="shrink-0"
                        >
                            {AD_STATUS_LABEL[vehicle.status]}
                        </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{vehicle.body_type}</span>
                        <span>·</span>
                        <span>{vehicle.transmission}</span>
                        {vehicle.mileage && (
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
        </li>
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

export default UserList;
