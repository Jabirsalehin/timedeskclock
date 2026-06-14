import { memo, useState, useRef, useEffect } from 'react';
import { useStore, type FullscreenMode } from '../../store/useStore';
import { useProfileStore, type FullscreenToolVisibility } from '../../store/profileStore';
import { themeExperiences, type ThemeExperienceId } from '../../utils/themeExperience';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Clock, LayoutGrid, Eye, EyeOff, Minimize2 } from 'lucide-react';

export const FullscreenControls = memo(function FullscreenControls() {
  const { themeExperience, fullscreenMode, setFullscreenMode, setFullscreen } = useStore();
  const { displaySettings, setFullscreenToolVisibility } = useProfileStore();
  const te = themeExperiences[(themeExperience as ThemeExperienceId) || 'glass-executive'];
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectMode = (mode: FullscreenMode) => {
    setFullscreenMode(mode);
    setOpen(false);
  };

  const selectAutoHide = () => {
    setFullscreenMode('clock-tools');
    setFullscreenToolVisibility('auto-hide');
    setOpen(false);
  };

  const items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }[] = [
    {
      id: 'clock-only',
      label: 'Clock Only',
      icon: <Clock size={14} />,
      active: fullscreenMode === 'clock-only',
      onClick: () => selectMode('clock-only'),
    },
    {
      id: 'clock-tools',
      label: 'Clock + Tools',
      icon: <LayoutGrid size={14} />,
      active:
        fullscreenMode === 'clock-tools' &&
        displaySettings.fullscreenToolVisibility === 'show',
      onClick: () => {
        setFullscreenMode('clock-tools');
        setFullscreenToolVisibility('show');
        setOpen(false);
      },
    },
    {
      id: 'auto-hide',
      label: 'Auto Hide',
      icon: <EyeOff size={14} />,
      active: displaySettings.fullscreenToolVisibility === 'auto-hide',
      onClick: selectAutoHide,
    },
    {
      id: 'exit',
      label: 'Exit Fullscreen',
      icon: <Minimize2 size={14} />,
      active: false,
      onClick: () => setFullscreen(false),
    },
  ];

  return (
    <div ref={menuRef} className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-2 rounded-full border backdrop-blur-md transition-all hover:scale-105"
        style={{
          background: `${te.colors.surface}cc`,
          borderColor: te.colors.border,
          color: te.colors.textSecondary,
        }}
        aria-label="Fullscreen options"
      >
        <MoreHorizontal size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 min-w-[180px] rounded-xl border overflow-hidden shadow-xl backdrop-blur-xl"
            style={{
              background: `${te.colors.surface}ee`,
              borderColor: te.colors.border,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors hover:opacity-80"
                style={{
                  color: item.active ? te.colors.accent : te.colors.textSecondary,
                  background: item.active ? `${te.colors.accent}15` : 'transparent',
                }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.active && <Eye size={10} className="ml-auto opacity-60" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
