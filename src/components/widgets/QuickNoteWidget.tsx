import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import WidgetWrapper from './WidgetWrapper';
import { Edit3, Save, Trash2 } from 'lucide-react';

interface QuickNoteWidgetProps {
  widget: Widget;
}

export default function QuickNoteWidget({ widget }: QuickNoteWidgetProps) {
  const { theme } = useStore();
  const t = getTheme(theme);
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  
  // Load note from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('timedesk-quicknote');
    if (saved) setNote(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem('timedesk-quicknote', note);
    setIsSaved(true);
  };

  const handleClear = () => {
    setNote('');
    localStorage.removeItem('timedesk-quicknote');
    setIsSaved(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    setIsSaved(false);
  };

  return (
    <WidgetWrapper
      widget={widget}
      title="Quick Note"
      icon={<Edit3 size={14} />}
      actions={
        <div className="flex items-center gap-1">
          {!isSaved && (
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              title="Save"
            >
              <Save size={12} />
            </button>
          )}
          {note && (
            <button
              onClick={handleClear}
              className={`p-1.5 rounded-lg ${t.textMuted} hover:text-red-400 transition-colors`}
              title="Clear"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      }
      noPadding
    >
      <div className="h-full flex flex-col">
        <textarea
          value={note}
          onChange={handleChange}
          onBlur={handleSave}
          placeholder="Quick thoughts, ideas, notes..."
          className={`flex-1 w-full resize-none ${t.inputBg} border-0 p-4 text-sm ${t.text} placeholder:${t.textMuted} focus:outline-none`}
        />
        {!isSaved && (
          <div className={`px-4 py-1 text-[10px] ${t.textMuted} border-t ${t.border}`}>
            Press save or click away to save
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}
