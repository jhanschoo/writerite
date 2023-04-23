import { createContext } from 'react';

export const ResetUrqlContext = createContext<(() => void) | undefined>(
  undefined
);
