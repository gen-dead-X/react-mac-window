"use client";

import { motion } from "motion/react";
import { type ReactNode, useRef } from "react";
import clsx from "clsx";
import type { Rect } from "../hooks/useMacWindow";
import useMacWindow from "../hooks/useMacWindow";
import MacWindowContext from "../context/macWindow/context";

type MacWindowProps = {
  children: ReactNode;
  className?: string;
  initialRect?: Rect;
  inset?: number;
  spring?: { type?: "spring"; bounce?: number; duration?: number };
  containerClassName?: string; // class for the constraints container
};

export default function MacWindow({
  children,
  className,
  containerClassName = "relative h-screen w-screen bg-gray-50",
  initialRect,
  inset,
  spring,
}: MacWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const api = useMacWindow({
    containerRef,
    initialRect,
    inset,
    spring,
  });

  const { dragControls, constraints, x, y, w, h } = api;

  return (
    <div ref={containerRef} className={containerClassName}>
      <MacWindowContext.Provider value={api}>
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={constraints}
          dragElastic={0.1}
          dragMomentum={false}
          style={{ x, y, width: w, height: h }}
          className={clsx(
            "absolute overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg will-change-transform",
            className
          )}
        >
          {children}
        </motion.div>
      </MacWindowContext.Provider>
    </div>
  );
}
