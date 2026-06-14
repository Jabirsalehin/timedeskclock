import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import WidgetWrapper from './WidgetWrapper';
import { Bell, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface RemindersWidgetProps {
  widget: Widget;
}

const categoryEmoji: Record<string, string> = {
  study: '📚', work: '💼', prayer: '🕌', medicine: '💊',
  birthday: '🎂', trading: '📈', fitness: '🏋️', custom: '📝',
};

export default function RemindersWidget({ widget }: RemindersWidgetProps) {
  const { theme, reminders, toggleReminder, setCurrentView } = useStore();
  const t = getTheme(theme);
  
  const now = new Date();
  const upcoming = reminders
    .filter(r => !r.completed && new Date(r.datetime) > now)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
    .slice(0, widget.size === 'small' ? 2 : 4);
  
  const totalUpcoming = reminders.filter(r => !r.completed).length;

  return (
    <WidgetWrapper
      widget={widget}
      title="Reminders"
      icon={<Bell size={14} />}
      actions={
        <button
          onClick={() => setCurrentView('reminder')}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <Plus size={12} />
        </button>
      }
      noPadding
    >
      <div className="h-full flex flex-col">
        {upcoming.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <Bell size={24} className={t.textMuted} />
            <p className={`text-xs ${t.textMuted} mt-2`}>No upcoming reminders</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {upcoming.map((reminder, i) => {
              const dt = new Date(reminder.datetime);
              const isToday = dt.toDateString() === now.toDateString();
              const isTomorrow = dt.toDateString() === new Date(now.getTime() + 86400000).toDateString();
              
              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b ${t.border} last:border-0 group`}
                >
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`w-4 h-4 rounded border-2 ${t.border} flex items-center justify-center shrink-0 hover:border-blue-400 transition-colors`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${t.text} truncate`}>
                      {categoryEmoji[reminder.category] || '📝'} {reminder.title}
                    </p>
                    <p className={`text-[10px] ${t.textMuted}`}>
                      {isToday 
                        ? `Today at ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : isTomorrow 
                          ? `Tomorrow at ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : dt.toLocaleDateString([], { month: 'short', day: 'numeric' })
                      }
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {totalUpcoming > upcoming.length && (
          <button
            onClick={() => setCurrentView('reminder')}
            className={`px-4 py-2 text-[10px] ${t.textMuted} hover:text-blue-400 transition-colors border-t ${t.border}`}
          >
            +{totalUpcoming - upcoming.length} more
          </button>
        )}
      </div>
    </WidgetWrapper>
  );
}
