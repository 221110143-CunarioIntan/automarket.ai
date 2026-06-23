import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input, InputNumber, Select, Textarea } from "@/components/ui";
import { useAuth } from "@/contexts";
import {
    BRAND_OPTIONS,
    CAR_BODY_OPTIONS,
    FUEL_OPTIONS,
    MOTOR_BODY_OPTIONS,
    TRANSMISSION_OPTIONS,
    VEHICLE_TYPE_OPTIONS,
} from "@/lib/enums";
import { supabase } from "@/lib/supabase";

const CURRENT_YEAR = new Date().getFullYear();

const UserCreate = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [submitError, setSubmitError] = useState(null);

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            type: "CAR",
            brand: "TOYOTA",
            transmission: "Manual",
            fuel: "Gasoline",
            body_type: "SUV",
        },
    });

    const vehicleType = watch("type");
    const bodyTypeOptions =
        vehicleType === "MOTOR" ? MOTOR_BODY_OPTIONS : CAR_BODY_OPTIONS;

    if (authLoading) return null;
    if (!user) {
        navigate("/login");
        return null;
    }

    const onSubmit = async (form) => {
        setSubmitError(null);
        const { error } = await supabase.from("vehicles").insert({
            user_id: user.id,
            type: form.type,
            brand: form.brand,
            model: form.model.trim(),
            year: Number(form.year),
            price_cash: Number(form.price_cash),
            body_type: form.body_type,
            color: form.color?.trim() || null,
            transmission: form.transmission,
            fuel: form.type === "MOTOR" ? null : form.fuel,
            mileage: Number(form.mileage),
            location: form.location?.trim() || null,
            engine_cc: form.engine_cc ? Number(form.engine_cc) : null,
            description: form.description?.trim() || null,
            status: "PENDING",
        });

        if (error) {
            setSubmitError(error.message);
            return;
        }

        navigate("/ads/mine");
    };

    return (
        <div className="mx-auto max-w-3xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Post Iklan Kendaraan
                </h1>
                <p className="text-sm text-slate-500">
                    Iklan akan tampil di marketplace setelah disetujui admin.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormSection title="Jenis Kendaraan">
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            control={control}
                            name="type"
                            rules={{ required: "Type wajib dipilih" }}
                            render={({ field, fieldState }) => (
                                <Select
                                    label="Type"
                                    required
                                    error={fieldState.error?.message}
                                    options={VEHICLE_TYPE_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="brand"
                            rules={{ required: "Brand wajib dipilih" }}
                            render={({ field, fieldState }) => (
                                <Select
                                    label="Brand"
                                    required
                                    error={fieldState.error?.message}
                                    options={BRAND_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                    searchPlaceholder="Search brand..."
                                />
                            )}
                        />
                    </div>
                </FormSection>

                <FormSection title="Model & Tahun">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Model"
                            id="model"
                            required
                            placeholder="e.g. Avanza, Vario 125"
                            error={errors.model?.message}
                            {...register("model", {
                                required: "Model wajib diisi",
                            })}
                        />
                        <Input
                            label="Tahun Produksi"
                            id="year"
                            type="number"
                            required
                            placeholder={CURRENT_YEAR.toString()}
                            min={1900}
                            max={CURRENT_YEAR + 1}
                            error={errors.year?.message}
                            {...register("year", {
                                required: "Tahun wajib diisi",
                                min: {
                                    value: 1900,
                                    message: "Tahun minimal 1900",
                                },
                                max: {
                                    value: CURRENT_YEAR + 1,
                                    message: `Tahun maksimal ${CURRENT_YEAR + 1}`,
                                },
                            })}
                        />
                    </div>
                </FormSection>

                <FormSection title="Spesifikasi">
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            control={control}
                            name="body_type"
                            rules={{ required: "Body type wajib dipilih" }}
                            render={({ field, fieldState }) => (
                                <Select
                                    label="Body Type"
                                    required
                                    error={fieldState.error?.message}
                                    options={bodyTypeOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="transmission"
                            rules={{ required: "Transmission wajib dipilih" }}
                            render={({ field, fieldState }) => (
                                <Select
                                    label="Transmission"
                                    required
                                    error={fieldState.error?.message}
                                    options={TRANSMISSION_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {vehicleType === "CAR" && (
                            <Controller
                                control={control}
                                name="fuel"
                                rules={{
                                    required:
                                        vehicleType === "CAR"
                                            ? "Fuel wajib dipilih"
                                            : false,
                                }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Fuel"
                                        required
                                        error={fieldState.error?.message}
                                        options={FUEL_OPTIONS}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        )}
                        <Input
                            label="Engine CC"
                            id="engine_cc"
                            type="number"
                            placeholder="e.g. 1500"
                            min={50}
                            error={errors.engine_cc?.message}
                            {...register("engine_cc")}
                        />
                        <Controller
                            control={control}
                            name="mileage"
                            rules={{
                                required: "Mileage wajib diisi",
                                min: {
                                    value: 0,
                                    message: "Mileage tidak boleh negatif",
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <InputNumber
                                    label="Mileage (km)"
                                    id="mileage"
                                    required
                                    placeholder="e.g. 50.000"
                                    error={fieldState.error?.message}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Input
                            label="Color"
                            id="color"
                            placeholder="e.g. Hitam, Putih"
                            error={errors.color?.message}
                            {...register("color")}
                        />
                    </div>
                </FormSection>

                <FormSection title="Harga & Lokasi">
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            control={control}
                            name="price_cash"
                            rules={{
                                required: "Harga wajib diisi",
                                min: {
                                    value: 1,
                                    message: "Harga harus lebih dari 0",
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <InputNumber
                                    label="Harga (Rp)"
                                    id="price_cash"
                                    required
                                    placeholder="e.g. 150.000.000"
                                    error={fieldState.error?.message}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Input
                            label="Lokasi"
                            id="location"
                            placeholder="e.g. Medan, Sumatera Utara"
                            error={errors.location?.message}
                            {...register("location")}
                        />
                    </div>
                </FormSection>

                <FormSection title="Deskripsi">
                    <Textarea
                        label="Deskripsi Iklan"
                        id="description"
                        rows={5}
                        placeholder="Ceritakan kondisi kendaraan, kelengkapan dokumen, riwayat servis, alasan dijual, dll. Kosongkan untuk memakai deskripsi otomatis."
                        error={errors.description?.message}
                        {...register("description")}
                    />
                </FormSection>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                    <h3 className="mb-3 font-semibold text-slate-900">
                        Ketentuan Posting Iklan
                    </h3>
                    <ul className="list-disc space-y-2 pl-5">
                        <li>
                            Dengan memposting iklan ini, Anda menyatakan bahwa
                            seluruh informasi yang diberikan adalah benar,
                            akurat, dan dapat dipertanggungjawabkan.
                        </li>
                        <li>
                            Iklan tidak akan langsung tampil di marketplace.
                            Tim admin akan meninjau dan menyetujui iklan
                            terlebih dahulu untuk memastikan kualitas dan
                            keaslian konten.
                        </li>
                        <li>
                            Iklan yang terindikasi penipuan, mengandung
                            informasi palsu, atau melanggar hukum akan ditolak
                            tanpa pemberitahuan.
                        </li>
                        <li>
                            Anda bertanggung jawab penuh atas keaslian dokumen
                            kendaraan (STNK, BPKB, faktur, dll.) yang dijadikan
                            dasar iklan.
                        </li>
                        <li>
                            Automarket berhak menurunkan iklan yang dilaporkan
                            oleh pengguna lain atau yang tidak sesuai dengan
                            ketentuan layanan.
                        </li>
                        <li>
                            Komunikasi lanjutan dengan calon pembeli dilakukan
                            di luar platform Automarket. Pihak Automarket tidak
                            terlibat dalam proses transaksi, pembayaran, atau
                            pengiriman kendaraan.
                        </li>
                        <li>
                            Dengan menekan tombol{" "}
                            <span className="font-semibold">Submit Iklan</span>,
                            Anda dianggap menyetujui seluruh ketentuan di atas
                            serta syarat &amp; ketentuan layanan Automarket.
                        </li>
                    </ul>
                </div>

                {submitError && (
                    <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                        {submitError}
                    </p>
                )}

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Iklan"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

const FormSection = ({ title, children }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">{title}</h2>
        {children}
    </div>
);

export default UserCreate;
