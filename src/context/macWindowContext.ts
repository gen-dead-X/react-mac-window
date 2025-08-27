'use client';

import type { DragControls, MotionValue } from 'motion/react';
import { createContext, useContext } from 'react';

type Ctx = {
  dragControls: DragControls;
  constraints: { left: number; right: number; top: number; bottom: number };
  isMaximized: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  w: MotionValue<number>;
  h: MotionValue<number>;
  toggleMaximize: () => void;
  maximize: () => void;
  restore: () => void;
  close: () => void;
  isOpen: boolean;
};

const MacWindowContext = createContext<Ctx | null>(null);

export const useMacWindowContext = () => {
  const ctx = useContext(MacWindowContext);
  if (!ctx)
    throw new Error(
      'useMacWindowContext must be used within <MacWindowProvider>'
    );
  return ctx;
};

export default MacWindowContext;
