import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import WidgetWrapper from './WidgetWrapper';
import { Focus, Play, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FocusWidgetProps {
  widget: Widget;
}

const focusModes = [
  { id: 'study', label: 'Study', emoji: '📚', duration: 50 },
  { id: 'coding', label: 'Coding', emoji: '💻', duration: 45 },
  { id: 'trading', label: 'Trading', emoji: '📈', duration: 30 },
  { id: 'reading', label: 'Reading', emoji: '📖', duration: 40 },
];

export default function FocusWidget({ widget }: FocusWidgetProps) {
  const { theme, setCurrentView, focusCategory, setFocusCategory, sessions } = useStore();
  const t = getTheme(theme);
  
  const today = new Date();
  const todaySessions = sessions.filter(s => 
    new Date(s.date).toDateString() === today.toDateString()
  );
  const todayMinutes = Math.floor(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60);
  
  const isLarge = widget.size === 'large' || widget.size === 'full';

  return (
    <WidgetWrapper
      widget={widget}
      title="Focus Mode"
      icon={<Focus size={14} />}
      actions={
        <button
          onClick={() => setCurrentView('focus')}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <Maximize2 size={12} />
        </button>
      }
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        {/* Today's Stats */}
        <div className="text-center">
          <p className={`text-[10px] uppercase tracking-widest ${t.textMuted}`}>Today</p>
          <p className={`text-2xl font-bold ${t.text} mt-1`}>
            {todayMinutes > 0 ? `${todayMinutes}m` : '0m'}
          </p>
          <p className={`text-[10px] ${t.textMuted}`}>
            {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Quick Start Options */}
        <div className={`grid ${isLarge ? 'grid-cols-4' : 'grid-cols-2'} gap-2 w-full`}>
          {focusModes.slice(0, isLarge ? 4 : 2).map((mode) => (
            <motion.button
              key={mode.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFocusCategory(mode.id);
                setCurrentView('focus');
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                focusCategory === mode.id
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : `${t.surface} ${t.border} ${t.surfaceHover}`
              }`}
            >
              <span className="text-lg">{mode.emoji}</span>
              <span className={`text-[10px] ${t.textSecondary}`}>{mode.duration}m</span>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('focus')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition-colors"
        >
          <Play size={12} /> Start Focus
        </motion.button>
      </div>
    </WidgetWrapper>
  );
}
