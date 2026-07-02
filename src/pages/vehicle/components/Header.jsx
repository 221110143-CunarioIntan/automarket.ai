import {
    LuBike,
    LuCar,
    LuPanelLeftClose,
    LuPanelLeftOpen,
} from "react-icons/lu";

const Header = ({ type, sidebarOpen, onToggleSidebar }) => {
    const Icon = type === "CAR" ? LuCar : LuBike;
    return (
        <div className="sticky top-0 z-20 -mx-6 mb-6 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-slate-700" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {type === "CAR" ? "Buy Car" : "Buy Motor"}
                    </h1>
                    <p className="text-sm text-slate-500">
                        Temukan {type === "CAR" ? "mobil" : "motor"} impian
                        kamu di sini.
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={onToggleSidebar}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50"
                aria-label={sidebarOpen ? "Hide filter" : "Show filter"}
            >
                {sidebarOpen ? (
                    <LuPanelLeftClose className="h-4 w-4" />
                ) : (
                    <LuPanelLeftOpen className="h-4 w-4" />
                )}
                {sidebarOpen ? "Sembunyikan filter" : "Tampilkan filter"}
            </button>
        </div>
    );
};

export default Header;
