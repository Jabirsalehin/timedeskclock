import { memo, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { themeExperiences, type ThemeExperienceId } from '../../utils/themeExperience';
import { usePreciseTime } from '../../hooks/usePreciseTime';
import { motion } from 'framer-motion';

// Day Progress Widget
const DayProgress = memo(function DayProgress() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const progress = useMemo(() => {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  }, [now.getHours(), now.getMinutes()]);

  const remaining = useMemo(() => {
    const totalMinutes = 24 * 60;
    const elapsed = now.getHours() * 60 + now.getMinutes();
    const left = totalMinutes - elapsed;
    const hours = Math.floor(left / 60);
    const mins = left % 60;
    return `${hours}h ${mins}m remaining`;
  }, [now.getHours(), now.getMinutes()]);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: te.colors.textSecondary }}>
          Day Progress
        </span>
        <span className="text-xs font-mono" style={{ color: te.colors.textMuted }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div 
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: te.colors.surface }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'rgba(255,255,255,0.8)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-[10px] mt-1" style={{ color: te.colors.textMuted }}>
        {remaining}
      </p>
    </div>
  );
});

// Week Progress Widget
const WeekProgress = memo(function WeekProgress() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const { progress, dayName, daysLeft } = useMemo(() => {
    const day = now.getDay();
    const adjustedDay = day === 0 ? 7 : day; // Sunday = 7
    const progress = (adjustedDay / 7) * 100;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      progress,
      dayName: days[day],
      daysLeft: 7 - adjustedDay,
    };
  }, [now.getDay()]);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: te.colors.textSecondary }}>
          Week Progress
        </span>
        <span className="text-xs font-mono" style={{ color: te.colors.textMuted }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div 
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: te.colors.surface }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'rgba(255,255,255,0.6)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-[10px] mt-1" style={{ color: te.colors.textMuted }}>
        {dayName} • {daysLeft} day{daysLeft !== 1 ? 's' : ''} until weekend
      </p>
    </div>
  );
});

export default function MinimalWidgets() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 max-w-lg mx-auto">
      <DayProgress />
      <WeekProgress />
    </div>
  );
}
