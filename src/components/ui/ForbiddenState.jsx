import { LuShieldAlert } from "react-icons/lu";
import EmptyState from "./EmptyState";

const ForbiddenState = ({
    icon,
    iconClassName,
    title = "Access denied",
    description,
    action,
    className,
}) => (
    <EmptyState
        icon={icon ?? <LuShieldAlert className="h-7 w-7" />}
        iconClassName={iconClassName ?? "bg-amber-50 text-amber-600"}
        title={title}
        description={description}
        action={action}
        className={className}
    />
);

export default ForbiddenState;
