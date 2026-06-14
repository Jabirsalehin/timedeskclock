import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * High-precision time hook with second-boundary synchronization
 * Uses RAF + timeout hybrid for optimal accuracy and performance
 */
export function usePreciseTime() {
  const [time, setTime] = useState(() => new Date());
  const rafRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSecondRef = useRef<number>(Math.floor(Date.now() / 1000));

  useEffect(() => {
    // Hybrid timeout + RAF approach:
    // - Schedule a timeout to wake shortly before the second boundary
    // - Use RAF loop to catch the exact millisecond when the second flips
    // This minimizes drift and ensures the visual update begins immediately
    const wakeBeforeMs = 30; // wake ~30ms before boundary to prepare RAF

    const startCycle = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const tick = () => {
        const now = new Date();
        const currentSecond = Math.floor(now.getTime() / 1000);

        if (currentSecond !== lastSecondRef.current) {
          lastSecondRef.current = currentSecond;
          setTime(now);
          // Schedule next cycle after this second has been captured
          scheduleNext();
          return;
        }

        // Continue polling with RAF until the second increments
        rafRef.current = requestAnimationFrame(tick);
      };

      // Calculate ms until next second boundary
      const now = new Date();
      const msUntilNextSecond = 1000 - now.getMilliseconds();
      const delay = Math.max(0, msUntilNextSecond - wakeBeforeMs);

      timeoutRef.current = setTimeout(() => {
        // Start the RAF polling to hit the boundary precisely
        rafRef.current = requestAnimationFrame(tick);
      }, delay);
    };

    const scheduleNext = () => {
      // After we've updated on the boundary, schedule the next wake
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const now = new Date();
      const msUntilNextSecond = 1000 - now.getMilliseconds();
      timeoutRef.current = setTimeout(startCycle, msUntilNextSecond - wakeBeforeMs);
    };

    // Start the synchronization cycle
    startCycle();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
  }, []);

  return time;
}

/**
 * Optimized time digits hook - only returns changed values
 * Prevents unnecessary re-renders of unchanged digits
 */
export function useTimeDigits(format: '12h' | '24h', showSeconds: boolean) {
  const time = usePreciseTime();
  
  return useMemo(() => {
    let hours = time.getHours();
    const isPM = hours >= 12;
    
    if (format === '12h') {
      hours = hours % 12 || 12;
    }
    
    const h1 = Math.floor(hours / 10).toString();
    const h2 = (hours % 10).toString();
    const m1 = Math.floor(time.getMinutes() / 10).toString();
    const m2 = (time.getMinutes() % 10).toString();
    const s1 = Math.floor(time.getSeconds() / 10).toString();
    const s2 = (time.getSeconds() % 10).toString();
    
    return {
      h1, h2, m1, m2, s1, s2,
      isPM,
      ampm: isPM ? 'PM' : 'AM',
      date: time,
    };
  }, [time, format, showSeconds]);
}

/**
 * High-precision stopwatch with centisecond accuracy
 */
export function usePreciseStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);

  const updateElapsed = useCallback(() => {
    if (startTimeRef.current) {
      setElapsed(performance.now() - startTimeRef.current + pausedTimeRef.current);
    }
    rafRef.current = requestAnimationFrame(updateElapsed);
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(updateElapsed);
  }, [updateElapsed]);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    pausedTimeRef.current = elapsed;
    startTimeRef.current = 0;
    setIsRunning(false);
  }, [elapsed]);

  const resume = useCallback(() => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(updateElapsed);
  }, [updateElapsed]);

  const reset = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    setElapsed(0);
    setIsRunning(false);
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    setLaps(prev => [...prev, elapsed]);
  }, [elapsed]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
  }, []);

  return { elapsed, isRunning, laps, start, pause, resume, reset, lap };
}

/**
 * High-precision countdown timer
 */
export function usePreciseTimer() {
  const [remaining, setRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const endTimeRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);

  const updateRemaining = useCallback(() => {
    const now = performance.now();
    const left = Math.max(0, endTimeRef.current - now);
    setRemaining(left);

    if (left <= 0) {
      setIsRunning(false);
      setIsComplete(true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    rafRef.current = requestAnimationFrame(updateRemaining);
  }, []);

  const startTimer = useCallback((durationMs: number) => {
    setTotalDuration(durationMs);
    setRemaining(durationMs);
    endTimeRef.current = performance.now() + durationMs;
    setIsRunning(true);
    setIsComplete(false);
    rafRef.current = requestAnimationFrame(updateRemaining);
  }, [updateRemaining]);

  const pauseTimer = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    if (remaining > 0) {
      endTimeRef.current = performance.now() + remaining;
      setIsRunning(true);
      rafRef.current = requestAnimationFrame(updateRemaining);
    }
  }, [remaining, updateRemaining]);

  const resetTimer = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
    setRemaining(0);
    setTotalDuration(0);
    setIsRunning(false);
    setIsComplete(false);
    endTimeRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
  }, []);

  return { remaining, totalDuration, isRunning, isComplete, startTimer, pauseTimer, resumeTimer, resetTimer };
}

/**
 * Format milliseconds to display components
 */
export function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
  return { hours, minutes, seconds, centiseconds };
}
