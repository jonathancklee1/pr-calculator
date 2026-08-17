import PrList from "./PrList";

function PrSection() {
    return (
        <section className="mb-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Personal Records</h2>
            </div>
            <PrList />
        </section>
    );
}

export default PrSection;
