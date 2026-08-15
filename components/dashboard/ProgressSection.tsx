"use client";
import Image from "next/image";
import { RadialProgressChart } from "./RadialProgressChart";
import IconButton from "../atoms/IconButton";
import { Dumbbell, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePrState } from "@/context/PrContext";

function ProgressSection() {
    const { prs } = usePrState();
    const exercise = getRandomRecord();

    const router = useRouter();
    function getRandomRecord() {
        return prs[Math.floor(Math.random() * prs.length)];
    }
    function addNewExercise() {
        router.push("/exercises");
    }
    return (
        <section className="bg-primary-background">
            <div className="relative text-3xl">
                {exercise?.gifUrl ? (
                    <Image
                        src={exercise?.gifUrl}
                        alt={exercise?.name ? exercise?.name : "Exercise Image"}
                        width={90}
                        height={90}
                        className="w-22 h-22 absolute left-1/2 -translate-x-1/2 top-10 mx-auto my-2 rounded-full aspect-square object-cover"
                    />
                ) : (
                    <Dumbbell className="w-17.5 h-17.5 text-primary-text absolute left-1/2 -translate-x-1/2 top-13 mx-auto my-2 rounded-full aspect-square object-cover" />
                )}

                <RadialProgressChart
                    currentPR={exercise?.currentPR}
                    goal={exercise?.goal}
                    label={exercise?.name}
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
            <p className="text-lg font-semibold text-secondary-text text-center w-full mx-auto mt-2 capitalize">
                {exercise?.name && exercise?.currentPR && exercise?.goal ? (
                    <>
                        {exercise.name} Progress:{" "}
                        <span className="text-accent-text font-extrabold">
                            {(
                                (exercise.currentPR / exercise.goal) *
                                100
                            ).toFixed(0)}
                            %
                        </span>
                    </>
                ) : (
                    "Start your journey by adding your first PR!"
                )}
            </p>
        </section>
    );
}

export default ProgressSection;
