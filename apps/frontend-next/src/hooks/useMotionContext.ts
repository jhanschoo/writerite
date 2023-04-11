import { useContext } from 'react';
import { MotionContext } from '../stores/motionContext';

export const useMotionContext = () => useContext(MotionContext);
