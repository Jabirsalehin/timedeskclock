import { memo, useEffect, useRef, useState, useMemo } from 'react';
import { useTimeDigits } from '../hooks/usePreciseTime';
import { useStore } from '../store/useStore';
import { themeExperiences, type ThemeExperienceId } from '../utils/themeExperience';

interface FlipDigitProps {
  value: string;
  prevValue: string;
  theme: ThemeExperienceId;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

// Memoized single digit - only re-renders when its value changes
const FlipDigit = memo(function FlipDigit({ value, prevValue, theme, size }: FlipDigitProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const themeConfig = themeExperiences[theme] || themeExperiences['glass-executive'];
  
  const flipDuration = themeConfig.animation.flipDuration;
  const flipEasing = themeConfig.animation.flipEasing;
  
  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsFlipping(false), flipDuration);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, prevValue, flipDuration]);

  // Size configurations
  const sizeConfig = useMemo(() => {
    const configs = {
      sm: { width: 'w-10', height: 'h-14', fontSize: 'text-2xl', half: '28px' },
      md: { width: 'w-14 sm:w-16', height: 'h-20 sm:h-24', fontSize: 'text-4xl sm:text-5xl', half: '48px' },
      lg: { width: 'w-16 sm:w-20 md:w-24', height: 'h-24 sm:h-28 md:h-32', fontSize: 'text-5xl sm:text-6xl md:text-7xl', half: '64px' },
      xl: { width: 'w-20 sm:w-24 md:w-28 lg:w-32', height: 'h-28 sm:h-32 md:h-40 lg:h-44', fontSize: 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl', half: '88px' },
    };
    return configs[size];
  }, [size]);

  // Theme-specific styles
  const colors = themeConfig.colors;
  const isLightTheme = theme === 'swiss-watch' || theme === 'focus-white';

  // Use inline styles for dynamic colors
  const topStyle = {
    background: isLightTheme ? '#ffffff' : colors.surface,
    borderColor: colors.border,
  };
  
  const bottomStyle = {
    background: isLightTheme ? '#f5f5f5' : colors.bg,
    borderColor: colors.border,
  };

  const fontStyle = {
    fontFamily: themeConfig.typography.clockFont,
    fontWeight: themeConfig.typography.clockWeight,
    letterSpacing: themeConfig.typography.clockLetterSpacing,
    color: colors.text,
  };

  return (
    <div 
      className={`relative ${sizeConfig.width} ${sizeConfig.height}`}
      style={{ perspective: '500px' }}
    >
      {/* Static Top Half */}
      <div 
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl overflow-hidden flex items-end justify-center border border-b-0"
        style={topStyle}
      >
        <span 
          className={`${sizeConfig.fontSize} font-mono translate-y-1/2`}
          style={fontStyle}
        >
          {value}
        </span>
      </div>

      {/* Static Bottom Half */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl overflow-hidden flex items-start justify-center border border-t-0"
        style={bottomStyle}
      >
        <span 
          className={`${sizeConfig.fontSize} font-mono -translate-y-1/2`}
          style={fontStyle}
        >
          {value}
        </span>
      </div>

      {/* Center Line */}
      <div 
        className="absolute inset-x-0 top-1/2 h-px z-10"
        style={{ backgroundColor: `${colors.border}80` }}
      />

      {/* Flip Animation - Top Card (flips down) */}
      {isFlipping && (
        <div
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl overflow-hidden flex items-end justify-center border border-b-0 z-20"
          style={{
            ...topStyle,
            animation: `flipTop ${flipDuration / 2}ms ${flipEasing} forwards`,
            transformOrigin: 'bottom center',
            backfaceVisibility: 'hidden',
          }}
        >
          <span 
            className={`${sizeConfig.fontSize} font-mono translate-y-1/2`}
            style={fontStyle}
          >
            {prevValue}
          </span>
        </div>
      )}

      {/* Flip Animation - Bottom Card (flips up) */}
      {isFlipping && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl overflow-hidden flex items-start justify-center border border-t-0 z-20"
          style={{
            ...bottomStyle,
            animation: `flipBottom ${flipDuration / 2}ms ${flipEasing} ${flipDuration / 2}ms forwards`,
            transformOrigin: 'top center',
            backfaceVisibility: 'hidden',
            transform: 'rotateX(90deg)',
          }}
        >
          <span 
            className={`${sizeConfig.fontSize} font-mono -translate-y-1/2`}
            style={fontStyle}
          >
            {value}
          </span>
        </div>
      )}

      {/* Ambient glow effect */}
      {themeConfig.animation.enableGlow && (
        <div 
          className="absolute inset-0 rounded-xl opacity-20 blur-xl -z-10"
          style={{ backgroundColor: colors.accent }}
        />
      )}
    </div>
  );
}, (prev, next) => {
  // Custom comparison - only re-render if value or theme changes
  return prev.value === next.value && 
         prev.prevValue === next.prevValue && 
         prev.theme === next.theme &&
         prev.size === next.size;
});

