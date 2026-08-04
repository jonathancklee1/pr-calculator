export interface ExerciseType {
    name: string;
    gifUrl: string;
    bodyParts: string[];
    date: string;
    weight: number;
    oneRM: number;
    reps?: number;
}

export interface ExerciseListType {
    name: string;
    gifUrl: string;
    bodyParts: string[];
}

//API response type for exercises
export interface ExerciseData {
    bodyParts: string[];
    equipments: string[];
    exerciseId: string;
    gifUrl: string;
    instructions: string[];
    name: string;
    secondaryMuscles: string[];
    targetMuscles: string[];
}

export interface ExerciseResponse {
    data: ExerciseData[];
    metadata?: {
        totalPages: number;
        currentPage: number;
        totalExercises: number;
    };
}

export interface ExerciseMeta {
    hasNextPage: boolean;
    nextCursor?: string;
}
