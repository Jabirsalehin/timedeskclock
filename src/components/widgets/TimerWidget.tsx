// Timer Widget Component
import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import { useCountdownTimer, formatMs } from '../../hooks/useTime';
import WidgetWrapper from './WidgetWrapper';
import { Timer, Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimerWidgetProps {
  widget: Widget;
}

const quickPresets = [
  { label: '5m', seconds: 300 },
  { label: '15m', seconds: 900 },
  { label: '25m', seconds: 1500 },
  { label: '60m', seconds: 3600 },
];

export default function TimerWidget({ widget }: TimerWidgetProps) {
  const { theme, setCurrentView } = useStore();
  const t = getTheme(theme);
  const { isRunning, remaining, totalDuration, isComplete, startTimer, pauseTimer, resumeTimer, resetTimer } = useCountdownTimer();
  
  const time = formatMs(remaining);
  const hasStarted = totalDuration > 0;
  const isLarge = widget.size === 'large' || widget.size === 'full';
  const progress = totalDuration > 0 ? remaining / totalDuration : 0;

  return (
    <WidgetWrapper
      widget={widget}
      title="Timer"
      icon={<Timer size={14} />}
      actions={
        <button
          onClick={() => setCurrentView('timer')}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <Maximize2 size={12} />
        </button>
      }
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        {!hasStarted ? (
          // Presets
          <div className="w-full">
            <p className={`text-[10px] ${t.textMuted} text-center mb-3`}>Quick Start</p>
            <div className="grid grid-cols-4 gap-2">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => startTimer(preset.seconds * 1000)}
                  className={`${t.surface} border ${t.border} rounded-lg py-2 text-xs font-mono font-semibold ${t.text} ${t.surfaceHover} transition-colors`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Progress Ring */}
            <div className="relative">
              <svg 
                width={isLarge ? 120 : 80} 
                height={isLarge ? 120 : 80} 
                viewBox="0 0 120 120" 
                className="-rotate-90"
              >
                <circle 
                  cx="60" cy="60" r="54" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  className={t.textMuted} 
                  opacity={0.15} 
                />
                <motion.circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke={isComplete ? '#ef4444' : '#3b82f6'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - progress)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isComplete ? (
                  <span className="text-xl">🎉</span>
                ) : (
                  <span className={`font-mono font-bold ${t.text} ${isLarge ? 'text-lg' : 'text-sm'}`}>
                    {time.minutes}:{time.seconds}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={resetTimer}
                className={`p-2 rounded-xl ${t.surface} border ${t.border} ${t.textSecondary} hover:text-white transition-colors`}
              >
                <RotateCcw size={14} />
              </motion.button>
              {!isComplete && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={isRunning ? pauseTimer : resumeTimer}
                  className={`p-2.5 rounded-xl ${
                    isRunning 
                      ? 'bg-amber-500 hover:bg-amber-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  {isRunning ? <Pause size={16} /> : <Play size={16} />}
                </motion.button>
              )}
            </div>
          </>
        )}
      </div>
    </WidgetWrapper>
  );
}
