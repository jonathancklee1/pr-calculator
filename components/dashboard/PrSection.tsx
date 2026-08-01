import { PR_EXERCISES } from "@/lib/constants";
import PrList from "./PrList";

export interface Exercise {
    name: string;
    imageUrl: string;
    muscleGroup: string;
    date: string;
    weight: number;
    oneRM: number;
    reps?: number;
}

function PrSection() {
    return (
        <section className="mb-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Personal Records</h2>
            </div>
            <PrList exerciseData={PR_EXERCISES} />
        </section>
    );
}

export default PrSection;
