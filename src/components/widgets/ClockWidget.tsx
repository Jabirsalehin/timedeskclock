import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import { useTime, formatTime, getAmPm, formatDate } from '../../hooks/useTime';
import WidgetWrapper from './WidgetWrapper';
import { Clock, Maximize2 } from 'lucide-react';

interface ClockWidgetProps {
  widget: Widget;
}

export default function ClockWidget({ widget }: ClockWidgetProps) {
  const { theme, timeFormat, showSeconds, dateFormat, setFullscreen, setCurrentView } = useStore();
  const t = getTheme(theme);
  const now = useTime();
  
  const timeStr = formatTime(now, timeFormat, showSeconds);
  const dateStr = formatDate(now, dateFormat);
  const isPrimary = widget.size === 'full' || widget.size === 'large';

  return (
    <WidgetWrapper
      widget={widget}
      title="Clock"
      icon={<Clock size={14} />}
      allowCollapse={false}
      actions={
        <button
          onClick={() => { setCurrentView('clock'); setFullscreen(true); }}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <Maximize2 size={12} />
        </button>
      }
    >
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className={`font-mono font-bold ${t.text} ${
              isPrimary 
                ? 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl' 
                : 'text-3xl sm:text-4xl md:text-5xl'
            }`}>
              {timeStr}
            </span>
            {timeFormat === '12h' && (
              <span className={`text-blue-400 font-mono font-medium ${
                isPrimary ? 'text-xl md:text-2xl' : 'text-sm md:text-base'
              }`}>
                {getAmPm(now)}
              </span>
            )}
          </div>
          <p className={`${t.textSecondary} mt-2 ${
            isPrimary ? 'text-sm md:text-base' : 'text-xs md:text-sm'
          }`}>
            {dateStr}
          </p>
        </div>
      </div>
    </WidgetWrapper>
  );
}
