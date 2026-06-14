import { useState } from 'react';
import { useStore, type ViewType } from '../store/useStore';
import { useWidgetStore } from '../store/widgetStore';
import { getTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Play, Timer, Focus,
  CheckSquare, AlarmClock, Bell, Globe2,
  History, Settings, Info, MoreHorizontal, X,
  LayoutDashboard, Layers
} from 'lucide-react';

const primaryItems: { id: ViewType | 'dashboard'; icon: React.ReactNode; label: string }[] = [
  { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { id: 'clock', icon: <Clock size={18} />, label: 'Clock' },
  { id: 'stopwatch', icon: <Play size={18} />, label: 'Stopwatch' },
  { id: 'timer', icon: <Timer size={18} />, label: 'Timer' },
  { id: 'focus', icon: <Focus size={18} />, label: 'Focus' },
];

const moreItems: { id: ViewType; icon: React.ReactNode; label: string }[] = [
  { id: 'tasks', icon: <CheckSquare size={18} />, label: 'Tasks' },
  { id: 'alarm', icon: <AlarmClock size={18} />, label: 'Alarms' },
  { id: 'reminder', icon: <Bell size={18} />, label: 'Reminders' },
  { id: 'worldclock', icon: <Globe2 size={18} />, label: 'World Clock' },
  { id: 'history', icon: <History size={18} />, label: 'History' },
  { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
  { id: 'about', icon: <Info size={18} />, label: 'About' },
];

const floatingOptions = [
  { type: 'clock' as const, label: 'Clock', emoji: '🕐' },
  { type: 'stopwatch' as const, label: 'Stopwatch', emoji: '⏱️' },
  { type: 'timer' as const, label: 'Timer', emoji: '⏲️' },
  { type: 'pomodoro' as const, label: 'Pomodoro', emoji: '🍅' },
  { type: 'prayer' as const, label: 'Prayer', emoji: '🕌' },
  { type: 'task' as const, label: 'Tasks', emoji: '✅' },
  { type: 'reminder' as const, label: 'Reminder', emoji: '🔔' },
  { type: 'countdown' as const, label: 'Countdown', emoji: '⏳' },
];

export default function MobileNav() {
  const { currentView, setCurrentView, theme } = useStore();
  const { dashboardMode, setDashboardMode, addFloatingWidget, floatingWidgets } = useWidgetStore();
  const t = getTheme(theme);
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = moreItems.some(item => item.id === currentView) && !dashboardMode;

  const handleNavClick = (id: string) => {
    if (id === 'dashboard') {
      setDashboardMode(true);
    } else {
      setDashboardMode(false);
      setCurrentView(id as ViewType);
    }
  };

  const isActive = (id: string) => {
    if (id === 'dashboard') return dashboardMode;
    return !dashboardMode && currentView === id;
  };

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMore(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-0 left-0 right-0 ${t.card} border-t ${t.border} rounded-t-2xl p-4 pb-8`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-semibold ${t.text}`}>More</span>
                <button onClick={() => setShowMore(false)} className={`${t.textMuted} p-1`}>
                  <X size={18} />
                </button>
              </div>
              
              {/* Views */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {moreItems.map((item) => {
                  const active = currentView === item.id && !dashboardMode;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { handleNavClick(item.id); setShowMore(false); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${
                        active ? 'bg-blue-500/20 text-blue-400' : `${t.surfaceHover} ${t.textSecondary}`
                      }`}
                    >
                      {item.icon}
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Floating Widgets */}
              <div className={`border-t ${t.border} pt-4`}>
                <p className={`text-xs font-semibold ${t.textMuted} mb-2 flex items-center gap-1.5`}>
                  <Layers size={12} /> Floating Widgets
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {floatingOptions.map((opt) => {
                    const isOpen = floatingWidgets.some(w => w.type === opt.type && w.visible);
                    return (
                      <button
                        key={opt.type}
                        onClick={() => { addFloatingWidget(opt.type); setShowMore(false); }}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                          isOpen 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : `${t.surfaceHover} ${t.textSecondary}`
                        }`}
                      >
                        <span className="text-lg">{opt.emoji}</span>
                        <span className="text-[9px]">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${t.sidebar} border-t ${t.border} safe-area-bottom`}>
        <div className="flex items-center justify-around px-1 py-1">
          {primaryItems.map((item) => {
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-[48px] ${
                  active ? 'text-blue-400' : t.textMuted
                }`}
              >
                {item.icon}
                <span className="text-[9px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowMore(true)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-[48px] ${
              isMoreActive ? 'text-blue-400' : t.textMuted
            }`}
          >
            <MoreHorizontal size={18} />
            <span className="text-[9px] font-medium">More</span>
          </button>
        </div>
      </div>
    </>
  );
}
