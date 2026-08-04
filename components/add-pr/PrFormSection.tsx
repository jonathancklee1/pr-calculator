import Image from "next/image";
import InputCard from "./InputCard";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { ExerciseData } from "@/lib/types";
function PrFormSection({ exercise }: { exercise: ExerciseData }) {
    console.log("exercise", exercise);
    return (
        <section className="mb-4">
            <div className="relative w-full mb-4">
                <Image
                    src={exercise.gifUrl}
                    width={500}
                    height={200}
                    alt={"barbell"}
                    className="rounded-lg object-cover w-full aspect-video"
                    unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
                <h2 className="absolute bottom-2 left-2 text-3xl font-bold capitalize">
                    {exercise.name}
                </h2>
            </div>
            <div className="flex flex-col gap-4">
                <InputCard label="Weight Lifted" showUnit />
                <InputCard label="Reps" />
                <InputCard label="Goal Weight" showUnit />
                <Button className="w-full bg-secondary-background text-tertiary-text rounded-lg cursor-pointer text-xl p-7 hover:bg-secondary-background-hover active:bg-secondary-background-hover font-bold">
                    <Save className="size-5" />
                    Save PR
                </Button>
            </div>
        </section>
    );
}

export default PrFormSection;
