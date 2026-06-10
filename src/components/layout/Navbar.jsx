import { Link } from "react-router-dom";
import {
    LuChevronDown,
    LuLayoutDashboard,
    LuLogOut,
    LuMapPin,
    LuPlus,
    LuSquareUser,
} from "react-icons/lu";
import { Avatar, Dropdown, LogoText } from "@/components/ui";
import { useAuth } from "@/contexts";

const Navbar = () => {
    const { user, profile, signOut, loading } = useAuth();

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/">
                    <LogoText className="text-xl" />
                </Link>

                <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
                    <button
                        type="button"
                        className="flex items-center gap-1 hover:text-slate-900"
                    >
                        Buy car
                        <LuChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1 hover:text-slate-900"
                    >
                        Buy motor
                        <LuChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <Link to="/trade-in" className="hover:text-slate-900">
                        Trade-in
                    </Link>
                    <Link to="/contact" className="hover:text-slate-900">
                        Contact-Us
                    </Link>
                </nav>

                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-slate-700">
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
                            className="font-medium text-slate-900 hover:text-blue-600"
                        >
                            Login / Register
                        </Link>
                    )}
                </div>
            </div>
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
