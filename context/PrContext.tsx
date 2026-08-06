"use client";

import { ExerciseRecord } from "@/lib/types";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

interface PrState {
    prs: ExerciseRecord[];
    setState: Dispatch<SetStateAction<PrState>>;
}

const STORAGE_KEY = "pr-state";

const defaultState: PrState = {
    prs: [
        // {
        //     name: null,
        //     gifUrl: null,
        //     currentPR: null,
        //     goal: null,
        //     date: null,
        //     oneRM: null,
        //     bodyParts: [],
        //     weight: null,
        //     reps: null,
        // },
    ],
    setState: () => {},
};

const PrStateContext = createContext<PrState | undefined>(undefined);

export function PrStateProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<PrState>(defaultState);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setState(JSON.parse(stored));
            }
        } catch (err) {
            console.error("Failed to read app state from localStorage:", err);
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            console.error("Failed to write app state to localStorage:", err);
        }
    }, [state, hydrated]);

    return (
        <PrStateContext.Provider value={{ ...state, setState }}>
            {children}
        </PrStateContext.Provider>
    );
}

export function usePrState() {
    const ctx = useContext(PrStateContext);
    if (!ctx) {
        throw new Error("usePrState must be used within an PrStateProvider");
    }
    return ctx;
}
