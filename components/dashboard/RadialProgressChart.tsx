"use client";

import {
    Label,
    PolarAngleAxis,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    exercise: {
        label: "Exercise",
        color: "var(--color-exercise)",
    },
} satisfies ChartConfig;

export function RadialProgressChart({
    currentPR = 0,
    goal = 0,
    label,
}: {
    currentPR?: number | null;
    goal?: number | null;
    label?: string | null;
}) {
    const chartData = [
        {
            browser: "desktop",
            exercise: currentPR,
            color: "var(--secondary-background)",
        },
    ];

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-h-80 overflow-visible"
        >
            <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={450}
                outerRadius={140}
                innerRadius={120}
            >
                <RadialBar
                    dataKey="exercise"
                    cornerRadius={10}
                    fill="var(--secondary-background)"
                    background={{ fill: "#ffffff" }}
                />
                <PolarAngleAxis
                    type="number"
                    domain={[0, goal || 0]}
                    tick={false}
                />
                <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                    className="max-w-2 overflow-hidden translate-y-10"
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        {label ? (
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) - 36}
                                                className="fill-secondary-text text-2xl font-bold capitalize"
                                                textLength="200"
                                                lengthAdjust="spacingAndGlyphs"
                                            >
                                                {label}
                                            </tspan>
                                        ) : (
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) - 36}
                                                className="fill-secondary-text text-2xl font-bold"
                                            >
                                                No PRs yet
                                            </tspan>
                                        )}

                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-primary-text text-4xl font-bold "
                                        >
                                            {chartData[0].exercise
                                                ? chartData[0].exercise
                                                : "- "}
                                            kg
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 36}
                                            className="fill-accent-text text-lg font-bold"
                                        >
                                            {goal
                                                ? `Goal: ${goal}kg`
                                                : "No goal set"}
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </PolarRadiusAxis>
            </RadialBarChart>
        </ChartContainer>
    );
}
