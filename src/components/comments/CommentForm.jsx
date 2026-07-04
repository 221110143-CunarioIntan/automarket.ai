import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Textarea } from "@/components/ui";
import { supabase } from "@/lib/supabase";

const MAX_CHARS = 1000;

const CommentForm = ({
    vehicleId,
    parentId = null,
    depth = 0,
    user,
    onCreated,
    onCancel,
    autoFocus,
}) => {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!user) {
        return (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
                <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Login
                </Link>{" "}
                untuk menulis komentar.
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) return;
        setSubmitting(true);
        setError(null);
        const { error: err } = await supabase.from("comments").insert({
            vehicle_id: vehicleId,
            user_id: user.id,
            parent_id: parentId,
            depth,
            content: trimmed,
        });
        setSubmitting(false);
        if (err) {
            setError(err.message);
            return;
        }
        setContent("");
        onCreated?.();
        onCancel?.();
    };

    const remaining = MAX_CHARS - content.length;
    const overLimit = remaining < 0;
    const isReply = parentId != null;
    const hasContent = content.length > 0;
    const showFooter = hasContent || onCancel;

    return (
        <form onSubmit={handleSubmit}>
            <Textarea
                rows={isReply ? 2 : 3}
                placeholder={isReply ? "Tulis balasan..." : "Tulis komentar..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus={autoFocus}
            />
            {showFooter && (
                <div
                    className={`mt-2 flex items-center gap-3 ${hasContent ? "justify-between" : "justify-end"}`}
                >
                    {hasContent && (
                        <span
                            className={`text-xs ${overLimit ? "text-red-600" : "text-slate-500"}`}
                        >
                            {remaining} karakter tersisa
                        </span>
                    )}
                    <div className="flex gap-2">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={submitting}
                            >
                                Batal
                            </Button>
                        )}
                        {hasContent && (
                            <Button
                                type="submit"
                                disabled={submitting || overLimit}
                            >
                                {submitting
                                    ? "Mengirim..."
                                    : isReply
                                      ? "Balas"
                                      : "Kirim"}
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {error && (
                <p className="mt-2 text-xs text-red-600">Gagal kirim: {error}</p>
            )}
        </form>
    );
};

export default CommentForm;
