"use client";

import * as React from "react";
import { IoMdClose } from "react-icons/io";
import { FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { useMacWindowContext } from "../context/macWindowContext";

const BTN =
  "text-white rounded-full p-1 hover:brightness-95 transition duration-200 cursor-pointer";

type Props = {
  title?: string;
  rightSlot?: React.ReactNode; // extra controls on the right
  onClose?: () => void;
  onMinimize?: () => void; // if you implement a dock, wire it here
};

export default function MacTitleBar({
  title = "Untitled",
  rightSlot,
  onClose,
  onMinimize,
}: Props) {
  const { dragControls, isMaximized, toggleMaximize } = useMacWindowContext();

  return (
    <div
      className="h-10 bg-gray-100 flex items-center justify-between px-2 cursor-move select-none"
      onPointerDown={(e) => {
        if (!isMaximized) dragControls.start(e);
      }}
      style={{ touchAction: "none" }}
    >
      <div className="flex gap-1">
        <button
          className={`bg-red-500 ${BTN}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          aria-label="Close"
          title="Close"
        >
          <IoMdClose />
        </button>

        <button
          className={`bg-yellow-500 ${BTN}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onMinimize?.();
          }}
          aria-label="Minimize"
          title="Minimize"
        >
          <FiMinimize2 />
        </button>

        <button
          className={`bg-green-500 ${BTN}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            toggleMaximize();
          }}
          aria-label={isMaximized ? "Restore" : "Maximize"}
          title={isMaximized ? "Restore" : "Maximize"}
        >
          <FiMaximize2 />
        </button>
      </div>

      <div className="text-sm text-gray-600 pr-2 truncate">{title}</div>
      <div className="flex items-center gap-2">{rightSlot}</div>
    </div>
  );
}
