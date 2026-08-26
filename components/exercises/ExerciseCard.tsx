import { Plus } from "lucide-react";
import Card from "../atoms/Card";
import ExerciseImage from "../atoms/ExerciseImage";
import { ExerciseListType } from "@/lib/types";
import Pill from "../atoms/Pill";

function ExerciseCard({ exercise }: { exercise: ExerciseListType }) {
    return (
        <Card>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <ExerciseImage
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        width={90}
                        height={90}
                        className="w-22.5 h-22.5 rounded-xl aspect-square object-cover"
                    />

                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-xl capitalize">
                            {exercise.name}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            {exercise.bodyParts?.length > 0 &&
                                exercise.bodyParts?.map((group, index) => (
                                    <Pill
                                        key={group + index}
                                        styles="bg-accent-text text-tertiary-text capitalize"
                                    >
                                        {group}
                                    </Pill>
                                ))}
                        </div>
                    </div>
                </div>
                <Plus className="size-6 text-primary-text mt-2" />
            </div>
        </Card>
    );
}

export default ExerciseCard;
