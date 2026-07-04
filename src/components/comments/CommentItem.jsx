import { useState } from "react";
import { LuCornerDownRight, LuTrash2 } from "react-icons/lu";
import { Avatar } from "@/components/ui";
import { formatRelativeTime } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import CommentForm from "./CommentForm";

const MAX_DEPTH = 2;

const CommentItem = ({
    comment,
    vehicleId,
    ownerId,
    currentUser,
    isAdmin,
    onRefresh,
}) => {
    const [replying, setReplying] = useState(false);
    const isDeleted = !!comment.deleted_at;
    const isAuthor = currentUser?.id === comment.user_id;
    const canDelete = !isDeleted && (isAuthor || isAdmin);
    const canReply = !isDeleted && currentUser && comment.depth < MAX_DEPTH;
    const author = comment.user;
    const displayName = author?.name || author?.email || "User";
    const isOwner = ownerId && author?.id === ownerId;

    const handleDelete = async () => {
        if (
            !confirm(
                "Hapus komentar ini? Balasan tetap terlihat dengan placeholder.",
            )
        )
            return;
        const { error } = await supabase
            .from("comments")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", comment.id);
        if (error) {
            alert(`Gagal hapus: ${error.message}`);
            return;
        }
        onRefresh?.();
    };

    return (
        <div>
            <div className="flex gap-3">
                <Avatar
                    name={author?.name}
                    email={author?.email}
                    size="sm"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-900">
                            {isDeleted ? "—" : displayName}
                        </span>
                        {!isDeleted && isOwner && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                OWNER
                            </span>
                        )}
                        {author?.role === "ADMIN" && !isDeleted && (
                            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                                ADMIN
                            </span>
                        )}
                        <span className="text-xs text-slate-500">
                            · {formatRelativeTime(comment.created_at)}
                        </span>
                    </div>
                    <p
                        className={`mt-1 text-sm whitespace-pre-line ${
                            isDeleted
                                ? "text-slate-400 italic"
                                : "text-slate-700"
                        }`}
                    >
                        {isDeleted
                            ? "[Komentar telah dihapus]"
                            : comment.content}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs">
                        {canReply && (
                            <button
                                type="button"
                                onClick={() => setReplying((p) => !p)}
                                className="flex items-center gap-1 text-slate-500 hover:text-blue-600"
                            >
                                <LuCornerDownRight className="h-3.5 w-3.5" />
                                Balas
                            </button>
                        )}
                        {canDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex items-center gap-1 text-slate-500 hover:text-red-600"
                            >
                                <LuTrash2 className="h-3.5 w-3.5" />
                                Hapus
                            </button>
                        )}
                    </div>
                    {replying && (
                        <div className="mt-3">
                            <CommentForm
                                vehicleId={vehicleId}
                                parentId={comment.id}
                                depth={comment.depth + 1}
                                user={currentUser}
                                onCreated={onRefresh}
                                onCancel={() => setReplying(false)}
                                autoFocus
                            />
                        </div>
                    )}
                </div>
            </div>
            {comment.replies?.length > 0 && (
                <div className="mt-4 space-y-4 border-l-2 border-slate-100 pl-4 sm:pl-6">
                    {comment.replies.map((r) => (
                        <CommentItem
                            key={r.id}
                            comment={r}
                            vehicleId={vehicleId}
                            ownerId={ownerId}
                            currentUser={currentUser}
                            isAdmin={isAdmin}
                            onRefresh={onRefresh}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
