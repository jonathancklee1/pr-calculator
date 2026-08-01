import { ReactNode } from "react";

function Card({ children }: { children: ReactNode }) {
    return (
        <div className="bg-tertiary-background shadow-md rounded-2xl px-4 py-3 border border-border-color">
            {children}
        </div>
    );
}

export default Card;
