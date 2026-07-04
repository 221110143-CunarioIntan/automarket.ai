import { useEffect, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu";

const Lightbox = ({ open, onClose, images = [], initialIndex = 0 }) => {
    const [current, setCurrent] = useState(initialIndex);

    useEffect(() => {
        if (open) setCurrent(initialIndex);
    }, [open, initialIndex]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
            if (e.key === "ArrowLeft")
                setCurrent((c) => (c - 1 + images.length) % images.length);
            if (e.key === "ArrowRight")
                setCurrent((c) => (c + 1) % images.length);
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, images.length, onClose]);

    if (!open || !images.length) return null;

    const prev = () =>
        setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);
    const hasMany = images.length > 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/85"
                onClick={onClose}
                aria-hidden="true"
            />

            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close"
            >
                <LuX className="h-5 w-5" />
            </button>

            {hasMany && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        className="absolute left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Previous"
                    >
                        <LuArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="absolute right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Next"
                    >
                        <LuArrowRight className="h-5 w-5" />
                    </button>
                    <span className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                        {current + 1} / {images.length}
                    </span>
                </>
            )}

            <img
                src={images[current]}
                alt={`Image ${current + 1}`}
                className="relative z-10 max-h-[90vh] max-w-[90vw] object-contain"
            />
        </div>
    );
};

export default Lightbox;
