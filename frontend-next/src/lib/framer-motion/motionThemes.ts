import type { MotionProps } from 'framer-motion';

const variants = {
  hideLeft: {
    x: '-100%',
  },
  hideRight: {
    x: '-100%',
  },
  show: {
    x: 0,
  },
} as const;

const style = {
  position: 'absolute',
  width: '100%',
  height: '100%',
} as const;

const transition = {
  type: 'circOut',
} as const;

const unanimated = {
  style,
  transition,
  variants,
} as const;

export const motionThemes = {
  unanimated,
  back: {
    ...unanimated,
    initial: {
      x: '-100%',
    },
    animate: {
      x: '0%',
    },
    exit: {
      x: '100%',
    },
  },
  forward: {
    ...unanimated,
    initial: {
      x: '100%',
    },
    animate: {
      x: '0%',
    },
    exit: {
      x: '-100%',
    },
  },
} as { [K: string]: MotionProps };
