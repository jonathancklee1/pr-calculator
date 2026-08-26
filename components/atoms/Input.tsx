import { SearchIcon } from "lucide-react";

import { Field } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { ComponentProps, CSSProperties, useId } from "react";

export function Input({
    isSearch,
    placeholder,
    styles,
    inputProps: props,
}: {
    isSearch?: boolean;
    placeholder?: string;
    styles?: CSSProperties | string;
    inputProps: ComponentProps<"input">;
}) {
    const generatedId = useId();

    return (
        <Field className="max-w-sm ">
            <InputGroup
                className={`w-full rounded-lg border border-border-color text-sm placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 py-5 ${styles}`}
            >
                <InputGroupInput
                    id={generatedId}
                    placeholder={placeholder || "Search..."}
                    {...props}
                />
                {isSearch && (
                    <InputGroupAddon align="inline-start">
                        <SearchIcon className="text-muted-foreground" />
                    </InputGroupAddon>
                )}
            </InputGroup>
        </Field>
    );
}
