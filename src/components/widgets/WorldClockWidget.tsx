import { useStore } from '../../store/useStore';
import { type Widget } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import { useTime } from '../../hooks/useTime';
import WidgetWrapper from './WidgetWrapper';
import { Globe2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface WorldClockWidgetProps {
  widget: Widget;
}

export default function WorldClockWidget({ widget }: WorldClockWidgetProps) {
  const { theme, worldClocks, timeFormat, setCurrentView } = useStore();
  const t = getTheme(theme);
  const now = useTime();
  
  const displayCities = worldClocks.slice(0, widget.size === 'small' ? 2 : widget.size === 'medium' ? 3 : 4);

  return (
    <WidgetWrapper
      widget={widget}
      title="World Clock"
      icon={<Globe2 size={14} />}
      actions={
        <button
          onClick={() => setCurrentView('worldclock')}
          className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
        >
          <Plus size={12} />
        </button>
      }
      noPadding
    >
      <div className="h-full flex flex-col">
        {displayCities.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <Globe2 size={24} className={t.textMuted} />
            <p className={`text-xs ${t.textMuted} mt-2`}>No cities added</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {displayCities.map((city, i) => {
              const cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
              let hours = cityTime.getHours();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              if (timeFormat === '12h') hours = hours % 12 || 12;
              const isDay = cityTime.getHours() >= 6 && cityTime.getHours() < 18;
              
              return (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center justify-between px-4 py-2.5 border-b ${t.border} last:border-0`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{isDay ? '☀️' : '🌙'}</span>
                    <div>
                      <p className={`text-xs font-medium ${t.text}`}>{city.name}</p>
                      <p className={`text-[10px] ${t.textMuted}`}>{city.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-mono font-semibold ${t.text}`}>
                      {hours.toString().padStart(2, '0')}:{cityTime.getMinutes().toString().padStart(2, '0')}
                    </span>
                    {timeFormat === '12h' && (
                      <span className={`text-[10px] ml-1 ${t.textMuted}`}>{ampm}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {worldClocks.length > displayCities.length && (
          <button
            onClick={() => setCurrentView('worldclock')}
            className={`px-4 py-2 text-[10px] ${t.textMuted} hover:text-blue-400 transition-colors border-t ${t.border}`}
          >
            +{worldClocks.length - displayCities.length} more cities
          </button>
        )}
      </div>
    </WidgetWrapper>
  );
}
