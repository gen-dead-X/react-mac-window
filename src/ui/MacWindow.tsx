"use client";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import useMacWindow, { type Rect } from "../hooks/useMacWindow";
import { useMemo, useState } from "react";
import { useDesktop } from "../context/desktopContext";
import MacWindowContext from "../context/macWindowContext";

type Props = {
  children: React.ReactNode;
  className?: string;
  initialRect?: Rect;
  inset?: number;
  spring?: { type?: "spring"; bounce?: number; duration?: number };
  containerRef?: React.RefObject<HTMLDivElement | null>;
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
};

export default function MacWindow({
  children,
  className,
  containerRef,
  initialRect,
  inset,
  spring,
  open,
  defaultOpen = true,
  onClose,
}: Props) {
  const desktop = useDesktop();
  const api = useMacWindow({
    containerRef: containerRef ?? desktop?.containerRef,
    initialRect,
    inset,
    spring,
  });
  const { dragControls, constraints, x, y, w, h } = api;
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [z, setZ] = useState(1);
  const isOpen = isControlled ? open : internalOpen;

  const requestClose = () => {
    if (!isControlled) setInternalOpen(false);
    onClose?.();
  };

  const ctxValue = useMemo(
    () => ({
      ...api,
      close: requestClose,
      isOpen,
    }),
    [api, isOpen]
  );

  const bump = () => {
    const nz = desktop?.nextZIndex ? desktop.nextZIndex() : z + 1;
    setZ(nz);
  };

  return (
    <MacWindowContext.Provider value={ctxValue}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mac-window"
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
            // entry/exit polish
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, y: -12, filter: "blur(1px)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </MacWindowContext.Provider>
  );
}
