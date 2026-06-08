import { createBrowserRouter } from "react-router-dom";
import { AuthShell, MainShell } from "@/layouts";
import * as Auth from "@/pages/auth";
import { Home } from "@/pages/home";
import * as Vehicle from "@/pages/vehicle";

export const router = createBrowserRouter([
    {
        element: <MainShell />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/vehicle/:id", element: <Vehicle.Show /> },
        ],
    },
    {
        element: <AuthShell />,
        children: [
            { path: "/login", element: <Auth.Login /> },
            { path: "/register", element: <Auth.Register /> },
        ],
    },
]);
