import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeExperienceId } from '../utils/themeExperience';
import { useWidgetStore } from './widgetStore';

export type ThemeType = 'dark' | 'amoled' | 'light' | 'glass' | 'minimal';
export type ClockMode = 'flip' | 'digital' | 'minimal';
export type TimeFormat = '12h' | '24h';
export type DateFormatType = 'mdy' | 'dmy' | 'ymd' | 'relative';
export type ViewType = 'clock' | 'alarm' | 'reminder' | 'stopwatch' | 'timer' | 'focus' | 'tasks' | 'worldclock' | 'history' | 'settings' | 'about';
export type WorkspaceProfile = 'minimal' | 'student' | 'developer' | 'trader' | 'prayer';
export type FullscreenMode = 'clock-only' | 'clock-tools';
export type OverlayMode = 'overlay-clock-only' | 'overlay-clock-tools';
export type OverlayPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'custom';
export type OverlayLayout = 'compact' | 'standard' | 'workspace';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  category: 'wakeup' | 'study' | 'meeting' | 'prayer' | 'workout' | 'custom';
  enabled: boolean;
  recurring: boolean;
  days: number[];
  sound: string;
}

export interface Reminder {
  id: string;
  title: string;
  datetime: string;
  category: 'study' | 'work' | 'prayer' | 'medicine' | 'birthday' | 'trading' | 'fitness' | 'custom';
  recurring: boolean;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  dueTime?: string;
  category: string;
  completed: boolean;
  estimatedDuration?: number;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  name: string;
  category: string;
  duration: number;
  date: string;
  laps: number[];
}

export interface WorldClockCity {
  id: string;
  name: string;
  timezone: string;
  country: string;
}

export interface TimerPreset {
  id: string;
  label: string;
  duration: number;
}

interface AppState {
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Theme
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeExperience: ThemeExperienceId;
  setThemeExperience: (theme: ThemeExperienceId) => void;

  // Clock
  clockMode: ClockMode;
  setClockMode: (mode: ClockMode) => void;
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  dateFormat: DateFormatType;
  setDateFormat: (format: DateFormatType) => void;
  showSeconds: boolean;
  toggleShowSeconds: () => void;

  // Startup
  autoStartEnabled: boolean;
  setAutoStartEnabled: (enabled: boolean) => void;

  // Workspace
  workspaceProfile: WorkspaceProfile;
  setWorkspaceProfile: (profile: WorkspaceProfile) => void;

  // Alarms
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Sessions
  sessions: SessionRecord[];
  addSession: (session: SessionRecord) => void;
  clearSessions: () => void;

  // World Clock
  worldClocks: WorldClockCity[];
  addWorldClock: (city: WorldClockCity) => void;
  removeWorldClock: (id: string) => void;

  // Timer Presets
  timerPresets: TimerPreset[];

  // Focus
  focusCategory: string;
  setFocusCategory: (cat: string) => void;

  // Fullscreen
  isFullscreen: boolean;
  setFullscreen: (val: boolean) => void;
  fullscreenMode: FullscreenMode;
  setFullscreenMode: (mode: FullscreenMode) => void;
  enterFullscreen: (mode?: FullscreenMode) => void;
  // Desktop Overlay (premium)
  overlayEnabled: boolean;
  setOverlayEnabled: (val: boolean) => void;
  overlayMode: OverlayMode;
  setOverlayMode: (mode: OverlayMode) => void;
  overlayTransparency: number; // 0-100
  setOverlayTransparency: (val: number) => void;
  overlayClickThrough: boolean;
  setOverlayClickThrough: (val: boolean) => void;
  overlayPosition: OverlayPosition;
  setOverlayPosition: (pos: OverlayPosition) => void;
  overlayCustomPosition: { x: number; y: number };
  setOverlayCustomPosition: (pos: { x: number; y: number }) => void;
  overlayLayout: OverlayLayout;
  setOverlayLayout: (layout: OverlayLayout) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'clock',
      setCurrentView: (view) => set({ currentView: view }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      themeExperience: 'glass-executive' as ThemeExperienceId,
      setThemeExperience: (theme) => set({ themeExperience: theme }),

      clockMode: 'digital',
      setClockMode: (mode) => set({ clockMode: mode }),
      timeFormat: '12h',
      setTimeFormat: (format) => set({ timeFormat: format }),
      dateFormat: 'mdy',
      setDateFormat: (format) => set({ dateFormat: format }),
      showSeconds: true,
      toggleShowSeconds: () => set((s) => ({ showSeconds: !s.showSeconds })),

      autoStartEnabled: false,
      setAutoStartEnabled: (enabled) => set({ autoStartEnabled: enabled }),

      workspaceProfile: 'minimal',
      setWorkspaceProfile: (profile) => set({ workspaceProfile: profile }),

      alarms: [],
      addAlarm: (alarm) => set((s) => ({ alarms: [...s.alarms, alarm] })),
      removeAlarm: (id) => set((s) => ({ alarms: s.alarms.filter((a) => a.id !== id) })),
      toggleAlarm: (id) => set((s) => ({
        alarms: s.alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
      })),

      reminders: [],
      addReminder: (reminder) => set((s) => ({ reminders: [...s.reminders, reminder] })),
      updateReminder: (reminder) => set((s) => ({
        reminders: s.reminders.map((r) => (r.id === reminder.id ? reminder : r)),
      })),
      removeReminder: (id) => set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),
      toggleReminder: (id) => set((s) => ({
        reminders: s.reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
      })),

