import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import WidgetWrapper from './WidgetWrapper';
import { CheckSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface TasksWidgetProps {
  widget: Widget;
}

export default function TasksWidget({ widget }: TasksWidgetProps) {
  const { theme, tasks, toggleTask, setCurrentView } = useStore();
  const t = getTheme(theme);
  
  const activeTasks = tasks.filter(task => !task.completed).slice(0, widget.size === 'small' ? 3 : 5);
  const totalActive = tasks.filter(task => !task.completed).length;

  return (
    <WidgetWrapper
      widget={widget}
      title="Tasks"
      icon={<CheckSquare size={14} />}
      actions={
        <button
          onClick={() => setCurrentView('tasks')}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <Plus size={12} />
        </button>
      }
      noPadding
    >
      <div className="h-full flex flex-col">
        {activeTasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <CheckSquare size={24} className={t.textMuted} />
            <p className={`text-xs ${t.textMuted} mt-2`}>No active tasks</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {activeTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 px-4 py-2.5 border-b ${t.border} last:border-0 group`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-4 h-4 rounded border-2 ${t.border} flex items-center justify-center shrink-0 hover:border-blue-400 transition-colors`}
                />
                <span className={`text-xs ${t.text} truncate flex-1`}>{task.title}</span>
              </motion.div>
            ))}
          </div>
        )}
        
        {totalActive > activeTasks.length && (
          <button
            onClick={() => setCurrentView('tasks')}
            className={`px-4 py-2 text-[10px] ${t.textMuted} hover:text-blue-400 transition-colors border-t ${t.border}`}
          >
            +{totalActive - activeTasks.length} more tasks
          </button>
        )}
      </div>
    </WidgetWrapper>
  );
}
