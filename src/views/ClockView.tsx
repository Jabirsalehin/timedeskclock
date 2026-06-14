/**
 * ClockView - The primary view of TimeDesk
 *
 * CLOCK-FIRST PHILOSOPHY:
 * - The clock is TimeDesk's identity — never changes between profiles
 * - Only supporting widgets change based on profile
 * - Profile identity and widget visibility are independent systems
 *
 * FULLSCREEN MODES:
 * - Clock Only: maximum focus (clock + date)
 * - Clock + Tools: productivity workspace with profile widgets
 */

import { useStore } from '../store/useStore';
import { useProfileStore, profileConfigs, type ProfileId } from '../store/profileStore';
import { themeExperiences, type ThemeExperienceId } from '../utils/themeExperience';
import { useAutoHideTools } from '../hooks/useAutoHideTools';
import { ClockDisplay } from '../components/clock/ClockDisplay';
import { DateDisplay } from '../components/clock/DateDisplay';
import { FullscreenControls } from '../components/fullscreen/FullscreenControls';
import { ProfileWidgetsPanel } from '../components/profiles/ProfileWidgetsPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { memo, useMemo } from 'react';
import { Maximize2, ChevronDown, ChevronUp, Settings } from 'lucide-react';

const ProfileBadge = memo(function ProfileBadge() {
  const { activeProfile, setActiveProfile } = useProfileStore();
  const { themeExperience, setCurrentView } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const profile = profileConfigs[activeProfile];

  const profiles: ProfileId[] = ['minimal', 'student', 'developer', 'trader', 'prayer'];
  const currentIndex = profiles.indexOf(activeProfile);

  const cycleProfile = () => {
    const nextIndex = (currentIndex + 1) % profiles.length;
    setActiveProfile(profiles[nextIndex]);
  };

  return (
    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 z-10">
      <button
        onClick={cycleProfile}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105"
        style={{
          background: profile.accentColorLight,
          borderColor: `${profile.accentColor}40`,
        }}
      >
        <span className="text-sm">{profile.emoji}</span>
        <span className="text-xs font-medium" style={{ color: profile.accentColor }}>
          {profile.name}
        </span>
      </button>
      <button
        onClick={() => setCurrentView('settings')}
        className="p-1.5 rounded-full transition-colors"
        style={{ color: te.colors.textMuted }}
      >
        <Settings size={14} />
      </button>
    </div>
  );
});

function AmbientGlow({ accentColor, opacity = 0.15 }: { accentColor: string; opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity,
        background: `radial-gradient(ellipse at 50% 30%, ${accentColor}30 0%, transparent 60%)`,
      }}
    />
  );
}

export default function ClockView() {
  const { clockMode, themeExperience, isFullscreen, enterFullscreen, fullscreenMode } = useStore();
  const {
    activeProfile,
    widgetsPanelExpanded,
    toggleWidgetsPanel,
    displaySettings,
  } = useProfileStore();

  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const profile = profileConfigs[activeProfile];

  const effectClasses = useMemo(
    () =>
      [te.effects.noise && 'theme-noise', te.effects.scanlines && 'theme-scanlines', te.effects.vignette && 'theme-vignette']
        .filter(Boolean)
        .join(' '),
    [te.effects]
  );

  const normalAutoHideActive =
    displaySettings.widgetsEnabled && displaySettings.widgetVisibility === 'auto-hide';
  const { toolsVisible: normalAutoVisible } = useAutoHideTools(normalAutoHideActive);

  const fullscreenAutoHideActive =
    isFullscreen &&
    fullscreenMode === 'clock-tools' &&
    displaySettings.widgetsEnabled &&
    displaySettings.fullscreenToolsEnabled &&
    displaySettings.fullscreenToolVisibility === 'auto-hide';
  const { toolsVisible: fullscreenAutoVisible } = useAutoHideTools(fullscreenAutoHideActive);

  const showNormalWidgets =
    displaySettings.widgetsEnabled && displaySettings.widgetVisibility !== 'hidden';

  const normalPanelVisible =
    showNormalWidgets &&
    (displaySettings.widgetVisibility === 'always'
      ? widgetsPanelExpanded
      : normalAutoVisible);

  const showFullscreenWidgets =
    fullscreenMode === 'clock-tools' &&
    displaySettings.widgetsEnabled &&
    displaySettings.fullscreenToolsEnabled &&
    displaySettings.fullscreenToolVisibility !== 'hide' &&
    (displaySettings.fullscreenToolVisibility === 'show' || fullscreenAutoVisible);

  // ── FULLSCREEN ──────────────────────────────────────────────
  if (isFullscreen) {
    return (
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${effectClasses}`}
        style={{ background: te.colors.bgGradient || te.colors.bg }}
      >
        <FullscreenControls />

        {/* Clock zone — always dominant, same xl size in all modes */}
        <div className="flex flex-col items-center z-10">
          <ClockDisplay accentColor={profile.accentColor} size="xl" />
          <DateDisplay />
        </div>

        {/* Profile tools — secondary, below clock */}
        <AnimatePresence>
          {showFullscreenWidgets && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-8 pt-4 max-h-[38vh] overflow-y-auto"
              style={{
                background: `linear-gradient(to top, ${te.colors.bg}ee 60%, transparent)`,
              }}
            >
              <ProfileWidgetsPanel compact />
            </motion.div>
          )}
        </AnimatePresence>

        {te.effects.ambientGlow && <AmbientGlow accentColor={profile.accentColor} opacity={0.2} />}
      </div>
    );
  }

  // ── NORMAL VIEW ─────────────────────────────────────────────
  return (
    <div
      className={`h-full flex flex-col relative overflow-hidden ${effectClasses}`}
      style={{ background: te.colors.bgGradient || 'transparent' }}
    >
      <ProfileBadge />

      <button
        onClick={() => enterFullscreen()}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-lg border transition-all z-10 hover:scale-105"
        style={{
          background: te.colors.surface,
          borderColor: te.colors.border,
          color: te.colors.textSecondary,
        }}
        aria-label="Enter fullscreen"
      >
        <Maximize2 size={16} />
      </button>

      {/* Clock zone — primary, never changes layout */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-[50vh] sm:min-h-[55vh]">
        <motion.div
          key={clockMode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center"
        >
          <ClockDisplay accentColor={profile.accentColor} size="lg" />
          <DateDisplay />
        </motion.div>
      </div>

      {/* Widgets zone — secondary, profile-specific, visibility independent */}
      {showNormalWidgets && (
        <div className="shrink-0">
          {displaySettings.widgetVisibility === 'always' && (
            <button
              onClick={toggleWidgetsPanel}
              className="w-full flex items-center justify-center gap-2 py-2 transition-colors"
              style={{ color: te.colors.textMuted }}
            >
              <span className="text-[10px] uppercase tracking-widest">{profile.name} Tools</span>
              {widgetsPanelExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          )}

          <AnimatePresence>
            {normalPanelVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t"
                style={{ borderColor: te.colors.border }}
              >
                <div className="p-4 sm:p-6 max-h-[35vh] overflow-y-auto">
                  <ProfileWidgetsPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {displaySettings.widgetVisibility === 'auto-hide' && !normalPanelVisible && (
            <p
              className="text-center text-[10px] py-1 opacity-40"
              style={{ color: te.colors.textMuted }}
            >
              Move cursor to bottom to reveal tools
            </p>
          )}
        </div>
      )}

      {te.effects.ambientGlow && <AmbientGlow accentColor={profile.accentColor} />}
    </div>
  );
}
