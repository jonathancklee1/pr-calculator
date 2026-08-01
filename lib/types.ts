export interface ExerciseType {
    name: string;
    imageUrl: string;
    muscleGroup: string;
    date: string;
    weight: number;
    oneRM: number;
    reps?: number;
}

export interface ExerciseListType {
    name: string;
    imageUrl: string;
    muscleGroup: string[];
}
