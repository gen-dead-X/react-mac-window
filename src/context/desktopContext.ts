import { createContext, useContext } from 'react';

export type DesktopCtx = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  inset: number;
  nextZIndex: () => number; // optional: for bring-to-front
};

const DesktopContext = createContext<DesktopCtx | null>(null);

export const useDesktop = () => {
  const v = useContext(DesktopContext);
  if (!v) throw new Error('MacDesktop missing. Wrap windows in <MacDesktop>.');
  return v;
};

export default DesktopContext;