// Colon separator
const ColonSeparator = memo(function ColonSeparator({ 
  theme, 
  style,
  size 
}: { 
  theme: ThemeExperienceId; 
  style: 'dots' | 'solid' | 'blinking' | 'hidden';
  size: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (style === 'hidden') return null;
  
  const themeConfig = themeExperiences[theme] || themeExperiences['glass-executive'];
  const colors = themeConfig.colors;
  
  const sizeMap = {
    sm: { dot: 'w-1 h-1', gap: 'gap-1' },
    md: { dot: 'w-1.5 h-1.5', gap: 'gap-1.5' },
    lg: { dot: 'w-2 h-2', gap: 'gap-2' },
    xl: { dot: 'w-2.5 h-2.5', gap: 'gap-3' },
  };
  
  const config = sizeMap[size];

  if (style === 'dots' || style === 'blinking') {
    return (
      <div className={`flex flex-col ${config.gap} mx-1 sm:mx-2`}>
        <div 
          className={`${config.dot} rounded-full ${style === 'blinking' ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: colors.accent }}
        />
        <div 
          className={`${config.dot} rounded-full ${style === 'blinking' ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: colors.accent }}
        />
      </div>
    );
  }

  return (
    <span 
      className="mx-1 font-mono text-2xl sm:text-3xl md:text-4xl"
      style={{ 
        color: colors.textMuted,
        fontFamily: themeConfig.typography.clockFont,
      }}
    >
      :
    </span>
  );
});

// Main optimized clock component
interface OptimizedFlipClockProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSeconds?: boolean;
  themeId?: ThemeExperienceId;
}

export default function OptimizedFlipClock({ 
  size = 'lg', 
  showSeconds: showSecondsProp,
  themeId,
}: OptimizedFlipClockProps) {
  const { timeFormat, showSeconds: storeShowSeconds, themeExperience } = useStore() as any;
  const showSeconds = showSecondsProp ?? storeShowSeconds;
  const activeTheme = (themeId || themeExperience || 'glass-executive') as ThemeExperienceId;
  
  const digits = useTimeDigits(timeFormat, showSeconds);
  const prevDigits = useRef(digits);
  
  // Store previous digits for flip comparison
  const prev = prevDigits.current;
  
  useEffect(() => {
    // Update prev after render so FlipDigit sees the previous value
    // Use immediate effect (no artificial delay) to trigger flips as soon
    // as the real second changes.
    prevDigits.current = digits;
    return () => {};
  }, [digits]);

  const themeConfig = themeExperiences[activeTheme] || themeExperiences['glass-executive'];

  return (
    <div className="flex items-center">
      {/* Hours */}
      <div className="flex gap-1 sm:gap-1.5">
        <FlipDigit value={digits.h1} prevValue={prev.h1} theme={activeTheme} size={size} />
        <FlipDigit value={digits.h2} prevValue={prev.h2} theme={activeTheme} size={size} />
      </div>
      
      <ColonSeparator theme={activeTheme} style={themeConfig.clock.colonStyle} size={size} />
      
      {/* Minutes */}
      <div className="flex gap-1 sm:gap-1.5">
        <FlipDigit value={digits.m1} prevValue={prev.m1} theme={activeTheme} size={size} />
        <FlipDigit value={digits.m2} prevValue={prev.m2} theme={activeTheme} size={size} />
      </div>
      
      {showSeconds && (
        <>
          <ColonSeparator theme={activeTheme} style={themeConfig.clock.colonStyle} size={size} />
          <div className="flex gap-1 sm:gap-1.5">
            <FlipDigit value={digits.s1} prevValue={prev.s1} theme={activeTheme} size={size} />
            <FlipDigit value={digits.s2} prevValue={prev.s2} theme={activeTheme} size={size} />
          </div>
        </>
      )}
      
      {/* AM/PM indicator */}
      {timeFormat === '12h' && (
        <span 
          className="ml-2 sm:ml-3 text-sm sm:text-base md:text-xl font-mono self-start mt-1 sm:mt-2"
          style={{ 
            color: themeConfig.colors.accent,
            fontFamily: themeConfig.typography.clockFont,
          }}
        >
          {digits.ampm}
        </span>
      )}
    </div>
  );
}

// CSS for flip animations (add to index.css)
export const flipClockStyles = `
@keyframes flipTop {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}

@keyframes flipBottom {
  0% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}
`;
