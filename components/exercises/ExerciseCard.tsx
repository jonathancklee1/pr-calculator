import { Plus } from "lucide-react";
import Card from "../atoms/Card";
import Image from "next/image";
import { ExerciseListType } from "@/lib/types";
import Pill from "../atoms/Pill";
import { useState } from "react";

function ExerciseCard({ exercise }: { exercise: ExerciseListType }) {
    const [imgError, setImgError] = useState(false);

    return (
        <Card>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {imgError || !exercise.gifUrl ? (
                        <div className="flex items-center justify-center bg-tertiary-background rounded-md h-22.5">
                            <span className="text-secondary-text text-sm text-wrap text-center  w-22.5">
                                No image available
                            </span>
                        </div>
                    ) : (
                        <Image
                            src={exercise.gifUrl}
                            alt={exercise.name}
                            width={90}
                            height={90}
                            onError={() => setImgError(true)}
                            className="rounded-xl aspect-square object-cover"
                            unoptimized
                        />
                    )}

                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-xl capitalize">
                            {exercise.name}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            {exercise.bodyParts.map((group, index) => (
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
