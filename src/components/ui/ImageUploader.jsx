import { useRef } from "react";
import { LuImagePlus, LuX } from "react-icons/lu";

const ACCEPT = "image/jpeg,image/png,image/webp";
const DEFAULT_MAX = 5;

const ImageUploader = ({
    value = [],
    onChange,
    max = DEFAULT_MAX,
    label,
    disabled,
}) => {
    const inputRef = useRef(null);

    const handleAdd = (event) => {
        const files = Array.from(event.target.files ?? []).slice(
            0,
            max - value.length,
        );
        const items = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        onChange([...value, ...items]);
        event.target.value = "";
    };

    const handleRemove = (index) => {
        const next = [...value];
        URL.revokeObjectURL(next[index].previewUrl);
        next.splice(index, 1);
        onChange(next);
    };

    const canAdd = value.length < max && !disabled;

    return (
        <div>
            {label && (
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {value.map((item, i) => (
                    <div
                        key={item.previewUrl}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                    >
                        <img
                            src={item.previewUrl}
                            alt={`Preview ${i + 1}`}
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(i)}
                            disabled={disabled}
                            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed"
                            aria-label="Hapus gambar"
                        >
                            <LuX className="h-3.5 w-3.5" />
                        </button>
                        {i === 0 && (
                            <span className="absolute bottom-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                                Utama
                            </span>
                        )}
                    </div>
                ))}
                {canAdd && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 transition hover:border-blue-400 hover:text-blue-500"
                    >
                        <LuImagePlus className="h-6 w-6" />
                        <span className="text-xs">Tambah</span>
                    </button>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                multiple
                onChange={handleAdd}
                className="hidden"
            />
            <p className="mt-2 text-xs text-slate-500">
                {value.length}/{max} gambar. JPG, PNG, atau WebP. Gambar pertama
                jadi thumbnail utama.
            </p>
        </div>
    );
};

export default ImageUploader;
