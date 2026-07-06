import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuMail, LuMessageSquare, LuSend } from "react-icons/lu";
import { Alert, Button, Input, Textarea } from "@/components/ui";

const ADMIN_EMAIL = "admin@automarket.ai";

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async () => {
        // Form is intentionally dead — no backend send.
        await new Promise((r) => setTimeout(r, 500));
        setSubmitted(true);
        reset();
    };

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    Hubungi Kami
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Ada pertanyaan, saran, atau menemukan bug? Kirim pesan atau
                    kontak kami langsung via email.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <aside className="space-y-4 lg:col-span-1">
                    <InfoCard
                        icon={<LuMail className="h-5 w-5" />}
                        title="Email"
                        value={
                            <a
                                href={`mailto:${ADMIN_EMAIL}`}
                                className="text-blue-600 hover:underline"
                            >
                                {ADMIN_EMAIL}
                            </a>
                        }
                        hint="Balasan dalam 1-2 hari kerja."
                    />
                    <InfoCard
                        icon={<LuMessageSquare className="h-5 w-5" />}
                        title="Kirim Pesan"
                        value="Gunakan form di samping."
                        hint="Kami akan tanggapi melalui email yang kamu cantumkan."
                    />
                </aside>

                <div className="lg:col-span-2">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
                    >
                        {submitted && (
                            <Alert tone="success">
                                Terima kasih! Pesan kamu sudah kami terima.
                                Kami akan balas via email dalam 1-2 hari kerja.
                            </Alert>
                        )}

                        <Input
                            label="Nama"
                            id="name"
                            required
                            placeholder="Nama lengkap"
                            error={errors.name?.message}
                            {...register("name", {
                                required: "Nama wajib diisi",
                            })}
                        />
                        <Input
                            label="Email"
                            id="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            hint="Kami balas ke email ini."
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email wajib diisi",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Format email tidak valid",
                                },
                            })}
                        />
                        <Input
                            label="Subjek"
                            id="subject"
                            placeholder="Contoh: Pertanyaan tentang cara post iklan"
                            error={errors.subject?.message}
                            {...register("subject")}
                        />
                        <Textarea
                            label="Pesan"
                            id="message"
                            rows={5}
                            required
                            placeholder="Tulis pesan atau pertanyaan kamu di sini..."
                            error={errors.message?.message}
                            {...register("message", {
                                required: "Pesan wajib diisi",
                                minLength: {
                                    value: 10,
                                    message: "Pesan minimal 10 karakter",
                                },
                            })}
                        />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-1.5"
                            >
                                <LuSend className="h-4 w-4" />
                                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, title, value, hint }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-slate-700">
            {icon}
            <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <div className="mt-2 text-sm text-slate-900">{value}</div>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
);

export default Contact;
