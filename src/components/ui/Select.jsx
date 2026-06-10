import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuSearch } from "react-icons/lu";
import { cn } from "@/lib/cn";

const Select = ({
    label,
    id,
    required,
    error,
    options = [],
    value,
    onChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()),
    );

    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || placeholder;

    const handleSelect = (val) => {
        onChange?.(val);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="w-full" ref={wrapperRef}>
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1 block text-sm font-medium text-slate-700"
                >
                    {label}
                    {required && (
                        <span className="ml-0.5 text-red-500">*</span>
                    )}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    id={id}
                    onClick={() => setIsOpen((s) => !s)}
                    aria-invalid={!!error}
                    className={cn(
                        "flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-left text-sm outline-none focus:ring-2",
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100",
                        !value && "text-slate-400",
                        className,
                    )}
                >
                    <span className="truncate">{selectedLabel}</span>
                    <LuChevronDown
                        className={cn(
                            "h-4 w-4 shrink-0 text-slate-400 transition",
                            isOpen && "rotate-180",
                        )}
                    />
                </button>

                {isOpen && (
                    <div className="absolute top-full z-30 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg" role="listbox">
                        <div className="relative border-b border-slate-100">
                            <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full bg-transparent py-2 pr-3 pl-9 text-sm outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <ul className="max-h-60 overflow-y-auto py-1">
                            {filtered.length === 0 ? (
                                <li className="px-3 py-2 text-sm text-slate-400">
                                    No results
                                </li>
                            ) : (
                                filtered.map((opt) => (
                                    <li key={opt.value}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSelect(opt.value)
                                            }
                                            className={cn(
                                                "flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50",
                                                opt.value === value &&
                                                    "bg-blue-50 font-medium text-blue-700",
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default Select;
