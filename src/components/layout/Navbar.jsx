import { useState } from "react";
import { Link } from "react-router-dom";
import {
    LuLayoutDashboard,
    LuLogOut,
    LuMapPin,
    LuMenu,
    LuPlus,
    LuSquareUser,
    LuX,
} from "react-icons/lu";
import { Avatar, Dropdown, LogoText } from "@/components/ui";
import { useAuth } from "@/contexts";

const NAV_LINKS = [
    { to: "/vehicles?type=CAR", label: "Buy car" },
    { to: "/vehicles?type=MOTOR", label: "Buy motor" },
    { to: "/compare", label: "Compare" },
    { to: "/contact", label: "Contact-Us" },
];

const Navbar = () => {
    const { user, profile, signOut, loading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
                <Link to="/" onClick={closeMobile}>
                    <LogoText className="text-xl" />
                </Link>

                <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className="hover:text-slate-900"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4 text-sm">
                    <div className="hidden items-center gap-1 text-slate-700 lg:flex">
                        <LuMapPin className="h-4 w-4 fill-red-500 text-red-500" />
                        <span>Medan, North Sumatera</span>
                    </div>
                    {loading ? null : user ? (
                        <UserMenu
                            user={user}
                            profile={profile}
                            onSignOut={signOut}
                        />
                    ) : (
                        <Link
                            to="/login"
                            className="hidden font-medium text-slate-900 hover:text-blue-600 md:inline"
                        >
                            Login / Register
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={() => setMobileOpen((p) => !p)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    >
                        {mobileOpen ? (
                            <LuX className="h-5 w-5" />
                        ) : (
                            <LuMenu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t border-slate-200 bg-white md:hidden">
                    <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-3 text-sm">
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                onClick={closeMobile}
                                className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
                            >
                                {l.label}
                            </Link>
                        ))}
                        {!user && (
                            <Link
                                to="/login"
                                onClick={closeMobile}
                                className="rounded-lg px-3 py-2 font-medium text-blue-600 hover:bg-blue-50"
                            >
                                Login / Register
                            </Link>
                        )}
                        <div className="mt-2 flex items-center gap-1 border-t border-slate-100 px-3 pt-3 text-slate-500">
                            <LuMapPin className="h-4 w-4 fill-red-500 text-red-500" />
                            <span>Medan, North Sumatera</span>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

const UserMenu = ({ user, profile, onSignOut }) => {
    const displayName = profile?.name || user.email;
    const role = profile?.role;

    return (
        <Dropdown
            trigger={
                <button
                    type="button"
                    className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                    <Avatar name={profile?.name} email={user.email} />
                </button>
            }
        >
            <Dropdown.Header>
                <div className="flex items-center gap-3">
                    <Avatar
                        name={profile?.name}
                        email={user.email}
                        size="md"
                    />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {displayName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            {user.email}
                        </p>
                    </div>
                </div>
            </Dropdown.Header>

            {role === "ADMIN" ? (
                <Dropdown.Item
                    to="/admin/dashboard"
                    icon={<LuLayoutDashboard className="h-4 w-4" />}
                >
                    Admin Dashboard
                </Dropdown.Item>
            ) : (
                <>
                    <Dropdown.Item
                        to="/ads/create"
                        icon={<LuPlus className="h-4 w-4" />}
                    >
                        Post Iklan
                    </Dropdown.Item>
                    <Dropdown.Item
                        to="/ads/mine"
                        icon={<LuSquareUser className="h-4 w-4" />}
                    >
                        My Iklan
                    </Dropdown.Item>
                </>
            )}

            <Dropdown.Divider />

            <Dropdown.Item
                onClick={onSignOut}
                icon={<LuLogOut className="h-4 w-4" />}
                className="text-red-600 hover:bg-red-50"
            >
                Logout
            </Dropdown.Item>
        </Dropdown>
    );
};

export default Navbar;
