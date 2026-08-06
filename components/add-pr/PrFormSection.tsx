"use client";
import Image from "next/image";
import InputCard from "./InputCard";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { ExerciseData, ExerciseRecord } from "@/lib/types";
import { usePrState } from "@/context/PrContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
function PrFormSection({ exercise }: { exercise: ExerciseData }) {
    console.log("exercise", exercise);
    const router = useRouter();

    const { prs, setState } = usePrState();
    function getExistingPR(name: string) {
        return prs.find((pr) => pr.name === name);
    }
    const existingPR = getExistingPR(exercise.name);
    const [formInputs, setFormInputs] = useState({
        weight: existingPR?.currentPR || 0,
        reps: existingPR?.reps || 0,
        goal: existingPR?.goal || 0,
    });

    function setWeight(weight: number) {
        setFormInputs((prevState) => ({
            ...prevState,
            weight: weight,
        }));
    }
    function setReps(reps: number) {
        setFormInputs((prevState) => ({
            ...prevState,
            reps: reps,
        }));
    }
    function setGoal(weight: number) {
        setFormInputs((prevState) => ({
            ...prevState,
            goal: weight,
        }));
    }

    function savePR() {
        setState((prevState) => {
            const exists = prevState.prs.some(
                (pr) => pr.name === exercise.name,
            );

            const updatedPrs = exists
                ? prevState.prs.map((pr) =>
                      pr.name === exercise.name
                          ? {
                                ...pr,
                                currentPR: formInputs.weight,
                                reps: formInputs.reps,
                                goal: formInputs.goal,
                            }
                          : pr,
                  )
                : [
                      ...prevState.prs,
                      {
                          name: exercise.name,
                          currentPR: formInputs.weight,
                          reps: formInputs.reps,
                          goal: formInputs.goal,
                          gifUrl: exercise.gifUrl ?? null,
                          date: new Date().toLocaleDateString("en-GB"),
                          oneRM: null,
                          bodyParts: exercise.bodyParts,
                      } as ExerciseRecord,
                  ];

            return {
                ...prevState,
                prs: updatedPrs,
            };
        });

        resetForm();
        router.push("/");
    }

    function resetForm() {
        setFormInputs({
            weight: 0,
            reps: 0,
            goal: 0,
        });
    }
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
                <InputCard
                    label="Weight Lifted"
                    value={formInputs.weight.toString()}
                    setValue={setWeight}
                    showUnit
                />
                <InputCard
                    label="Reps"
                    value={formInputs.reps.toString()}
                    setValue={setReps}
                />
                <InputCard
                    label="Goal Weight"
                    showUnit
                    value={formInputs.goal.toString()}
                    setValue={setGoal}
                />
                <Button
                    className="w-full bg-secondary-background text-tertiary-text rounded-lg cursor-pointer text-xl p-7 hover:bg-secondary-background-hover active:bg-secondary-background-hover font-bold"
                    onClick={savePR}
                >
                    <Save className="size-5" />
                    Save PR
                </Button>
            </div>
        </section>
    );
}

export default PrFormSection;
