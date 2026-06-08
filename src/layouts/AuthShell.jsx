import { Outlet } from "react-router-dom";
import { LogoText } from "@/components/ui";

const AuthShell = () => {
    return (
        <div className="flex min-h-screen">
            <div className="flex w-full flex-col bg-white lg:w-1/2">
                <div className="p-8">
                    <LogoText className="text-2xl" />
                </div>

                <div className="flex flex-1 items-center justify-center px-8 pb-16">
                    <div className="w-full max-w-sm">
                        <Outlet />
                    </div>
                </div>
            </div>

            <div className="hidden bg-slate-200 lg:block lg:w-1/2">
                <img
                    src="/images/auth-hero.webp"
                    alt=""
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
    );
};

export default AuthShell;
