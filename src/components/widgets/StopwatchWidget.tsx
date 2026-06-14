import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import { useStopwatch, formatMs } from '../../hooks/useTime';
import WidgetWrapper from './WidgetWrapper';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StopwatchWidgetProps {
  widget: Widget;
}

export default function StopwatchWidget({ widget }: StopwatchWidgetProps) {
  const { theme, setCurrentView } = useStore();
  const t = getTheme(theme);
  const { isRunning, elapsed, start, pause, resume, reset } = useStopwatch();
  const [hasStarted, setHasStarted] = useState(false);
  
  const time = formatMs(elapsed);
  const isLarge = widget.size === 'large' || widget.size === 'full';

  const handleStart = () => {
    setHasStarted(true);
    start();
  };

  const handleReset = () => {
    reset();
    setHasStarted(false);
  };

  return (
    <WidgetWrapper
      widget={widget}
      title="Stopwatch"
      icon={<Play size={14} />}
      actions={
        <button
          onClick={() => setCurrentView('stopwatch')}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <Maximize2 size={12} />
        </button>
      }
    >
      <div className="h-full flex flex-col items-center justify-center gap-4">
        {/* Time Display */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-0.5 font-mono">
            {elapsed >= 3600000 && (
              <>
                <span className={`font-bold ${t.text} ${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                  {time.hours}
                </span>
                <span className={`${t.textMuted} ${isLarge ? 'text-2xl' : 'text-xl'}`}>:</span>
              </>
            )}
            <span className={`font-bold ${t.text} ${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
              {time.minutes}
            </span>
            <span className={`${t.textMuted} ${isLarge ? 'text-2xl' : 'text-xl'}`}>:</span>
            <span className={`font-bold ${t.text} ${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
              {time.seconds}
            </span>
            <span className={`${t.textMuted} ${isLarge ? 'text-xl' : 'text-base'} ml-0.5`}>
              .{time.centiseconds}
            </span>
          </div>
          
          {isRunning && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className={`text-[10px] ${t.textMuted}`}>Recording</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!hasStarted ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleStart}
              className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <Play size={16} />
            </motion.button>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleReset}
                className={`p-2 rounded-xl ${t.surface} border ${t.border} ${t.textSecondary} hover:text-white transition-colors`}
              >
                <RotateCcw size={14} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={isRunning ? pause : resume}
                className={`p-2.5 rounded-xl ${
                  isRunning 
                    ? 'bg-amber-500 hover:bg-amber-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </WidgetWrapper>
  );
}
