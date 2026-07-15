import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Reset scroll to the top whenever the route path changes. React Router keeps
// the previous page's scroll position on navigation by default. Keyed on
// pathname (not search) so in-page filtering via query params doesn't jump.
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
