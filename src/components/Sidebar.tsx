import { useStore, type ViewType } from '../store/useStore';
import { useWidgetStore } from '../store/widgetStore';
import { useProfileStore, profileConfigs } from '../store/profileStore';
// Profile-aware sidebar
import { getTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, AlarmClock, Bell, Timer, Play, Focus, CheckSquare,
  Globe2, History, Settings, Info, ChevronLeft, ChevronRight,
  LayoutDashboard, Layers
} from 'lucide-react';
import { useState } from 'react';

const navItems: { id: ViewType | 'dashboard'; label: string; icon: React.ReactNode; group: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, group: 'main' },
  { id: 'clock', label: 'Clock', icon: <Clock size={18} />, group: 'time' },
  { id: 'alarm', label: 'Alarm', icon: <AlarmClock size={18} />, group: 'time' },
  { id: 'reminder', label: 'Reminders', icon: <Bell size={18} />, group: 'time' },
  { id: 'stopwatch', label: 'Stopwatch', icon: <Play size={18} />, group: 'time' },
  { id: 'timer', label: 'Timer', icon: <Timer size={18} />, group: 'time' },
  { id: 'focus', label: 'Focus', icon: <Focus size={18} />, group: 'productivity' },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} />, group: 'productivity' },
  { id: 'worldclock', label: 'World Clock', icon: <Globe2 size={18} />, group: 'tools' },
  { id: 'history', label: 'History', icon: <History size={18} />, group: 'tools' },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} />, group: 'system' },
  { id: 'about', label: 'About', icon: <Info size={18} />, group: 'system' },
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

export default function Sidebar() {
  const { currentView, setCurrentView, theme, sidebarCollapsed, toggleSidebar } = useStore();
  const { dashboardMode, setDashboardMode, addFloatingWidget, floatingWidgets } = useWidgetStore();
  const { activeProfile } = useProfileStore();
  const profile = profileConfigs[activeProfile];
  const t = getTheme(theme);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  const groups = [
    { key: 'main', label: 'Main' },
    { key: 'time', label: 'Time' },
    { key: 'productivity', label: 'Productivity' },
    { key: 'tools', label: 'Tools' },
    { key: 'system', label: 'System' },
  ];

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
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 60 : 216 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`${t.sidebar} ${t.border} border-r flex flex-col h-full relative z-20 shrink-0`}
    >
      {/* Logo Header - with profile accent */}
      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between px-4'} h-14 border-b ${t.border}`}>
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md"
              style={{ 
                background: `linear-gradient(135deg, ${profile.accentColor}, ${profile.accentColor}cc)`,
                boxShadow: `0 4px 12px ${profile.accentColor}30`
              }}
            >
              <Clock size={14} className="text-white" />
            </div>
            <div>
              <span className={`font-semibold text-[13px] tracking-tight ${t.text} block leading-none`}>TimeDesk</span>
              <span className="text-[9px] leading-none" style={{ color: profile.accentColor }}>
                {profile.emoji} {profile.name}
              </span>
            </div>
          </div>
        ) : (
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md"
            style={{ 
              background: `linear-gradient(135deg, ${profile.accentColor}, ${profile.accentColor}cc)`,
              boxShadow: `0 4px 12px ${profile.accentColor}30`
            }}
          >
            <Clock size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-0.5">
        {groups.map((group, gi) => (
          <div key={group.key} className={gi > 0 ? 'mt-3' : ''}>
            {!sidebarCollapsed && (
              <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${t.textMuted} px-2.5 mb-1`}>
                {group.label}
              </p>
            )}
            {sidebarCollapsed && gi > 0 && (
              <div className={`mx-auto w-5 border-t ${t.border} mb-1.5 mt-1.5`} />
            )}
            {navItems
              .filter((item) => item.group === group.key)
              .map((item) => {
                const active = isActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2.5 rounded-lg text-[13px] transition-all duration-100 ${
                      sidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-[7px]'
                    } ${
                      active
                        ? `${t.surface} ${t.text} font-medium`
                        : `${t.textSecondary} ${t.surfaceHover} hover:${t.text}`
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className={`shrink-0 ${active ? 'text-blue-400' : ''}`}>{item.icon}</span>
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Floating Widgets Menu */}
      {!sidebarCollapsed && (
        <div className={`border-t ${t.border} p-2`}>
          <div className="relative">
            <button
              onClick={() => setShowFloatingMenu(!showFloatingMenu)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] ${t.textSecondary} ${t.surfaceHover} transition-colors`}
            >
              <Layers size={16} />
              <span>Floating Widgets</span>
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${t.surface} ${t.textMuted}`}>
                {floatingWidgets.filter(w => w.visible).length}
              </span>
            </button>
            
            <AnimatePresence>
              {showFloatingMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={`absolute bottom-full left-0 right-0 mb-1 ${t.card} border ${t.cardBorder} rounded-xl shadow-xl p-2 z-50`}
                >
                  <p className={`text-[10px] font-semibold uppercase tracking-widest ${t.textMuted} px-2 mb-1`}>
                    Launch Floating
                  </p>
                  {floatingOptions.map((opt) => {
                    const isOpen = floatingWidgets.some(w => w.type === opt.type && w.visible);
                    return (
                      <button
                        key={opt.type}
                        onClick={() => addFloatingWidget(opt.type)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs ${
                          isOpen 
                            ? 'text-blue-400 bg-blue-500/10' 
                            : `${t.textSecondary} ${t.surfaceHover}`
                        } transition-colors`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{opt.emoji}</span>
                          {opt.label}
                        </span>
                        {isOpen && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className={`border-t ${t.border} p-2 space-y-1`}>
        {!sidebarCollapsed && (
          <a
            href="https://zabir.site"
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-center text-[9px] ${t.textMuted} hover:text-blue-400 transition-colors py-1`}
          >
            by JABIR
          </a>
        )}
        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center justify-center p-1.5 rounded-lg ${t.textMuted} ${t.surfaceHover} transition-colors`}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>
  );
}
