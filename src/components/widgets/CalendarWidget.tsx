import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import WidgetWrapper from './WidgetWrapper';
import { Calendar } from 'lucide-react';

interface CalendarWidgetProps {
  widget: Widget;
}

export default function CalendarWidget({ widget }: CalendarWidgetProps) {
  const { theme } = useStore();
  const t = getTheme(theme);
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Create calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const isLarge = widget.size === 'large' || widget.size === 'full';

  return (
    <WidgetWrapper
      widget={widget}
      title="Calendar"
      icon={<Calendar size={14} />}
      allowCollapse={false}
    >
      <div className="h-full flex flex-col">
        {/* Month Header */}
        <div className="text-center mb-3">
          <p className={`text-sm font-semibold ${t.text}`}>{monthName}</p>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day, i) => (
            <div 
              key={i} 
              className={`text-center text-[10px] font-medium ${t.textMuted} py-1`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {calendarDays.slice(0, isLarge ? undefined : 35).map((day, i) => {
            const isToday = day === today.getDate();
            return (
              <div
                key={i}
                className={`
                  flex items-center justify-center text-[11px] rounded-lg transition-colors
                  ${day === null 
                    ? '' 
                    : isToday 
                      ? 'bg-blue-500 text-white font-semibold'
                      : `${t.text} ${t.surfaceHover} hover:cursor-pointer`
                  }
                `}
                style={{ aspectRatio: isLarge ? '1' : 'auto', minHeight: isLarge ? undefined : '24px' }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </WidgetWrapper>
  );
}
