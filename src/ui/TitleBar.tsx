'use client';

import * as React from 'react';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { useMacWindowContext } from '../context/macWindowContext';

const BTN =
  'text-white rounded-full p-1 hover:brightness-95 transition duration-200 cursor-pointer';

type Props = {
  title?: string;
  rightSlot?: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
};

export default function MacTitleBar({
  title = 'Untitled',
  rightSlot,
  onClose,
  onMinimize,
}: Props) {
  const { dragControls, isMaximized, toggleMaximize, close } =
    useMacWindowContext();

  return (
    <div
      className="flex h-10 cursor-move items-center justify-between bg-gray-100 px-2 select-none"
      onPointerDown={(e) => {
        if (!isMaximized) dragControls.start(e);
      }}
      style={{ touchAction: 'none' }}
    >
      <div className="flex gap-1">
        <button
          className={`bg-red-500 ${BTN}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
            close();
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
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          <FiMaximize2 />
        </button>
      </div>

      <div className="truncate pr-2 text-sm text-gray-600">{title}</div>
      <div className="flex items-center gap-2">{rightSlot}</div>
    </div>
  );
}
