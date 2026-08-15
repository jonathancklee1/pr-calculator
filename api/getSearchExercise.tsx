export async function searchExercises(query: string) {
    const res = await fetch(
        `https://oss.exercisedb.dev/api/v1/exercises?name=${encodeURIComponent(query)}&limit=25`,
        {
            next: { revalidate: 3600 },
        },
    );

    if (!res.ok) {
        throw new Error(
            `Failed to search exercises: ${res.status} ${res.statusText}`,
        );
    }

    const json = await res.json();
    return { data: json.data };
}
