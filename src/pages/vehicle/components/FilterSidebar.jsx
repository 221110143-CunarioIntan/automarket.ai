import { Button, Input, InputNumber, Select } from "@/components/ui";
import {
    BRAND_OPTIONS,
    CAR_BODY_OPTIONS,
    FUEL_OPTIONS,
    MOTOR_BODY_OPTIONS,
    TRANSMISSION_OPTIONS,
} from "@/lib/enums";

const CURRENT_YEAR = new Date().getFullYear();

const SORT_OPTIONS = [
    { value: "newest", label: "Terbaru diposting" },
    { value: "price_asc", label: "Harga: Termurah" },
    { value: "price_desc", label: "Harga: Termahal" },
    { value: "year_desc", label: "Tahun: Terbaru" },
    { value: "year_asc", label: "Tahun: Terlama" },
];

const FilterSidebar = ({
    filters,
    isCar,
    onChange,
    onReset,
    onApply,
    isDirty,
}) => (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-8rem)] w-72 shrink-0 flex-col self-start rounded-xl border border-slate-200 bg-white shadow-sm lg:flex">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Filter</h2>
            <button
                type="button"
                onClick={onReset}
                className="text-xs text-slate-500 hover:text-blue-600"
            >
                Reset filter
            </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <FilterFields
                filters={filters}
                isCar={isCar}
                onChange={onChange}
            />
        </div>
        <div className="shrink-0 border-t border-slate-100 px-5 py-4">
            <Button
                type="button"
                onClick={onApply}
                disabled={!isDirty}
                className="w-full"
            >
                {isDirty ? "Terapkan filter" : "Filter diterapkan"}
            </Button>
        </div>
    </aside>
);

const FilterFields = ({ filters, isCar, onChange }) => {
    const bodyOptions = isCar ? CAR_BODY_OPTIONS : MOTOR_BODY_OPTIONS;
    return (
        <>
            <Select
                label="Brand"
                options={[
                    { value: "", label: "Semua brand" },
                    ...BRAND_OPTIONS,
                ]}
                value={filters.brand}
                onChange={(v) => onChange("brand", v)}
                searchPlaceholder="Cari brand..."
            />
            <Select
                label="Body Type"
                options={[{ value: "", label: "Semua tipe" }, ...bodyOptions]}
                value={filters.body_type}
                onChange={(v) => onChange("body_type", v)}
            />
            <Select
                label="Transmisi"
                options={[
                    { value: "", label: "Semua transmisi" },
                    ...TRANSMISSION_OPTIONS,
                ]}
                value={filters.transmission}
                onChange={(v) => onChange("transmission", v)}
            />
            {isCar && (
                <Select
                    label="Bahan Bakar"
                    options={[
                        { value: "", label: "Semua bahan bakar" },
                        ...FUEL_OPTIONS,
                    ]}
                    value={filters.fuel}
                    onChange={(v) => onChange("fuel", v)}
                />
            )}
            <RangeField label="Harga (Rp)">
                <InputNumber
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={(v) => onChange("min_price", v)}
                />
                <span className="shrink-0 text-slate-400">–</span>
                <InputNumber
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={(v) => onChange("max_price", v)}
                />
            </RangeField>
            <RangeField label="Tahun">
                <Input
                    type="number"
                    min="1990"
                    max={CURRENT_YEAR + 1}
                    placeholder="Min"
                    value={filters.min_year}
                    onChange={(e) => onChange("min_year", e.target.value)}
                />
                <span className="shrink-0 text-slate-400">–</span>
                <Input
                    type="number"
                    min="1990"
                    max={CURRENT_YEAR + 1}
                    placeholder="Max"
                    value={filters.max_year}
                    onChange={(e) => onChange("max_year", e.target.value)}
                />
            </RangeField>
            <Input
                label="Lokasi"
                placeholder="Semua lokasi"
                value={filters.location}
                onChange={(e) => onChange("location", e.target.value)}
            />
            <Select
                label="Urutkan"
                options={SORT_OPTIONS}
                value={filters.sort}
                onChange={(v) => onChange("sort", v)}
            />
        </>
    );
};

const RangeField = ({ label, children }) => (
    <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
            {label}
        </label>
        <div className="flex items-center gap-2">{children}</div>
    </div>
);

export default FilterSidebar;
