import { memo, useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useProfileStore, profileConfigs } from '../../store/profileStore';
import { themeExperiences, type ThemeExperienceId } from '../../utils/themeExperience';
import { usePreciseTime, usePreciseStopwatch } from '../../hooks/usePreciseTime';
// Developer Profile Widgets
import { Globe2, Code, Target, Timer, Play, Pause } from 'lucide-react';

const accent = profileConfigs.developer.accentColor;

// UTC Time Widget
const UTCTimeWidget = memo(function UTCTimeWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const utcTime = useMemo(() => {
    return now.toUTCString().split(' ')[4];
  }, [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()]);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Globe2 size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          UTC Time
        </span>
      </div>
      <span 
        className="text-2xl font-mono font-bold block"
        style={{ color: te.colors.text }}
      >
        {utcTime}
      </span>
      <p className="text-[10px]" style={{ color: te.colors.textMuted }}>
        Coordinated Universal Time
      </p>
    </div>
  );
});

// Unix Timestamp Widget
const UnixTimestampWidget = memo(function UnixTimestampWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();
  const [copied, setCopied] = useState(false);

  const timestamp = Math.floor(now.getTime() / 1000);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(timestamp.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div 
      className="p-4 rounded-xl border cursor-pointer hover:opacity-90 transition-opacity"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
      onClick={copyToClipboard}
    >
      <div className="flex items-center gap-2 mb-2">
        <Code size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Unix Timestamp
        </span>
      </div>
      <span 
        className="text-lg font-mono font-bold block"
        style={{ color: te.colors.text }}
      >
        {timestamp}
      </span>
      <p className="text-[10px]" style={{ color: copied ? accent : te.colors.textMuted }}>
        {copied ? '✓ Copied!' : 'Click to copy'}
      </p>
    </div>
  );
});

// World Clocks Widget (Developer focus cities)
const WorldClocksWidget = memo(function WorldClocksWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const cities = [
    { name: 'SF', tz: 'America/Los_Angeles', flag: '🇺🇸' },
    { name: 'NYC', tz: 'America/New_York', flag: '🇺🇸' },
    { name: 'LON', tz: 'Europe/London', flag: '🇬🇧' },
    { name: 'TKY', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  ];

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Globe2 size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          World Clocks
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cities.map((city) => {
          const time = new Date(now.toLocaleString('en-US', { timeZone: city.tz }));
          return (
            <div key={city.name} className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: te.colors.textMuted }}>
                {city.flag} {city.name}
              </span>
              <span className="text-xs font-mono" style={{ color: te.colors.text }}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Sprint Countdown Widget
const SprintCountdownWidget = memo(function SprintCountdownWidget() {
  const { themeExperience } = useStore();
  const { sprintEndDate, setSprintEndDate } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const daysLeft = useMemo(() => {
    if (!sprintEndDate) return null;
    const end = new Date(sprintEndDate);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [sprintEndDate, now.toDateString()]);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Target size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Sprint
        </span>
      </div>
      {daysLeft !== null && daysLeft > 0 ? (
        <div className="text-center">
          <span 
            className="text-2xl font-bold"
            style={{ color: daysLeft <= 2 ? '#ef4444' : te.colors.text }}
          >
            {daysLeft}
          </span>
          <p className="text-[10px]" style={{ color: te.colors.textMuted }}>
            days left
          </p>
        </div>
      ) : (
        <input
          type="date"
          onChange={(e) => setSprintEndDate(e.target.value)}
          className="w-full text-[10px] p-1.5 rounded border"
          style={{ 
            background: te.colors.bg, 
            borderColor: te.colors.border,
            color: te.colors.text 
          }}
        />
      )}
    </div>
  );
});

// Current Task Widget
const CurrentTaskWidget = memo(function CurrentTaskWidget() {
  const { themeExperience } = useStore();
  const { currentTask, setCurrentTask } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];

  return (
    <div 
      className="p-4 rounded-xl border col-span-2"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Code size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Current Task
        </span>
      </div>
      <input
        type="text"
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        placeholder="What are you working on?"
        className="w-full text-sm p-2 rounded-lg border bg-transparent"
        style={{ 
          borderColor: te.colors.border,
          color: te.colors.text 
        }}
      />
    </div>
  );
});

// Coding Session Widget
const CodingSessionWidget = memo(function CodingSessionWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const { isRunning, elapsed, start, pause, reset } = usePreciseStopwatch();

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Timer size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Coding Session
        </span>
      </div>
      <span 
        className="text-xl font-mono font-bold block text-center"
        style={{ color: te.colors.text }}
      >
        {formatTime(elapsed)}
      </span>
      <div className="flex justify-center gap-2 mt-2">
        <button 
          onClick={isRunning ? pause : start}
          className="p-2 rounded-lg text-white"
          style={{ background: accent }}
        >
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-lg border text-sm"
          style={{ borderColor: te.colors.border, color: te.colors.text }}
        >
          Reset
        </button>
      </div>
    </div>
  );
});

export default function DeveloperWidgets() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
      <UTCTimeWidget />
      <UnixTimestampWidget />
      <WorldClocksWidget />
      <SprintCountdownWidget />
      <CurrentTaskWidget />
      <CodingSessionWidget />
    </div>
  );
}
