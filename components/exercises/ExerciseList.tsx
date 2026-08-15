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
    const containerRef = useRef<HTMLUListElement | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const [scrollLoading, setScrollLoading] = useState(false);

    const metaRef = useRef<ExerciseMeta>(meta);
    const loadingRef = useRef(false);
    const handleIntersect = useCallback(
        async (entries: IntersectionObserverEntry[]) => {
            if (
                !entries[0].isIntersecting ||
                loadingRef.current ||
                !metaRef.current.hasNextPage ||
                searchTerm !== "" ||
                selectedFilter !== "All"
            ) {
                return;
            }

            loadingRef.current = true;
            setScrollLoading(true);

            try {
                const { data: newExercises, meta: newMeta } =
                    await getExercises(metaRef.current.nextCursor);
                metaRef.current = newMeta;
                setExerciseData((prev) => [...prev, ...newExercises]);
            } catch (err) {
                console.error(err);
            } finally {
                loadingRef.current = false;
                setScrollLoading(false);
            }
        },
        [searchTerm, selectedFilter, setExerciseData],
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
        selectedFilter !== "All"
            ? exercises?.filter(
                  (exercise) =>
                      exercise.bodyParts &&
                      exercise.bodyParts?.includes(selectedFilter),
              )
            : exercises;

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
            {filteredExercises?.length > 0 &&
                filteredExercises?.map((exercise) => (
                    <li
                        key={exercise.exerciseId}
                        onClick={() => handleCardClick(exercise.exerciseId)}
                        className="cursor-pointer"
                    >
                        <ExerciseCard exercise={exercise} />
                    </li>
                ))}
            <div ref={sentinelRef} className="h-4" />

            {(loading || scrollLoading) && (
                <p className="text-center text-secondary-text">
                    Loading more...
                </p>
            )}
        </ul>
    );
}

export default ExerciseList;
