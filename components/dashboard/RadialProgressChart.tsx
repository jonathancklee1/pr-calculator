"use client";

import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import Image from "next/image";

const chartData = [
    {
        browser: "desktop",
        exercise: 90,
        fill: "var(--secondary-background)",
        color: "var(--secondary-background)",
    },
];

const chartConfig = {
    exercise: {
        label: "Exercise",
        color: "var(--color-exercise)",
    },
    desktop: {
        label: "Desktop",
        color: "var(--color-desktop)",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig;

export function RadialProgressChart({ goal = 100 }: { goal?: number }) {
    const endAngle = (chartData[0].exercise / goal) * 360;
    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-h-80"
        >
            <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={endAngle}
                outerRadius={140}
                innerRadius={120}
            >
                <RadialBar dataKey="exercise" background cornerRadius={10} />
                <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                    className=" max-w-2 overflow-hidden"
                >
                    <Label
                        className=" max-w-2 overflow-hidden"
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
                                            className="fill-secondary-text text-2xl font-bold text-wrap "
                                            textLength="200"
                                            lengthAdjust="spacingAndGlyphs"
                                        >
                                            Flat Bench Press
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) - 36}
                                            className="fill-secondary-text text-2xl font-bold"
                                        >
                                            <Image
                                                src="https://images.pexels.com/photos/38247624/pexels-photo-38247624.jpeg"
                                                alt="Flat Bench Press"
                                                width={100}
                                                height={100}
                                                className="mx-auto my-2 rounded-full"
                                            />
                                        </tspan>

                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-secondary-text text-4xl font-bold "
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
