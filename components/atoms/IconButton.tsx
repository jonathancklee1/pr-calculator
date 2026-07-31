import { ReactNode } from "react";
import { Button } from "../ui/button";

function IconButton({
    icon,
    onClick,
    styles,
}: {
    icon: ReactNode;
    onClick: () => void;
    styles?: string;
}) {
    return (
        <Button
            className={`p-2 rounded-full hover:bg-secondary-background-hover active:bg-secondary-background-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-secondary-background size-15 cursor-pointer ${styles}`}
            onClick={onClick}
        >
            {icon}
        </Button>
    );
}

export default IconButton;
