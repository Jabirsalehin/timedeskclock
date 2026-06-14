/**
 * Unified clock renderer — same size, typography, and animation everywhere.
 * The clock is TimeDesk's identity and never changes by profile.
 */

import { memo } from 'react';
import { useStore } from '../../store/useStore';
import { themeExperiences, type ThemeExperienceId } from '../../utils/themeExperience';
import { usePreciseTime } from '../../hooks/usePreciseTime';
import { formatTime, getAmPm } from '../../hooks/useTime';
import OptimizedFlipClock from '../OptimizedFlipClock';

export type ClockDisplaySize = 'lg' | 'xl';

interface ClockDisplayProps {
  accentColor: string;
  /** lg = normal view, xl = fullscreen — consistent relative sizing */
  size?: ClockDisplaySize;
}

export const ClockDisplay = memo(function ClockDisplay({
  accentColor,
  size = 'lg',
}: ClockDisplayProps) {
  const { clockMode, showSeconds, timeFormat, themeExperience } = useStore();
  const now = usePreciseTime();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];

  if (clockMode === 'flip') {
    return (
      <OptimizedFlipClock
        size={size}
        showSeconds={showSeconds}
        themeId={themeExperience as ThemeExperienceId}
      />
    );
  }

  const timeStr = formatTime(now, timeFormat, clockMode === 'digital' && showSeconds);

  if (clockMode === 'minimal') {
    const minimalTime = formatTime(now, timeFormat, false);
    return (
      <div className="flex flex-col items-center">
        <span
          className="font-mono font-extralight tracking-tighter leading-none text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem]"
          style={{
            fontFamily: te.typography.clockFont,
            fontWeight: '100',
            letterSpacing: '-0.05em',
            color: te.colors.text,
          }}
        >
          {minimalTime}
        </span>
        {timeFormat === '12h' && (
          <span
            className="text-lg sm:text-xl font-mono font-light mt-2"
            style={{ color: accentColor }}
          >
            {getAmPm(now)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2 sm:gap-4">
      <span
        className="font-mono font-bold tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
        style={{
          fontFamily: te.typography.clockFont,
          fontWeight: te.typography.clockWeight,
          letterSpacing: te.typography.clockLetterSpacing,
          color: te.colors.text,
        }}
      >
        {timeStr}
      </span>
      {timeFormat === '12h' && (
        <span
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono font-medium"
          style={{ color: accentColor }}
        >
          {getAmPm(now)}
        </span>
      )}
    </div>
  );
});
