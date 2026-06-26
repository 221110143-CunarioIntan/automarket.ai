import { cn } from "@/lib/cn";

const Input = ({ label, id, required, error, className, ...props }) => (
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
        <input
            id={id}
            aria-invalid={!!error}
            className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
                error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100",
                className,
            )}
            {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

export default Input;
