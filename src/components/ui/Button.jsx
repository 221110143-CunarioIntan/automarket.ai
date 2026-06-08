import { cn } from "@/lib/cn";

const Button = ({ variant = "primary", className, children, ...props }) => {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        outline:
            "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
    };

    return (
        <button
            className={cn(
                "rounded-lg px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
                variants[variant],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