      tasks: [],
      addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
      updateTask: (task) => set((s) => ({
        tasks: s.tasks.map((t) => (t.id === task.id ? task : t)),
      })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      toggleTask: (id) => set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      })),

      sessions: [],
      addSession: (session) => set((s) => ({ sessions: [...s.sessions, session] })),
      clearSessions: () => set({ sessions: [] }),

      worldClocks: [
        { id: '1', name: 'New York', timezone: 'America/New_York', country: 'USA' },
        { id: '2', name: 'London', timezone: 'Europe/London', country: 'UK' },
        { id: '3', name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
        { id: '4', name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
      ],
      addWorldClock: (city) => set((s) => ({ worldClocks: [...s.worldClocks, city] })),
      removeWorldClock: (id) => set((s) => ({ worldClocks: s.worldClocks.filter((c) => c.id !== id) })),

      timerPresets: [
        { id: '1', label: 'Quick Break', duration: 300 },
        { id: '2', label: 'Pomodoro', duration: 1500 },
        { id: '3', label: 'Long Break', duration: 900 },
        { id: '4', label: 'Deep Work', duration: 3600 },
        { id: '5', label: 'Meeting', duration: 1800 },
        { id: '6', label: 'Power Nap', duration: 1200 },
      ],

      focusCategory: 'study',
      setFocusCategory: (cat) => set({ focusCategory: cat }),

      isFullscreen: false,
      setFullscreen: (val) => set({ isFullscreen: val }),
      fullscreenMode: 'clock-only',
      setFullscreenMode: (mode) => set({ fullscreenMode: mode }),
      enterFullscreen: (mode) => {
        useWidgetStore.getState().setDashboardMode(false);
        set((s) => ({
          isFullscreen: true,
          fullscreenMode: mode ?? s.fullscreenMode,
          currentView: 'clock',
        }));
      },
      // Desktop Overlay defaults
      overlayEnabled: false,
      setOverlayEnabled: (val) => set({ overlayEnabled: val }),
      overlayMode: 'overlay-clock-only',
      setOverlayMode: (mode) => set({ overlayMode: mode }),
      overlayTransparency: 50,
      setOverlayTransparency: (val) => set({ overlayTransparency: Math.max(0, Math.min(100, val)) }),
      overlayClickThrough: false,
      setOverlayClickThrough: (val) => set({ overlayClickThrough: val }),
      overlayPosition: 'center',
      setOverlayPosition: (pos) => set({ overlayPosition: pos }),
      overlayCustomPosition: { x: 100, y: 100 },
      setOverlayCustomPosition: (pos) => set({ overlayCustomPosition: pos }),
      overlayLayout: 'standard',
      setOverlayLayout: (layout) => set({ overlayLayout: layout }),
    }),
    {
      name: 'timedesk-storage',
      partialize: (state) => ({
        theme: state.theme,
        clockMode: state.clockMode,
        timeFormat: state.timeFormat,
        dateFormat: state.dateFormat,
        showSeconds: state.showSeconds,
        workspaceProfile: state.workspaceProfile,
        alarms: state.alarms,
        reminders: state.reminders,
        tasks: state.tasks,
        sessions: state.sessions,
        worldClocks: state.worldClocks,
        sidebarCollapsed: state.sidebarCollapsed,
        overlayEnabled: state.overlayEnabled,
        overlayMode: state.overlayMode,
        overlayTransparency: state.overlayTransparency,
        overlayClickThrough: state.overlayClickThrough,
        overlayPosition: state.overlayPosition,
        overlayCustomPosition: state.overlayCustomPosition,
        overlayLayout: state.overlayLayout,
        autoStartEnabled: state.autoStartEnabled,
      }),
    }
  )
);
