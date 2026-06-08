import { createBrowserRouter } from "react-router-dom";
import { AuthShell, MainShell } from "@/layouts";
import * as Auth from "@/pages/auth";
import { Home } from "@/pages/home";

export const router = createBrowserRouter([
    {
        element: <MainShell />,
        children: [{ path: "/", element: <Home /> }],
    },
    {
        element: <AuthShell />,
        children: [
            { path: "/login", element: <Auth.Login /> },
            { path: "/register", element: <Auth.Register /> },
        ],
    },
]);
