import { CircleUser, Dumbbell } from "lucide-react";
import Link from "next/link";

function Navbar() {
    return (
        <nav className="bg-primary-background text-secondary-text p-4 flex items-center justify-between fixed top-0 right-0 left-0">
            <Link
                className="flex items-center space-x-4 cursor-pointer"
                href="/"
            >
                <Dumbbell className="w-6 h-6 text-primary-text" />
                <span className="text-2xl font-bold text-primary-text">
                    PR Calculator
                </span>
            </Link>
            <CircleUser className="w-6 h-6" />
        </nav>
    );
}

export default Navbar;
