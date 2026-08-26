import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.prcalculator.app",
    appName: "pr-calculator",
    webDir: "out",
    // No `server.url` here: the packaged app must load the bundled `out/`
    // export, not a dev server that won't exist on a real device. For local
    // live-reload, run `npx cap run android -l --external` instead of adding
    // `server.url` back here.
};

export default config;
