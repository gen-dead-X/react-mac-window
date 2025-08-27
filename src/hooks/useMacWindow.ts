'use client';
import {
  animate,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDesktop } from '../context/desktopContext';

export type Rect = { x: number; y: number; w: number; h: number };

export default function useMacWindow({
  containerRef: externalRef,
  initialRect = { x: 80, y: 80, w: 720, h: 460 },
  inset: insetProp,
  spring = { type: 'spring', bounce: 0.18, duration: 0.5 },
}: {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  initialRect?: Rect;
  inset?: number;
  spring?: { type?: 'spring'; bounce?: number; duration?: number };
}) {
  const desktop = useDesktop();
  const containerRef = externalRef ?? desktop?.containerRef;
  const inset = insetProp ?? desktop?.inset ?? 16;

  if (!containerRef) {
    throw new Error('No containerRef provided and no <MacDesktop> found.');
  }

  const dragControls = useDragControls();
  const x = useMotionValue(initialRect.x);
  const y = useMotionValue(initialRect.y);
  const w = useMotionValue(initialRect.w);
  const h = useMotionValue(initialRect.h);

  const [winSize, setWinSize] = useState({
    w: initialRect.w,
    h: initialRect.h,
  });
  useMotionValueEvent(w, 'change', (val) =>
    setWinSize((s) => (s.w === val ? s : { ...s, w: val }))
  );
  useMotionValueEvent(h, 'change', (val) =>
    setWinSize((s) => (s.h === val ? s : { ...s, h: val }))
  );

  const [containerSize, setContainerSize] = useState({ cw: 0, ch: 0 });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setContainerSize({ cw: r.width, ch: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const constraints = useMemo(() => {
    const { cw, ch } = containerSize;
    const { w: ww, h: hh } = winSize;
    if (!cw || !ch)
      return {
        left: -Infinity,
        right: Infinity,
        top: -Infinity,
        bottom: Infinity,
      };
    return {
      left: inset,
      top: inset,
      right: Math.max(inset, cw - inset - ww),
      bottom: Math.max(inset, ch - inset - hh),
    };
  }, [containerSize, winSize, inset]);

  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  useEffect(() => {
    const { left, right, top, bottom } = constraints;
    x.set(clamp(x.get(), left, right));
    y.set(clamp(y.get(), top, bottom));
  }, [constraints]); // eslint-disable-line

  useLayoutEffect(() => {
    const { left, right, top, bottom } = constraints;
    x.set(clamp(x.get(), left, right));
    y.set(clamp(y.get(), top, bottom));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isMaximized, setIsMaximized] = useState(false);
  const prevRectRef = useRef<Rect>(initialRect);
  const animateRect = (r: Rect) => {
    animate(x, r.x, spring);
    animate(y, r.y, spring);
    animate(w, r.w, spring);
    animate(h, r.h, spring);
  };

  const maximize = () => {
    const el = containerRef.current;
    if (!el) return;
    prevRectRef.current = { x: x.get(), y: y.get(), w: w.get(), h: h.get() };
    const cw = el.clientWidth,
      ch = el.clientHeight;
    animateRect({
      x: inset,
      y: inset,
      w: Math.max(0, cw - inset * 2),
      h: Math.max(0, ch - inset * 2),
    });
    setIsMaximized(true);
  };
  const restore = () => {
    animateRect(prevRectRef.current);
    setIsMaximized(false);
  };
  const toggleMaximize = () => (isMaximized ? restore() : maximize());

  return {
    dragControls,
    constraints,
    isMaximized,
    x,
    y,
    w,
    h,
    inset,
    maximize,
    restore,
    toggleMaximize,
    setRect: (rect: Partial<Rect>) =>
      animateRect({
        x: rect.x ?? x.get(),
        y: rect.y ?? y.get(),
        w: rect.w ?? w.get(),
        h: rect.h ?? h.get(),
      }),
  };
}
