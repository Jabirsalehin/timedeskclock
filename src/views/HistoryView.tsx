import { useStore } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { formatDuration } from '../hooks/useTime';
import { motion } from 'framer-motion';
import { History, Trash2, BarChart3, Clock, Flame } from 'lucide-react';

const categoryEmoji: Record<string, string> = {
  study: '📚', work: '💼', coding: '💻', trading: '📈',
  fitness: '🏋️', gaming: '🎮', reading: '📖', other: '⏱️',
};

export default function HistoryView() {
  const { sessions, clearSessions, theme } = useStore();
  const t = getTheme(theme);

  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = sessions.length;
  const avgDuration = totalSessions > 0 ? Math.floor(totalDuration / totalSessions) : 0;

  // Category breakdown
  const catBreakdown: Record<string, number> = {};
  sessions.forEach(s => {
    catBreakdown[s.category] = (catBreakdown[s.category] || 0) + s.duration;
  });
  const sortedCats = Object.entries(catBreakdown).sort((a, b) => b[1] - a[1]);

  // Last 7 days
  const today = new Date();
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const daySessions = sessions.filter(s => new Date(s.date).toDateString() === dateStr);
    const totalMin = daySessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), minutes: totalMin };
  });
  const maxMin = Math.max(...last7.map(d => d.minutes), 1);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-xl font-semibold ${t.text}`}>Session History</h1>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>Track your productivity</p>
        </div>
        {sessions.length > 0 && (
          <button
            onClick={clearSessions}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${t.surface} border ${t.border} ${t.danger} hover:opacity-80 transition-opacity`}
          >
            <Trash2 size={12} /> Clear All
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <History size={40} className={t.textMuted} />
          <p className={`${t.textSecondary} text-sm`}>No sessions recorded</p>
          <p className={`${t.textMuted} text-xs`}>Start a stopwatch or focus session</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`${t.card} border ${t.cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-blue-400" />
                <span className={`text-xs ${t.textMuted}`}>Total Time</span>
              </div>
              <p className={`text-lg font-semibold font-mono ${t.text}`}>{formatDuration(totalDuration)}</p>
            </div>
            <div className={`${t.card} border ${t.cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Flame size={14} className="text-orange-400" />
                <span className={`text-xs ${t.textMuted}`}>Sessions</span>
              </div>
              <p className={`text-lg font-semibold font-mono ${t.text}`}>{totalSessions}</p>
            </div>
            <div className={`${t.card} border ${t.cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={14} className="text-emerald-400" />
                <span className={`text-xs ${t.textMuted}`}>Avg Duration</span>
              </div>
              <p className={`text-lg font-semibold font-mono ${t.text}`}>{formatDuration(avgDuration)}</p>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5`}>
            <p className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted} mb-4`}>Last 7 Days</p>
            <div className="flex items-end justify-between gap-2 h-32">
              {last7.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-24">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.minutes / maxMin) * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="w-full max-w-[24px] rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 min-h-[2px]"
                    />
                  </div>
                  <span className={`text-[10px] ${t.textMuted}`}>{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          {sortedCats.length > 0 && (
            <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted} mb-4`}>By Category</p>
              <div className="space-y-3">
                {sortedCats.map(([cat, dur]) => {
                  const pct = totalDuration > 0 ? (dur / totalDuration) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${t.text}`}>{categoryEmoji[cat] || '⏱️'} {cat}</span>
                        <span className={`text-xs font-mono ${t.textSecondary}`}>{formatDuration(dur)}</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full ${t.inputBg}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full bg-blue-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Session List */}
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted} mb-3`}>All Sessions</p>
            <div className="space-y-2">
              {[...sessions].reverse().map((session) => (
                <div
                  key={session.id}
                  className={`${t.card} border ${t.cardBorder} rounded-xl p-3.5 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{categoryEmoji[session.category] || '⏱️'}</span>
                    <div>
                      <p className={`text-sm font-medium ${t.text}`}>{session.name}</p>
                      <p className={`text-xs ${t.textMuted}`}>
                        {new Date(session.date).toLocaleDateString()} · {session.laps.length > 0 ? `${session.laps.length} laps` : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-mono ${t.textSecondary}`}>{formatDuration(session.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
