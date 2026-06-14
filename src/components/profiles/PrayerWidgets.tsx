import { memo, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useProfileStore, profileConfigs } from '../../store/profileStore';
import { themeExperiences, type ThemeExperienceId } from '../../utils/themeExperience';
import { usePreciseTime } from '../../hooks/usePreciseTime';
import { Moon, Clock, Calendar, Bell } from 'lucide-react';

const accent = profileConfigs.prayer.accentColor;

function formatCountdown(mins: number) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function getNextPrayer(prayerTimes: Record<string, string>, currentMinutes: number) {
  const entries = Object.entries(prayerTimes) as [keyof typeof prayerTimes, string][];
  for (const [key, time] of entries) {
    const [h, m] = time.split(':').map(Number);
    const prayerMinutes = h * 60 + m;
    if (prayerMinutes > currentMinutes) {
      return { key, time, minutesLeft: prayerMinutes - currentMinutes };
    }
  }

  const [h, m] = prayerTimes.fajr.split(':').map(Number);
  const fajrMinutes = h * 60 + m;
  return {
    key: 'fajr' as keyof typeof prayerTimes,
    time: prayerTimes.fajr,
    minutesLeft: 24 * 60 - currentMinutes + fajrMinutes,
  };
}

function formatPrayerTime(time: string) {
  return time;
}

// Prayer name display
const prayerNames: Record<string, { name: string; arabic: string; emoji: string }> = {
  fajr: { name: 'Fajr', arabic: 'الفجر', emoji: '🌅' },
  dhuhr: { name: 'Dhuhr', arabic: 'الظهر', emoji: '☀️' },
  asr: { name: 'Asr', arabic: 'العصر', emoji: '🌤️' },
  maghrib: { name: 'Maghrib', arabic: 'المغرب', emoji: '🌅' },
  isha: { name: 'Isha', arabic: 'العشاء', emoji: '🌙' },
};

// Next Prayer Widget
const NextPrayerWidget = memo(function NextPrayerWidget() {
  const { themeExperience } = useStore();
  const { prayerTimes } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const nextPrayer = useMemo(() => {
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const prayer = getNextPrayer(prayerTimes, currentTime);
    return {
      key: prayer.key,
      ...prayerNames[prayer.key],
      time: formatPrayerTime(prayer.time),
      minutesLeft: prayer.minutesLeft,
    };
  }, [prayerTimes, now.getHours(), now.getMinutes()]);

  const formatCountdown = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div 
      className="p-4 rounded-xl border col-span-2"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Moon size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Next Prayer
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{nextPrayer.emoji}</span>
            <div>
              <p className="text-lg font-semibold" style={{ color: te.colors.text }}>
                {nextPrayer.name}
              </p>
              <p className="text-xs" style={{ color: accent }}>
                {nextPrayer.arabic}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span 
            className="text-2xl font-bold font-mono"
            style={{ color: te.colors.text }}
          >
            {nextPrayer.time}
          </span>
          <p className="text-xs" style={{ color: te.colors.textMuted }}>
            in {formatCountdown(nextPrayer.minutesLeft)}
          </p>
        </div>
      </div>
    </div>
  );
});

// Prayer Times List Widget
const PrayerTimesWidget = memo(function PrayerTimesWidget() {
  const { themeExperience } = useStore();
  const { prayerTimes } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const currentTime = now.getHours() * 60 + now.getMinutes();

  const isPassed = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m < currentTime;
  };

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Today's Prayers
        </span>
      </div>

      <div className="space-y-1.5">
        {Object.entries(prayerTimes).map(([key, time]) => {
          const passed = isPassed(time);
          const prayer = prayerNames[key];
          return (
            <div 
              key={key}
              className="flex items-center justify-between"
            >
              <span 
                className="text-xs"
                style={{ color: passed ? te.colors.textMuted : te.colors.text }}
              >
                {prayer.emoji} {prayer.name}
              </span>
              <span 
                className="text-xs font-mono"
                style={{ color: passed ? te.colors.textMuted : accent }}
              >
                {time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Hijri Date Widget
const HijriDateWidget = memo(function HijriDateWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  // Simplified Hijri calculation (would use proper library in production)
  const hijriDate = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const parts = formatter.formatToParts(now);
      const plural = parts.reduce(
        (acc, part) => ({ ...acc, [part.type]: part.value }),
        {} as Record<string, string>
      );
      return {
        day: Number(plural.day) || now.getDate(),
        month: plural.month || 'Ramadan',
        year: Number(plural.year) || now.getFullYear(),
      };
    } catch {
      // Fallback approximation if Intl Islamic calendar is not available
      const gregorian = now;
      const jd = Math.floor((gregorian.getTime() / 86400000) + 2440587.5);
      const l = jd - 1948440 + 10632;
      const n = Math.floor((l - 1) / 10631);
      const l2 = l - 10631 * n + 354;
      const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + 
                Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
      const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - 
                 Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
      const month = Math.floor((24 * l3) / 709);
      const day = l3 - Math.floor((709 * month) / 24);
      const year = 30 * n + j - 30;
      const months = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II',
                      'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'];
      return { day, month: months[month - 1], year };
    }
  }, [now.toDateString()]);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Hijri Date
        </span>
      </div>
      <div className="text-center">
        <span 
          className="text-2xl font-bold"
          style={{ color: te.colors.text }}
        >
          {hijriDate.day}
        </span>
        <p className="text-sm" style={{ color: accent }}>
          {hijriDate.month}
        </p>
        <p className="text-xs" style={{ color: te.colors.textMuted }}>
          {hijriDate.year} AH
        </p>
      </div>
    </div>
  );
});

