import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminShell, AuthShell, MainShell, SearchShell } from "@/layouts";
import {
    AdminEdit,
    AdminList,
    AdminShow,
    UserCreate,
    UserList,
    UserShow,
} from "@/pages/ad";
import { AdminDashboard } from "@/pages/admin";
import * as Auth from "@/pages/auth";
import { Home } from "@/pages/home";
import { Search } from "@/pages/search";
import { ShowVehicle } from "@/pages/vehicle";

export const router = createBrowserRouter([
    {
        element: <MainShell />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/vehicle/:id", element: <ShowVehicle /> },
            { path: "/ads/create", element: <UserCreate /> },
            { path: "/ads/mine", element: <UserList /> },
            { path: "/ads/mine/:id", element: <UserShow /> },
        ],
    },
    {
        element: <AuthShell />,
        children: [
            { path: "/login", element: <Auth.Login /> },
            { path: "/register", element: <Auth.Register /> },
        ],
    },
    {
        element: <SearchShell />,
        children: [{ path: "/search", element: <Search /> }],
    },
    {
        element: <AdminShell />,
        children: [
            {
                path: "/admin",
                element: <Navigate to="/admin/dashboard" replace />,
            },
            { path: "/admin/dashboard", element: <AdminDashboard /> },
            { path: "/admin/ads", element: <AdminList /> },
            { path: "/admin/ads/:id", element: <AdminShow /> },
            { path: "/admin/ads/:id/edit", element: <AdminEdit /> },
        ],
    },
]);
