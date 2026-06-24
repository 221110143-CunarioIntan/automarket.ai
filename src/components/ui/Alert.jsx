import { cn } from "@/lib/cn";

const TONES = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-red-200 bg-red-50 text-red-700",
};

const Alert = ({ tone = "info", icon: Icon, className, children }) => (
    <div
        className={cn(
            "flex items-start gap-3 rounded-xl border p-4 text-sm",
            TONES[tone],
            className,
        )}
    >
        {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0" />}
        <div>{children}</div>
    </div>
);

export default Alert;