// Prayer Reminders Widget
const PrayerRemindersWidget = memo(function PrayerRemindersWidget() {
  const { themeExperience, reminders } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  
  const prayerReminders = reminders.filter((r: any) => 
    r.category === 'prayer' || r.title.toLowerCase().includes('pray')
  ).slice(0, 3);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Bell size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Reminders
        </span>
      </div>

      {prayerReminders.length === 0 ? (
        <p className="text-[10px] text-center" style={{ color: te.colors.textMuted }}>
          No prayer reminders
        </p>
      ) : (
        <div className="space-y-1.5">
          {prayerReminders.map((rem: any) => (
            <div 
              key={rem.id}
              className="text-[10px] truncate"
              style={{ color: te.colors.text }}
            >
              🕌 {rem.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Prayer Countdown Widget
const PrayerCountdownWidget = memo(function PrayerCountdownWidget() {
  const { themeExperience } = useStore();
  const { prayerTimes } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const countdown = useMemo(() => {
    const current = now.getHours() * 60 + now.getMinutes();
    for (const [key, time] of Object.entries(prayerTimes)) {
      const [h, m] = time.split(':').map(Number);
      const mins = h * 60 + m;
      if (mins > current) {
        return { name: prayerNames[key].name, minutes: mins - current };
      }
    }
    const [h, m] = prayerTimes.fajr.split(':').map(Number);
    return { name: 'Fajr', minutes: 24 * 60 - current + h * 60 + m };
  }, [prayerTimes, now.getHours(), now.getMinutes()]);

  return (
    <div
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Prayer Countdown
        </span>
      </div>
      <p className="text-center text-sm" style={{ color: te.colors.textSecondary }}>
        {countdown.name}
      </p>
      <p className="text-2xl font-mono font-bold text-center" style={{ color: accent }}>
        {Math.floor(countdown.minutes / 60)}:{(countdown.minutes % 60).toString().padStart(2, '0')}
      </p>
    </div>
  );
});

// Ramadan Countdown Widget
const RamadanCountdownWidget = memo(function RamadanCountdownWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const daysToRamadan = useMemo(() => {
    const ramadanDates: Record<number, string> = {
      2025: '2025-03-03',
      2026: '2026-02-18',
      2027: '2027-02-07',
      2028: '2028-01-27',
      2029: '2029-01-17',
      2030: '2030-01-07',
    };
    const year = now.getFullYear();
    const currentYearDate = new Date(ramadanDates[year] || '2026-02-18');
    const target = currentYearDate.getTime() > now.getTime()
      ? currentYearDate
      : new Date(ramadanDates[year + 1] || '2027-02-07');
    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [now.toDateString()]);

  return (
    <div
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Moon size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Ramadan
        </span>
      </div>
      <p className="text-3xl font-bold text-center" style={{ color: te.colors.text }}>
        {daysToRamadan}
      </p>
      <p className="text-[10px] text-center" style={{ color: te.colors.textMuted }}>
        days until Ramadan
      </p>
    </div>
  );
});

export default function PrayerWidgets() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
      <NextPrayerWidget />
      <PrayerCountdownWidget />
      <HijriDateWidget />
      <RamadanCountdownWidget />
      <PrayerRemindersWidget />
    </div>
  );
}
