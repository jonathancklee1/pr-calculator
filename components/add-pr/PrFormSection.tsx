"use client";
import Image from "next/image";
import InputCard from "./InputCard";
import { Button } from "../ui/button";
import { Trophy } from "lucide-react";
import { ExerciseData, ExerciseRecord } from "@/lib/types";
import { usePrState } from "@/context/PrContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOneRepMax } from "@/lib/constants";
import { toast, ToastContainer } from "react-toastify";
import confetti from "canvas-confetti";
function PrFormSection({ exercise }: { exercise: ExerciseData }) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
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

    const showToast = (message: string, type: "success" | "error") => {
        if (type === "error") {
            toast(message, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                type: "error",
            });
        } else {
            toast(message, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                type: "success",
            });
        }
    };

    function savePR(event: React.MouseEvent<HTMLButtonElement>) {
        try {
            if (
                formInputs.weight === 0 ||
                formInputs.reps === 0 ||
                formInputs.goal === 0
            )
                throw new Error("Please fill in all fields");
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
                                    oneRM: getOneRepMax(
                                        formInputs.weight,
                                        formInputs.reps,
                                    ),
                                    date: new Date().toLocaleDateString(
                                        "en-GB",
                                    ),
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
                              oneRM: getOneRepMax(
                                  formInputs.weight,
                                  formInputs.reps,
                              ),
                              bodyParts: exercise.bodyParts,
                          } as ExerciseRecord,
                      ];

                return {
                    ...prevState,
                    prs: updatedPrs,
                };
            });

            const rect = event.currentTarget.getBoundingClientRect();
            confetti({
                particleCount: 150,
                spread: 60,
                origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight,
                },
            });
            setSaving(true);

            showToast(
                "PR Saved! Congratulations on hitting a new record! Redirecting to dashboard...",
                "success",
            );
            resetForm();

            setTimeout(() => {
                router.push("/");
            }, 4000);
        } catch (error) {
            showToast("Inputs should be greater than 0", "error");
            console.error(error);
        }
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
                    onClick={savePR}
                    disabled={saving}
                    className="w-full bg-secondary-background text-tertiary-text rounded-lg cursor-pointer text-xl  hover:bg-secondary-background-hover active:bg-secondary-background-hover font-bold p-7"
                >
                    <Trophy className="size-5" />
                    Save PR
                </Button>
            </div>
            <ToastContainer />
        </section>
    );
}

export default PrFormSection;
