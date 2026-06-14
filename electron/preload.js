import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getPlatform: () => ipcRenderer.invoke('electron/get-platform'),
  getVersion: () => ipcRenderer.invoke('electron/get-version'),
  showMainWindow: () => ipcRenderer.send('electron/show-main-window'),
  hideMainWindow: () => ipcRenderer.send('electron/hide-main-window'),
  toggleOverlayWindow: () => ipcRenderer.send('electron/toggle-overlay-window'),
  setOverlayWindowVisibility: (visible) => ipcRenderer.send('electron/set-overlay-window-visibility', visible),
  setOverlayClickThrough: (enabled) => ipcRenderer.send('electron/set-overlay-click-through', enabled),
  setAlwaysOnTop: (enabled) => ipcRenderer.send('electron/set-always-on-top', enabled),
  openDashboard: () => ipcRenderer.send('electron/open-dashboard'),
  openSettings: () => ipcRenderer.send('electron/open-settings'),
  openWidgetMode: () => ipcRenderer.send('electron/open-widget-mode'),
  restartWidgets: () => ipcRenderer.send('electron/restart-widgets'),
  getRunAtLogin: () => ipcRenderer.invoke('electron/get-run-at-login'),
  setRunAtLogin: (enabled) => ipcRenderer.send('electron/set-run-at-login', enabled),
  onNavigate: (callback) => {
    if (typeof callback !== 'function') throw new TypeError('Callback must be a function');
    const validViews = ['dashboard', 'clock', 'settings', 'alarm', 'reminder', 'stopwatch', 'timer', 'focus', 'tasks', 'worldclock', 'history', 'about'];
    const handler = (_event, view) => {
      if (typeof view === 'string' && validViews.includes(view)) {
        callback(view);
      }
    };
    ipcRenderer.on('electron/navigate', handler);
    return () => ipcRenderer.off('electron/navigate', handler);
  },
});
