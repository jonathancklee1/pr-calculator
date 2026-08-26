"use client";
import Image from "next/image";
import { RadialProgressChart } from "./RadialProgressChart";
import IconButton from "../atoms/IconButton";
import { Dumbbell, Plus, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrState } from "@/context/PrContext";
import { ExerciseRecord } from "@/lib/types";

// Keyed by gifUrl by the caller so shuffling to a different exercise resets
// the failed-load state instead of getting stuck on the previous fallback.
function ProgressAvatar({
    gifUrl,
    name,
}: {
    gifUrl?: string | null;
    name?: string | null;
}) {
    const [imgFailed, setImgFailed] = useState(false);

    if (!gifUrl || imgFailed) {
        return (
            <Dumbbell className="w-17.5 h-17.5 text-primary-text absolute left-1/2 -translate-x-1/2 top-13 mx-auto my-2 rounded-full aspect-square object-cover" />
        );
    }

    return (
        <Image
            src={gifUrl}
            alt={name ? name : "Exercise Image"}
            width={90}
            height={90}
            onError={() => setImgFailed(true)}
            className="w-22 h-22 absolute left-1/2 -translate-x-1/2 top-10 mx-auto my-2 rounded-full aspect-square object-cover"
        />
    );
}

function ProgressSection() {
    const { prs } = usePrState();
    const [exercise, setExercise] = useState<ExerciseRecord | undefined>(
        undefined,
    );
    const [shuffleSpin, setShuffleSpin] = useState(0);

    // Picked once prs become available (post-hydration) and kept stable
    // afterwards, so unrelated re-renders elsewhere in the app don't swap
    // the displayed exercise out from under the user.
    useEffect(() => {
        if (prs.length === 0) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExercise(
            (prev) => prev ?? prs[Math.floor(Math.random() * prs.length)],
        );
    }, [prs]);

    const router = useRouter();
    function addNewExercise() {
        router.push("/exercises");
    }
    function randomizeExercise() {
        if (prs.length < 2) return;
        setShuffleSpin((spin) => spin + 360);
        setExercise((prev) => {
            let next = prev;
            while (next === prev) {
                next = prs[Math.floor(Math.random() * prs.length)];
            }
            return next;
        });
    }
    const goalPercentage =
        exercise?.goal &&
        exercise?.currentPR &&
        (Math.round((exercise?.currentPR / exercise?.goal) * 100) > 100
            ? 100
            : Math.round((exercise?.currentPR / exercise?.goal) * 100));
    return (
        <section className="bg-primary-background">
            <div className="relative text-3xl">
                <ProgressAvatar
                    key={exercise?.gifUrl}
                    gifUrl={exercise?.gifUrl}
                    name={exercise?.name}
                />

                <RadialProgressChart
                    currentPR={exercise?.currentPR}
                    goal={exercise?.goal}
                    label={exercise?.name}
                />
                {prs.length > 1 && (
                    <IconButton
                        icon={
                            <Shuffle
                                className="size-5 text-tertiary-text transition-transform duration-500 ease-out"
                                strokeWidth="2.5"
                                style={{
                                    transform: `rotate(${shuffleSpin}deg)`,
                                }}
                            />
                        }
                        onClick={randomizeExercise}
                        size="size-10"
                        styles="absolute top-0 right-0"
                    />
                )}
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
                            {goalPercentage}%
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
