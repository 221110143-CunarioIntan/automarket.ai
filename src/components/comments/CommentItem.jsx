import { useState } from "react";
import { LuCornerDownRight, LuTrash2 } from "react-icons/lu";
import { Avatar, Button, Modal } from "@/components/ui";
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
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const isDeleted = !!comment.deleted_at;
    const isAuthor = currentUser?.id === comment.user_id;
    const canDelete = !isDeleted && (isAuthor || isAdmin);
    const canReply = !isDeleted && currentUser && comment.depth < MAX_DEPTH;
    const author = comment.user;
    const displayName = author?.name || author?.email || "User";
    const isOwner = ownerId && author?.id === ownerId;

    const handleDelete = async () => {
        setDeleting(true);
        setDeleteError(null);
        const { error } = await supabase
            .from("comments")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", comment.id);
        setDeleting(false);
        if (error) {
            setDeleteError(error.message);
            return;
        }
        setConfirmingDelete(false);
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
                                onClick={() => setConfirmingDelete(true)}
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

            <Modal
                open={confirmingDelete}
                onClose={() => !deleting && setConfirmingDelete(false)}
                title="Hapus komentar?"
            >
                <p className="text-sm text-slate-600">
                    Komentar ini akan ditandai sebagai dihapus. Balasan yang
                    ada tetap terlihat, tapi isi komentar diganti dengan
                    placeholder.
                </p>
                {deleteError && (
                    <p className="mt-3 text-sm text-red-600">
                        Gagal hapus: {deleteError}
                    </p>
                )}
                <div className="mt-5 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConfirmingDelete(false)}
                        disabled={deleting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {deleting ? "Menghapus..." : "Hapus"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default CommentItem;
