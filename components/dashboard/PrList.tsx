"use client";
import Card from "../atoms/Card";
import Image from "next/image";
import Pill from "../atoms/Pill";
import { ExerciseType } from "@/lib/types";
import { usePrState } from "@/context/PrContext";

function PrList({ exerciseData }: { exerciseData: ExerciseType[] }) {
    const { prs } = usePrState();
    console.log(prs);
    if (!prs || prs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-primary-text">No PRs</h2>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-4">
            {prs.map((exercise, index) => (
                <li key={(exercise?.name || "") + index}>
                    <Card>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Image
                                    src={exercise?.gifUrl || ""}
                                    alt={exercise?.name || ""}
                                    width={90}
                                    height={90}
                                    className="rounded-xl aspect-square object-cover"
                                    unoptimized
                                />
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold ">
                                        {exercise?.name}
                                    </h3>
                                    <Pill styles="bg-accent-text text-tertiary-text">
                                        {exercise?.bodyParts.join(", ")}
                                    </Pill>
                                    <p className="font-bold text-xs">
                                        {exercise?.date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 text-end">
                                <p className="font-bold text-3xl text-primary-text">
                                    <span className="font-medium text-base mr-1">
                                        {exercise?.reps}x
                                    </span>
                                    {`${exercise?.weight}kg`}
                                </p>
                                <p className="font-medium text-secondary-text text-sm">
                                    Estimated 1RM: {exercise?.oneRM}kg
                                </p>
                            </div>
                        </div>
                    </Card>
                </li>
            ))}
        </ul>
    );
}

export default PrList;
