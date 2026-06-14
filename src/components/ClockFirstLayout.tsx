import { ReactNode, memo, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useProfileStore, profileConfigs } from '../store/profileStore';
import { themeExperiences, type ThemeExperienceId } from '../utils/themeExperience';
import { usePreciseTime } from '../hooks/usePreciseTime';
import { formatTime, getAmPm, formatDate } from '../hooks/useTime';
import OptimizedFlipClock from './OptimizedFlipClock';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ClockFirstLayout - The core layout component that ensures clock consistency
 * 
 * RULES:
 * - Clock ALWAYS remains the primary visual element
 * - Clock position, size, and animation NEVER change between profiles
 * - Only supporting widgets change based on profile
 * - The clock IS TimeDesk's identity
 */

// Memoized Digital Clock - identical across all profiles
const DigitalClock = memo(function DigitalClock({ accent }: { accent: string }) {
  const { timeFormat, showSeconds, themeExperience } = useStore();
  const now = usePreciseTime();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];

  const timeStr = formatTime(now, timeFormat, showSeconds);

  return (
    <div className="flex items-baseline gap-2 sm:gap-4">
      <span
        className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight transition-colors duration-300"
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
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono font-medium transition-colors duration-300"
          style={{ color: accent }}
        >
          {getAmPm(now)}
        </span>
      )}
    </div>
  );
});

// Memoized Minimal Clock
const MinimalClock = memo(function MinimalClock({ accent }: { accent: string }) {
  const { timeFormat, themeExperience } = useStore();
  const now = usePreciseTime();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];

  const timeStr = formatTime(now, timeFormat, false);

  return (
    <div className="flex flex-col items-center">
      <span
        className="font-mono text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-extralight tracking-tighter leading-none transition-colors duration-300"
        style={{
          fontFamily: te.typography.clockFont,
          fontWeight: '100',
          letterSpacing: '-0.05em',
          color: te.colors.text,
        }}
      >
        {timeStr}
      </span>
      {timeFormat === '12h' && (
        <span
          className="text-lg sm:text-xl font-mono font-light mt-2 transition-colors duration-300"
          style={{ color: accent }}
        >
          {getAmPm(now)}
        </span>
      )}
    </div>
  );
});

// Date Display - consistent across profiles
const DateDisplay = memo(function DateDisplay() {
  const { dateFormat, themeExperience } = useStore();
  const now = usePreciseTime();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];

  const dateStr = useMemo(() => {
    return formatDate(now, dateFormat);
  }, [now.getDate(), now.getMonth(), now.getFullYear(), dateFormat]);

  return (
    <p
      className="text-xs sm:text-sm md:text-base font-light tracking-wide mt-4 sm:mt-6 transition-colors duration-300"
      style={{ color: te.colors.textSecondary }}
    >
      {dateStr}
    </p>
  );
});

// Profile indicator badge
const ProfileBadge = memo(function ProfileBadge() {
  const { activeProfile } = useProfileStore();
  const profile = profileConfigs[activeProfile];

  if (activeProfile === 'minimal') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-300"
      style={{
        background: profile.accentColorLight,
        borderColor: `${profile.accentColor}40`,
      }}
    >
      <span className="text-sm">{profile.emoji}</span>
      <span 
        className="text-xs font-medium"
        style={{ color: profile.accentColor }}
      >
        {profile.name}
      </span>
    </motion.div>
  );
});

interface ClockFirstLayoutProps {
  children?: ReactNode; // Profile-specific widgets
  showWidgetsPanel?: boolean;
}

export default function ClockFirstLayout({ children, showWidgetsPanel = true }: ClockFirstLayoutProps) {
  const { clockMode, setFullscreen, showSeconds, themeExperience } = useStore();
  const { activeProfile, widgetsPanelExpanded, toggleWidgetsPanel } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const profile = profileConfigs[activeProfile];

  // Effect classes from theme
  const effectClasses = useMemo(() => {
    return [
      te.effects.noise && 'theme-noise',
      te.effects.scanlines && 'theme-scanlines',
      te.effects.vignette && 'theme-vignette',
    ].filter(Boolean).join(' ');
  }, [te.effects]);

  return (
    <div
      className={`h-full flex flex-col relative overflow-hidden ${effectClasses}`}
      style={{ background: te.colors.bgGradient || 'transparent' }}
    >
      {/* Profile Badge - top left */}
      <ProfileBadge />

      {/* Fullscreen button - top right, consistent position */}
      <button
        onClick={() => setFullscreen(true)}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-lg border transition-all z-10 hover:scale-105"
        style={{
          background: te.colors.surface,
          borderColor: te.colors.border,
          color: te.colors.textSecondary,
        }}
      >
        <Maximize2 size={16} />
      </button>

      {/* CLOCK ZONE - Primary, NEVER changes layout */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-[50vh] sm:min-h-[60vh]">
        {/* Clock - THE identity of TimeDesk */}
        <motion.div
          key={clockMode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center"
        >
          {clockMode === 'flip' && (
            <OptimizedFlipClock
              size="lg"
              showSeconds={showSeconds}
              themeId={themeExperience as ThemeExperienceId}
            />
          )}
          {clockMode === 'digital' && <DigitalClock accent={profile.accentColor} />}
          {clockMode === 'minimal' && <MinimalClock accent={profile.accentColor} />}
          
          {/* Date - always below clock */}
          <DateDisplay />
        </motion.div>
      </div>

      {/* WIDGETS ZONE - Secondary, profile-specific */}
      {showWidgetsPanel && children && (
        <div className="shrink-0">
          {/* Collapse toggle */}
          <button
            onClick={toggleWidgetsPanel}
            className="w-full flex items-center justify-center py-2 transition-colors"
            style={{ color: te.colors.textMuted }}
          >
            {widgetsPanelExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </button>

          {/* Widgets panel */}
          <AnimatePresence>
            {widgetsPanelExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t"
                style={{ borderColor: te.colors.border }}
              >
                <div className="p-4 sm:p-6 max-h-[35vh] overflow-y-auto">
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Ambient glow - uses profile accent color */}
      {te.effects.ambientGlow && (
        <div
          className="fixed inset-0 pointer-events-none opacity-15 z-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${profile.accentColor}30 0%, transparent 60%)`,
          }}
        />
      )}
    </div>
  );
}
