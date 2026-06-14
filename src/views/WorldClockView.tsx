import { useState } from 'react';
import { useStore, type WorldClockCity } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { useTime } from '../hooks/useTime';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Globe2, X } from 'lucide-react';

const availableCities: WorldClockCity[] = [
  { id: 'nyc', name: 'New York', timezone: 'America/New_York', country: 'USA' },
  { id: 'la', name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA' },
  { id: 'chi', name: 'Chicago', timezone: 'America/Chicago', country: 'USA' },
  { id: 'lon', name: 'London', timezone: 'Europe/London', country: 'UK' },
  { id: 'par', name: 'Paris', timezone: 'Europe/Paris', country: 'France' },
  { id: 'ber', name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany' },
  { id: 'ist', name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'Turkey' },
  { id: 'mos', name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia' },
  { id: 'dub', name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
  { id: 'mum', name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India' },
  { id: 'dhk', name: 'Dhaka', timezone: 'Asia/Dhaka', country: 'Bangladesh' },
  { id: 'bkk', name: 'Bangkok', timezone: 'Asia/Bangkok', country: 'Thailand' },
  { id: 'sgp', name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore' },
  { id: 'hkg', name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'China' },
  { id: 'tok', name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
  { id: 'syd', name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia' },
  { id: 'akl', name: 'Auckland', timezone: 'Pacific/Auckland', country: 'New Zealand' },
  { id: 'sao', name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil' },
  { id: 'jkt', name: 'Jakarta', timezone: 'Asia/Jakarta', country: 'Indonesia' },
  { id: 'sel', name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea' },
  { id: 'cai', name: 'Cairo', timezone: 'Africa/Cairo', country: 'Egypt' },
  { id: 'lag', name: 'Lagos', timezone: 'Africa/Lagos', country: 'Nigeria' },
];

function CityCard({ city, onRemove }: { city: WorldClockCity; onRemove: () => void }) {
  const { theme, timeFormat } = useStore();
  const t = getTheme(theme);
  const now = useTime();

  const cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
  const localTime = now;
  const diffMs = cityTime.getTime() - localTime.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  let hours = cityTime.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  if (timeFormat === '12h') hours = hours % 12 || 12;

  const isDay = cityTime.getHours() >= 6 && cityTime.getHours() < 18;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${t.card} border ${t.cardBorder} rounded-xl p-5 group relative overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${isDay ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${t.text}`}>{city.name}</p>
          <p className={`text-xs ${t.textMuted}`}>{city.country}</p>
        </div>
        <button
          onClick={onRemove}
          className={`p-1 rounded-lg ${t.textMuted} hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all`}
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div className="mt-3">
        <span className={`text-3xl font-mono font-bold ${t.text}`}>
          {hours.toString().padStart(2, '0')}:{cityTime.getMinutes().toString().padStart(2, '0')}
        </span>
        {timeFormat === '12h' && (
          <span className={`text-xs ml-1.5 ${t.textSecondary}`}>{ampm}</span>
        )}
      </div>
      <div className={`flex items-center gap-2 mt-2 text-xs ${t.textMuted}`}>
        <span>{isDay ? '☀️' : '🌙'}</span>
        <span>
          {diffHours === 0
            ? 'Same time'
            : `${diffHours > 0 ? '+' : ''}${diffHours}h`}
        </span>
      </div>
    </motion.div>
  );
}

export default function WorldClockView() {
  const { worldClocks, addWorldClock, removeWorldClock, theme } = useStore();
  const t = getTheme(theme);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = availableCities.filter(
    c => !worldClocks.find(wc => wc.timezone === c.timezone) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-xl font-semibold ${t.text}`}>World Clock</h1>
          <p className={`text-sm ${t.textMuted} mt-0.5`}>{worldClocks.length} cities</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add City
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {worldClocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Globe2 size={40} className={t.textMuted} />
            <p className={`${t.textSecondary} text-sm`}>No cities added</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {worldClocks.map((city) => (
              <CityCard key={city.id} city={city} onRemove={() => removeWorldClock(city.id)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${t.card} border ${t.cardBorder} rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl max-h-[80vh] flex flex-col`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${t.text}`}>Add City</h2>
                <button onClick={() => setShowAdd(false)} className={`${t.textMuted} hover:text-white p-1`}>
                  <X size={18} />
                </button>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cities..."
                autoFocus
                className={`w-full ${t.inputBg} border ${t.border} rounded-xl px-4 py-2.5 ${t.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-4`}
              />
              <div className="flex-1 overflow-y-auto space-y-1.5">
                {filtered.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      addWorldClock({ ...city, id: Date.now().toString() });
                      setShowAdd(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl ${t.surfaceHover} transition-colors flex items-center justify-between`}
                  >
                    <div>
                      <p className={`text-sm font-medium ${t.text}`}>{city.name}</p>
                      <p className={`text-xs ${t.textMuted}`}>{city.country} · {city.timezone}</p>
                    </div>
                    <Plus size={14} className={t.textMuted} />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
