import { useStore } from '../../store/useStore';
import { useWidgetStore, type Widget, type WidgetSize } from '../../store/widgetStore';
import { getTheme } from '../../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, X, GripVertical, Settings 
} from 'lucide-react';
import { useState, ReactNode } from 'react';

interface WidgetWrapperProps {
  widget: Widget;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  noPadding?: boolean;
  allowResize?: boolean;
  allowCollapse?: boolean;
  className?: string;
}

const sizeClasses: Record<WidgetSize, string> = {
  small: 'col-span-1',
  medium: 'col-span-1 md:col-span-1',
  large: 'col-span-1 md:col-span-2',
  full: 'col-span-1 md:col-span-2 lg:col-span-3',
};

const sizeHeights: Record<WidgetSize, string> = {
  small: 'min-h-[120px]',
  medium: 'min-h-[180px]',
  large: 'min-h-[240px]',
  full: 'min-h-[300px]',
};

export default function WidgetWrapper({
  widget,
  title,
  icon,
  children,
  actions,
  noPadding = false,
  allowResize = true,
  allowCollapse = true,
  className = '',
}: WidgetWrapperProps) {
  const { theme } = useStore();
  const { editMode, removeWidget, toggleWidgetCollapse, resizeWidget } = useWidgetStore();
  const t = getTheme(theme);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const sizes: { value: WidgetSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'full', label: 'Full Width' },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${sizeClasses[widget.size]} ${className}`}
    >
      <div 
        className={`
          ${t.card} border ${t.cardBorder} rounded-2xl overflow-hidden
          ${editMode ? 'ring-2 ring-blue-500/30 ring-offset-2 ring-offset-transparent' : ''}
          transition-all duration-200 h-full flex flex-col
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${t.border} shrink-0`}>
          <div className="flex items-center gap-2.5">
            {editMode && (
              <div className={`cursor-grab active:cursor-grabbing ${t.textMuted} hover:text-white`}>
                <GripVertical size={14} />
              </div>
            )}
            <span className="text-blue-400">{icon}</span>
            <h3 className={`text-sm font-semibold ${t.text}`}>{title}</h3>
          </div>
          
          <div className="flex items-center gap-1">
            {actions}
            
            {allowResize && (
              <div className="relative">
                <button
                  onClick={() => setShowSizeMenu(!showSizeMenu)}
                  className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
                >
                  <Settings size={12} />
                </button>
                
                <AnimatePresence>
                  {showSizeMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      className={`absolute right-0 top-full mt-1 ${t.card} border ${t.cardBorder} rounded-xl shadow-xl z-50 py-1 min-w-[100px]`}
                    >
                      {sizes.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => {
                            resizeWidget(widget.id, size.value);
                            setShowSizeMenu(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left text-xs ${
                            widget.size === size.value
                              ? 'text-blue-400 bg-blue-500/10'
                              : `${t.textSecondary} ${t.surfaceHover}`
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {allowCollapse && (
              <button
                onClick={() => toggleWidgetCollapse(widget.id)}
                className={`p-1.5 rounded-lg ${t.textMuted} hover:text-white ${t.surfaceHover} transition-colors`}
              >
                {widget.collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
              </button>
            )}
            
            {editMode && (
              <button
                onClick={() => removeWidget(widget.id)}
                className={`p-1.5 rounded-lg text-red-400/60 hover:text-red-400 ${t.surfaceHover} transition-colors`}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <AnimatePresence>
          {!widget.collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex-1 ${noPadding ? '' : 'p-4'} ${sizeHeights[widget.size]} overflow-hidden`}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
