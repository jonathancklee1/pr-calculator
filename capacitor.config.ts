import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.prcalculator.app",
    appName: "pr-calculator",
    webDir: "out",
    server: {
        url: "http://localhost:3000",
    },
};

export default config;
