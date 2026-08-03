export async function getBodyParts() {
    const res = await fetch("https://oss.exercisedb.dev/api/v1/bodyparts", {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(
            `Failed to fetch body parts: ${res.status} ${res.statusText}`,
        );
    }

    const json = await res.json();
    return { data: json.data };
}
