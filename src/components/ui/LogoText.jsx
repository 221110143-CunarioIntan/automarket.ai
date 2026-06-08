import { cn } from "@/lib/cn";

const LogoText = ({ className }) => (
    <span
        className={cn(
            "font-extrabold tracking-wider text-slate-900",
            className,
        )}
    >
        AUTOMARKET
    </span>
);

export default LogoText;
