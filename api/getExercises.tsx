export async function getExercises(cursor?: string) {
    const res = await fetch(
        `https://oss.exercisedb.dev/api/v1/exercises?limit=25${cursor ? `&cursor=${cursor}` : ""}`,
        {
            next: { revalidate: 3600 },
        },
    );

    if (!res.ok) {
        throw new Error(
            `Failed to fetch exercises: ${res.status} ${res.statusText}`,
        );
    }

    const json = await res.json();
    return { data: json.data, meta: json.meta };
}
