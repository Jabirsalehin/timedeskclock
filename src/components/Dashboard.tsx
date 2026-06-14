import { useStore } from '../store/useStore';
import { useWidgetStore, type WidgetType, type Widget } from '../store/widgetStore';
import { getTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, X, LayoutGrid, Save, RotateCcw,
  Clock, Globe2, CheckSquare, Bell, Play, Timer, 
  Calendar, Focus, History, AlarmClock
} from 'lucide-react';
import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Widget Components
import ClockWidget from './widgets/ClockWidget';
import WorldClockWidget from './widgets/WorldClockWidget';
import TasksWidget from './widgets/TasksWidget';
import RemindersWidget from './widgets/RemindersWidget';
import StopwatchWidget from './widgets/StopwatchWidget';
import TimerWidget from './widgets/TimerWidget';
import FocusWidget from './widgets/FocusWidget';
import AlarmsWidget from './widgets/AlarmsWidget';
import HistoryWidget from './widgets/HistoryWidget';
import CalendarWidget from './widgets/CalendarWidget';
import QuickNoteWidget from './widgets/QuickNoteWidget';

const widgetInfo: Record<WidgetType, { icon: React.ReactNode; label: string }> = {
  clock: { icon: <Clock size={16} />, label: 'Clock' },
  worldclock: { icon: <Globe2 size={16} />, label: 'World Clock' },
  tasks: { icon: <CheckSquare size={16} />, label: 'Tasks' },
  reminders: { icon: <Bell size={16} />, label: 'Reminders' },
  stopwatch: { icon: <Play size={16} />, label: 'Stopwatch' },
  timer: { icon: <Timer size={16} />, label: 'Timer' },
  focus: { icon: <Focus size={16} />, label: 'Focus' },
  alarms: { icon: <AlarmClock size={16} />, label: 'Alarms' },
  history: { icon: <History size={16} />, label: 'History' },
  calendar: { icon: <Calendar size={16} />, label: 'Calendar' },
  quicknote: { icon: <Edit3 size={16} />, label: 'Quick Note' },
};

function WidgetRenderer({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'clock': return <ErrorBoundary widgetType="clock"><ClockWidget widget={widget} /></ErrorBoundary>;
    case 'worldclock': return <ErrorBoundary widgetType="worldclock"><WorldClockWidget widget={widget} /></ErrorBoundary>;
    case 'tasks': return <ErrorBoundary widgetType="tasks"><TasksWidget widget={widget} /></ErrorBoundary>;
    case 'reminders': return <ErrorBoundary widgetType="reminders"><RemindersWidget widget={widget} /></ErrorBoundary>;
    case 'stopwatch': return <ErrorBoundary widgetType="stopwatch"><StopwatchWidget widget={widget} /></ErrorBoundary>;
    case 'timer': return <ErrorBoundary widgetType="timer"><TimerWidget widget={widget} /></ErrorBoundary>;
    case 'focus': return <ErrorBoundary widgetType="focus"><FocusWidget widget={widget} /></ErrorBoundary>;
    case 'alarms': return <ErrorBoundary widgetType="alarms"><AlarmsWidget widget={widget} /></ErrorBoundary>;
    case 'history': return <ErrorBoundary widgetType="history"><HistoryWidget widget={widget} /></ErrorBoundary>;
    case 'calendar': return <ErrorBoundary widgetType="calendar"><CalendarWidget widget={widget} /></ErrorBoundary>;
    case 'quicknote': return <ErrorBoundary widgetType="quicknote"><QuickNoteWidget widget={widget} /></ErrorBoundary>;
    default: return null;
  }
}

export default function Dashboard() {
  const { theme, workspaceProfile } = useStore();
  const { 
    widgets, editMode, setEditMode, 
    addWidget, saveCurrentLayout, resetToDefault 
  } = useWidgetStore();
  const t = getTheme(theme);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const visibleWidgets = widgets.filter(w => w.visible).sort((a, b) => a.order - b.order);

  const availableWidgets = Object.entries(widgetInfo).filter(
    ([type]) => !widgets.some(w => w.type === type && w.visible)
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Dashboard Header */}
      <div className={`shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b ${t.border}`}>
        <div className="flex items-center gap-2">
          <LayoutGrid size={16} className="text-blue-400" />
          <h1 className={`text-sm font-semibold ${t.text}`}>Dashboard</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${t.surface} ${t.textMuted} capitalize`}>
            {workspaceProfile}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {editMode && (
            <>
              <button
                onClick={() => resetToDefault(workspaceProfile)}
                className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
                title="Reset to default"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => { saveCurrentLayout(workspaceProfile); setEditMode(false); }}
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Save size={12} /> Save
              </button>
            </>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
              title="Add widget"
            >
              <Plus size={16} />
            </button>
            
            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className={`absolute right-0 top-full mt-2 ${t.card} border ${t.cardBorder} rounded-xl shadow-2xl z-50 py-2 min-w-[180px]`}
                >
                  <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest ${t.textMuted}`}>
                    Add Widget
                  </div>
                  {availableWidgets.map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => {
                        addWidget(type as WidgetType);
                        setShowAddMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm ${t.textSecondary} ${t.surfaceHover} transition-colors`}
                    >
                      <span className="text-blue-400">{info.icon}</span>
                      {info.label}
                    </button>
                  ))}
                  {availableWidgets.length === 0 && (
                    <p className={`px-3 py-2 text-xs ${t.textMuted}`}>All widgets added</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={() => setEditMode(!editMode)}
            className={`p-1.5 rounded-lg transition-colors ${
              editMode 
                ? 'bg-blue-500 text-white' 
                : `${t.textMuted} hover:text-white ${t.surfaceHover}`
            }`}
            title={editMode ? 'Done editing' : 'Edit layout'}
          >
            {editMode ? <X size={16} /> : <Edit3 size={16} />}
          </button>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
          <AnimatePresence mode="popLayout">
            {visibleWidgets.map((widget) => (
              <WidgetRenderer key={widget.id} widget={widget} />
            ))}
          </AnimatePresence>
        </div>

        {visibleWidgets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <LayoutGrid size={40} className={t.textMuted} />
            <p className={`text-sm ${t.textSecondary}`}>No widgets added</p>
            <button
              onClick={() => setShowAddMenu(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={14} /> Add Widget
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
