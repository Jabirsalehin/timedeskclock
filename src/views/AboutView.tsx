import { useStore } from '../store/useStore';
import { getTheme } from '../utils/theme';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, Heart, Globe, Star, Sparkles } from 'lucide-react';

export default function AboutView() {
  const { theme } = useStore();
  const t = getTheme(theme);

  const features = [
    { emoji: '⏰', label: 'Flip & Digital Clocks', desc: 'Premium clock experience' },
    { emoji: '🔔', label: 'Smart Alarms', desc: 'One-time & recurring' },
    { emoji: '📝', label: 'Quick Tasks', desc: 'Lightweight task management' },
    { emoji: '⏱️', label: 'Session Stopwatch', desc: 'Track work sessions' },
    { emoji: '🎯', label: 'Focus Mode', desc: 'Pomodoro & deep work' },
    { emoji: '🌍', label: 'World Clock', desc: 'Multi-timezone support' },
    { emoji: '📊', label: 'Session History', desc: 'Productivity insights' },
    { emoji: '🎨', label: '5 Themes', desc: 'Dark, AMOLED, Light & more' },
  ];

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg space-y-6 sm:space-y-8"
      >
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
            className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-5"
          >
            <Clock size={36} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-bold ${t.text} tracking-tight`}
          >
            TimeDesk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-sm ${t.textSecondary} mt-1.5`}
          >
            Your Personal Time Workspace
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${t.surface} border ${t.border} text-xs ${t.textMuted}`}
          >
            <Sparkles size={12} className="text-blue-400" />
            Version 1.0.0
          </motion.div>
        </div>

        {/* Tagline Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${t.card} border ${t.cardBorder} rounded-2xl p-6 text-center`}
        >
          <p className={`text-lg font-semibold ${t.text} italic leading-relaxed`}>
            "Open. Use. Focus."
          </p>
          <p className={`text-xs ${t.textMuted} mt-3 leading-relaxed`}>
            TimeDesk helps you manage time, focus, tasks, and daily workflows through an elegant, lightweight, distraction-free experience.
          </p>
        </motion.div>

        {/* Version Info */}
        <div className={`${t.card} border ${t.cardBorder} rounded-2xl overflow-hidden`}>
          {[
            { label: 'Version', value: '1.0.0' },
            { label: 'Platform', value: 'Web (PWA Ready)' },
            { label: 'Framework', value: 'React + Vite' },
            { label: 'License', value: 'MIT' },
          ].map((item, i) => (
            <div key={item.label} className={`flex items-center justify-between px-5 py-3.5 ${i > 0 ? `border-t ${t.border}` : ''}`}>
              <span className={`text-sm ${t.textSecondary}`}>{item.label}</span>
              <span className={`text-sm font-mono ${t.text}`}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${t.textMuted} mb-3 text-center`}>Features</p>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={`${t.card} border ${t.cardBorder} rounded-xl p-3.5`}
              >
                <span className="text-xl">{feat.emoji}</span>
                <p className={`text-xs font-medium ${t.text} mt-1.5`}>{feat.label}</p>
                <p className={`text-[10px] ${t.textMuted} mt-0.5`}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Creator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${t.card} border ${t.cardBorder} rounded-2xl p-6 text-center space-y-4`}
        >
          <p className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${t.textMuted}`}>Designed & Developed by</p>
          <a
            href="https://zabir.site"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            JABIR
            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="https://zabir.site"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 text-sm ${t.textSecondary} hover:text-blue-400 transition-colors`}
          >
            <Globe size={14} />
            zabir.site
          </a>
        </motion.div>

        {/* Premium Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/15 rounded-2xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <Star size={14} className="text-amber-400 fill-amber-400" />
          </div>
          <h3 className={`text-base font-semibold ${t.text}`}>TimeDesk Premium</h3>
          <p className={`text-xs ${t.textMuted} mt-1.5 max-w-xs mx-auto`}>
            Unlock unlimited themes, custom alarm sounds, cloud sync, advanced analytics, and more.
          </p>
          <div className="flex items-center justify-center gap-6 mt-5">
            <div className="text-center">
              <p className={`text-xs ${t.textMuted}`}>Monthly</p>
              <p className={`text-xl font-bold ${t.text} mt-0.5`}>$4.99</p>
            </div>
            <div className={`border-l ${t.border} h-10`} />
            <div className="text-center">
              <p className="text-xs text-blue-400">Lifetime</p>
              <p className="text-xl font-bold text-blue-400 mt-0.5">$29.99</p>
            </div>
          </div>
          <p className={`text-[10px] ${t.textMuted} mt-4 italic`}>Coming soon</p>
        </motion.div>

        {/* Copyright */}
        <div className={`text-center text-xs ${t.textMuted} space-y-1.5 pb-6`}>
          <p className="flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-red-400" /> by{' '}
            <a href="https://zabir.site" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium">
              JABIR
            </a>
          </p>
          <p>© 2026 TimeDesk. All rights reserved.</p>
          <p>
            <a href="https://zabir.site" target="_blank" rel="noopener noreferrer" className="text-blue-400/60 hover:text-blue-400 transition-colors">
              zabir.site
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
