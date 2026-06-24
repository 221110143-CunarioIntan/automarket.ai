import { useState } from "react";
import { LuBike, LuCar, LuSearch } from "react-icons/lu";
import { Modal } from "@/components/ui";
import { useDebounce, useFetchData } from "@/hooks";
import { BRAND_LABEL } from "@/lib/enums";
import { formatBrand, formatCurrency } from "@/lib/format";
import { supabase } from "@/lib/supabase";

// Same search shape as the Search page: ilike on model/body_type + brand enum match.
const sanitize = (s) => s.replace(/[%,()]/g, "").trim();
const matchBrandEnums = (needle) =>
    Object.entries(BRAND_LABEL)
        .filter(([, label]) =>
            label.toLowerCase().includes(needle.toLowerCase()),
        )
        .map(([value]) => value);

const fetchVehicles = async ({ q, type, excludeId }) => {
    let query = supabase
        .from("vehicles")
        .select("*")
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false })
        .limit(20);
    if (type) query = query.eq("type", type);
    if (excludeId) query = query.neq("id", excludeId);

    const safe = sanitize(q);
    if (safe) {
        const filters = [`model.ilike.%${safe}%`, `body_type.ilike.%${safe}%`];
        const brands = matchBrandEnums(safe);
        if (brands.length) filters.push(`brand.in.(${brands.join(",")})`);
        query = query.or(filters.join(","));
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

const VehiclePicker = ({ open, onClose, onSelect, type, excludeId }) => {
    const [input, setInput] = useState("");
    const q = useDebounce(input.trim(), 300);

    const { data, loading, error } = useFetchData(
        () => (open ? fetchVehicles({ q, type, excludeId }) : null),
        [q, type, excludeId, open],
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Pilih Kendaraan"
            toolbar={
                <>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2"
                    >
                        <LuSearch className="h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari brand atau model..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                    </form>
                    {type && (
                        <p className="mt-2 text-xs text-slate-500">
                            Menampilkan {type === "CAR" ? "mobil" : "motor"} saja
                            — harus sama dengan kendaraan pertama.
                        </p>
                    )}
                </>
            }
        >
            <ResultList
                data={data}
                loading={loading}
                error={error}
                onSelect={onSelect}
            />
        </Modal>
    );
};

const ResultList = ({ data, loading, error, onSelect }) => {
    if (loading)
        return (
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-14 animate-pulse rounded-lg bg-slate-100"
                    />
                ))}
            </div>
        );
    if (error)
        return (
            <p className="text-sm text-red-600">Gagal memuat: {error.message}</p>
        );
    if (!data?.length)
        return (
            <p className="text-sm text-slate-500">
                Tidak ada kendaraan yang cocok.
            </p>
        );

    return (
        <ul className="space-y-2">
            {data.map((v) => {
                const Icon = v.type === "CAR" ? LuCar : LuBike;
                return (
                    <li key={v.id}>
                        <button
                            type="button"
                            onClick={() => onSelect(v)}
                            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-2 text-left hover:border-blue-400 hover:bg-blue-50/40"
                        >
                            <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-slate-200">
                                <Icon className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {formatBrand(v.brand)} {v.model}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {v.year} · {formatCurrency(v.price_cash)}
                                </p>
                            </div>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default VehiclePicker;
