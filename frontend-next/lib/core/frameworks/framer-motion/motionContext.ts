import { createContext } from "react";
import type { MotionProps } from "framer-motion";

export interface MotionState {
	motionProps: MotionProps;
	setMotionProps: (props: MotionProps) => void;
}

export const initialMotionState: MotionState = {
	motionProps: {},
	setMotionProps: () => {},
};

export const MotionContext = createContext<MotionState>(initialMotionState);
