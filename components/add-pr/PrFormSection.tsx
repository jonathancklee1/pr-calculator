import Image from "next/image";
import InputCard from "./InputCard";
function PrFormSection() {
    return (
        <section className="mb-4">
            <div className="relative w-full mb-4">
                <Image
                    src={
                        "https://images.pexels.com/photos/38247624/pexels-photo-38247624.jpeg"
                    }
                    width={500}
                    height={500}
                    alt={"barbell"}
                    className="rounded-lg object-cover w-full aspect-video"
                />
                <h2 className="absolute bottom-1 left-2 text-3xl font-bold">
                    Flat Bench Press
                </h2>
            </div>
            <div className="flex flex-col gap-4">
                <InputCard label="Weight Lifted" showUnit />
                <InputCard label="Reps" />
                <InputCard label="Goal Weight" showUnit />
            </div>
        </section>
    );
}

export default PrFormSection;
