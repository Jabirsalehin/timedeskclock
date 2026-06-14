import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Generate a unique ID with less collision risk than Date.now()
 * Uses timestamp + random component for safety
 */
const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 11);
  return `${timestamp}-${randomPart}`;
};

export type WidgetType = 
  | 'clock' 
  | 'worldclock' 
  | 'tasks' 
  | 'reminders' 
  | 'stopwatch' 
  | 'timer' 
  | 'calendar' 
  | 'focus' 
  | 'alarms'
  | 'history'
  | 'quicknote';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface Widget {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  position: { x: number; y: number };
  order: number;
  collapsed: boolean;
  visible: boolean;
}

export interface FloatingWidget {
  id: string;
  type: 'clock' | 'stopwatch' | 'timer' | 'pomodoro' | 'prayer' | 'task' | 'reminder' | 'countdown';
  position: { x: number; y: number };
  size: { width: number; height: number };
  alwaysOnTop: boolean;
  visible: boolean;
  opacity: number;
}

const floatingDefaultSizes: Record<FloatingWidget['type'], { width: number; height: number }> = {
  clock: { width: 200, height: 120 },
  stopwatch: { width: 200, height: 140 },
  timer: { width: 200, height: 160 },
  pomodoro: { width: 200, height: 180 },
  prayer: { width: 220, height: 160 },
  task: { width: 240, height: 200 },
  reminder: { width: 220, height: 180 },
  countdown: { width: 200, height: 140 },
};

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: Widget[];
  columns: number;
}

export type WorkspaceProfile = 'minimal' | 'student' | 'developer' | 'trader' | 'prayer';

// Default layouts for each profile
const defaultLayouts: Record<WorkspaceProfile, Widget[]> = {
  minimal: [
    { id: 'clock-1', type: 'clock', size: 'full', position: { x: 0, y: 0 }, order: 0, collapsed: false, visible: true },
  ],
  student: [
    { id: 'clock-1', type: 'clock', size: 'large', position: { x: 0, y: 0 }, order: 0, collapsed: false, visible: true },
    { id: 'tasks-1', type: 'tasks', size: 'medium', position: { x: 0, y: 1 }, order: 1, collapsed: false, visible: true },
    { id: 'timer-1', type: 'timer', size: 'medium', position: { x: 1, y: 1 }, order: 2, collapsed: false, visible: true },
    { id: 'reminders-1', type: 'reminders', size: 'medium', position: { x: 0, y: 2 }, order: 3, collapsed: false, visible: true },
    { id: 'focus-1', type: 'focus', size: 'medium', position: { x: 1, y: 2 }, order: 4, collapsed: false, visible: true },
  ],
  developer: [
    { id: 'clock-1', type: 'clock', size: 'large', position: { x: 0, y: 0 }, order: 0, collapsed: false, visible: true },
    { id: 'worldclock-1', type: 'worldclock', size: 'medium', position: { x: 0, y: 1 }, order: 1, collapsed: false, visible: true },
    { id: 'stopwatch-1', type: 'stopwatch', size: 'medium', position: { x: 1, y: 1 }, order: 2, collapsed: false, visible: true },
    { id: 'tasks-1', type: 'tasks', size: 'medium', position: { x: 0, y: 2 }, order: 3, collapsed: false, visible: true },
    { id: 'focus-1', type: 'focus', size: 'medium', position: { x: 1, y: 2 }, order: 4, collapsed: false, visible: true },
  ],
  trader: [
    { id: 'clock-1', type: 'clock', size: 'large', position: { x: 0, y: 0 }, order: 0, collapsed: false, visible: true },
    { id: 'worldclock-1', type: 'worldclock', size: 'large', position: { x: 0, y: 1 }, order: 1, collapsed: false, visible: true },
    { id: 'alarms-1', type: 'alarms', size: 'medium', position: { x: 0, y: 2 }, order: 2, collapsed: false, visible: true },
    { id: 'reminders-1', type: 'reminders', size: 'medium', position: { x: 1, y: 2 }, order: 3, collapsed: false, visible: true },
  ],
  prayer: [
    { id: 'clock-1', type: 'clock', size: 'full', position: { x: 0, y: 0 }, order: 0, collapsed: false, visible: true },
    { id: 'alarms-1', type: 'alarms', size: 'large', position: { x: 0, y: 1 }, order: 1, collapsed: false, visible: true },
    { id: 'reminders-1', type: 'reminders', size: 'medium', position: { x: 0, y: 2 }, order: 2, collapsed: false, visible: true },
  ],
};

interface WidgetState {
  // Dashboard mode
  dashboardMode: boolean;
  setDashboardMode: (mode: boolean) => void;
  
  // Current profile widgets
  widgets: Widget[];
  
