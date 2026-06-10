import {
    LuCircleCheckBig,
    LuCircleX,
    LuClock,
    LuLayoutDashboard,
} from "react-icons/lu";
import { useFetchData } from "@/hooks";
import { supabase } from "@/lib/supabase";

const fetchStats = async () => {
    const [pending, approved, rejected] = await Promise.all([
        supabase
            .from("vehicles")
            .select("id", { count: "exact", head: true })
            .eq("status", "PENDING"),
        supabase
            .from("vehicles")
            .select("id", { count: "exact", head: true })
            .eq("status", "APPROVED"),
        supabase
            .from("vehicles")
            .select("id", { count: "exact", head: true })
            .eq("status", "REJECTED"),
    ]);

    return {
        pending: pending.count ?? 0,
        approved: approved.count ?? 0,
        rejected: rejected.count ?? 0,
    };
};

const Dashboard = () => {
    const { data, loading } = useFetchData(fetchStats, []);

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6 flex items-center gap-3">
                <LuLayoutDashboard className="h-6 w-6 text-slate-700" />
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    label="Pending Approval"
                    value={data?.pending}
                    loading={loading}
                    icon={<LuClock className="h-5 w-5" />}
                    accent="bg-yellow-50 text-yellow-700"
                />
                <StatCard
                    label="Approved"
                    value={data?.approved}
                    loading={loading}
                    icon={<LuCircleCheckBig className="h-5 w-5" />}
                    accent="bg-green-50 text-green-700"
                />
                <StatCard
                    label="Rejected"
                    value={data?.rejected}
                    loading={loading}
                    icon={<LuCircleX className="h-5 w-5" />}
                    accent="bg-red-50 text-red-700"
                />
            </div>
        </div>
    );
};

const StatCard = ({ label, value, loading, icon, accent }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{label}</p>
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${accent}`}>
                {icon}
            </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
            ) : (
                value?.toLocaleString("id-ID") ?? "—"
            )}
        </p>
    </div>
);

export default Dashboard;
