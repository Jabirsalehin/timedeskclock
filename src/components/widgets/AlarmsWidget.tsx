import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import WidgetWrapper from './WidgetWrapper';
import { AlarmClock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlarmsWidgetProps {
  widget: Widget;
}

const categoryEmoji: Record<string, string> = {
  wakeup: '🌅', study: '📚', meeting: '💼', 
  prayer: '🕌', workout: '💪', custom: '⏰',
};

export default function AlarmsWidget({ widget }: AlarmsWidgetProps) {
  const { theme, alarms, toggleAlarm, setCurrentView } = useStore();
  const t = getTheme(theme);
  
  const enabledAlarms = alarms.filter(a => a.enabled).slice(0, widget.size === 'small' ? 2 : 4);
  const totalEnabled = alarms.filter(a => a.enabled).length;

  return (
    <WidgetWrapper
      widget={widget}
      title="Alarms"
      icon={<AlarmClock size={14} />}
      actions={
        <button
          onClick={() => setCurrentView('alarm')}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <Plus size={12} />
        </button>
      }
      noPadding
    >
      <div className="h-full flex flex-col">
        {enabledAlarms.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <AlarmClock size={24} className={t.textMuted} />
            <p className={`text-xs ${t.textMuted} mt-2`}>No alarms set</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {enabledAlarms.map((alarm, i) => (
              <motion.div
                key={alarm.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between px-4 py-2.5 border-b ${t.border} last:border-0`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryEmoji[alarm.category] || '⏰'}</span>
                  <div>
                    <p className={`text-sm font-mono font-semibold ${t.text}`}>{alarm.time}</p>
                    <p className={`text-[10px] ${t.textMuted}`}>{alarm.label}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    alarm.enabled ? 'bg-blue-500' : `${t.inputBg} border ${t.border}`
                  }`}
                >
                  <motion.div
                    animate={{ x: alarm.enabled ? 16 : 2 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </motion.div>
            ))}
          </div>
        )}
        
        {totalEnabled > enabledAlarms.length && (
          <button
            onClick={() => setCurrentView('alarm')}
            className={`px-4 py-2 text-[10px] ${t.textMuted} hover:text-blue-400 transition-colors border-t ${t.border}`}
          >
            +{totalEnabled - enabledAlarms.length} more
          </button>
        )}
      </div>
    </WidgetWrapper>
  );
}
