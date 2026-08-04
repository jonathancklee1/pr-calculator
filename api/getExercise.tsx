export async function getExercise(id?: string) {
    const res = await fetch(
        `https://oss.exercisedb.dev/api/v1/exercises/${id}`,
        {
            next: { revalidate: 3600 },
        },
    );

    if (!res.ok) {
        throw new Error(
            `Failed to fetch exercise: ${res.status} ${res.statusText}`,
        );
    }

    const json = await res.json();
    return { data: json.data, meta: json.meta };
}
