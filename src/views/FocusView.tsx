import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, X } from 'lucide-react';

const focusModes = [
  { id: 'study', label: 'Study', emoji: '📚', color: 'from-blue-600/20 to-indigo-600/20', work: 50, break: 10, desc: 'Deep focus for learning' },
  { id: 'coding', label: 'Coding', emoji: '💻', color: 'from-emerald-600/20 to-cyan-600/20', work: 45, break: 10, desc: 'Flow state for developers' },
  { id: 'trading', label: 'Trading', emoji: '📈', color: 'from-amber-600/20 to-orange-600/20', work: 30, break: 5, desc: 'Sharp focus for analysis' },
  { id: 'reading', label: 'Reading', emoji: '📖', color: 'from-purple-600/20 to-pink-600/20', work: 40, break: 10, desc: 'Calm focus for reading' },
];

export default function FocusView() {
  const { theme, focusCategory, setFocusCategory, addSession } = useStore();
  const t = getTheme(theme);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mode = focusModes.find(m => m.id === focusCategory) || focusModes[0];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && !isPaused && remaining > 0) {
      interval = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            if (!isBreak) {
              setSessionsCompleted(s => s + 1);
              addSession({
                id: Date.now().toString(),
                name: `Focus: ${mode.label}`,
                category: mode.id,
                duration: mode.work * 60,
                date: new Date().toISOString(),
                laps: [],
              });
              setIsBreak(true);
              return mode.break * 60;
            } else {
              setIsBreak(false);
              return mode.work * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, remaining, isBreak, mode, addSession]);

  const startFocus = () => {
    const duration = mode.work * 60;
    setTotalDuration(duration);
    setRemaining(duration);
    setIsActive(true);
    setIsBreak(false);
    setIsPaused(false);
  };

  const resetFocus = () => {
    setIsActive(false);
    setRemaining(0);
    setTotalDuration(0);
    setIsBreak(false);
    setIsPaused(false);
    setSessionsCompleted(0);
  };

  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');
  const progress = totalDuration > 0 ? remaining / (isBreak ? mode.break * 60 : mode.work * 60) : 0;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress);

  if (isActive) {
    return (
      <div className={`h-full flex flex-col items-center justify-center relative bg-gradient-to-br ${mode.color}`}>
        <button
          onClick={resetFocus}
          className={`absolute top-6 right-6 p-2 rounded-lg ${t.surface} ${t.textSecondary} hover:text-white transition-colors`}
        >
          <X size={18} />
        </button>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-8"
        >
          {isBreak ? (
            <span className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <Coffee size={16} /> Break Time
            </span>
          ) : (
            <span className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <Brain size={16} /> Deep Focus — {mode.emoji} {mode.label}
            </span>
          )}
        </motion.div>

        {/* Timer */}
        <div className="relative">
          <svg width="300" height="300" viewBox="0 0 300 300" className="-rotate-90">
            <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="2" className={t.textMuted} opacity={0.1} />
            <motion.circle
              cx="150" cy="150" r="140"
              fill="none"
              stroke={isBreak ? '#10b981' : '#3b82f6'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl font-mono font-bold ${t.text}`}>{minutes}:{seconds}</span>
            <span className={`text-xs ${t.textMuted} mt-2`}>{isBreak ? 'break' : 'focus'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={resetFocus}
            className={`p-3 rounded-2xl ${t.surface} border ${t.border} ${t.textSecondary} hover:text-white transition-colors`}
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-4 rounded-2xl ${isPaused ? 'bg-blue-500 hover:bg-blue-600' : 'bg-amber-500 hover:bg-amber-600'} text-white transition-colors shadow-lg`}
          >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
          </button>
        </div>

        {/* Sessions Counter */}
        <div className={`mt-8 flex items-center gap-2 ${t.textMuted}`}>
          <span className="text-xs">Sessions completed:</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(sessionsCompleted, 8) }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-400" />
            ))}
            {Array.from({ length: Math.max(0, 4 - sessionsCompleted) }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${t.surface}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className={`text-xl font-semibold ${t.text}`}>Focus Mode</h1>
        <p className={`text-sm ${t.textMuted} mt-0.5`}>Distraction-free deep work sessions</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {focusModes.map((fm) => (
            <motion.button
              key={fm.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFocusCategory(fm.id)}
              className={`p-6 rounded-2xl border text-left transition-all ${
                focusCategory === fm.id
                  ? `bg-gradient-to-br ${fm.color} border-blue-500/30`
                  : `${t.card} ${t.cardBorder} ${t.surfaceHover}`
              }`}
            >
              <span className="text-3xl">{fm.emoji}</span>
              <h3 className={`text-base font-semibold ${t.text} mt-3`}>{fm.label}</h3>
              <p className={`text-xs ${t.textMuted} mt-1`}>{fm.desc}</p>
              <div className={`flex items-center gap-3 mt-3 text-xs ${t.textSecondary}`}>
                <span>{fm.work}min work</span>
                <span>•</span>
                <span>{fm.break}min break</span>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={startFocus}
          className="mt-8 flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/25"
        >
          <Play size={18} /> Enter Focus Mode
        </button>
      </div>
    </div>
  );
}