  // Floating widgets
  floatingWidgets: FloatingWidget[];
  
  // Profile layouts (user customized)
  profileLayouts: Record<WorkspaceProfile, Widget[]>;
  
  // Widget actions
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  reorderWidgets: (fromIndex: number, toIndex: number) => void;
  toggleWidgetCollapse: (id: string) => void;
  resizeWidget: (id: string, size: WidgetSize) => void;
  
  // Floating widget actions
  addFloatingWidget: (type: FloatingWidget['type']) => void;
  removeFloatingWidget: (id: string) => void;
  updateFloatingWidget: (id: string, updates: Partial<FloatingWidget>) => void;
  toggleFloatingWidget: (id: string) => void;
  
  // Layout actions
  loadProfileLayout: (profile: WorkspaceProfile) => void;
  saveCurrentLayout: (profile: WorkspaceProfile) => void;
  resetToDefault: (profile: WorkspaceProfile) => void;
  
  // Edit mode for drag/drop
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      dashboardMode: false,
      setDashboardMode: (mode) => set({ dashboardMode: mode }),
      
      widgets: defaultLayouts.minimal,
      floatingWidgets: [],
      profileLayouts: defaultLayouts,
      
      addWidget: (type) => set((state) => {
        const id = `${type}-${generateId()}`;
        const maxOrder = Math.max(...state.widgets.map(w => w.order), -1);
        const newWidget: Widget = {
          id,
          type,
          size: 'medium',
          position: { x: 0, y: maxOrder + 1 },
          order: maxOrder + 1,
          collapsed: false,
          visible: true,
        };
        return { widgets: [...state.widgets, newWidget] };
      }),
      
      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(w => w.id !== id),
      })),
      
      updateWidget: (id, updates) => set((state) => ({
        widgets: state.widgets.map(w => w.id === id ? { ...w, ...updates } : w),
      })),
      
      reorderWidgets: (fromIndex, toIndex) => set((state) => {
        const newWidgets = [...state.widgets];
        const [removed] = newWidgets.splice(fromIndex, 1);
        newWidgets.splice(toIndex, 0, removed);
        return { widgets: newWidgets.map((w, i) => ({ ...w, order: i })) };
      }),
      
      toggleWidgetCollapse: (id) => set((state) => ({
        widgets: state.widgets.map(w => w.id === id ? { ...w, collapsed: !w.collapsed } : w),
      })),
      
      resizeWidget: (id, size) => set((state) => ({
        widgets: state.widgets.map(w => w.id === id ? { ...w, size } : w),
      })),
      
      addFloatingWidget: (type) => set((state) => {
        const existing = state.floatingWidgets.find(w => w.type === type);
        if (existing) {
          return {
            floatingWidgets: state.floatingWidgets.map(w =>
              w.type === type ? { ...w, visible: true } : w
            ),
          };
        }
        const newWidget: FloatingWidget = {
          id: `floating-${type}-${generateId()}`,
          type,
          position: { x: 100 + state.floatingWidgets.length * 20, y: 100 + state.floatingWidgets.length * 20 },
          size: floatingDefaultSizes[type],
          alwaysOnTop: true,
          visible: true,
          opacity: 1,
        };
        return { floatingWidgets: [...state.floatingWidgets, newWidget] };
      }),
      
      removeFloatingWidget: (id) => set((state) => ({
        floatingWidgets: state.floatingWidgets.filter(w => w.id !== id),
      })),
      
      updateFloatingWidget: (id, updates) => set((state) => ({
        floatingWidgets: state.floatingWidgets.map(w =>
          w.id === id ? { ...w, ...updates } : w
        ),
      })),
      
      toggleFloatingWidget: (id) => set((state) => ({
        floatingWidgets: state.floatingWidgets.map(w =>
          w.id === id ? { ...w, visible: !w.visible } : w
        ),
      })),
      
      loadProfileLayout: (profile) => set((state) => ({
        widgets: state.profileLayouts[profile] || defaultLayouts[profile],
      })),
      
      saveCurrentLayout: (profile) => set((state) => ({
        profileLayouts: {
          ...state.profileLayouts,
          [profile]: state.widgets,
        },
      })),
      
      resetToDefault: (profile) => set((state) => ({
        widgets: defaultLayouts[profile],
        profileLayouts: {
          ...state.profileLayouts,
          [profile]: defaultLayouts[profile],
        },
      })),
      
      editMode: false,
      setEditMode: (mode) => set({ editMode: mode }),
    }),
    {
      name: 'timedesk-widgets',
      partialize: (state) => ({
        widgets: state.widgets,
        floatingWidgets: state.floatingWidgets,
        profileLayouts: state.profileLayouts,
        dashboardMode: state.dashboardMode,
      }),
    }
  )
);
