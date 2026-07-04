import { useEffect, useState } from "react";
import { LuMessageCircle } from "react-icons/lu";
import { useAuth } from "@/contexts";
import { supabase } from "@/lib/supabase";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const fetchComments = async (vehicleId) => {
    const { data, error } = await supabase
        .from("comments")
        .select("*, user:users(id, name, email, role)")
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
};

const buildTree = (comments) => {
    const map = new Map();
    const roots = [];
    comments.forEach((c) => map.set(c.id, { ...c, replies: [] }));
    comments.forEach((c) => {
        if (c.parent_id) {
            map.get(c.parent_id)?.replies.push(map.get(c.id));
        } else {
            roots.push(map.get(c.id));
        }
    });
    return roots;
};

const CommentSection = ({ vehicleId, ownerId }) => {
    const { user, profile } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchComments(vehicleId);
            setComments(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [vehicleId]);

    const tree = buildTree(comments);
    const visibleCount = comments.filter((c) => !c.deleted_at).length;
    const isAdmin = profile?.role === "ADMIN";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <LuMessageCircle className="h-5 w-5" />
                Comments ({visibleCount})
            </h2>

            <CommentForm
                vehicleId={vehicleId}
                user={user}
                onCreated={load}
            />

            <div className="mt-6 space-y-5">
                {loading ? (
                    <p className="text-sm text-slate-500">
                        Memuat komentar...
                    </p>
                ) : error ? (
                    <p className="text-sm text-red-600">
                        Gagal memuat: {error.message}
                    </p>
                ) : tree.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-500">
                        Belum ada komentar. Jadilah yang pertama!
                    </p>
                ) : (
                    tree.map((c) => (
                        <CommentItem
                            key={c.id}
                            comment={c}
                            vehicleId={vehicleId}
                            ownerId={ownerId}
                            currentUser={user}
                            isAdmin={isAdmin}
                            onRefresh={load}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
