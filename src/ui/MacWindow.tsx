// MacWindow.tsx
"use client";
import { motion } from "motion/react";
import clsx from "clsx";
import useMacWindow, { type Rect } from "../hooks/useMacWindow";
import { useState } from "react";
import { useDesktop } from "../context/desktop";
import MacWindowContext from "../context/macWindow";

type Props = {
  children: React.ReactNode;
  className?: string;
  initialRect?: Rect;
  inset?: number;
  spring?: { type?: "spring"; bounce?: number; duration?: number };
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function MacWindow({
  children,
  className,
  containerRef,
  initialRect,
  inset,
  spring,
}: Props) {
  const desktop = useDesktop();
  const api = useMacWindow({
    containerRef: containerRef ?? desktop?.containerRef,
    initialRect,
    inset,
    spring,
  });
  const { dragControls, constraints, x, y, w, h } = api;

  const [z, setZ] = useState(1);
  const bump = () => {
    const nz = desktop?.nextZIndex ? desktop.nextZIndex() : z + 1;
    setZ(nz);
  };

  return (
    <MacWindowContext.Provider value={api}>
      <motion.div
        onMouseDown={bump}
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraints}
        dragElastic={0.1}
        dragMomentum={false}
        style={{ x, y, width: w, height: h, zIndex: z }}
        className={clsx(
          "absolute overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg will-change-transform",
          className
        )}
      >
        {children}
      </motion.div>
    </MacWindowContext.Provider>
  );
}
