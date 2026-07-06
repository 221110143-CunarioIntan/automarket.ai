import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const Dropdown = ({ trigger, children, align = "right", className }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onOutside = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onOutside);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onOutside);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={ref} className={cn("relative", className)}>
            <div onClick={() => setOpen((p) => !p)}>{trigger}</div>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className={cn(
                        "absolute top-full z-40 mt-2 w-56",
                        align === "right" ? "right-0" : "left-0",
                    )}
                >
                    <div className="origin-top overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

const Header = ({ children, className }) => (
    <div
        className={cn(
            "border-b border-slate-100 px-3 pt-3 pb-2",
            className,
        )}
    >
        {children}
    </div>
);

const Item = ({ to, onClick, icon, children, className }) => {
    const base =
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50";
    if (to) {
        return (
            <Link to={to} className={cn(base, className)}>
                {icon}
                {children}
            </Link>
        );
    }
    return (
        <button type="button" onClick={onClick} className={cn(base, className)}>
            {icon}
            {children}
        </button>
    );
};

const Divider = () => <div className="border-t border-slate-100" />;

Dropdown.Header = Header;
Dropdown.Item = Item;
Dropdown.Divider = Divider;

export default Dropdown;
