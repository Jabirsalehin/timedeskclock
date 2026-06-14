import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { themeExperiences, type ThemeExperienceId } from '../../utils/themeExperience';
import { usePreciseTime } from '../../hooks/usePreciseTime';
import { formatDate } from '../../hooks/useTime';

export const DateDisplay = memo(function DateDisplay() {
  const { dateFormat, themeExperience } = useStore();
  const now = usePreciseTime();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];

  const dateStr = useMemo(() => formatDate(now, dateFormat), [
    now.getDate(),
    now.getMonth(),
    now.getFullYear(),
    dateFormat,
  ]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="text-xs sm:text-sm md:text-base font-light tracking-wide mt-4 sm:mt-6"
      style={{ color: te.colors.textSecondary }}
    >
      {dateStr}
    </motion.p>
  );
});
