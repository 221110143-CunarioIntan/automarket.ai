import { cn } from "@/lib/cn";

const Checkbox = ({ id, className, children, ...props }) => {
    return (
        <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
                type="checkbox"
                id={id}
                className={cn("mt-0.5 rounded", className)}
                {...props}
            />
            <span>{children}</span>
        </label>
    );
};

export default Checkbox;
