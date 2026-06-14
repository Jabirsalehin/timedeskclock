import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useWidgetStore } from '../store/widgetStore';

export function useKeyboardShortcuts() {
  const { setCurrentView, setFullscreen, enterFullscreen } = useStore();
  const { setDashboardMode, addFloatingWidget } = useWidgetStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    // Ctrl/Cmd + number for quick nav
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'd': e.preventDefault(); setDashboardMode(true); break;
        case '1': e.preventDefault(); setDashboardMode(false); setCurrentView('clock'); break;
        case '2': e.preventDefault(); setDashboardMode(false); setCurrentView('stopwatch'); break;
        case '3': e.preventDefault(); setDashboardMode(false); setCurrentView('timer'); break;
        case '4': e.preventDefault(); setDashboardMode(false); setCurrentView('focus'); break;
        case '5': e.preventDefault(); setDashboardMode(false); setCurrentView('tasks'); break;
      }
    }

    // Alt + key for floating widgets
    if (e.altKey) {
      switch (e.key) {
        case 'c': e.preventDefault(); addFloatingWidget('clock'); break;
        case 's': e.preventDefault(); addFloatingWidget('stopwatch'); break;
        case 't': e.preventDefault(); addFloatingWidget('timer'); break;
        case 'p': e.preventDefault(); addFloatingWidget('pomodoro'); break;
        case 'r': e.preventDefault(); addFloatingWidget('reminder'); break;
        case 'k': e.preventDefault(); addFloatingWidget('task'); break;
      }
    }

    // F11 / Escape for fullscreen
    if (e.key === 'F11') {
      e.preventDefault();
      setDashboardMode(false);
      enterFullscreen();
    }
    if (e.key === 'Escape') {
      setFullscreen(false);
    }
  }, [setCurrentView, setFullscreen, enterFullscreen, setDashboardMode, addFloatingWidget]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
