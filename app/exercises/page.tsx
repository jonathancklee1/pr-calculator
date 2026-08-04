import { getBodyParts } from "@/api/getBodyParts";
import { getExercises } from "@/api/getExercises";
import ExerciseSection from "@/components/exercises/ExerciseSection";

export default async function Exercises() {
    const { data: exercises, meta } = await getExercises();
    const { data: bodyParts } = await getBodyParts();

    return (
        <div className="relative min-h-screen py-20 flex flex-col gap-4 px-4">
            <ExerciseSection
                exercises={exercises}
                bodyParts={bodyParts}
                meta={meta}
            />
        </div>
    );
}
