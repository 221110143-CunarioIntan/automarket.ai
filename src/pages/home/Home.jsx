import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuMic, LuSearch } from "react-icons/lu";
import { Button } from "@/components/ui";
import { useFetchData } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { sampleRandom } from "@/lib/random";
import { CarCard, MotorCard } from "./components";

const POPULAR_SEARCHES = [
    "Everest",
    "Fortuner",
    "Innova",
    "Avanza",
    "Pajero Sport",
    "Triton",
    "Aerox",
    "Vario",
    "Beat",
    "Satria",
];

const POPULAR_BRANDS = [
    { name: "Toyota", logo: "toyota.png" },
    { name: "Honda", logo: "honda.png" },
    { name: "BMW", logo: "bmw.png" },
    { name: "Mercedes-Benz", logo: "mercedes_benz.png" },
    { name: "Yamaha", logo: "yamaha.png" },
    { name: "Mitsubishi", logo: "mitsubishi.png" },
    { name: "Daihatsu", logo: "daihatsu.png" },
    { name: "Suzuki", logo: "suzuki.png" },
    { name: "Lexus", logo: "lexus.png" },
    { name: "KIA", logo: "kia.png" },
    { name: "BYD", logo: "byd.png" },
    { name: "Wuling", logo: "wuling.png" },
];

const fetchApprovedVehiclesByType = async (type) => {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "APPROVED")
        .eq("type", type);
    if (error) throw error;
    return sampleRandom(data, 8);
};

const Home = () => (
    <>
        <HeroSection />
        <PopularBrandSection />
        <CarRecommendationSection />
        <MotorRecommendationSection />
    </>
);

const HeroSection = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");

    const submit = (value) => {
        const q = value.trim();
        navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    };

    return (
        <section className="relative">
            <div className="relative h-120 w-full overflow-hidden">
                <img
                    src="/images/home-hero.webp"
                    alt=""
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center px-6">
                    <h1 className="max-w-2xl text-center text-4xl font-extrabold tracking-wider text-white drop-shadow-lg md:text-5xl">
                        EXPLORE THE NEW EXPERIENCE OF AUTOMOTIVE ONLINE SHOP
                    </h1>
                </div>
            </div>

            <div className="relative z-10 mx-auto -mt-12 max-w-4xl px-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit(input);
                    }}
                    className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200"
                >
                    <div className="flex items-center gap-3">
                        <LuSearch className="h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find your vehicle using AI"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            className="text-slate-400 hover:text-slate-600"
                            aria-label="Voice search"
                        >
                            <LuMic className="h-5 w-5" />
                        </button>
                        <Button type="submit" className="px-6">
                            Search
                        </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-sm">
                        <span aria-hidden="true">🔥</span>
                        {POPULAR_SEARCHES.map((term) => (
                            <button
                                key={term}
                                type="button"
                                onClick={() => submit(term)}
                                className="text-slate-600 hover:text-blue-600"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </form>
            </div>
        </section>
    );
};

const PopularBrandSection = () => (
    <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
                Popular Brand
            </h2>
        </div>
        <div className="group overflow-hidden">
            <div className="animate-marquee flex w-max gap-3 group-hover:[animation-play-state:paused]">
                {[...POPULAR_BRANDS, ...POPULAR_BRANDS].map((brand, i) => (
                    <div
                        key={`${brand.name}-${i}`}
                        className="flex h-20 w-35 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4"
                    >
                        <img
                            src={`/images/brand-logo/${brand.logo}`}
                            alt={brand.name}
                            className="max-h-12 max-w-full object-contain mix-blend-multiply"
                        />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CarRecommendationSection = () => {
    const { data, loading, error } = useFetchData(
        () => fetchApprovedVehiclesByType("CAR"),
        [],
    );

    return (
        <section className="mx-auto max-w-7xl px-6 pb-10">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
                Car Recommendation
            </h2>
            <VehicleGrid
                items={data}
                loading={loading}
                error={error}
                renderItem={(item) => <CarCard key={item.id} car={item} />}
            />
        </section>
    );
};

const MotorRecommendationSection = () => {
    const { data, loading, error } = useFetchData(
        () => fetchApprovedVehiclesByType("MOTOR"),
        [],
    );

    return (
        <section className="mx-auto max-w-7xl px-6 pb-16">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
                Motor Recommendation
            </h2>
            <VehicleGrid
                items={data}
                loading={loading}
                error={error}
                renderItem={(item) => <MotorCard key={item.id} motor={item} />}
            />
        </section>
    );
};

const VehicleGrid = ({ items, loading, error, renderItem }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
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
        return <p className="text-sm text-slate-500">No vehicles found.</p>;
    }
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(renderItem)}
        </div>
    );
};

export default Home;
