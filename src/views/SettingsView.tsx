import { useEffect, useState, type ReactNode } from 'react';
import { useStore, type ThemeType, type ClockMode, type TimeFormat, type DateFormatType } from '../store/useStore';
import { useWidgetStore } from '../store/widgetStore';
import { useProfileStore, profileConfigs, type WidgetVisibilityMode, type FullscreenToolVisibility } from '../store/profileStore';
import { getTheme } from '../utils/theme';
import { themeExperiences, themeList, type ThemeExperienceId } from '../utils/themeExperience';
import { motion } from 'framer-motion';
import { Monitor, Clock, Palette, Layout, Globe, LayoutDashboard, Keyboard, Sparkles } from 'lucide-react';

export default function SettingsView() {
  const store = useStore();
  const widgetStore = useWidgetStore();
  const profileStore = useProfileStore();
  const { displaySettings } = profileStore;
  const t = getTheme(store.theme);
  const currentThemeExp = themeExperiences[(store.themeExperience as ThemeExperienceId) || 'glass-executive'];
  const [startupReady, setStartupReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const electron = (window as any).electron;
    if (!electron?.getRunAtLogin) return;

    electron.getRunAtLogin().then((enabled: boolean) => {
      store.setAutoStartEnabled(Boolean(enabled));
      setStartupReady(true);
    });
  }, [store]);

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-4`}>
      <div className="flex items-center gap-2.5">
        <span className="text-blue-400">{icon}</span>
        <h3 className={`text-sm font-semibold ${t.text}`}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const OptionGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <p className={`text-xs ${t.textMuted} mb-2`}>{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );

  const OptionBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
        active
          ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
          : `${t.inputBg} ${t.border} ${t.textSecondary} hover:text-white`
      }`}
    >
      {children}
    </button>
  );

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        value ? 'bg-blue-500' : `${t.inputBg} border ${t.border}`
      }`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className={`text-xl font-semibold ${t.text}`}>Settings</h1>
        <p className={`text-sm ${t.textMuted} mt-0.5`}>Customize your TimeDesk experience</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Theme Experience */}
        <Section title="Theme Experience" icon={<Sparkles size={16} />}>
          <p className={`text-xs ${t.textMuted} mb-3`}>
            Each theme creates a unique workspace atmosphere
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-1">
            {themeList.map((theme) => {
              const isActive = store.themeExperience === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => store.setThemeExperience(theme.id as ThemeExperienceId)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    isActive
                      ? 'border-blue-500/50 ring-2 ring-blue-500/20'
                      : `${t.border} hover:border-blue-500/30`
                  }`}
                  style={{
                    background: isActive ? `${theme.preview.bg}` : t.card.replace('bg-', ''),
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.preview.accent }}
                    />
                    <span
                      className="text-xs font-semibold truncate"
                      style={{ color: isActive ? theme.preview.text : undefined }}
                    >
                      {theme.name}
                    </span>
                  </div>
                  <p className={`text-[10px] ${isActive ? '' : t.textMuted} line-clamp-2`}
                     style={{ color: isActive ? `${theme.preview.text}aa` : undefined }}>
                    {theme.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Current theme preview */}
          <div className="mt-4 p-4 rounded-xl border" style={{
            background: currentThemeExp.colors.bg,
            borderColor: currentThemeExp.colors.border,
          }}>
            <p className="text-xs mb-2" style={{ color: currentThemeExp.colors.textSecondary }}>
              Preview
            </p>
            <div className="flex items-center justify-center py-4">
              <span className="font-mono text-4xl font-bold" style={{
                fontFamily: currentThemeExp.typography.clockFont,
                fontWeight: currentThemeExp.typography.clockWeight,
                letterSpacing: currentThemeExp.typography.clockLetterSpacing,
                color: currentThemeExp.colors.text,
              }}>
                12:34
              </span>
              <span className="ml-2 text-sm" style={{ color: currentThemeExp.colors.accent }}>PM</span>
            </div>
          </div>
        </Section>

        {/* Legacy Themes (Simple) */}
        <Section title="Quick Themes" icon={<Palette size={16} />}>
          <OptionGroup label="Simple Theme Presets">
            {(['dark', 'amoled', 'light', 'glass', 'minimal'] as ThemeType[]).map((th) => (
              <OptionBtn key={th} active={store.theme === th} onClick={() => store.setTheme(th)}>
                {th === 'amoled' ? 'AMOLED' : th.charAt(0).toUpperCase() + th.slice(1)}
              </OptionBtn>
            ))}
          </OptionGroup>
        </Section>

        {/* Clock */}
        <Section title="Clock" icon={<Clock size={16} />}>
          <OptionGroup label="Clock Style">
            {(['flip', 'digital', 'minimal'] as ClockMode[]).map((mode) => (
              <OptionBtn key={mode} active={store.clockMode === mode} onClick={() => store.setClockMode(mode)}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </OptionBtn>
            ))}
          </OptionGroup>

          <OptionGroup label="Time Format">
            {(['12h', '24h'] as TimeFormat[]).map((fmt) => (
              <OptionBtn key={fmt} active={store.timeFormat === fmt} onClick={() => store.setTimeFormat(fmt)}>
                {fmt === '12h' ? '12-Hour' : '24-Hour'}
              </OptionBtn>
            ))}
          </OptionGroup>

          <OptionGroup label="Date Format">
            {(['mdy', 'dmy', 'ymd', 'relative'] as DateFormatType[]).map((fmt) => (
              <OptionBtn key={fmt} active={store.dateFormat === fmt} onClick={() => store.setDateFormat(fmt)}>
                {fmt === 'mdy' ? 'Month Day Year' : fmt === 'dmy' ? 'Day Month Year' : fmt === 'ymd' ? 'Year Month Day' : 'Relative'}
              </OptionBtn>
            ))}
          </OptionGroup>

          <div className="flex items-center justify-between">
            <span className={`text-sm ${t.textSecondary}`}>Show Seconds</span>
            <Toggle value={store.showSeconds} onChange={store.toggleShowSeconds} />
          </div>
        </Section>

        {/* Dashboard */}
        <Section title="Dashboard & Widgets" icon={<LayoutDashboard size={16} />}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-sm ${t.textSecondary}`}>Dashboard Mode by Default</span>
              <p className={`text-xs ${t.textMuted}`}>Open Dashboard instead of Clock view</p>
            </div>
            <Toggle 
              value={widgetStore.dashboardMode} 
              onChange={() => widgetStore.setDashboardMode(!widgetStore.dashboardMode)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className={`text-sm ${t.textSecondary}`}>Widget Edit Mode</span>
              <p className={`text-xs ${t.textMuted}`}>Show edit controls on widgets</p>
            </div>
            <Toggle 
              value={widgetStore.editMode} 
              onChange={() => widgetStore.setEditMode(!widgetStore.editMode)} 
            />
          </div>
        </Section>

        {/* Desktop Overlay */}
        <Section title="Desktop Overlay (Premium)" icon={<Monitor size={16} />}>
          <p className={`text-xs ${t.textMuted} mb-3`}>Use TimeDesk as a lightweight desktop overlay.</p>
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-sm ${t.textSecondary}`}>Enable Overlay</span>
              <p className={`text-xs ${t.textMuted}`}>Show clock/widgets on desktop wallpaper</p>
            </div>
            <Toggle value={profileStore ? (store as any).overlayEnabled : false} onChange={() => store.setOverlayEnabled ? store.setOverlayEnabled(!((store as any).overlayEnabled)) : null} />
          </div>

          <OptionGroup label="Mode">
            <OptionBtn active={(store as any).overlayMode === 'overlay-clock-only'} onClick={() => store.setOverlayMode('overlay-clock-only')}>Clock Only</OptionBtn>
            <OptionBtn active={(store as any).overlayMode === 'overlay-clock-tools'} onClick={() => store.setOverlayMode('overlay-clock-tools')}>Clock + Tools</OptionBtn>
          </OptionGroup>

          <div className="space-y-2">
            <p className={`text-xs ${t.textMuted}`}>Transparency</p>
            <input
              type="range"
              min={0}
              max={100}
              value={(store as any).overlayTransparency}
              onChange={(e) => store.setOverlayTransparency(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs">
              <span className={t.textMuted}>0%</span>
              <span className={t.textMuted}>25%</span>
              <span className={t.textMuted}>50%</span>
              <span className={t.textMuted}>75%</span>
              <span className={t.textMuted}>100%</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <span className={`text-sm ${t.textSecondary}`}>Click Through</span>
              <p className={`text-xs ${t.textMuted}`}>When enabled, overlay is display-only and ignores mouse events</p>
            </div>
            <Toggle value={(store as any).overlayClickThrough} onChange={() => store.setOverlayClickThrough(!((store as any).overlayClickThrough))} />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <span className={`text-sm ${t.textSecondary}`}>Start With Windows</span>
              <p className={`text-xs ${t.textMuted}`}>Keep TimeDesk running in the background after login</p>
            </div>
            <Toggle
              value={store.autoStartEnabled}
              onChange={() => {
                const next = !store.autoStartEnabled;
                store.setAutoStartEnabled(next);
                const electron = (window as any).electron;
                electron?.setRunAtLogin?.(next);
              }}
            />
          </div>

          <OptionGroup label="Position">
            {(['center','top','bottom','left','right','custom'] as any[]).map((pos) => (
              <OptionBtn key={pos} active={(store as any).overlayPosition === pos} onClick={() => store.setOverlayPosition(pos)}>
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </OptionBtn>
            ))}
          </OptionGroup>

          <OptionGroup label="Layout">
            {(['compact','standard','workspace'] as any[]).map((lay) => (
              <OptionBtn key={lay} active={(store as any).overlayLayout === lay} onClick={() => store.setOverlayLayout(lay)}>
                {lay.charAt(0).toUpperCase() + lay.slice(1)}
              </OptionBtn>
            ))}
          </OptionGroup>
        </Section>

        {/* Workspace Profile - Clock-First Architecture */}
        <Section title="Workspace Profile" icon={<Layout size={16} />}>
          <p className={`text-xs ${t.textMuted} mb-3`}>
            Profiles add supporting tools without changing the clock experience.
            Profile identity and widget visibility are independent.
          </p>
          <OptionGroup label="Select Profile">
            {Object.values(profileConfigs).map((profile) => {
              const isActive = profileStore.activeProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => profileStore.setActiveProfile(profile.id)}
                  className="flex flex-col px-4 py-3 rounded-xl text-left transition-all border"
                  style={{
                    background: isActive ? profile.accentColorLight : undefined,
                    borderColor: isActive ? `${profile.accentColor}60` : undefined,
                  }}
                >
                  <span 
                    className="text-sm font-medium flex items-center gap-2"
                    style={{ color: isActive ? profile.accentColor : undefined }}
                  >
                    {profile.emoji} {profile.name}
                  </span>
                  <span className={`text-xs ${t.textMuted} mt-0.5`}>{profile.description}</span>
                </button>
              );
            })}
          </OptionGroup>

          <div className="border-t border-white/5 pt-4 mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm ${t.textSecondary}`}>Widgets</span>
                <p className={`text-xs ${t.textMuted}`}>Show profile tools in clock view</p>
              </div>
              <Toggle
                value={displaySettings.widgetsEnabled}
                onChange={() => profileStore.setWidgetsEnabled(!displaySettings.widgetsEnabled)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm ${t.textSecondary}`}>Fullscreen Tools</span>
                <p className={`text-xs ${t.textMuted}`}>Allow tools in Clock + Tools fullscreen</p>
              </div>
              <Toggle
                value={displaySettings.fullscreenToolsEnabled}
                onChange={() => profileStore.setFullscreenToolsEnabled(!displaySettings.fullscreenToolsEnabled)}
              />
            </div>

            <OptionGroup label="Widget Visibility">
              {([
                { id: 'always' as WidgetVisibilityMode, label: 'Always Visible' },
                { id: 'auto-hide' as WidgetVisibilityMode, label: 'Auto Hide' },
                { id: 'hidden' as WidgetVisibilityMode, label: 'Hidden' },
              ]).map((opt) => (
                <OptionBtn
                  key={opt.id}
                  active={displaySettings.widgetVisibility === opt.id}
                  onClick={() => profileStore.setWidgetVisibility(opt.id)}
                >
                  {opt.label}
                </OptionBtn>
              ))}
            </OptionGroup>

            <OptionGroup label="Fullscreen Tool Visibility">
              {([
                { id: 'show' as FullscreenToolVisibility, label: 'Show Tools' },
                { id: 'auto-hide' as FullscreenToolVisibility, label: 'Auto Hide' },
                { id: 'hide' as FullscreenToolVisibility, label: 'Hide Tools' },
              ]).map((opt) => (
                <OptionBtn
                  key={opt.id}
                  active={displaySettings.fullscreenToolVisibility === opt.id}
                  onClick={() => profileStore.setFullscreenToolVisibility(opt.id)}
                >
                  {opt.label}
                </OptionBtn>
              ))}
            </OptionGroup>
          </div>
        </Section>

        {/* Keyboard Shortcuts */}
        <Section title="Keyboard Shortcuts" icon={<Keyboard size={16} />}>
          <div className="space-y-2">
            {[
              { keys: 'Ctrl + D', desc: 'Open Dashboard' },
              { keys: 'Ctrl + 1', desc: 'Go to Clock' },
              { keys: 'Ctrl + 2', desc: 'Go to Stopwatch' },
              { keys: 'Ctrl + 3', desc: 'Go to Timer' },
              { keys: 'Ctrl + 4', desc: 'Go to Focus' },
              { keys: 'Ctrl + 5', desc: 'Go to Tasks' },
              { keys: 'Alt + C', desc: 'Floating Clock' },
              { keys: 'Alt + S', desc: 'Floating Stopwatch' },
              { keys: 'Alt + T', desc: 'Floating Timer' },
              { keys: 'Alt + P', desc: 'Floating Pomodoro' },
              { keys: 'Alt + R', desc: 'Floating Reminder' },
              { keys: 'Alt + K', desc: 'Floating Task Widget' },
              { keys: 'F11', desc: 'Fullscreen (Clock view)' },
              { keys: 'Escape', desc: 'Exit Fullscreen' },
            ].map((shortcut) => (
              <div key={shortcut.keys} className="flex items-center justify-between">
                <span className={`text-xs ${t.textSecondary}`}>{shortcut.desc}</span>
                <kbd className={`px-2 py-1 rounded text-[10px] font-mono ${t.surface} ${t.text}`}>
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </Section>

        {/* Language */}
        <Section title="Language & Region" icon={<Globe size={16} />}>
          <OptionGroup label="Language">
            <OptionBtn active={true} onClick={() => {}}>🇺🇸 English</OptionBtn>
            <OptionBtn active={false} onClick={() => {}}>🇧🇩 বাংলা</OptionBtn>
            <OptionBtn active={false} onClick={() => {}}>🇸🇦 العربية</OptionBtn>
            <OptionBtn active={false} onClick={() => {}}>🇪🇸 Español</OptionBtn>
            <OptionBtn active={false} onClick={() => {}}>🇫🇷 Français</OptionBtn>
            <OptionBtn active={false} onClick={() => {}}>🇩🇪 Deutsch</OptionBtn>
          </OptionGroup>
          <p className={`text-xs ${t.textMuted} italic`}>
            Multi-language support coming soon. Architecture supports RTL and localization.
          </p>
        </Section>

        {/* Display */}
        <Section title="Display" icon={<Monitor size={16} />}>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${t.textSecondary}`}>Sidebar Collapsed</span>
            <Toggle value={store.sidebarCollapsed} onChange={store.toggleSidebar} />
          </div>
        </Section>
      </div>
    </div>
  );
}
