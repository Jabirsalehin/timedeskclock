import { useStore } from './store/useStore';
import { useWidgetStore } from './store/widgetStore';
import { themeExperiences, type ThemeExperienceId } from './utils/themeExperience';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import FloatingWidgets from './components/FloatingWidgets';
import DesktopOverlay from './components/DesktopOverlay';
import ClockView from './views/ClockView';
import AlarmView from './views/AlarmView';
import ReminderView from './views/ReminderView';
import StopwatchView from './views/StopwatchView';
import TimerView from './views/TimerView';
import FocusView from './views/FocusView';
import TasksView from './views/TasksView';
import WorldClockView from './views/WorldClockView';
import HistoryView from './views/HistoryView';
import SettingsView from './views/SettingsView';
import AboutView from './views/AboutView';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';

// Theme manager that applies theme experience to body
function ThemeManager() {
  const { theme, themeExperience } = useStore();
  
  useEffect(() => {
    const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
    const accentRgb = useMemo(
      () => hexToRgb(te.colors.accent) || '59, 130, 246',
      [te.colors.accent]
    );
    
    // Apply base theme colors
    document.body.style.backgroundColor = te.colors.bg;
    document.body.style.color = te.colors.text;
    
    // Apply CSS custom properties for dynamic theming
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', te.colors.bg);
    root.style.setProperty('--theme-surface', te.colors.surface);
    root.style.setProperty('--theme-border', te.colors.border);
    root.style.setProperty('--theme-text', te.colors.text);
    root.style.setProperty('--theme-accent', te.colors.accent);
    root.style.setProperty('--accent-rgb', accentRgb);
    
    // Add/remove effect classes
    document.body.classList.remove('theme-noise', 'theme-scanlines', 'theme-vignette');
    if (te.effects.noise) document.body.classList.add('theme-noise');
    if (te.effects.scanlines) document.body.classList.add('theme-scanlines');
    if (te.effects.vignette) document.body.classList.add('theme-vignette');
    
  }, [theme, themeExperience]);
  
  return null;
}

function hexToRgb(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : null;
}

function WelcomeScreen({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center cursor-pointer"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6"
      >
        <Clock size={36} className="text-white" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-3xl font-bold text-white tracking-tight"
      >
        TimeDesk
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-[#555] mt-2 font-light"
      >
        Your Personal Time Workspace
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-8 text-[11px] text-[#3a3a3a] flex items-center gap-1.5"
      >
        Designed & Developed by{' '}
        <a
          href="https://zabir.site"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500/70 hover:text-blue-400 transition-colors font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          JABIR
        </a>
      </motion.div>
    </motion.div>
  );
}

function ViewRenderer() {
  const { currentView } = useStore();
  const { dashboardMode } = useWidgetStore();

  // If dashboard mode is active, show dashboard
  if (dashboardMode) {
    return <Dashboard />;
  }

  const views: Record<string, React.ReactNode> = {
    clock: <ClockView />,
    alarm: <AlarmView />,
    reminder: <ReminderView />,
    stopwatch: <StopwatchView />,
    timer: <TimerView />,
    focus: <FocusView />,
    tasks: <TasksView />,
    worldclock: <WorldClockView />,
    history: <HistoryView />,
    settings: <SettingsView />,
    about: <AboutView />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="h-full"
      >
        {views[currentView] || <ClockView />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { themeExperience, isFullscreen, overlayEnabled, overlayClickThrough } = useStore();
  const setCurrentView = useStore((state) => state.setCurrentView);
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const [showWelcome, setShowWelcome] = useState(true);

  const isOverlayWindow = typeof window !== 'undefined' && window.location.search.includes('overlay=1');

  useKeyboardShortcuts();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    if (params.get('settings') === '1') {
      setCurrentView('settings');
    }

    if (params.get('dashboard') === '1') {
      setCurrentView((params.get('view') as any) || 'clock');
    }
  }, [setCurrentView]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.electron?.onNavigate) return;

    window.electron.onNavigate((view) => {
      if (view === 'dashboard') {
        setCurrentView('clock');
      } else if (view === 'settings') {
        setCurrentView('settings');
      } else if (view === 'clock') {
        setCurrentView('clock');
      }
    });
  }, [setCurrentView]);

  useEffect(() => {
    if (typeof window === 'undefined' || isOverlayWindow) return;
    const electron = (window as any).electron;
    if (!electron?.setOverlayWindowVisibility) return;
    electron.setOverlayWindowVisibility(Boolean(overlayEnabled));
  }, [overlayEnabled, isOverlayWindow]);

  useEffect(() => {
    if (typeof window === 'undefined' || isOverlayWindow) return;
    const electron = (window as any).electron;
    if (!electron?.setOverlayClickThrough) return;
    electron.setOverlayClickThrough(Boolean(overlayClickThrough));
  }, [overlayClickThrough, isOverlayWindow]);

  // Compute effect classes
  const effectClasses = useMemo(() => {
    return [
      te.effects.noise && 'theme-noise',
      te.effects.scanlines && 'theme-scanlines',
      te.effects.vignette && 'theme-vignette',
    ].filter(Boolean).join(' ');
  }, [te.effects]);

  if (isOverlayWindow) {
    return (
      <div className="h-full w-full relative overflow-hidden" style={{ background: 'transparent' }}>
        <DesktopOverlay />
      </div>
    );
  }

  return (
    <>
      <ThemeManager />

      <AnimatePresence>
        {showWelcome && <WelcomeScreen onDismiss={() => setShowWelcome(false)} />}
      </AnimatePresence>

      <div 
        className={`h-full flex relative overflow-hidden ${effectClasses}`}
        style={{
          background: te.colors.bgGradient || te.colors.bg,
        }}
      >
        {/* Desktop Sidebar — hidden during fullscreen for distraction-free focus */}
        {!isFullscreen && (
          <div className="hidden md:flex">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-hidden relative ${isFullscreen ? '' : 'pb-14 md:pb-0'}`}>
          <ViewRenderer />
          
          {/* Footer Credit — hidden in fullscreen */}
          {!isFullscreen && (
            <div 
              className="hidden md:flex absolute bottom-2 right-4 text-[10px] items-center gap-1 pointer-events-auto opacity-30 hover:opacity-70 transition-opacity z-10"
              style={{ color: te.colors.textMuted }}
            >
              <span>© 2026 TimeDesk</span>
              <span>·</span>
              <a
                href="https://zabir.site"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: `${te.colors.accent}99` }}
                className="hover:opacity-100 transition-colors"
              >
                JABIR
              </a>
            </div>
          )}
        </main>

        {/* Mobile Navigation — hidden during fullscreen */}
        {!isFullscreen && <MobileNav />}
        
        {/* Ambient glow for themes that support it */}
        {te.effects.ambientGlow && (
          <div 
            className="fixed inset-0 pointer-events-none opacity-10 z-0"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${te.colors.accent}25 0%, transparent 60%)`,
            }}
          />
        )}
      </div>

      {/* Floating Widgets Layer */}
      <FloatingWidgets />
      {/* Desktop Overlay (premium) */}
      <DesktopOverlay />
    </>
  );
}
