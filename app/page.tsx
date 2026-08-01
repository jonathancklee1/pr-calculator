import ProgressSection from "@/components/dashboard/ProgressSection";
import PrSection from "@/components/dashboard/PrSection";

export default function Home() {
    return (
        <div className="relative min-h-screen py-20 flex flex-col gap-10 px-4">
            <ProgressSection />
            <PrSection />
        </div>
    );
}
