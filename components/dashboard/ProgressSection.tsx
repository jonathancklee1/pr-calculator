"use client";
import Image from "next/image";
import { RadialProgressChart } from "./RadialProgressChart";
import IconButton from "../atoms/IconButton";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

function ProgressSection() {
    const exercise = {
        name: "Flat Bench Press",
        imageUrl:
            "https://images.pexels.com/photos/38247624/pexels-photo-38247624.jpeg",
        currentPR: 60,
        goal: 90,
    };
    const router = useRouter();
    function addNewExercise() {
        router.push("/exercises");
    }
    return (
        <section className="bg-primary-background">
            <div className="relative text-3xl">
                <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    width={90}
                    height={90}
                    className="absolute left-1/2 -translate-x-1/2 top-10 mx-auto my-2 rounded-full aspect-square object-cover"
                />
                <RadialProgressChart
                    currentPR={exercise.currentPR}
                    goal={exercise.goal}
                    label={exercise.name}
                />
                <IconButton
                    icon={
                        <Plus
                            className="size-8 text-tertiary-text"
                            strokeWidth="2.5"
                        />
                    }
                    onClick={addNewExercise}
                    styles="absolute bottom-0 left-1/2 -translate-x-1/2"
                />
            </div>
            <p className="text-lg font-semibold text-secondary-text text-center w-full mx-auto mt-2">
                {exercise.name} Progress:{" "}
                {((exercise.currentPR / exercise.goal) * 100).toFixed(2)}%
            </p>
        </section>
    );
}

export default ProgressSection;
