import { cn } from "@/lib/cn";

const EmptyState = ({ icon, title, description, action, className }) => (
    <div
        className={cn(
            "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center",
            className,
        )}
    >
        {icon && (
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                {icon}
            </div>
        )}
        {title && (
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        )}
        {description && (
            <p className="mt-1 max-w-sm text-sm text-slate-500">
                {description}
            </p>
        )}
        {action && <div className="mt-6">{action}</div>}
    </div>
);

export default EmptyState;
