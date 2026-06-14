import {
  usePreciseTime,
  usePreciseStopwatch,
  usePreciseTimer,
} from './usePreciseTime';

export function useTime() {
  return usePreciseTime();
}

export function useStopwatch() {
  return usePreciseStopwatch();
}

export function useCountdownTimer() {
  return usePreciseTimer();
}

export function formatTime(date: Date, format: '12h' | '24h', showSeconds: boolean): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  if (format === '12h') {
    hours = hours % 12 || 12;
  }

  const h = hours.toString().padStart(2, '0');
  return showSeconds ? `${h}:${minutes}:${seconds}` : `${h}:${minutes}`;
}

export function getAmPm(date: Date): string {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}

export function formatDate(date: Date, format: string): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const shortMonth = month.slice(0, 3);
  const year = date.getFullYear();
  const dayName = days[date.getDay()];

  switch (format) {
    case 'mdy': return `${dayName}, ${month} ${day}, ${year}`;
    case 'dmy': return `${dayName}, ${day} ${month} ${year}`;
    case 'ymd': return `${year} ${month} ${day}, ${dayName}`;
    case 'relative': return `${dayName}, ${shortMonth} ${day}`;
    default: return `${dayName}, ${month} ${day}, ${year}`;
  }
}

export function formatMs(ms: number): { hours: string; minutes: string; seconds: string; centiseconds: string } {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
  return { hours, minutes, seconds, centiseconds };
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
