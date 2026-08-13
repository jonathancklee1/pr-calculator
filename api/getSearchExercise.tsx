export async function searchExercises(query: string, threshold: number = 0.4) {
    const res = await fetch(
        `https://oss.exercisedb.dev/api/v1/exercises/search?search=${encodeURIComponent(query)}&threshold=${threshold}`,
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
