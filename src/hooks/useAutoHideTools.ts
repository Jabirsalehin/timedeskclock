import { useState, useEffect, useCallback } from 'react';

const IDLE_MS = 3000;

/**
 * Auto-hide tools after idle period; reveal on mouse movement near bottom or any movement.
 */
export function useAutoHideTools(enabled: boolean) {
  const [toolsVisible, setToolsVisible] = useState(!enabled);

  const reveal = useCallback(() => {
    if (enabled) setToolsVisible(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setToolsVisible(true);
      return;
    }

    setToolsVisible(false);
    let idleTimer: ReturnType<typeof setTimeout>;

    const scheduleHide = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setToolsVisible(false), IDLE_MS);
    };

    const handleMove = (e: MouseEvent) => {
      const nearBottom = e.clientY > window.innerHeight * 0.65;
      if (nearBottom || e.movementX !== 0 || e.movementY !== 0) {
        setToolsVisible(true);
        scheduleHide();
      }
    };

    const handleTouch = () => {
      setToolsVisible(true);
      scheduleHide();
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchstart', handleTouch);
    scheduleHide();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [enabled]);

  return { toolsVisible, reveal };
}
