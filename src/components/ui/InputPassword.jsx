import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { cn } from "@/lib/cn";

const InputPassword = ({ label, id, className, ...props }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1 block text-sm font-medium text-slate-700"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    className={cn(
                        "w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                        className,
                    )}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    tabIndex={-1}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                    {show ? (
                        <LuEyeOff className="h-4 w-4" />
                    ) : (
                        <LuEye className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default InputPassword;
