import { cn } from "@/lib/cn";

const COLOR = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
};

const Badge = ({ color = "slate", className, children }) => (
    <span
        className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            COLOR[color],
            className,
        )}
    >
        {children}
    </span>
);

export default Badge;
