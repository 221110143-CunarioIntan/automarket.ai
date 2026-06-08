import { cn } from "@/lib/cn";

const Input = ({ label, id, className, ...props }) => {
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
            <input
                id={id}
                className={cn(
                    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                    className,
                )}
                {...props}
            />
        </div>
    );
};

export default Input;
