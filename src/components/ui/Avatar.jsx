import { cn } from "@/lib/cn";

const SIZE = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
};

const initialsOf = (text) => {
    if (!text) return "?";
    return text
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
};

const Avatar = ({ name, email, size = "md", className }) => (
    <div
        className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white",
            SIZE[size],
            className,
        )}
    >
        {initialsOf(name || email)}
    </div>
);

export default Avatar;
