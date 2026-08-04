import { getExercise } from "@/api/getExercise";
import PrFormSection from "@/components/add-pr/PrFormSection";

export default async function AddPR({ params }: { params: { id: string } }) {
    const { id } = await params;
    const { data: exercise } = await getExercise(id);
    return (
        <div className="relative min-h-screen py-20 flex flex-col gap-4 px-4">
            <h1 className="text-2xl font-bold">Add your PR</h1>
            <PrFormSection exercise={exercise} />
        </div>
    );
}
