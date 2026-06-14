import { useState } from 'react';
import { useStore, type Reminder } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Bell, X, Check } from 'lucide-react';

const categories = [
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'prayer', label: 'Prayer', emoji: '🕌' },
  { id: 'medicine', label: 'Medicine', emoji: '💊' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'trading', label: 'Trading', emoji: '📈' },
  { id: 'fitness', label: 'Fitness', emoji: '🏋️' },
  { id: 'custom', label: 'Custom', emoji: '📝' },
] as const;

export default function ReminderView() {
  const { reminders, addReminder, updateReminder, removeReminder, toggleReminder, theme } = useStore();
  const t = getTheme(theme);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDatetime, setNewDatetime] = useState('');
  const [newCategory, setNewCategory] = useState<Reminder['category']>('work');
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newTitle || !newDatetime) return;

    if (editingReminderId) {
      const existing = reminders.find((r) => r.id === editingReminderId);
      if (existing) {
        updateReminder({
          ...existing,
          title: newTitle,
          datetime: newDatetime,
          category: newCategory,
        });
      }
    } else {
      const reminder: Reminder = {
        id: Date.now().toString(),
        title: newTitle,
        datetime: newDatetime,
        category: newCategory,
        recurring: false,
        completed: false,
      };
      addReminder(reminder);
    }

    setShowForm(false);
    setEditingReminderId(null);
    setNewTitle('');
    setNewDatetime('');
    setNewCategory('work');
  };

  const active = reminders.filter(r => !r.completed);
  const completed = reminders.filter(r => r.completed);
  const getCat = (id: string) => categories.find(c => c.id === id) || categories[7];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-xl font-semibold ${t.text}`}>Reminders</h1>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{active.length} active</p>
        </div>
        <button
          onClick={() => {
            setEditingReminderId(null);
            setNewTitle('');
            setNewDatetime('');
            setNewCategory('work');
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Reminder
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {reminders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Bell size={40} className={t.textMuted} />
            <p className={`${t.textSecondary} text-sm`}>No reminders</p>
          </div>
        )}
        
        {active.length > 0 && (
          <div className="space-y-2">
            {active.map((rem) => {
              const cat = getCat(rem.category);
              const dt = new Date(rem.datetime);
              return (
                <motion.div
                  key={rem.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${t.card} border ${t.cardBorder} rounded-xl p-4 flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className={`w-5 h-5 rounded-md border-2 ${t.border} flex items-center justify-center hover:border-blue-400 transition-colors`}
                    >
                    </button>
                    <span className="text-xl">{cat.emoji}</span>
                    <div>
                      <p className={`text-sm font-medium ${t.text}`}>{rem.title}</p>
                      <p className={`text-xs ${t.textMuted}`}>
                        {dt.toLocaleDateString()} at {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => {
                        setEditingReminderId(rem.id);
                        setShowForm(true);
                        setNewTitle(rem.title);
                        setNewDatetime(rem.datetime);
                        setNewCategory(rem.category);
                      }}
                      className={`p-1.5 rounded-lg ${t.textMuted} hover:text-blue-400 transition-colors`}
                      title="Edit reminder"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeReminder(rem.id)}
                      className={`p-1.5 rounded-lg ${t.textMuted} hover:text-red-400 transition-all`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-6">
            <p className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted} mb-2`}>Completed</p>
            <div className="space-y-2">
              {completed.map((rem) => {
                const cat = getCat(rem.category);
                return (
                  <motion.div
                    key={rem.id}
                    layout
                    className={`${t.card} border ${t.cardBorder} rounded-xl p-4 flex items-center justify-between opacity-50 group`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleReminder(rem.id)}
                        className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center"
                      >
                        <Check size={12} className="text-white" />
                      </button>
                      <span className="text-xl">{cat.emoji}</span>
                      <p className={`text-sm font-medium ${t.text} line-through`}>{rem.title}</p>
                    </div>
                    <button
                      onClick={() => removeReminder(rem.id)}
                      className={`p-1.5 rounded-lg ${t.textMuted} hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

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
                <h2 className={`text-lg font-semibold ${t.text}`}>{editingReminderId ? 'Edit Reminder' : 'New Reminder'}</h2>
                <button onClick={() => {
                  setShowForm(false);
                  setEditingReminderId(null);
                  setNewTitle('');
                  setNewDatetime('');
                  setNewCategory('work');
                }} className={`${t.textMuted} hover:text-white p-1`}>
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What to remember..."
                    className={`w-full ${t.inputBg} border ${t.border} rounded-xl px-4 py-2.5 ${t.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newDatetime}
                    onChange={(e) => setNewDatetime(e.target.value)}
                    className={`w-full ${t.inputBg} border ${t.border} rounded-xl px-4 py-2.5 ${t.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewCategory(cat.id)}
                        className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-[10px] font-medium transition-all border ${
                          newCategory === cat.id
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                            : `${t.inputBg} ${t.border} ${t.textSecondary}`
                        }`}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors mt-2"
                >
                  {editingReminderId ? 'Save Reminder' : 'Set Reminder'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
