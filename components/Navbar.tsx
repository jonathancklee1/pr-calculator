import { CircleUser, Dumbbell } from "lucide-react";

function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Dumbbell className="w-6 h-6 text-primary-text" />
                <span className="text-2xl font-bold text-primary-text">
                    PR Calculator
                </span>
            </div>
            <CircleUser className="w-6 h-6" />
        </nav>
    );
}

export default Navbar;
