import { useState } from 'react';
import { useStore, type Task } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckSquare, Check, Play, X } from 'lucide-react';

const taskCategories = [
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'coding', label: 'Coding', emoji: '💻' },
  { id: 'personal', label: 'Personal', emoji: '🏠' },
  { id: 'health', label: 'Health', emoji: '🏃' },
  { id: 'other', label: 'Other', emoji: '📝' },
];

export default function TasksView() {
  const { tasks, addTask, updateTask, removeTask, toggleTask, theme, setCurrentView } = useStore();
  const t = getTheme(theme);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('other');
  const [newDueTime, setNewDueTime] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    if (editingTaskId) {
      const existing = tasks.find((t) => t.id === editingTaskId);
      if (existing) {
        updateTask({
          ...existing,
          title: newTitle.trim(),
          dueTime: newDueTime || undefined,
          category: newCategory,
        });
      }
    } else {
      const task: Task = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        dueTime: newDueTime || undefined,
        category: newCategory,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      addTask(task);
    }

    setShowForm(false);
    setEditingTaskId(null);
    setNewTitle('');
    setNewDueTime('');
    setNewCategory('other');
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getCat = (id: string) => taskCategories.find(c => c.id === id) || taskCategories[5];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-xl font-semibold ${t.text}`}>Tasks</h1>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{activeTasks.length} active · {completedTasks.length} done</p>
        </div>
        <button
          onClick={() => {
            setEditingTaskId(null);
            setNewTitle('');
            setNewCategory('other');
            setNewDueTime('');
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Filter */}
      <div className={`flex items-center gap-1 ${t.surface} rounded-xl p-1 border ${t.border} mb-4 w-fit`}>
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              filter === f ? 'bg-blue-500 text-white' : `${t.textSecondary} hover:text-white`
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <CheckSquare size={40} className={t.textMuted} />
            <p className={`${t.textSecondary} text-sm`}>No tasks yet</p>
          </div>
        )}
        <AnimatePresence>
          {filteredTasks.map((task) => {
            const cat = getCat(task.category);
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`${t.card} border ${t.cardBorder} rounded-xl p-3.5 flex items-center gap-3 group ${task.completed ? 'opacity-50' : ''}`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-blue-500 border-blue-500'
                      : `${t.border} hover:border-blue-400`
                  }`}
                >
                  {task.completed && <Check size={12} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through' : ''} ${t.text} truncate`}>
                    {cat.emoji} {task.title}
                  </p>
                  {task.dueTime && (
                    <p className={`text-xs ${t.textMuted} mt-0.5`}>
                      Due: {new Date(task.dueTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setShowForm(true);
                    setNewTitle(task.title);
                    setNewCategory(task.category);
                    setNewDueTime(task.dueTime || '');
                  }}
                  className={`p-1.5 rounded-lg ${t.textMuted} hover:text-blue-400 transition-colors`}
                  title="Edit task"
                >
                  <Plus size={14} />
                </button>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!task.completed && (
                    <button
                      onClick={() => setCurrentView('stopwatch')}
                      className={`p-1.5 rounded-lg ${t.textMuted} hover:text-blue-400 transition-colors`}
                      title="Start session"
                    >
                      <Play size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => removeTask(task.id)}
                    className={`p-1.5 rounded-lg ${t.textMuted} hover:text-red-400 transition-colors`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quick Add */}
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
                <h2 className={`text-lg font-semibold ${t.text}`}>{editingTaskId ? 'Edit Task' : 'New Task'}</h2>
                <button onClick={() => setShowForm(false)} className={`${t.textMuted} hover:text-white p-1`}>
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Task</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What needs to be done?"
                    autoFocus
                    className={`w-full ${t.inputBg} border ${t.border} rounded-xl px-4 py-2.5 ${t.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Due Date (optional)</label>
                  <input
                    type="datetime-local"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className={`w-full ${t.inputBg} border ${t.border} rounded-xl px-4 py-2.5 ${t.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium ${t.textSecondary} block mb-1.5`}>Category</label>
                  <div className="flex flex-wrap gap-2">
                    {taskCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
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

                <button
                  onClick={handleAdd}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors mt-2"
                >
                  {editingTaskId ? 'Save Task' : 'Add Task'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
