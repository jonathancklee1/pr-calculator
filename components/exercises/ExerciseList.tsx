import ExerciseCard from "./ExerciseCard";
import { useRouter } from "next/navigation";
import { ExerciseData, ExerciseMeta } from "@/lib/types";
import {
    useRef,
    useCallback,
    useEffect,
    useState,
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
}: {
    selectedFilter: string;
    searchTerm: string;
    exercises: ExerciseData[];
    setExerciseData: Dispatch<SetStateAction<ExerciseData[]>>;
    meta: ExerciseMeta;
}) {
    const router = useRouter();
    const containerRef = useRef<HTMLUListElement | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const [loading, setLoading] = useState(false);

    const metaRef = useRef<ExerciseMeta>(meta); // synchronous read for the observer callback
    const loadingRef = useRef(false);
    const handleIntersect = useCallback(
        async (entries: IntersectionObserverEntry[]) => {
            const isFiltering =
                selectedFilter !== "All" || searchTerm.trim() !== "";

            if (
                !entries[0].isIntersecting ||
                loadingRef.current ||
                !metaRef.current.hasNextPage ||
                isFiltering
            ) {
                return;
            }

            loadingRef.current = true;
            setLoading(true);

            try {
                const { data: newExercises, meta: newMeta } =
                    await getExercises(metaRef.current.nextCursor);
                metaRef.current = newMeta;
                setExerciseData((prev) => [...prev, ...newExercises]);
            } catch (err) {
                console.error(err);
            } finally {
                loadingRef.current = false;
                setLoading(false);
            }
        },
        [setExerciseData, selectedFilter, searchTerm],
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

    if (filteredExercises.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-primary-text">
                    No exercises found
                </h2>
            </div>
        );
    }
    return (
        <ul
            ref={containerRef}
            className="flex flex-col gap-4 overflow-auto max-h-[calc(100dvh-410px)]"
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
        </ul>
    );
}

export default ExerciseList;
