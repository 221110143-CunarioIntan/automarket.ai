import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/components/layout";

const MainShell = () => {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainShell;
