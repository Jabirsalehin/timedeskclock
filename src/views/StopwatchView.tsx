import { useState } from 'react';
import { useStore } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { useStopwatch, formatMs } from '../hooks/useTime';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Flag, Save, Maximize2, Minimize2 } from 'lucide-react';

const sessionCategories = [
  { id: 'study', label: 'Study', emoji: '📚', color: 'from-blue-500/20 to-indigo-500/20' },
  { id: 'work', label: 'Work', emoji: '💼', color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'coding', label: 'Coding', emoji: '💻', color: 'from-emerald-500/20 to-cyan-500/20' },
  { id: 'trading', label: 'Trading', emoji: '📈', color: 'from-green-500/20 to-lime-500/20' },
  { id: 'fitness', label: 'Fitness', emoji: '🏋️', color: 'from-red-500/20 to-rose-500/20' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', color: 'from-purple-500/20 to-pink-500/20' },
  { id: 'other', label: 'Other', emoji: '⏱️', color: 'from-slate-500/20 to-gray-500/20' },
];

export default function StopwatchView() {
  const { theme, addSession, isFullscreen, setFullscreen } = useStore();
  const t = getTheme(theme);
  const { isRunning, elapsed, laps, start, pause, resume, reset, lap } = useStopwatch();
  const [sessionName, setSessionName] = useState('');
  const [sessionCategory, setSessionCategory] = useState('other');
  const [hasStarted, setHasStarted] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const time = formatMs(elapsed);
  const catInfo = sessionCategories.find(c => c.id === sessionCategory);

  const handleStart = () => {
    setHasStarted(true);
    start();
  };

  const handleReset = () => {
    reset();
    setHasStarted(false);
    setSessionName('');
    setSessionCategory('other');
  };

  const handleSave = () => {
    addSession({
      id: Date.now().toString(),
      name: sessionName || 'Untitled Session',
      category: sessionCategory,
      duration: Math.floor(elapsed / 1000),
      date: new Date().toISOString(),
      laps: laps.map(l => Math.floor(l / 1000)),
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
    handleReset();
  };

  // Active stopwatch display
  const StopwatchDisplay = ({ isFs }: { isFs?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center ${isFs ? 'gap-10' : 'gap-6 sm:gap-8'}`}
    >
      {/* Session Label */}
      {sessionName && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${t.surface} border ${t.border}`}
        >
          <span>{catInfo?.emoji}</span>
          <span className={`text-xs sm:text-sm font-medium ${t.textSecondary}`}>{sessionName}</span>
        </motion.div>
      )}

      {/* Time Display */}
      <div className="flex items-baseline gap-0.5 font-mono select-none">
        {elapsed >= 3600000 && (
          <>
            <span className={`${isFs ? 'text-8xl sm:text-9xl' : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'} font-bold ${t.text}`}>{time.hours}</span>
            <span className={`${isFs ? 'text-5xl' : 'text-3xl sm:text-4xl'} ${t.textMuted}`}>:</span>
          </>
        )}
        <span className={`${isFs ? 'text-8xl sm:text-9xl' : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'} font-bold ${t.text}`}>{time.minutes}</span>
        <span className={`${isFs ? 'text-5xl' : 'text-3xl sm:text-4xl'} ${t.textMuted}`}>:</span>
        <span className={`${isFs ? 'text-8xl sm:text-9xl' : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'} font-bold ${t.text}`}>{time.seconds}</span>
        <span className={`${isFs ? 'text-4xl' : 'text-xl sm:text-2xl md:text-3xl'} ${t.textMuted} ml-1`}>.{time.centiseconds}</span>
      </div>

      {/* Running indicator */}
      {isRunning && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className={`text-xs ${t.textMuted}`}>Recording</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {isRunning ? (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={lap}
              className={`p-2.5 sm:p-3 rounded-2xl ${t.surface} border ${t.border} ${t.textSecondary} hover:text-white transition-colors`}
              title="Lap"
            >
              <Flag size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={pause}
              className="p-3.5 sm:p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-lg shadow-amber-500/25"
              title="Pause"
            >
              <Pause size={22} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setFullscreen(!isFullscreen)}
              className={`p-2.5 sm:p-3 rounded-2xl ${t.surface} border ${t.border} ${t.textSecondary} hover:text-white transition-colors`}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleReset}
              className={`p-2.5 sm:p-3 rounded-2xl ${t.surface} border ${t.border} ${t.textSecondary} hover:text-white transition-colors`}
              title="Reset"
            >
              <RotateCcw size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={resume}
              className="p-3.5 sm:p-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-lg shadow-blue-500/25"
              title="Resume"
            >
              <Play size={22} />
            </motion.button>
            {elapsed > 0 && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleSave}
                className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-lg shadow-emerald-500/25"
                title="Save session"
              >
                <Save size={18} />
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Laps */}
      {laps.length > 0 && !isFs && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-sm ${t.card} border ${t.cardBorder} rounded-xl overflow-hidden`}
        >
          <div className={`px-4 py-2.5 border-b ${t.border} flex items-center justify-between`}>
            <p className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted}`}>Laps</p>
            <span className={`text-xs ${t.textMuted}`}>{laps.length}</span>
          </div>
          <div className="max-h-40 sm:max-h-48 overflow-y-auto">
            {[...laps].reverse().map((l, ri) => {
              const i = laps.length - 1 - ri;
              const lapTime = formatMs(i === 0 ? l : l - laps[i - 1]);
              return (
                <div key={i} className={`px-4 py-2 flex items-center justify-between border-b ${t.border} last:border-0`}>
                  <span className={`text-xs ${t.textSecondary}`}>Lap {i + 1}</span>
                  <span className={`text-xs font-mono ${t.text}`}>
                    {lapTime.minutes}:{lapTime.seconds}.{lapTime.centiseconds}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Fullscreen active
  if (isFullscreen && hasStarted) {
    return (
      <div className={`fixed inset-0 z-50 ${t.bg} flex items-center justify-center`}>
        <button
          onClick={() => setFullscreen(false)}
          className={`absolute top-6 right-6 p-2 rounded-lg ${t.surface} ${t.textSecondary} hover:text-white transition-colors z-10`}
        >
          <Minimize2 size={18} />
        </button>
        <StopwatchDisplay isFs />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full relative px-4">
      {!hasStarted ? (
        // Session Setup
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 sm:gap-6 w-full max-w-md"
        >
          <div className="text-center mb-1 sm:mb-2">
            <h2 className={`text-lg sm:text-xl font-semibold ${t.text}`}>New Session</h2>
            <p className={`text-xs sm:text-sm ${t.textMuted} mt-1`}>What are you working on?</p>
          </div>

          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="e.g., Physics Study, Website Design..."
            className={`w-full ${t.inputBg} border ${t.border} rounded-xl px-4 py-3 ${t.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-center`}
          />

          <div className="flex flex-wrap justify-center gap-2">
            {sessionCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSessionCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                  sessionCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} border-blue-500/30 text-blue-400`
                    : `${t.inputBg} ${t.border} ${t.textSecondary}`
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/25 mt-2"
          >
            <Play size={18} /> Start Session
          </motion.button>
        </motion.div>
      ) : (
        <StopwatchDisplay />
      )}

      {/* Saved Toast */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-sm font-medium shadow-xl z-50"
          >
            ✓ Session saved to history
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
