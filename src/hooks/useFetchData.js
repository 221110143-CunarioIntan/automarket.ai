import { useEffect, useState } from "react";

/**
 * Generic data fetching hook.
 *
 * Usage:
 *     const { data, loading, error, refetch } = useFetchData(
 *         async () => {
 *             const { data, error } = await supabase.from("table").select();
 *             if (error) throw error;
 *             return data;
 *         },
 *         [filterValue],
 *     );
 *
 * The fetcher must throw on error (don't return error objects).
 * Pass deps so the fetch re-runs when they change.
 */
export const useFetchData = (fetcher, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetcher();
                if (!cancelled) setData(result);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, trigger]);

    const refetch = () => setTrigger((t) => t + 1);

    return { data, loading, error, refetch };
};
