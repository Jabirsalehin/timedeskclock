import { useState } from 'react';
import { useStore } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { useCountdownTimer, formatMs } from '../hooks/useTime';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

export default function TimerView() {
  const { theme, timerPresets } = useStore();
  const t = getTheme(theme);
  const { isRunning, remaining, totalDuration, isComplete, startTimer, pauseTimer, resumeTimer, resetTimer } = useCountdownTimer();
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);
  const hasStarted = totalDuration > 0;

  const time = formatMs(remaining);
  const progress = totalDuration > 0 ? remaining / totalDuration : 0;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress);

  const handlePreset = (duration: number) => {
    startTimer(duration * 1000);
  };

  const handleCustomStart = () => {
    const totalSec = customMinutes * 60 + customSeconds;
    if (totalSec > 0) startTimer(totalSec * 1000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      {!hasStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8 w-full max-w-lg"
        >
          <div className="text-center">
            <h2 className={`text-xl font-semibold ${t.text}`}>Timer</h2>
            <p className={`text-sm ${t.textMuted} mt-1`}>Choose a preset or set custom duration</p>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {timerPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePreset(preset.duration)}
                className={`${t.card} border ${t.cardBorder} rounded-xl p-4 flex flex-col items-center gap-2 ${t.surfaceHover} transition-all group`}
              >
                <span className={`text-lg font-mono font-semibold ${t.text} group-hover:text-blue-400 transition-colors`}>
                  {Math.floor(preset.duration / 60)}:{(preset.duration % 60).toString().padStart(2, '0')}
                </span>
                <span className={`text-xs ${t.textMuted}`}>{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Custom Timer */}
          <div className={`${t.card} border ${t.cardBorder} rounded-xl p-6 w-full`}>
            <p className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted} mb-4 text-center`}>Custom Timer</p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <button onClick={() => setCustomMinutes(Math.min(99, customMinutes + 1))} className={`p-1.5 rounded-lg ${t.surface} ${t.textSecondary} hover:text-white`}>
                  <Plus size={16} />
                </button>
                <span className={`text-4xl font-mono font-bold ${t.text} w-16 text-center`}>
                  {customMinutes.toString().padStart(2, '0')}
                </span>
                <button onClick={() => setCustomMinutes(Math.max(0, customMinutes - 1))} className={`p-1.5 rounded-lg ${t.surface} ${t.textSecondary} hover:text-white`}>
                  <Minus size={16} />
                </button>
                <span className={`text-xs ${t.textMuted}`}>min</span>
              </div>

              <span className={`text-4xl font-mono ${t.textMuted}`}>:</span>

              <div className="flex flex-col items-center gap-2">
                <button onClick={() => setCustomSeconds(Math.min(59, customSeconds + 5))} className={`p-1.5 rounded-lg ${t.surface} ${t.textSecondary} hover:text-white`}>
                  <Plus size={16} />
                </button>
                <span className={`text-4xl font-mono font-bold ${t.text} w-16 text-center`}>
                  {customSeconds.toString().padStart(2, '0')}
                </span>
                <button onClick={() => setCustomSeconds(Math.max(0, customSeconds - 5))} className={`p-1.5 rounded-lg ${t.surface} ${t.textSecondary} hover:text-white`}>
                  <Minus size={16} />
                </button>
                <span className={`text-xs ${t.textMuted}`}>sec</span>
              </div>
            </div>
            <button
              onClick={handleCustomStart}
              className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Start Timer
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Circular Progress */}
          <div className="relative">
            <svg width="300" height="300" viewBox="0 0 300 300" className="-rotate-90">
              <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="3" className={t.textMuted} opacity={0.15} />
              <motion.circle
                cx="150" cy="150" r="140"
                fill="none"
                stroke={isComplete ? '#ef4444' : '#3b82f6'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transition={{ duration: 0.1 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <span className="text-5xl">🎉</span>
                  <p className={`text-lg font-semibold ${t.text} mt-2`}>Time's up!</p>
                </motion.div>
              ) : (
                <>
                  <span className={`text-5xl md:text-6xl font-mono font-bold ${t.text}`}>
                    {remaining >= 3600000 ? `${time.hours}:` : ''}{time.minutes}:{time.seconds}
                  </span>
                  <span className={`text-xs ${t.textMuted} mt-2`}>remaining</span>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetTimer}
              className={`p-3 rounded-2xl ${t.surface} border ${t.border} ${t.textSecondary} hover:text-white transition-colors`}
            >
              <RotateCcw size={20} />
            </button>
            {!isComplete && (
              <button
                onClick={isRunning ? pauseTimer : resumeTimer}
                className={`p-4 rounded-2xl ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors shadow-lg`}
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
            )}
            {isComplete && (
              <button
                onClick={resetTimer}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-sm font-semibold transition-colors"
              >
                New Timer
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
