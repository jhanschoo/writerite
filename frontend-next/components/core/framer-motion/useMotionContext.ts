import { useContext } from "react";
import { MotionContext } from "../../../lib/core/frameworks/framer-motion/motionContext";

export const useMotionContext = () => useContext(MotionContext);