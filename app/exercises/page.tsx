"use client";
import Card from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import Pill from "@/components/atoms/Pill";
import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { CATEGORIES, EXERCISE_LIST } from "@/lib/constants";
export default function Exercises() {
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const filteredExercises =
        selectedFilter === "All"
            ? EXERCISE_LIST.filter((exercise) =>
                  exercise.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
              )
            : EXERCISE_LIST.filter((exercise) =>
                  exercise.muscleGroup.includes(selectedFilter),
              ).filter((exercise) =>
                  exercise.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
              );
    return (
        <div className="relative min-h-screen py-20 flex flex-col gap-4 px-4">
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
                {CATEGORIES.map((category, index) => (
                    <button
                        onClick={() => setSelectedFilter(category)}
                        key={category + index}
                    >
                        <Pill
                            styles={`font-semibold p-4 text-lg cursor-pointer ${selectedFilter === category ? "bg-secondary-background hover:bg-secondary-hover text-primary-background  text-tertiary-text" : "bg-tertiary-background hover:bg-secondary-hover text-secondary-text"}`}
                        >
                            {category}
                        </Pill>
                    </button>
                ))}
            </div>
            <ul className="flex flex-col gap-4 overflow-auto max-h-[calc(100dvh-420px)]">
                {filteredExercises.map((exercise, index) => (
                    <li
                        key={exercise.name + index}
                        onClick={() => console.log("Redirect to Add PR page")}
                        className="cursor-pointer"
                    >
                        <Card>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={exercise.imageUrl}
                                        alt={exercise.name}
                                        width={90}
                                        height={90}
                                        className="rounded-xl aspect-square object-cover"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-bold text-xl">
                                            {exercise.name}
                                        </h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {exercise.muscleGroup.map(
                                                (group, index) => (
                                                    <Pill
                                                        key={group + index}
                                                        styles="bg-accent-text text-tertiary-text"
                                                    >
                                                        {group}
                                                    </Pill>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Plus className="size-6 text-primary-text mt-2" />
                            </div>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
}
