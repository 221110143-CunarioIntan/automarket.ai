import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
    FilterSidebar,
    Header,
    LoadMore,
    VehicleGrid,
} from "./components";

const PAGE_SIZE = 20;

const extractFilters = (searchParams) => ({
    type: searchParams.get("type") === "MOTOR" ? "MOTOR" : "CAR",
    brand: searchParams.get("brand") ?? "",
    body_type: searchParams.get("body_type") ?? "",
    transmission: searchParams.get("transmission") ?? "",
    fuel: searchParams.get("fuel") ?? "",
    min_price: searchParams.get("min_price") ?? "",
    max_price: searchParams.get("max_price") ?? "",
    min_year: searchParams.get("min_year") ?? "",
    max_year: searchParams.get("max_year") ?? "",
    location: searchParams.get("location") ?? "",
    sort: searchParams.get("sort") ?? "newest",
});

const fetchVehicles = async (filters, offset, limit) => {
    let query = supabase
        .from("vehicles")
        .select("*, vehicle_images(webp_url, order)", { count: "exact" })
        .eq("status", "APPROVED")
        .eq("type", filters.type)
        .range(offset, offset + limit - 1);

    if (filters.brand) query = query.eq("brand", filters.brand);
    if (filters.body_type)
        query = query.ilike("body_type", `%${filters.body_type}%`);
    if (filters.transmission)
        query = query.eq("transmission", filters.transmission);
    if (filters.fuel) query = query.eq("fuel", filters.fuel);
    if (filters.min_price)
        query = query.gte("price_cash", Number(filters.min_price));
    if (filters.max_price)
        query = query.lte("price_cash", Number(filters.max_price));
    if (filters.min_year) query = query.gte("year", Number(filters.min_year));
    if (filters.max_year) query = query.lte("year", Number(filters.max_year));
    if (filters.location)
        query = query.ilike("location", `%${filters.location}%`);

    switch (filters.sort) {
        case "price_asc":
            query = query.order("price_cash", { ascending: true });
            break;
        case "price_desc":
            query = query.order("price_cash", { ascending: false });
            break;
        case "year_desc":
            query = query.order("year", { ascending: false });
            break;
        case "year_asc":
            query = query.order("year", { ascending: true });
            break;
        default:
            query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data ?? [], count: count ?? 0 };
};

const List = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [vehicles, setVehicles] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const filters = useMemo(() => extractFilters(searchParams), [searchParams]);
    const filterKey = searchParams.toString();
    const isCar = filters.type === "CAR";
    const hasMore = vehicles.length < total;

    const [pending, setPending] = useState(filters);
    useEffect(() => {
        setPending(filters);
    }, [filterKey]);
    const isDirty = useMemo(
        () => JSON.stringify(pending) !== JSON.stringify(filters),
        [pending, filters],
    );

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, count } = await fetchVehicles(
                    filters,
                    0,
                    PAGE_SIZE,
                );
                if (!cancelled) {
                    setVehicles(data);
                    setTotal(count);
                }
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [filterKey]);

    const loadMore = async () => {
        setLoadingMore(true);
        try {
            const { data } = await fetchVehicles(
                filters,
                vehicles.length,
                PAGE_SIZE,
            );
            setVehicles((prev) => [...prev, ...data]);
        } catch (err) {
            setError(err);
        } finally {
            setLoadingMore(false);
        }
    };

    const updatePending = (key, value) => {
        setPending((prev) => ({ ...prev, [key]: value }));
    };

    const applyPending = () => {
        const next = new URLSearchParams();
        Object.entries(pending).forEach(([k, v]) => {
            if (k === "sort" && (v === "newest" || v === "")) return;
            if (v != null && v !== "") next.set(k, String(v));
        });
        if (!next.has("type")) next.set("type", filters.type);
        setSearchParams(next);
    };

    const resetFilters = () => {
        const next = new URLSearchParams();
        next.set("type", filters.type);
        setSearchParams(next);
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <Header
                type={filters.type}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={() => setSidebarOpen((p) => !p)}
            />
            <div className="flex gap-6">
                {sidebarOpen && (
                    <FilterSidebar
                        filters={pending}
                        isCar={isCar}
                        onChange={updatePending}
                        onReset={resetFilters}
                        onApply={applyPending}
                        isDirty={isDirty}
                    />
                )}
                <div className="min-w-0 flex-1">
                    <VehicleGrid
                        vehicles={vehicles}
                        isCar={isCar}
                        loading={loading}
                        error={error}
                        compact={sidebarOpen}
                    />
                    <LoadMore
                        hasMore={hasMore}
                        loading={loading}
                        loadingMore={loadingMore}
                        onClick={loadMore}
                    />
                </div>
            </div>
        </div>
    );
};

export default List;
