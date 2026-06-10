import Input from "./Input";

const formatter = new Intl.NumberFormat("id-ID");

const formatDisplay = (value) => {
    if (value === "" || value === null || value === undefined) return "";
    const num = Number(value);
    if (Number.isNaN(num)) return "";
    return formatter.format(num);
};

const InputNumber = ({ value, onChange, ...props }) => {
    const handleChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        onChange?.(raw === "" ? "" : Number(raw));
    };

    return (
        <Input
            type="text"
            inputMode="numeric"
            value={formatDisplay(value)}
            onChange={handleChange}
            {...props}
        />
    );
};

export default InputNumber;
