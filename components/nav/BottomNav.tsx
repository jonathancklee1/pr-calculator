"use client";
import { ClipboardList, LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";

function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bg-black text-secondary-text px-4 py-2 flex items-center justify-around fixed bottom-0 right-0 left-0">
            <Link
                className={`flex flex-col items-center gap-1 cursor-pointer px-9 py-1.5 rounded-full transition-colors ${
                    pathname === "/"
                        ? "bg-secondary-background text-tertiary-text"
                        : " text-primary-text"
                }`}
                href="/"
            >
                <LayoutDashboard />
                <span className="text-md font-bold">Dashboard</span>
            </Link>

            <Link
                className={`flex flex-col items-center gap-1 cursor-pointer px-9 py-1.5 rounded-full transition-colors ${
                    pathname === "/exercises"
                        ? "bg-secondary-background text-tertiary-text"
                        : " text-primary-text"
                }`}
                href="/exercises"
            >
                <ClipboardList />
                <span className="text-md font-bold">Exercises</span>
            </Link>
        </nav>
    );
}

export default BottomNav;
