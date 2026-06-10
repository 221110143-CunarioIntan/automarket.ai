import { Link, NavLink } from "react-router-dom";
import {
    LuExternalLink,
    LuLayoutDashboard,
    LuLogOut,
    LuSquareCheckBig,
} from "react-icons/lu";
import { Avatar, Dropdown, LogoText } from "@/components/ui";
import { useAuth } from "@/contexts";
import { cn } from "@/lib/cn";

const TABS = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
    { to: "/admin/ads", label: "Ad Approvals", icon: LuSquareCheckBig },
];

const AdminNavbar = () => {
    const { user, profile, signOut } = useAuth();

    return (
        <header className="bg-white">
            <div className="border-b border-slate-200">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <LogoText className="text-lg" />
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
                            Admin
                        </span>
                    </Link>

                    <Dropdown
                        trigger={
                            <button
                                type="button"
                                className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <Avatar
                                    name={profile?.name}
                                    email={user?.email}
                                />
                            </button>
                        }
                    >
                        <Dropdown.Header>
                            <div className="flex items-center gap-3">
                                <Avatar
                                    name={profile?.name}
                                    email={user?.email}
                                    size="md"
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {profile?.name || user?.email}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </Dropdown.Header>

                        <Dropdown.Item
                            to="/"
                            icon={<LuExternalLink className="h-4 w-4" />}
                        >
                            View as Public
                        </Dropdown.Item>

                        <Dropdown.Divider />

                        <Dropdown.Item
                            onClick={signOut}
                            icon={<LuLogOut className="h-4 w-4" />}
                            className="text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>

            <div className="border-b border-slate-200">
                <div className="mx-auto flex h-12 max-w-7xl items-center gap-1 px-6">
                    {TABS.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className={({ isActive }) =>
                                cn(
                                    "relative flex h-full items-center gap-2 px-4 text-sm font-medium transition",
                                    isActive
                                        ? "text-blue-600"
                                        : "text-slate-600 hover:text-slate-900",
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    {isActive && (
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
