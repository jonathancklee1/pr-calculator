import PrFormSection from "@/components/add-pr/PrFormSection";

export default async function AddPR({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div className="relative min-h-screen py-20 flex flex-col gap-4 px-4">
            <h1 className="text-3xl font-bold">Add your PR</h1>
            <p className=" text-secondary-text">
                Add your personal record for the exercise: {id}
            </p>
            <PrFormSection />
        </div>
    );
}
