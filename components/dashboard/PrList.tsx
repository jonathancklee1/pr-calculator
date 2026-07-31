import Card from "../atoms/Card";
import Image from "next/image";
import Pill from "../atoms/Pill";

function PrList() {
    return (
        <ul className="flex flex-col gap-4">
            <li>
                <Card>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src="https://images.pexels.com/photos/38247624/pexels-photo-38247624.jpeg"
                                alt="Flat Bench Press"
                                width={90}
                                height={90}
                                className="rounded-xl aspect-square object-cover"
                            />
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold">
                                    Flat Bench Press
                                </h3>
                                <Pill styles="bg-accent-text text-tertiary-text">
                                    Chest
                                </Pill>
                                <p>20/08/2026</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <p className="font-bold text-3xl text-primary-text">
                                60kg
                            </p>
                            <p className="font-medium  text-secondary-text">
                                Estimated 1RM: 75kg
                            </p>
                        </div>
                    </div>
                </Card>
            </li>
        </ul>
    );
}

export default PrList;
