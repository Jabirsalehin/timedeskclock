import { useState } from 'react';
import { useStore, type Alarm } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, AlarmClock, X } from 'lucide-react';

const categories = [
  { id: 'wakeup', label: 'Wake Up', emoji: '🌅' },
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'meeting', label: 'Meeting', emoji: '💼' },
  { id: 'prayer', label: 'Prayer', emoji: '🕌' },
  { id: 'workout', label: 'Workout', emoji: '💪' },
  { id: 'custom', label: 'Custom', emoji: '⏰' },
] as const;

export default function AlarmView() {
  const { alarms, addAlarm, removeAlarm, toggleAlarm, theme } = useStore();
  const t = getTheme(theme);
  const [showForm, setShowForm] = useState(false);
  const [newTime, setNewTime] = useState('07:00');
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<Alarm['category']>('wakeup');
  const [newRecurring, setNewRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleAdd = () => {
    if (!newTime) return;
    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newTime,
      label: newLabel || categories.find(c => c.id === newCategory)?.label || 'Alarm',
      category: newCategory,
      enabled: true,
      recurring: newRecurring,
      days: selectedDays,
      sound: 'default',
    };
    addAlarm(alarm);
    setShowForm(false);
    setNewTime('07:00');
    setNewLabel('');
    setNewCategory('wakeup');
    setNewRecurring(false);
    setSelectedDays([]);
  };

  const getCategoryInfo = (id: string) => categories.find(c => c.id === id) || categories[5];

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-xl font-semibold ${t.text}`}>Alarms</h1>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{alarms.length} alarm{alarms.length !== 1 ? 's' : ''} set</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Alarm
        </button>
      </div>

      {/* Alarm List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <AnimatePresence>
          {alarms.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 gap-3"
            >
              <AlarmClock size={40} className={t.textMuted} />
              <p className={`${t.textSecondary} text-sm`}>No alarms set</p>
              <p className={`${t.textMuted} text-xs`}>Tap "Add Alarm" to create one</p>
            </motion.div>
          )}
          {alarms.map((alarm) => {
            const cat = getCategoryInfo(alarm.category);
            return (
              <motion.div
                key={alarm.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`${t.card} border ${t.cardBorder} rounded-xl p-4 flex items-center justify-between group`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <p className={`font-mono text-2xl font-semibold ${alarm.enabled ? t.text : t.textMuted}`}>
                      {alarm.time}
                    </p>
                    <p className={`text-xs ${t.textSecondary}`}>
                      {alarm.label}
                      {alarm.recurring && (
                        <span className={`ml-2 ${t.textMuted}`}>
                          • {alarm.days.map(d => days[d]).join(', ') || 'Every day'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      alarm.enabled ? 'bg-blue-500' : `${t.inputBg} border ${t.border}`
                    }`}
                  >
                    <motion.div
                      animate={{ x: alarm.enabled ? 20 : 2 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                    />
                  </button>
                  <button
                    onClick={() => removeAlarm(alarm.id)}
                    className={`p-1.5 rounded-lg ${t.textMuted} hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${t.card} border ${t.cardBorder} rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-lg font-semibold ${t.text}`}>New Alarm</h2>
                <button onClick={() => setShowForm(false)} className={`${t.textMuted} hover:text-white p-1`}>
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className={`w-full ${t.inputBg} border ${t.border} rounded-xl px-4 py-3 ${t.text} text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Label</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Alarm label..."
                    className={`w-full ${t.inputBg} border ${t.border} rounded-xl px-4 py-2.5 ${t.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:${t.textMuted}`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewCategory(cat.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                          newCategory === cat.id
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                            : `${t.inputBg} ${t.border} ${t.textSecondary}`
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${t.textSecondary}`}>Recurring</span>
                  <button
                    onClick={() => setNewRecurring(!newRecurring)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      newRecurring ? 'bg-blue-500' : `${t.inputBg} border ${t.border}`
                    }`}
                  >
                    <motion.div
                      animate={{ x: newRecurring ? 20 : 2 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                    />
                  </button>
                </div>

                {newRecurring && (
                  <div className="flex gap-1.5">
                    {days.map((day, i) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDays(
                          selectedDays.includes(i)
                            ? selectedDays.filter(d => d !== i)
                            : [...selectedDays, i]
                        )}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          selectedDays.includes(i)
                            ? 'bg-blue-500 text-white'
                            : `${t.inputBg} ${t.textSecondary}`
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleAdd}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors mt-2"
                >
                  Set Alarm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
