import { useStore } from '../store/useStore';
import { useWidgetStore, type FloatingWidget } from '../store/widgetStore';
import { useProfileStore } from '../store/profileStore';
import { getTheme } from '../utils/theme';
import { useTime, formatTime, getAmPm, formatMs } from '../hooks/useTime';
import { useStopwatch, useCountdownTimer } from '../hooks/useTime';
import { usePreciseTime } from '../hooks/usePreciseTime';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Pin, PinOff, Move } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FloatingWidgetContainerProps {
  widget: FloatingWidget;
  children: React.ReactNode;
  title: string;
}

function FloatingWidgetContainer({ widget, children, title }: FloatingWidgetContainerProps) {
  const { theme } = useStore();
  const { updateFloatingWidget, removeFloatingWidget } = useWidgetStore();
  const t = getTheme(theme);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: widget.position.x,
      startPosY: widget.position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      updateFloatingWidget(widget.id, {
        position: {
          x: Math.max(0, dragRef.current.startPosX + deltaX),
          y: Math.max(0, dragRef.current.startPosY + deltaY),
        },
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, widget.id, updateFloatingWidget]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: widget.opacity, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed z-[60] ${t.card} border ${t.cardBorder} rounded-2xl shadow-2xl overflow-hidden`}
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        minHeight: widget.size.height,
      }}
    >
      {/* Header */}
      <div
        onMouseDown={handleMouseDown}
        className={`flex items-center justify-between px-3 py-2 border-b ${t.border} cursor-move select-none`}
      >
        <div className="flex items-center gap-2">
          <Move size={10} className={t.textMuted} />
          <span className={`text-xs font-medium ${t.text}`}>{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateFloatingWidget(widget.id, { alwaysOnTop: !widget.alwaysOnTop })}
            className={`p-1 rounded ${widget.alwaysOnTop ? 'text-blue-400' : t.textMuted} hover:text-white transition-colors`}
            title={widget.alwaysOnTop ? 'Unpin' : 'Pin on top'}
          >
            {widget.alwaysOnTop ? <Pin size={10} /> : <PinOff size={10} />}
          </button>
          <button
            onClick={() => updateFloatingWidget(widget.id, { visible: false })}
            className={`p-1 rounded ${t.textMuted} hover:text-white transition-colors`}
            title="Minimize"
          >
            <Minimize2 size={10} />
          </button>
          <button
            onClick={() => removeFloatingWidget(widget.id)}
            className={`p-1 rounded ${t.textMuted} hover:text-red-400 transition-colors`}
            title="Close"
          >
            <X size={10} />
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="p-3">{children}</div>
    </motion.div>
  );
}

function FloatingClockContent() {
  const { theme, timeFormat, showSeconds } = useStore();
  const t = getTheme(theme);
  const now = useTime();
  const timeStr = formatTime(now, timeFormat, showSeconds);

  return (
    <div className="text-center">
      <div className="flex items-baseline justify-center gap-1">
        <span className={`font-mono text-2xl font-bold ${t.text}`}>{timeStr}</span>
        {timeFormat === '12h' && (
          <span className="text-blue-400 text-xs font-mono">{getAmPm(now)}</span>
        )}
      </div>
    </div>
  );
}

function FloatingStopwatchContent() {
  const { theme } = useStore();
  const t = getTheme(theme);
  const { isRunning, elapsed, start, pause, resume, reset } = useStopwatch();
  const time = formatMs(elapsed);
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="text-center space-y-2">
      <div className="flex items-baseline justify-center gap-0.5 font-mono">
        <span className={`text-xl font-bold ${t.text}`}>{time.minutes}</span>
        <span className={`text-sm ${t.textMuted}`}>:</span>
        <span className={`text-xl font-bold ${t.text}`}>{time.seconds}</span>
        <span className={`text-xs ${t.textMuted}`}>.{time.centiseconds}</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        {!hasStarted ? (
          <button
            onClick={() => { setHasStarted(true); start(); }}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg"
          >
            Start
          </button>
        ) : (
          <>
            <button
              onClick={() => { reset(); setHasStarted(false); }}
              className={`px-2 py-1 ${t.surface} text-xs rounded-lg ${t.textSecondary}`}
            >
              Reset
            </button>
            <button
              onClick={isRunning ? pause : resume}
              className={`px-3 py-1 ${isRunning ? 'bg-amber-500' : 'bg-blue-500'} text-white text-xs rounded-lg`}
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FloatingTimerContent() {
  const { theme } = useStore();
  const t = getTheme(theme);
  const { isRunning, remaining, totalDuration, isComplete, startTimer, pauseTimer, resumeTimer, resetTimer } = useCountdownTimer();
  const time = formatMs(remaining);
  const hasStarted = totalDuration > 0;

  return (
    <div className="text-center space-y-2">
      {!hasStarted ? (
        <div className="flex flex-wrap justify-center gap-1">
          {[5, 10, 15, 25].map((min) => (
            <button
              key={min}
              onClick={() => startTimer(min * 60 * 1000)}
              className={`px-2 py-1 ${t.surface} text-xs rounded-lg ${t.textSecondary} ${t.surfaceHover}`}
            >
              {min}m
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-center gap-0.5 font-mono">
            <span className={`text-xl font-bold ${isComplete ? 'text-red-400' : t.text}`}>
              {time.minutes}
            </span>
            <span className={`text-sm ${t.textMuted}`}>:</span>
            <span className={`text-xl font-bold ${isComplete ? 'text-red-400' : t.text}`}>
              {time.seconds}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={resetTimer}
              className={`px-2 py-1 ${t.surface} text-xs rounded-lg ${t.textSecondary}`}
            >
              Reset
            </button>
            {!isComplete && (
              <button
                onClick={isRunning ? pauseTimer : resumeTimer}
                className={`px-3 py-1 ${isRunning ? 'bg-amber-500' : 'bg-blue-500'} text-white text-xs rounded-lg`}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function FloatingPomodoroContent() {
  const { theme } = useStore();
  const t = getTheme(theme);
  const [isBreak, setIsBreak] = useState(false);
  const { isRunning, remaining, totalDuration, isComplete, startTimer, pauseTimer, resumeTimer, resetTimer } = useCountdownTimer();
  const time = formatMs(remaining);
  const hasStarted = totalDuration > 0;

  const startWork = () => {
    setIsBreak(false);
    startTimer(25 * 60 * 1000);
  };

  const startBreak = () => {
    setIsBreak(true);
    startTimer(5 * 60 * 1000);
  };

  useEffect(() => {
    if (isComplete && hasStarted) {
      // Could add sound notification here
    }
  }, [isComplete, hasStarted]);

  return (
    <div className="text-center space-y-2">
      {!hasStarted ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={startWork}
            className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg"
          >
            Start Work (25m)
          </button>
          <button
            onClick={startBreak}
            className={`px-3 py-1.5 ${t.surface} text-xs rounded-lg ${t.textSecondary}`}
          >
            Start Break (5m)
          </button>
        </div>
      ) : (
        <>
          <p className={`text-[10px] ${isBreak ? 'text-emerald-400' : 'text-blue-400'}`}>
            {isBreak ? '☕ Break Time' : '🎯 Focus Time'}
          </p>
          <div className="flex items-baseline justify-center gap-0.5 font-mono">
            <span className={`text-xl font-bold ${isComplete ? 'text-red-400' : t.text}`}>
              {time.minutes}:{time.seconds}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={resetTimer}
              className={`px-2 py-1 ${t.surface} text-xs rounded-lg ${t.textSecondary}`}
            >
              Reset
            </button>
            {!isComplete && (
              <button
                onClick={isRunning ? pauseTimer : resumeTimer}
                className={`px-3 py-1 ${isRunning ? 'bg-amber-500' : 'bg-blue-500'} text-white text-xs rounded-lg`}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function FloatingPrayerContent() {
  const { theme } = useStore();
  const { prayerTimes } = useProfileStore();
  const t = getTheme(theme);
  const now = usePreciseTime();

  const next = (() => {
    const current = now.getHours() * 60 + now.getMinutes();
    for (const [name, time] of Object.entries(prayerTimes)) {
      const [h, m] = time.split(':').map(Number);
      const mins = h * 60 + m;
      if (mins > current) {
        return { name: name.charAt(0).toUpperCase() + name.slice(1), time, left: mins - current };
      }
    }
    const [h, m] = prayerTimes.fajr.split(':').map(Number);
    return { name: 'Fajr', time: prayerTimes.fajr, left: 24 * 60 - current + h * 60 + m };
  })();

  return (
    <div className="text-center space-y-1">
      <p className={`text-[10px] ${t.textMuted}`}>Next Prayer</p>
      <p className={`text-sm font-semibold ${t.text}`}>🕌 {next.name}</p>
      <p className={`text-lg font-mono font-bold ${t.text}`}>{next.time}</p>
      <p className={`text-[10px] text-amber-400`}>
        in {Math.floor(next.left / 60)}h {next.left % 60}m
      </p>
    </div>
  );
}

function FloatingTaskContent() {
  const { theme, tasks, toggleTask } = useStore();
  const t = getTheme(theme);
  const pending = tasks.filter((task) => !task.completed).slice(0, 4);

  return (
    <div className="space-y-1.5">
      {pending.length === 0 ? (
        <p className={`text-xs text-center ${t.textMuted}`}>No pending tasks</p>
      ) : (
        pending.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`w-full flex items-center gap-2 text-left text-xs ${t.textSecondary}`}
          >
            <span className={`w-3 h-3 rounded border shrink-0 ${task.completed ? 'bg-blue-500 border-blue-500' : t.border}`} />
            <span className="truncate">{task.title}</span>
          </button>
        ))
      )}
    </div>
  );
}

function FloatingReminderContent() {
  const { theme, reminders } = useStore();
  const t = getTheme(theme);
  const upcoming = reminders.filter((r) => !r.completed).slice(0, 3);

  return (
    <div className="space-y-1.5">
      {upcoming.length === 0 ? (
        <p className={`text-xs text-center ${t.textMuted}`}>No reminders</p>
      ) : (
        upcoming.map((rem) => (
          <div key={rem.id} className={`text-xs truncate ${t.textSecondary}`}>
            🔔 {rem.title}
          </div>
        ))
      )}
    </div>
  );
}

function FloatingCountdownContent() {
  const { theme } = useStore();
  const { examDate } = useProfileStore();
  const t = getTheme(theme);
  const now = usePreciseTime();

  const daysLeft = examDate
    ? Math.ceil((new Date(examDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="text-center">
      <p className={`text-[10px] ${t.textMuted}`}>Countdown</p>
      {daysLeft !== null ? (
        <>
          <p className={`text-3xl font-bold ${t.text}`}>{daysLeft}</p>
          <p className={`text-[10px] ${t.textMuted}`}>days remaining</p>
        </>
      ) : (
        <p className={`text-xs ${t.textMuted}`}>Set a date in profile settings</p>
      )}
    </div>
  );
}

const floatingTitles: Record<FloatingWidget['type'], string> = {
  clock: 'Clock',
  stopwatch: 'Stopwatch',
  timer: 'Timer',
  pomodoro: 'Pomodoro',
  prayer: 'Prayer',
  task: 'Tasks',
  reminder: 'Reminders',
  countdown: 'Countdown',
};

export default function FloatingWidgets() {
  const { floatingWidgets } = useWidgetStore();
  const visibleWidgets = floatingWidgets.filter(w => w.visible);

  return (
    <AnimatePresence>
      {visibleWidgets.map((widget) => (
        <FloatingWidgetContainer
          key={widget.id}
          widget={widget}
          title={floatingTitles[widget.type]}
        >
          {widget.type === 'clock' && <FloatingClockContent />}
          {widget.type === 'stopwatch' && <FloatingStopwatchContent />}
          {widget.type === 'timer' && <FloatingTimerContent />}
          {widget.type === 'pomodoro' && <FloatingPomodoroContent />}
          {widget.type === 'prayer' && <FloatingPrayerContent />}
          {widget.type === 'task' && <FloatingTaskContent />}
          {widget.type === 'reminder' && <FloatingReminderContent />}
          {widget.type === 'countdown' && <FloatingCountdownContent />}
        </FloatingWidgetContainer>
      ))}
    </AnimatePresence>
  );
}
