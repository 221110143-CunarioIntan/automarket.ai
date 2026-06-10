import { LuFileQuestion } from "react-icons/lu";
import EmptyState from "./EmptyState";

const NotFoundState = ({
    icon,
    iconClassName,
    title = "Not found",
    description,
    action,
    className,
}) => (
    <EmptyState
        icon={icon ?? <LuFileQuestion className="h-7 w-7" />}
        iconClassName={iconClassName ?? "bg-slate-100 text-slate-500"}
        title={title}
        description={description}
        action={action}
        className={className}
    />
);

export default NotFoundState;
