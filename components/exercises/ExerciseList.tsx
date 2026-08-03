import ExerciseCard from "./ExerciseCard";
import { useRouter } from "next/navigation";
import { ExerciseData, ExerciseMeta } from "@/lib/types";
import {
    useRef,
    useCallback,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import { getExercises } from "@/api/getExercises";

function ExerciseList({
    selectedFilter,
    searchTerm,
    exercises,
    setExerciseData,
    meta,
    loading,
}: {
    selectedFilter: string;
    searchTerm: string;
    exercises: ExerciseData[];
    setExerciseData: Dispatch<SetStateAction<ExerciseData[]>>;
    meta: ExerciseMeta;
    loading: boolean;
}) {
    const router = useRouter();
    const loadingRef = useRef(loading);
    const containerRef = useRef<HTMLUListElement | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // keep the ref in sync so the observer callback always sees the latest value
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    const handleIntersect = useCallback(
        async (entries: IntersectionObserverEntry[]) => {
            if (
                entries[0].isIntersecting &&
                !loadingRef.current &&
                meta.hasNextPage
            ) {
                // End is hit, call the next page
                const { data: exercises, meta: newMeta } = await getExercises(
                    meta.nextCursor,
                );
                setExerciseData((prev) => [...prev, ...exercises]);
            }
        },
        [meta.hasNextPage, meta.nextCursor, setExerciseData],
    );

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(handleIntersect, {
            root: containerRef.current,
            rootMargin: "200px",
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [handleIntersect]);

    function handleCardClick(exerciseId: string) {
        router.push(`/exercises/${exerciseId}`);
    }

    const filteredExercises =
        selectedFilter === "All"
            ? exercises.filter((exercise) =>
                  exercise.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
              )
            : exercises
                  .filter((exercise) =>
                      exercise.bodyParts.includes(selectedFilter),
                  )
                  .filter((exercise) =>
                      exercise.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                  );

    return (
        <ul
            ref={containerRef}
            className="flex flex-col gap-4 overflow-auto max-h-[calc(100dvh-400px)]"
        >
            {filteredExercises.map((exercise) => (
                <li
                    key={exercise.exerciseId}
                    onClick={() => handleCardClick(exercise.exerciseId)}
                    className="cursor-pointer"
                >
                    <ExerciseCard exercise={exercise} />
                </li>
            ))}
            <div ref={sentinelRef} className="h-4" />

            {loading && (
                <p className="text-center text-secondary-text">
                    Loading more...
                </p>
            )}
            {!meta.hasNextPage && (
                <p className="text-center text-secondary-text">
                    No more exercises
                </p>
            )}
        </ul>
    );
}

export default ExerciseList;
