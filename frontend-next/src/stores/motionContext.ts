import { createContext } from "react";
import type { MotionProps } from "framer-motion";
import { motionThemes } from "../lib/framer-motion/motionThemes";

export interface MotionState {
	motionProps: MotionProps;
	setMotionProps: (props: MotionProps) => void;
}

export const initialMotionState: MotionState = {
	motionProps: motionThemes.unanimated,
	setMotionProps: () => {},
};

export const MotionContext = createContext<MotionState>(initialMotionState);
