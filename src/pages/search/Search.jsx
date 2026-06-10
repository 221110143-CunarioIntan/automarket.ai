import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    LuClipboardList,
    LuHandshake,
    LuMessageCircle,
    LuMic,
    LuPlus,
    LuSearch,
    LuSend,
} from "react-icons/lu";
import { Button } from "@/components/ui";
import { useFetchData } from "@/hooks";
import { CarCard, MotorCard } from "@/pages/home/components";
import { BRAND_LABEL } from "@/lib/enums";
import { supabase } from "@/lib/supabase";

const HOW_TO_BUY = [
    {
        icon: LuSearch,
        text: "Search and find your dream car or motor, fully available on AUTOMARKET.",
    },
    {
        icon: LuClipboardList,
        text: "Explore comprehensive details of your dream car or motor.",
    },
    {
        icon: LuHandshake,
        text: "Make your choice and submit your dream car or motor purchase.",
    },
    {
        icon: LuMessageCircle,
        text: "Seller will contact you as soon as possible.",
    },
];

const sanitize = (s) => s.replace(/[%,()]/g, "").trim();

const matchBrandEnums = (needle) =>
    Object.entries(BRAND_LABEL)
        .filter(([, label]) => label.toLowerCase().includes(needle.toLowerCase()))
        .map(([value]) => value);

const fetchSearch = async (q) => {
    let query = supabase
        .from("vehicles")
        .select("*")
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false })
        .limit(12);
    const safe = sanitize(q);
    if (safe) {
        const filters = [
            `model.ilike.%${safe}%`,
            `body_type.ilike.%${safe}%`,
        ];
        const brands = matchBrandEnums(safe);
        if (brands.length) filters.push(`brand.in.(${brands.join(",")})`);
        query = query.or(filters.join(","));
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") ?? "";
    const [input, setInput] = useState(q);
    const { data, loading, error } = useFetchData(() => fetchSearch(q), [q]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        setSearchParams(trimmed ? { q: trimmed } : {});
    };

    return (
        <>
            <div className="mx-auto flex max-w-7xl gap-6 px-6 pt-8 pb-32">
                <HowToBuySidebar />
                <div className="flex min-w-0 flex-1 flex-col gap-6">
                    <ResultsGrid items={data} loading={loading} error={error} />
                    <AIResponse query={q} />
                </div>
            </div>
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-6">
                <div className="mx-auto flex max-w-7xl gap-6">
                    <div className="hidden w-64 shrink-0 lg:block" />
                    <div className="pointer-events-auto min-w-0 flex-1 bg-white py-4">
                        <SearchInput
                            value={input}
                            onChange={setInput}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const HowToBuySidebar = () => (
    <aside className="sticky top-4 hidden h-fit w-64 shrink-0 self-start rounded-2xl bg-blue-50/60 p-6 lg:block">
        <h2 className="mb-5 border-b border-blue-200 pb-3 text-center text-sm font-semibold text-blue-700">
            How to buy
        </h2>
        <ol className="space-y-6">
            {HOW_TO_BUY.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex flex-col items-center text-center">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-blue-100">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                        {text}
                    </p>
                </li>
            ))}
        </ol>
    </aside>
);

const ResultsGrid = ({ items, loading, error }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-4/3 animate-pulse rounded-xl bg-slate-200"
                    />
                ))}
            </div>
        );
    }
    if (error) {
        return (
            <p className="text-sm text-red-600">
                Failed to load: {error.message}
            </p>
        );
    }
    if (!items?.length) {
        return (
            <p className="text-sm text-slate-500">
                Tidak ada iklan yang cocok dengan pencarian.
            </p>
        );
    }
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v) =>
                v.type === "CAR" ? (
                    <CarCard key={v.id} car={v} />
                ) : (
                    <MotorCard key={v.id} motor={v} />
                ),
            )}
        </div>
    );
};

const AIResponse = ({ query }) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
        <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            AUTO&apos;Z
        </p>
        <p className="mt-2 leading-relaxed">
            {query
                ? `You searched for "${query}". AI-powered recommendation akan segera tersedia — untuk sementara kami tampilkan iklan yang cocok dari katalog kami.`
                : `Coba tanya kendaraan seperti apa yang kamu cari. Aku akan bantu rekomendasikan iklan terbaik dari marketplace.`}
        </p>
    </div>
);

const SearchInput = ({ value, onChange, onSubmit }) => (
    <form
        onSubmit={onSubmit}
        className="flex items-center gap-1 rounded-full border border-slate-300 bg-white p-2 shadow-sm"
    >
        <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Attach"
        >
            <LuPlus className="h-5 w-5" />
        </button>
        <input
            type="text"
            placeholder="Ask AUTO'Z"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
        />
        <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Voice search"
        >
            <LuMic className="h-5 w-5" />
        </button>
        <Button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full p-0"
            aria-label="Search"
        >
            <LuSend className="h-4 w-4" />
        </Button>
    </form>
);

export default Search;
