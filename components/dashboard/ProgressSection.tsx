import Image from "next/image";
import { RadialProgressChart } from "./RadialProgressChart";

function ProgressSection() {
    return (
        <div className="relative text-3xl font-bold underline bg-primary-background ">
            <Image
                src="https://images.pexels.com/photos/38247624/pexels-photo-38247624.jpeg"
                alt="Flat Bench Press"
                width={90}
                height={90}
                className="absolute left-1/2 -translate-x-1/2 top-10 mx-auto my-2 rounded-full aspect-square object-cover"
            />
            <RadialProgressChart />
        </div>
    );
}

export default ProgressSection;
