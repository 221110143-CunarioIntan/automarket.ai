import { Link } from "react-router-dom";
import { LuChevronDown, LuMapPin, LuUser } from "react-icons/lu";
import { LogoText } from "@/components/ui";
import { useAuth } from "@/contexts";

const Navbar = () => {
    const { user, signOut, loading } = useAuth();

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
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-slate-700">
                                <LuUser className="h-4 w-4" />
                                <span className="max-w-40 truncate">
                                    {user.email}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={signOut}
                                className="font-medium text-slate-900 hover:text-blue-600"
                            >
                                Logout
                            </button>
                        </div>
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

export default Navbar;
