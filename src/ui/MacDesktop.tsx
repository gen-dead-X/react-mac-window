"use client";
import { useRef, useState } from "react";
import clsx from "clsx";
import DesktopContext from "../context/desktopContext";

export default function MacDesktop({
  children,
  className = "relative h-screen w-screen bg-neutral-100",
  inset = 16,
}: {
  children: React.ReactNode;
  className?: string;
  inset?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [z, setZ] = useState(10);
  const nextZIndex = () => {
    setZ((n) => n + 1);
    return z + 1;
  };

  return (
    <div ref={containerRef} className={clsx(className)}>
      <DesktopContext.Provider value={{ containerRef, inset, nextZIndex }}>
        {children}
      </DesktopContext.Provider>
    </div>
  );
}
