import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuShieldAlert } from "react-icons/lu";
import {
    Alert,
    Button,
    ErrorState,
    Input,
    InputNumber,
    NotFoundState,
    Select,
    Textarea,
} from "@/components/ui";
import { useFetchData } from "@/hooks";
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

const fetchAd = async (id) => {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*, poster:users!user_id (id, email, name)")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
};

const AdminEdit = () => {
    const { id } = useParams();
    const { data: vehicle, loading, error } = useFetchData(
        () => fetchAd(id),
        [id],
    );

    if (loading) return <Skeleton />;

    const backAction = (
        <Link
            to={`/admin/ads/${id}`}
            className="font-medium text-blue-600 hover:underline"
        >
            ← Back to ad
        </Link>
    );
    if (error)
        return (
            <div className="mx-auto max-w-3xl px-6 py-16">
                <ErrorState
                    title="Failed to load ad"
                    description={error.message}
                    action={backAction}
                />
            </div>
        );
    if (!vehicle)
        return (
            <div className="mx-auto max-w-3xl px-6 py-16">
                <NotFoundState title="Ad not found" action={backAction} />
            </div>
        );

    return <EditForm vehicle={vehicle} />;
};

const EditForm = ({ vehicle }) => {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState(null);

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            type: vehicle.type,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            body_type: vehicle.body_type,
            transmission: vehicle.transmission,
            fuel: vehicle.fuel ?? "Gasoline",
            engine_cc: vehicle.engine_cc ?? "",
            mileage: vehicle.mileage,
            color: vehicle.color ?? "",
            price_cash: Number(vehicle.price_cash),
            location: vehicle.location ?? "",
            description: vehicle.description ?? "",
        },
    });

    const vehicleType = watch("type");
    const bodyTypeOptions =
        vehicleType === "MOTOR" ? MOTOR_BODY_OPTIONS : CAR_BODY_OPTIONS;
    const poster = vehicle.poster;

    const onSubmit = async (form) => {
        setSubmitError(null);
        const { error } = await supabase
            .from("vehicles")
            .update({
                type: form.type,
                brand: form.brand,
                model: form.model.trim(),
                year: Number(form.year),
                body_type: form.body_type,
                color: form.color?.trim() || null,
                transmission: form.transmission,
                fuel: form.type === "MOTOR" ? null : form.fuel,
                mileage: Number(form.mileage),
                engine_cc: form.engine_cc ? Number(form.engine_cc) : null,
            })
            .eq("id", vehicle.id);

        if (error) {
            setSubmitError(error.message);
            return;
        }

        navigate(`/admin/ads/${vehicle.id}`);
    };

    return (
        <div className="mx-auto max-w-3xl px-6 py-8">
            <Link
                to={`/admin/ads/${vehicle.id}`}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back to ad
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Edit Iklan Kendaraan
                </h1>
                <p className="text-sm text-slate-500">
                    Mode admin — memperbaiki data iklan milik pengguna.
                </p>
            </div>

            <Alert tone="warning" icon={LuShieldAlert} className="mb-6">
                Anda mengedit iklan milik{" "}
                <span className="font-semibold">
                    {poster?.name || poster?.email || "pengguna"}
                </span>
                . Perubahan langsung tersimpan dan tidak mengubah status
                persetujuan iklan.
            </Alert>

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
                            render={({ field }) => (
                                <InputNumber
                                    label="Harga (Rp)"
                                    id="price_cash"
                                    disabled
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Input
                            label="Lokasi"
                            id="location"
                            disabled
                            {...register("location")}
                        />
                    </div>
                </FormSection>

                <FormSection title="Deskripsi">
                    <Textarea
                        label="Deskripsi Iklan"
                        id="description"
                        rows={5}
                        disabled
                        error={errors.description?.message}
                        {...register("description")}
                    />
                </FormSection>

                {submitError && <Alert tone="danger">{submitError}</Alert>}

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/admin/ads/${vehicle.id}`)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Simpan Perubahan"}
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

const Skeleton = () => (
    <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="space-y-6">
            <div className="h-32 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-32 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-48 animate-pulse rounded-xl bg-slate-200" />
        </div>
    </div>
);

export default AdminEdit;
