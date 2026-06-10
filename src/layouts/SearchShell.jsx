import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout";

const SearchShell = () => {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default SearchShell;
