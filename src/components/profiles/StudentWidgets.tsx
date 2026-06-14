import { memo, useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useProfileStore, profileConfigs } from '../../store/profileStore';
import { themeExperiences, type ThemeExperienceId } from '../../utils/themeExperience';
import { usePreciseTime, usePreciseTimer, usePreciseStopwatch } from '../../hooks/usePreciseTime';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, BookOpen, Target, Clock, CheckCircle2, Bell } from 'lucide-react';

const accent = profileConfigs.student.accentColor;

// Pomodoro Widget
const PomodoroWidget = memo(function PomodoroWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const [isBreak, setIsBreak] = useState(false);
  const { isRunning, remaining, totalDuration, isComplete, startTimer, pauseTimer, resumeTimer, resetTimer } = usePreciseTimer();

  const workDuration = 25 * 60 * 1000;
  const breakDuration = 5 * 60 * 1000;

  const handleStart = () => {
    setIsBreak(false);
    startTimer(workDuration);
  };

  const handleStartBreak = () => {
    setIsBreak(true);
    startTimer(breakDuration);
  };

  const progress = totalDuration > 0 ? (remaining / totalDuration) * 100 : 0;
  const minutes = Math.floor(Math.max(0, remaining / 1000) / 60);
  const seconds = Math.floor(Math.max(0, remaining / 1000) % 60);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Target size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Pomodoro
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto" style={{ 
          background: isBreak ? 'rgba(16, 185, 129, 0.2)' : `${accent}20`,
          color: isBreak ? '#10b981' : accent 
        }}>
          {isBreak ? 'Break' : 'Focus'}
        </span>
      </div>

      <div className="text-center">
        <span 
          className="text-3xl font-mono font-bold"
          style={{ color: te.colors.text }}
        >
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
        <div 
          className="h-1 rounded-full mt-2 overflow-hidden"
          style={{ background: te.colors.bg }}
        >
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              background: isBreak ? '#10b981' : accent 
            }}
          />
        </div>
        <p className="text-[10px] mt-1" style={{ color: te.colors.textMuted }}>
          {isComplete ? 'Session complete' : isRunning ? 'Running' : 'Ready to start'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        <button 
          onClick={handleStart}
          className="p-2 rounded-lg text-white"
          style={{ background: accent }}
        >
          Focus
        </button>
        <button 
          onClick={handleStartBreak}
          className="p-2 rounded-lg text-white"
          style={{ background: '#10b981' }}
        >
          Break
        </button>
        {isRunning && (
          <button 
            onClick={pauseTimer}
            className="p-2 rounded-lg border"
            style={{ borderColor: te.colors.border, color: te.colors.text }}
          >
            Pause
          </button>
        )}
        {totalDuration > 0 && (
          <button 
            onClick={resetTimer}
            className="p-2 rounded-lg border"
            style={{ borderColor: te.colors.border, color: te.colors.text }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
});

// Study Tasks Widget
const StudyTasksWidget = memo(function StudyTasksWidget() {
  const { themeExperience, tasks, toggleTask } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  
  const studyTasks = tasks.filter((t: any) => 
    t.category === 'study' || t.title.toLowerCase().includes('study')
  ).slice(0, 4);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Study Tasks
        </span>
        <span className="text-[10px] ml-auto" style={{ color: te.colors.textMuted }}>
          {studyTasks.filter((t: any) => !t.completed).length} remaining
        </span>
      </div>

      {studyTasks.length === 0 ? (
        <p className="text-xs text-center py-2" style={{ color: te.colors.textMuted }}>
          No study tasks
        </p>
      ) : (
        <div className="space-y-1.5">
          {studyTasks.map((task: any) => (
            <div 
              key={task.id}
              className="flex items-center gap-2 py-1"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
                style={{ 
                  borderColor: task.completed ? accent : te.colors.border,
                  background: task.completed ? accent : 'transparent'
                }}
              >
                {task.completed && <CheckCircle2 size={10} className="text-white" />}
              </button>
              <span 
                className={`text-xs truncate ${task.completed ? 'line-through' : ''}`}
                style={{ color: task.completed ? te.colors.textMuted : te.colors.text }}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Focus Hours Widget
const FocusHoursWidget = memo(function FocusHoursWidget() {
  const { themeExperience, sessions } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const todayMinutes = useMemo(() => {
    const today = now.toDateString();
    return sessions
      .filter((s: any) => new Date(s.date).toDateString() === today)
      .reduce((sum: number, s: any) => sum + s.duration, 0) / 60;
  }, [sessions, now.toDateString()]);

  const hours = Math.floor(todayMinutes / 60);
  const mins = Math.round(todayMinutes % 60);
  const goal = 4; // 4 hours daily goal
  const progress = Math.min((todayMinutes / 60 / goal) * 100, 100);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Focus Today
        </span>
      </div>

      <div className="text-center">
        <span 
          className="text-2xl font-bold"
          style={{ color: te.colors.text }}
        >
          {hours}h {mins}m
        </span>
        <div 
          className="h-1 rounded-full mt-2 overflow-hidden"
          style={{ background: te.colors.bg }}
        >
          <motion.div 
            className="h-full rounded-full"
            style={{ background: accent }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] mt-1" style={{ color: te.colors.textMuted }}>
          Goal: {goal}h daily
        </p>
      </div>
    </div>
  );
});

// Exam Countdown Widget
const ExamCountdownWidget = memo(function ExamCountdownWidget() {
  const { themeExperience } = useStore();
  const { examDate, setExamDate } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const now = usePreciseTime();

  const daysLeft = useMemo(() => {
    if (!examDate) return null;
    const exam = new Date(examDate);
    const diff = exam.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [examDate, now.toDateString()]);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Target size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Exam Countdown
        </span>
      </div>

      {daysLeft !== null ? (
        <div className="text-center">
          <span 
            className="text-3xl font-bold"
            style={{ color: daysLeft <= 7 ? '#ef4444' : te.colors.text }}
          >
            {daysLeft}
          </span>
          <p className="text-xs" style={{ color: te.colors.textSecondary }}>
            days remaining
          </p>
        </div>
      ) : (
        <input
          type="date"
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full text-xs p-2 rounded-lg border"
          style={{ 
            background: te.colors.bg, 
            borderColor: te.colors.border,
            color: te.colors.text 
          }}
          placeholder="Set exam date"
        />
      )}
    </div>
  );
});

// Study Session Stopwatch
const StudyStopwatchWidget = memo(function StudyStopwatchWidget() {
  const { themeExperience } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const { isRunning, elapsed, start, pause, resume, reset } = usePreciseStopwatch();

  const formatElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Study Session
        </span>
      </div>
      <span className="text-2xl font-mono font-bold block text-center" style={{ color: te.colors.text }}>
        {formatElapsed(elapsed)}
      </span>
      <div className="flex justify-center gap-2 mt-2">
        {!isRunning ? (
          <button onClick={start} className="p-2 rounded-lg text-white" style={{ background: accent }}>
            <Play size={14} />
          </button>
        ) : (
          <button onClick={pause} className="p-2 rounded-lg text-white" style={{ background: accent }}>
            <Pause size={14} />
          </button>
        )}
        <button onClick={reset} className="p-2 rounded-lg border" style={{ borderColor: te.colors.border, color: te.colors.text }}>
          Reset
        </button>
      </div>
    </div>
  );
});

// Study Reminders Widget
const StudyRemindersWidget = memo(function StudyRemindersWidget() {
  const { themeExperience, reminders } = useStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];

  const studyReminders = reminders
    .filter((r) => r.category === 'study' || r.title.toLowerCase().includes('study'))
    .slice(0, 3);

  return (
    <div
      className="p-4 rounded-xl border"
      style={{ background: te.colors.surface, borderColor: te.colors.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Bell size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: te.colors.text }}>
          Study Reminders
        </span>
      </div>
      {studyReminders.length === 0 ? (
        <p className="text-[10px] text-center" style={{ color: te.colors.textMuted }}>
          No study reminders
        </p>
      ) : (
        <div className="space-y-1">
          {studyReminders.map((rem) => (
            <p key={rem.id} className="text-[10px] truncate" style={{ color: te.colors.text }}>
              📚 {rem.title}
            </p>
          ))}
        </div>
      )}
    </div>
  );
});

export default function StudentWidgets() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
      <StudyTasksWidget />
      <PomodoroWidget />
      <StudyStopwatchWidget />
      <FocusHoursWidget />
      <ExamCountdownWidget />
      <StudyRemindersWidget />
    </div>
  );
}
