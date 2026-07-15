import { Outlet } from "react-router-dom";
import { ScrollToTop } from "@/components/layout";

// App-wide wrapper mounted above every shell so scroll resets to top on each
// route change, regardless of which shell renders.
const RootLayout = () => (
    <>
        <ScrollToTop />
        <Outlet />
    </>
);

export default RootLayout;
