import { useEffect } from "react";
import { LuX } from "react-icons/lu";
import { cn } from "@/lib/cn";

const Modal = ({ open, onClose, title, toolbar, children, className }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center">
            <div
                className="absolute inset-0 bg-slate-900/50"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className={cn(
                    "relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl",
                    className,
                )}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <h2 className="font-bold text-slate-900">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close"
                    >
                        <LuX className="h-5 w-5" />
                    </button>
                </div>
                {toolbar && (
                    <div className="border-b border-slate-200 px-5 py-3">
                        {toolbar}
                    </div>
                )}
                <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
