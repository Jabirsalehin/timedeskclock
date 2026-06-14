/**
 * Mobile & lock screen widget registry.
 * Native Android/iOS widgets would consume this config via a bridge layer.
 * Web app uses floating overlays as lightweight equivalents.
 */

export type MobileWidgetId =
  | 'clock'
  | 'worldclock'
  | 'prayer'
  | 'task'
  | 'reminder'
  | 'countdown'
  | 'pomodoro'
  | 'stopwatch'
  | 'timer';

export interface MobileWidgetDefinition {
  id: MobileWidgetId;
  name: string;
  emoji: string;
  /** Supported surfaces */
  homeScreen: boolean;
  lockScreen: boolean;
  /** Minimum refresh interval in seconds — battery-conscious */
  refreshIntervalSec: number;
  /** Maps to floating widget type for web/desktop gadget experience */
  floatingType?: string;
}

export const mobileWidgetRegistry: MobileWidgetDefinition[] = [
  { id: 'clock', name: 'Clock', emoji: '🕐', homeScreen: true, lockScreen: true, refreshIntervalSec: 60, floatingType: 'clock' },
  { id: 'worldclock', name: 'World Clock', emoji: '🌍', homeScreen: true, lockScreen: false, refreshIntervalSec: 60 },
  { id: 'prayer', name: 'Prayer', emoji: '🕌', homeScreen: true, lockScreen: true, refreshIntervalSec: 300, floatingType: 'prayer' },
  { id: 'task', name: 'Tasks', emoji: '✅', homeScreen: true, lockScreen: false, refreshIntervalSec: 120, floatingType: 'task' },
  { id: 'reminder', name: 'Reminders', emoji: '🔔', homeScreen: true, lockScreen: true, refreshIntervalSec: 120, floatingType: 'reminder' },
  { id: 'countdown', name: 'Countdown', emoji: '⏳', homeScreen: true, lockScreen: false, refreshIntervalSec: 3600, floatingType: 'countdown' },
  { id: 'pomodoro', name: 'Pomodoro', emoji: '🍅', homeScreen: true, lockScreen: false, refreshIntervalSec: 1, floatingType: 'pomodoro' },
  { id: 'stopwatch', name: 'Stopwatch', emoji: '⏱️', homeScreen: true, lockScreen: false, refreshIntervalSec: 1, floatingType: 'stopwatch' },
  { id: 'timer', name: 'Timer', emoji: '⏲️', homeScreen: true, lockScreen: true, refreshIntervalSec: 1, floatingType: 'timer' },
];

/** Widgets suitable for lock screen (minimal, glanceable) */
export const lockScreenWidgets = mobileWidgetRegistry.filter((w) => w.lockScreen);

/** Widgets suitable for home screen */
export const homeScreenWidgets = mobileWidgetRegistry.filter((w) => w.homeScreen);
