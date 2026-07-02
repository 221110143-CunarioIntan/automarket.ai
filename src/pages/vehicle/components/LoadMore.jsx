import { Button } from "@/components/ui";

const LoadMore = ({ hasMore, loading, loadingMore, onClick }) => {
    if (loading || !hasMore) return null;
    return (
        <div className="mt-8 flex justify-center">
            <Button
                variant="outline"
                onClick={onClick}
                disabled={loadingMore}
                className="px-6"
            >
                {loadingMore ? "Memuat..." : "Muat lebih banyak"}
            </Button>
        </div>
    );
};

export default LoadMore;
