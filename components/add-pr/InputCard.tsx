"use client";
import { Plus, Minus } from "lucide-react";
import Card from "../atoms/Card";
import IconButton from "../atoms/IconButton";
import Pill from "../atoms/Pill";
import { Input } from "../atoms/Input";
import { useState } from "react";

function InputCard({ label, showUnit }: { label: string; showUnit?: boolean }) {
    const [inputValue, setInputValue] = useState("");
    const handleIncrement = () => {
        // Handle increment logic here
        console.log("Increment clicked");
        setInputValue((prev) => (prev === "" ? "1" : String(Number(prev) + 1)));
    };

    const handleDecrement = () => {
        // Handle decrement logic here
        console.log("Decrement clicked");
        setInputValue((prev) =>
            prev === "" ? "0" : String(Math.max(0, Number(prev) - 1)),
        );
    };

    return (
        <Card>
            <div className="flex gap-2 justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{label}</h3>
                {showUnit && (
                    <Pill styles="bg-accent-text text-tertiary-text">KG</Pill>
                )}
            </div>
            <div className="flex gap-6 justify-between items-center">
                <IconButton
                    icon={
                        <Minus
                            className="size-8 text-tertiary-text"
                            strokeWidth="2.5"
                        />
                    }
                    onClick={handleDecrement}
                />
                <Input
                    placeholder="0"
                    styles="w-16 text-center border-none "
                    inputProps={{
                        value: inputValue,
                        onChange: (e) => setInputValue(e.target.value),
                        type: "number",
                        style: {
                            textAlign: "center",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        },
                    }}
                />

                <IconButton
                    icon={
                        <Plus
                            className="size-8 text-tertiary-text"
                            strokeWidth="2.5"
                        />
                    }
                    onClick={handleIncrement}
                />
            </div>
        </Card>
    );
}

export default InputCard;
