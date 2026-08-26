"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

// If `src` can change while this stays mounted (e.g. a parent swaps which
// exercise it's showing without remounting), pass `key={src}` from the
// caller so a new `src` resets the failed-load state instead of getting
// stuck showing the fallback for the previous image.
function ExerciseImage({
    src,
    alt,
    width,
    height,
    className,
    iconClassName = "size-8 text-secondary-text",
}: {
    src?: string | null;
    alt: string;
    width: number;
    height: number;
    className?: string;
    iconClassName?: string;
}) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                className={`flex items-center justify-center bg-tertiary-background ${className ?? ""}`}
            >
                <ImageOff className={iconClassName} strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            onError={() => setFailed(true)}
            className={className}
            unoptimized
        />
    );
}

export default ExerciseImage;
