"use client";
import { Input } from "../atoms/Input";
import Pill from "../atoms/Pill";
import { useState } from "react";
import ExerciseList from "./ExerciseList";
import { ExerciseData } from "@/lib/types";

function ExerciseSection({
    exercises,
    bodyParts,
    meta,
}: {
    exercises: ExerciseData[];
    bodyParts: { name: string }[];
    meta: {
        hasNextPage: boolean;
        nextCursor?: string;
    };
}) {
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [exerciseData, setExerciseData] = useState<ExerciseData[]>(exercises);
    console.log("exercises in ExerciseSection:", exercises);
    console.log("bodyParts in ExerciseSection:", bodyParts);
    const mappedBodyParts = [
        {
            name: "All",
        },
        ...bodyParts,
    ];
    return (
        <section className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Exercises</h1>
            <p className=" text-secondary-text">
                Select an exercise to add a new personal record.
            </p>
            <div className="relative w-full max-w-md mb-4">
                <Input
                    isSearch
                    inputProps={{
                        onChange: (e) => setSearchTerm(e.target.value),
                    }}
                />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
                {mappedBodyParts.map(({ name }, index) => (
                    <button
                        onClick={() => setSelectedFilter(name)}
                        key={name + index}
                    >
                        <Pill
                            styles={`font-bold p-4 text-lg cursor-pointer capitalize ${selectedFilter === name ? "bg-secondary-background hover:bg-secondary-hover text-primary-background  text-tertiary-text" : "bg-tertiary-background hover:bg-secondary-hover text-secondary-text"}`}
                        >
                            {name}
                        </Pill>
                    </button>
                ))}
            </div>
            <ExerciseList
                exercises={exerciseData}
                setExerciseData={setExerciseData}
                selectedFilter={selectedFilter}
                searchTerm={searchTerm}
                meta={meta}
                loading={false}
            />
        </section>
    );
}

export default ExerciseSection;
