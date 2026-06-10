import { LuTriangleAlert } from "react-icons/lu";
import EmptyState from "./EmptyState";

const ErrorState = ({
    icon,
    iconClassName,
    title = "Something went wrong",
    description,
    action,
    className,
}) => (
    <EmptyState
        icon={icon ?? <LuTriangleAlert className="h-7 w-7" />}
        iconClassName={iconClassName ?? "bg-red-50 text-red-500"}
        title={title}
        description={description}
        action={action}
        className={className}
    />
);

export default ErrorState;
