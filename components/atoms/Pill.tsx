import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
function Pill({ children, styles }: { children: ReactNode; styles?: string }) {
    return <Badge className={styles}>{children}</Badge>;
}

export default Pill;
