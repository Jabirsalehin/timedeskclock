import { memo, useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { profileConfigs } from '../../store/profileStore';
import { themeExperiences, type ThemeExperienceId } from '../../utils/themeExperience';
import { usePreciseTime, usePreciseTimer } from '../../hooks/usePreciseTime';
import { TrendingUp, Clock, AlertCircle, Play, Pause } from 'lucide-react';

const accent = profileConfigs.trader.accentColor;

interface MarketSession {
  name: string;
  city: string;
  flag: string;
  openHour: number;
  closeHour: number;
  timezone: string;
}

const sessions: MarketSession[] = [
  { name: 'Sydney', city: 'Sydney', flag: '🇦🇺', openHour: 7, closeHour: 16, timezone: 'Australia/Sydney' },
  { name: 'Tokyo', city: 'Tokyo', flag: '🇯🇵', openHour: 9, closeHour: 18, timezone: 'Asia/Tokyo' },
  { name: 'London', city: 'London', flag: '🇬🇧', openHour: 8, closeHour: 17, timezone: 'Europe/London' },
  { name: 'New York', city: 'New York', flag: '🇺🇸', openHour: 9, closeHour: 17, timezone: 'America/New_York' },
];

function getTimeInZone(date: Date, timezone: string) {
  const timeString = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  const [hourStr, minuteStr] = timeString.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  return {
    hour,
    minute,
    totalMinutes: hour * 60 + minute,
  };
}

function formatHoursMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

// Market Sessions Widget
const MarketSessionsWidget = memo(function MarketSessionsWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const sessionStatus = useMemo(() => {
    return sessions.map(session => {
      const local = getTimeInZone(now, session.timezone);
      const isOpen = local.totalMinutes >= session.openHour * 60 && local.totalMinutes < session.closeHour * 60;
      let nextChange = '';

      if (isOpen) {
        nextChange = `Closes in ${formatHoursMinutes(session.closeHour * 60 - local.totalMinutes)}`;
      } else if (local.totalMinutes < session.openHour * 60) {
        nextChange = `Opens in ${formatHoursMinutes(session.openHour * 60 - local.totalMinutes)}`;
      } else {
        nextChange = `Opens in ${formatHoursMinutes(24 * 60 - local.totalMinutes + session.openHour * 60)}`;
      }

      return { ...session, isOpen, nextChange, currentHour: local.hour };
    });
  }, [now]);

  const openCount = sessionStatus.filter(s => s.isOpen).length;

  return (
    <div 
      className="p-4 rounded-xl border col-span-2 sm:col-span-3"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Market Sessions
        </span>
        <span 
          className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto"
          style={{ background: `${accent}20`, color: accent }}
        >
          {openCount} Open
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sessionStatus.map((session) => (
          <div 
            key={session.name}
            className="flex items-center justify-between p-2 rounded-lg"
            style={{ background: te.colors.bg }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{session.flag}</span>
              <div>
                <p className="text-xs font-medium" style={{ color: te.colors.text }}>
                  {session.name}
                </p>
                <p className="text-[10px]" style={{ color: te.colors.textMuted }}>
                  {session.nextChange}
                </p>
              </div>
            </div>
            <div 
              className="w-2 h-2 rounded-full"
              style={{ background: session.isOpen ? accent : '#ef4444' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// Market Countdown Widget
const MarketCountdownWidget = memo(function MarketCountdownWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const nextSession = useMemo(() => {
    const candidates = sessions.map((session) => {
      const local = getTimeInZone(now, session.timezone);
      const openMinutes = session.openHour * 60;
      const closeMinutes = session.closeHour * 60;
      if (local.totalMinutes < openMinutes) {
        return {
          name: session.name,
          flag: session.flag,
          minutes: openMinutes - local.totalMinutes,
        };
      }
      if (local.totalMinutes >= closeMinutes) {
        return {
          name: session.name,
          flag: session.flag,
          minutes: 24 * 60 - local.totalMinutes + openMinutes,
        };
      }
      return null;
    }).filter(Boolean) as Array<{ name: string; flag: string; minutes: number }>;

    return candidates.sort((a, b) => a.minutes - b.minutes)[0] || null;
  }, [now]);

  const formatCountdown = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Next Opening
        </span>
      </div>
      {nextSession ? (
        <div className="text-center">
          <p className="text-sm" style={{ color: te.colors.textSecondary }}>
            {nextSession.flag} {nextSession.name}
          </p>
          <span 
            className="text-2xl font-bold"
            style={{ color: te.colors.text }}
          >
            {formatCountdown(nextSession.minutes)}
          </span>
        </div>
      ) : (
        <p className="text-xs text-center" style={{ color: te.colors.textMuted }}>
          All major sessions active
        </p>
      )}
    </div>
  );
});

// Trading Tasks Widget
const TradingTasksWidget = memo(function TradingTasksWidget() {
  const { themeExperience, tasks, toggleTask } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  
  const tradingTasks = tasks.filter((t: any) => 
    t.category === 'trading' || t.title.toLowerCase().includes('trad')
  ).slice(0, 3);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Trading Tasks
        </span>
      </div>

      {tradingTasks.length === 0 ? (
        <p className="text-[10px] text-center" style={{ color: te.colors.textMuted }}>
          No trading tasks
        </p>
      ) : (
        <div className="space-y-1">
          {tradingTasks.map((task: any) => (
            <div 
              key={task.id}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="w-3 h-3 rounded border shrink-0"
                style={{ 
                  borderColor: task.completed ? accent : te.colors.border,
                  background: task.completed ? accent : 'transparent'
                }}
              />
              <span 
                className={`text-[10px] truncate ${task.completed ? 'line-through' : ''}`}
                style={{ color: task.completed ? te.colors.textMuted : te.colors.text }}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Trading Timer Widget
const TradingTimerWidget = memo(function TradingTimerWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const { isRunning, remaining, isComplete, startTimer, pauseTimer, resumeTimer, resetTimer } = usePreciseTimer();
  const [customMinutes, setCustomMinutes] = useState(15);

  const formatTime = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Session Timer
        </span>
      </div>
      <span 
        className="text-xl font-mono font-bold block text-center"
        style={{ color: te.colors.text }}
      >
        {formatTime(remaining)}
      </span>
      <div className="flex items-center justify-center gap-2 mt-2">
        {!isRunning && !isComplete && (
          <button
            onClick={() => startTimer(customMinutes * 60 * 1000)}
            className="p-1.5 rounded-lg text-white"
            style={{ background: accent }}
          >
            Start
          </button>
        )}
        {isRunning && (
          <button
            onClick={pauseTimer}
            className="p-1.5 rounded-lg text-white"
            style={{ background: accent }}
          >
            <Pause size={12} />
          </button>
        )}
        {!isRunning && remaining > 0 && !isComplete && (
          <button
            onClick={resumeTimer}
            className="p-1.5 rounded-lg text-white"
            style={{ background: accent }}
          >
            Resume
          </button>
        )}
        <button
          onClick={resetTimer}
          className="p-1.5 rounded-lg border"
          style={{ borderColor: te.colors.border, color: te.colors.text }}
        >
          Reset
        </button>
      </div>
      <div className="mt-3 text-[10px] text-center" style={{ color: te.colors.textMuted }}>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCustomMinutes((prev) => Math.max(1, prev - 5))}
            className="px-2 py-1 rounded-lg border"
            style={{ borderColor: te.colors.border, color: te.colors.text }}
          >
            -5
          </button>
          <span>{customMinutes} min</span>
          <button
            onClick={() => setCustomMinutes((prev) => Math.min(120, prev + 5))}
            className="px-2 py-1 rounded-lg border"
            style={{ borderColor: te.colors.border, color: te.colors.text }}
          >
            +5
          </button>
        </div>
      </div>
    </div>
  );
});

// Session Status Widget
const SessionStatusWidget = memo(function SessionStatusWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const openSessions = useMemo(() => {
    return sessions.filter((session) => {
      const local = getTimeInZone(now, session.timezone);
      return local.totalMinutes >= session.openHour * 60 && local.totalMinutes < session.closeHour * 60;
    });
  }, [now]);

  return (
    <div
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Session Status
        </span>
      </div>
      <p className="text-2xl font-bold text-center" style={{ color: accent }}>
        {openSessions.length}/{sessions.length}
      </p>
      <p className="text-[10px] text-center" style={{ color: te.colors.textMuted }}>
        markets open
      </p>
    </div>
  );
});

// Market Close Countdown
const MarketCloseCountdownWidget = memo(function MarketCloseCountdownWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const closingSoon = useMemo(() => {
    const candidates = sessions
      .map((session) => {
        const local = getTimeInZone(now, session.timezone);
        const closeMinutes = session.closeHour * 60;
        if (local.totalMinutes >= session.openHour * 60 && local.totalMinutes < closeMinutes) {
          return {
            name: session.name,
            flag: session.flag,
            minutes: closeMinutes - local.totalMinutes,
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{ name: string; flag: string; minutes: number }>;

    return candidates.sort((a, b) => a.minutes - b.minutes)[0] || null;
  }, [now]);

  return (
    <div
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Market Close
        </span>
      </div>
      {closingSoon ? (
        <div className="text-center">
          <p className="text-sm" style={{ color: te.colors.textSecondary }}>
            {closingSoon.flag} {closingSoon.name}
          </p>
          <span className="text-xl font-bold" style={{ color: '#ef4444' }}>
            {Math.floor(closingSoon.minutes / 60)}h {closingSoon.minutes % 60}m
          </span>
        </div>
      ) : (
        <p className="text-[10px] text-center" style={{ color: te.colors.textMuted }}>
          No active session
        </p>
      )}
    </div>
  );
});

export default function TraderWidgets() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
      <MarketSessionsWidget />
      <SessionStatusWidget />
      <MarketCountdownWidget />
      <MarketCloseCountdownWidget />
      <TradingTasksWidget />
      <TradingTimerWidget />
    </div>
  );
}
