"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getExercise } from "@/api/getExercise";
import PrFormSection from "@/components/add-pr/PrFormSection";
import { ExerciseData } from "@/lib/types";

function ExerciseFetcher({ id }: { id: string }) {
    const [exercise, setExercise] = useState<ExerciseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        getExercise(id)
            .then(({ data }) => {
                if (!cancelled) setExercise(data);
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return <p className="text-secondary-text text-center">Loading...</p>;
    }

    if (error || !exercise) {
        return <h1 className="text-2xl font-bold">Exercise not found</h1>;
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Add your PR</h1>
            <PrFormSection exercise={exercise} />
        </>
    );
}

function AddPRContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    if (!id) {
        return <h1 className="text-2xl font-bold">Exercise not found</h1>;
    }

    // Keyed by id so navigating between two exercise details (list -> detail
    // -> back -> a different detail) remounts with fresh loading/error state
    // instead of needing to manually reset it inside the effect.
    return <ExerciseFetcher key={id} id={id} />;
}

export default function AddPR() {
    return (
        <div className="relative min-h-screen py-20 flex flex-col gap-4 px-4">
            <Suspense
                fallback={
                    <p className="text-secondary-text text-center">
                        Loading...
                    </p>
                }
            >
                <AddPRContent />
            </Suspense>
        </div>
    );
}
