import { useStore } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { useTime, formatTime, getAmPm } from '../hooks/useTime';
// Header component for TimeDesk

export default function HeaderBar() {
  const { theme, timeFormat, currentView } = useStore();
  const t = getTheme(theme);
  const now = useTime();

  const viewLabels: Record<string, string> = {
    clock: 'Clock',
    alarm: 'Alarms',
    reminder: 'Reminders',
    stopwatch: 'Stopwatch',
    timer: 'Timer',
    focus: 'Focus Mode',
    tasks: 'Tasks',
    worldclock: 'World Clock',
    history: 'Session History',
    settings: 'Settings',
    about: 'About',
  };

  return (
    <div className={`h-12 flex items-center justify-between px-4 border-b ${t.border} ${t.bgSecondary} shrink-0`}>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${t.text}`}>
          {viewLabels[currentView] || 'TimeDesk'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-mono ${t.textMuted}`}>
          {formatTime(now, timeFormat, false)} {timeFormat === '12h' ? getAmPm(now) : ''}
        </span>
      </div>
    </div>
  );
}
