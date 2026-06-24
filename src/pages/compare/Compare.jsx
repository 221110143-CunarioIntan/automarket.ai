import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LuArrowLeftRight, LuBike, LuCar, LuPlus, LuX } from "react-icons/lu";
import { useFetchData } from "@/hooks";
import { cn } from "@/lib/cn";
import { formatBrand, formatCurrency, fuelLabel } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import VehiclePicker from "./VehiclePicker";

const fetchById = async (id) => {
    if (!id) return null;
    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .eq("status", "APPROVED")
        .maybeSingle();
    if (error) throw error;
    return data;
};

const SPEC_ROWS = [
    { label: "Harga", get: (v) => formatCurrency(v.price_cash) },
    { label: "Jenis", get: (v) => (v.type === "CAR" ? "Mobil" : "Motor") },
    { label: "Body Type", get: (v) => v.body_type || "-" },
    { label: "Tahun", get: (v) => String(v.year) },
    { label: "Transmisi", get: (v) => v.transmission || "-" },
    { label: "Bahan Bakar", get: (v) => (v.fuel ? fuelLabel(v.fuel) : "-") },
    {
        label: "Kapasitas Mesin",
        get: (v) => (v.engine_cc ? `${v.engine_cc} cc` : "-"),
    },
    {
        label: "Kilometer",
        get: (v) => `${v.mileage?.toLocaleString("id-ID") ?? 0} km`,
    },
    { label: "Warna", get: (v) => v.color || "-" },
    { label: "Lokasi", get: (v) => v.location || "-" },
];

const Compare = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const id1 = searchParams.get("v1") ?? "";
    const id2 = searchParams.get("v2") ?? "";
    const [pickerSlot, setPickerSlot] = useState(null);

    const v1 = useFetchData(() => fetchById(id1), [id1]);
    const v2 = useFetchData(() => fetchById(id2), [id2]);

    const setSlot = (slot, vehicleId) => {
        const next = new URLSearchParams(searchParams);
        const key = slot === 1 ? "v1" : "v2";
        if (vehicleId) next.set(key, vehicleId);
        else next.delete(key);
        setSearchParams(next);
    };

    // When one slot is filled, lock the picker for the other slot to the same type.
    const lockType =
        pickerSlot === 1
            ? v2.data?.type
            : pickerSlot === 2
              ? v1.data?.type
              : undefined;
    const excludeId = pickerSlot === 1 ? id2 : pickerSlot === 2 ? id1 : undefined;

    const both = v1.data && v2.data;
    const anySelected = v1.data || v2.data;

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="mb-6">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                    <LuArrowLeftRight className="h-6 w-6 text-blue-600" />
                    Bandingkan Kendaraan
                </h1>
                <p className="text-sm text-slate-500">
                    Pilih dua kendaraan untuk membandingkan spesifikasinya
                    berdampingan.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
                {/* Slot headers */}
                <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50/50">
                    <div className="p-3">
                        <SlotCard
                            slot={1}
                            state={v1}
                            onPick={() => setPickerSlot(1)}
                            onRemove={() => setSlot(1, null)}
                        />
                    </div>
                    <div className="p-3">
                        <SlotCard
                            slot={2}
                            state={v2}
                            onPick={() => setPickerSlot(2)}
                            onRemove={() => setSlot(2, null)}
                        />
                    </div>
                </div>

                {/* Spec comparison — label on top, values side-by-side (mobile-friendly) */}
                {anySelected ? (
                    SPEC_ROWS.map((row, i) => {
                        const a = v1.data ? row.get(v1.data) : null;
                        const b = v2.data ? row.get(v2.data) : null;
                        const diff = both && a !== b;
                        return (
                            <div
                                key={row.label}
                                className={cn(
                                    "border-t border-slate-100",
                                    i % 2 ? "bg-slate-50/40" : "bg-white",
                                    diff && "bg-amber-50",
                                )}
                            >
                                <p className="px-4 pt-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
                                    {row.label}
                                </p>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Cell value={a} diff={diff} />
                                    <Cell value={b} diff={diff} />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="px-4 py-10 text-center text-sm text-slate-500">
                        Pilih kendaraan di kedua kolom untuk mulai
                        membandingkan.
                    </p>
                )}
            </div>

            <VehiclePicker
                open={pickerSlot !== null}
                onClose={() => setPickerSlot(null)}
                type={lockType}
                excludeId={excludeId}
                onSelect={(v) => {
                    setSlot(pickerSlot, v.id);
                    setPickerSlot(null);
                }}
            />
        </div>
    );
};

const Cell = ({ value, diff }) => (
    <div
        className={cn(
            "px-4 pt-1 pb-3 text-sm wrap-break-word",
            diff ? "font-semibold text-slate-900" : "text-slate-700",
        )}
    >
        {value ?? "-"}
    </div>
);

const SlotCard = ({ slot, state, onPick, onRemove }) => {
    const { data: vehicle, loading } = state;

    if (loading)
        return <div className="h-40 animate-pulse rounded-xl bg-slate-200" />;

    if (!vehicle)
        return (
            <button
                type="button"
                onClick={onPick}
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600"
            >
                <LuPlus className="h-7 w-7" />
                <span className="text-sm font-medium">
                    Pilih Kendaraan {slot}
                </span>
            </button>
        );

    const Icon = vehicle.type === "CAR" ? LuCar : LuBike;
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm hover:bg-red-100 hover:text-red-600"
                aria-label="Hapus"
            >
                <LuX className="h-4 w-4" />
            </button>
            <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-200">
                <Icon className="h-14 w-14 text-slate-400" />
            </div>
            <p className="mt-3 truncate font-bold text-slate-900">
                {formatBrand(vehicle.brand)} {vehicle.model}
            </p>
            <p className="text-sm font-semibold text-blue-600">
                {formatCurrency(vehicle.price_cash)}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                <Link
                    to={`/vehicle/${vehicle.id}`}
                    className="text-slate-500 hover:text-blue-600"
                >
                    Lihat detail
                </Link>
                <span className="text-slate-300">·</span>
                <button
                    type="button"
                    onClick={onPick}
                    className="text-slate-500 hover:text-blue-600"
                >
                    Ganti
                </button>
            </div>
        </div>
    );
};

export default Compare;
