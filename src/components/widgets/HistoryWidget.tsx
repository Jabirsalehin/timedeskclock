import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import { formatDuration } from '../../hooks/useTime';
import WidgetWrapper from './WidgetWrapper';
import { History, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryWidgetProps {
  widget: Widget;
}

// History Widget Component

export default function HistoryWidget({ widget }: HistoryWidgetProps) {
  const { theme, sessions, setCurrentView } = useStore();
  const t = getTheme(theme);
  
  // Last 7 days stats
  const today = new Date();
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const daySessions = sessions.filter(s => new Date(s.date).toDateString() === dateStr);
    const totalMin = daySessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    return { day: d.toLocaleDateString('en-US', { weekday: 'narrow' }), minutes: totalMin };
  });
  const maxMin = Math.max(...last7.map(d => d.minutes), 1);
  
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = sessions.length;
  
  const isLarge = widget.size === 'large' || widget.size === 'full';

  return (
    <WidgetWrapper
      widget={widget}
      title="History"
      icon={<History size={14} />}
      actions={
        <button
          onClick={() => setCurrentView('history')}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <BarChart3 size={12} />
        </button>
      }
    >
      <div className="h-full flex flex-col gap-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`${t.surface} rounded-lg p-2.5 text-center`}>
            <p className={`text-[10px] ${t.textMuted}`}>Total Time</p>
            <p className={`text-sm font-mono font-semibold ${t.text} mt-0.5`}>
              {formatDuration(totalDuration)}
            </p>
          </div>
          <div className={`${t.surface} rounded-lg p-2.5 text-center`}>
            <p className={`text-[10px] ${t.textMuted}`}>Sessions</p>
            <p className={`text-sm font-mono font-semibold ${t.text} mt-0.5`}>
              {totalSessions}
            </p>
          </div>
        </div>

        {/* Weekly Chart */}
        {isLarge && (
          <div className="flex-1 flex flex-col">
            <p className={`text-[10px] ${t.textMuted} mb-2`}>Last 7 Days</p>
            <div className="flex items-end justify-between gap-1 flex-1">
              {last7.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center justify-end h-16">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.minutes / maxMin) * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="w-full max-w-[16px] rounded-t bg-gradient-to-t from-blue-600 to-blue-400 min-h-[2px]"
                    />
                  </div>
                  <span className={`text-[8px] ${t.textMuted}`}>{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}
