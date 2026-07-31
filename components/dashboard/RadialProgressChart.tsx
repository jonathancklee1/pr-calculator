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
    currentPR = 60,
    goal = 90,
    label,
}: {
    currentPR?: number;
    goal?: number;
    label?: string;
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
                <PolarAngleAxis type="number" domain={[0, goal]} tick={false} />
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
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) - 36}
                                            className="fill-secondary-text text-2xl font-bold"
                                            textLength="200"
                                            lengthAdjust="spacingAndGlyphs"
                                        >
                                            {label}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-primary-text text-4xl font-bold "
                                        >
                                            {chartData[0].exercise}kg
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 36}
                                            className="fill-accent-text text-lg font-bold"
                                        >
                                            Goal: {goal}kg
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
