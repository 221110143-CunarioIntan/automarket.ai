import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { cn } from "@/lib/cn";

const InputPassword = ({
    label,
    id,
    required,
    error,
    className,
    ...props
}) => {
    const [show, setShow] = useState(false);

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1 block text-sm font-medium text-slate-700"
                >
                    {label}
                    {required && (
                        <span className="ml-0.5 text-red-500">*</span>
                    )}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    aria-invalid={!!error}
                    className={cn(
                        "w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none focus:ring-2",
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100",
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
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default InputPassword;
