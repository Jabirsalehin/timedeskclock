import React from 'react';
import { useStore } from '../store/useStore';
import { useProfileStore, profileConfigs } from '../store/profileStore';
import { themeExperiences, type ThemeExperienceId } from '../utils/themeExperience';
import { ClockDisplay } from './clock/ClockDisplay';
import { DateDisplay } from './clock/DateDisplay';
import { ProfileWidgetsPanel } from './profiles/ProfileWidgetsPanel';

export default function DesktopOverlay() {
  const {
    overlayEnabled,
    overlayMode,
    overlayTransparency,
    overlayClickThrough,
    overlayPosition,
    overlayCustomPosition,
    overlayLayout,
    themeExperience,
  } = useStore() as any;

  const { activeProfile } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];

  const isOverlayWindow = typeof window !== 'undefined' && window.location.search.includes('overlay=1');
  if (!overlayEnabled && !isOverlayWindow) return null;

  // Position mapping
  const justifyMap: Record<string, string> = {
    center: 'center',
    top: 'flex-start',
    bottom: 'flex-end',
    left: 'center',
    right: 'center',
    custom: 'flex-start',
  };

  const alignMap: Record<string, string> = {
    center: 'center',
    top: 'center',
    bottom: 'center',
    left: 'flex-start',
    right: 'flex-end',
    custom: 'flex-start',
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    justifyContent: justifyMap[overlayPosition],
    alignItems: alignMap[overlayPosition],
    pointerEvents: overlayClickThrough ? 'none' : 'auto',
    // Transparent background — wallpaper should remain visible
    background: 'transparent',
    padding: 20,
  };

  const widgetAreaStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    opacity: overlayTransparency / 100,
    // allow click-through for children when enabled
    pointerEvents: overlayClickThrough ? 'none' : 'auto',
    backdropFilter: 'none',
  };

  // Custom coordinates for custom position
  const customStyle: React.CSSProperties = {};
  if (overlayPosition === 'custom') {
    customStyle.position = 'fixed';
    customStyle.left = overlayCustomPosition.x;
    customStyle.top = overlayCustomPosition.y;
  }

  return (
    <div style={containerStyle} aria-hidden={overlayClickThrough}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        {/* Invisible layer to preserve click-through regions when centered */}
      </div>

      <div style={{ ...widgetAreaStyle, ...customStyle }} className="desktop-overlay-panel">
        <div
          style={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            width: 32,
            height: 32,
            WebkitAppRegion: 'drag',
            zIndex: 99999,
            opacity: 0.01,
            pointerEvents: overlayClickThrough ? 'none' : 'auto',
          }}
          aria-hidden="true"
        />
        {/* Clock area — must remain visually identical to main app */}
        <div className="overlay-clock" style={{ pointerEvents: overlayClickThrough ? 'none' : 'auto' }}>
          <ClockDisplay accentColor={profileConfigs[activeProfile]?.accentColor || te.colors.accent} size={overlayLayout === 'compact' ? 'lg' : 'xl'} />
          <DateDisplay />
        </div>

        {/* Tools — only when overlay mode is clock-tools */}
        {overlayMode === 'overlay-clock-tools' && (
          <div className="overlay-tools" style={{ width: 'min(980px, 90vw)', pointerEvents: overlayClickThrough ? 'none' : 'auto' }}>
            <ProfileWidgetsPanel compact={overlayLayout === 'compact'} />
          </div>
        )}
      </div>
    </div>
  );
}

