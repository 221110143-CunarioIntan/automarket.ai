import { Navigate, Outlet } from "react-router-dom";
import { AdminNavbar } from "@/components/layout";
import { useAuth } from "@/contexts";
import { useScrollDirection } from "@/hooks";
import { cn } from "@/lib/cn";

const AdminShell = () => {
    const { user, profile, loading } = useAuth();
    const visible = useScrollDirection();

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (profile && profile.role !== "ADMIN") return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-slate-50">
            <div
                className={cn(
                    "sticky top-0 z-40 transition-transform duration-300",
                    visible ? "translate-y-0" : "-translate-y-full",
                )}
            >
                <AdminNavbar />
            </div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminShell;
