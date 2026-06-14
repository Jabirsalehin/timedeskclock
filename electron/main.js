import path from 'path';
import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen } from 'electron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = !app.isPackaged;
const startHidden = process.argv.includes('--hidden');
let mainWindow = null;
let widgetWindow = null;
let tray = null;
let isQuiting = false;

const trayIconDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABGElEQVQ4T6XTsUoCURQG8N+9GWhgHsGxkIR0sXEwNxa2sLMHq4uhI6WGjH4CP0CYLRw8kR1s7u2h6N7KxME9G8zZmb3zvOKs8k9zVtlEFc2qciVfH51E20jjmXbYcA0fHi+ocGAoFKlGz6UWpQgSCPQ62oCp8F5a6D5aXkpwK95Q7gOUS5A6XV5RVPtCF5TNFn6+hON67CNtLQ7iL20wVgeQisxnYm0jNqVc5Qbfgk1JDtdRxA0GwXKRKSnmhmOZHVK2Cx8pUWkkSU1rCb3XB5uBLZsJs7Id9WcEE7+vK5oUzvneDQwcHLFAX26cmcA54i8kR+QccN4Qr3V0jI2YPDtVwNlDTov+otVg25kryJ4aEtpKq+k+/3tlcZOg6b3ZAAAAAElFTkSuQmCC';

function getAppUrl(query = '') {
  if (isDev) {
    return `http://127.0.0.1:5173${query}`;
  }

  return `file://${path.join(__dirname, '../dist/index.html')}${query}`;
}

function createDashboardWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  const url = getAppUrl();
  window.loadURL(url);

  window.on('close', (event) => {
    if (!isQuiting) {
      event.preventDefault();
      window.hide();
    }
  });

  window.on('closed', () => {
    mainWindow = null;
  });

  return window;
}

function createWidgetWindow() {
  const window = new BrowserWindow({
    width: 540,
    height: 320,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    hasShadow: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  window.loadURL(getAppUrl('?overlay=1'));

  window.once('ready-to-show', () => {
    window.showInactive();
  });

  window.on('close', (event) => {
    if (!isQuiting) {
      event.preventDefault();
      window.hide();
    }
  });

  window.on('closed', () => {
    widgetWindow = null;
  });

  return window;
}

function showMainWindow(view = 'dashboard') {
  if (!mainWindow) {
    mainWindow = createDashboardWindow();
  }

  if (widgetWindow?.isVisible()) {
    widgetWindow.hide();
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();

  const targetView = view === 'dashboard' ? 'clock' : view;
  if (!mainWindow.webContents.isLoading()) {
    mainWindow.webContents.send('electron/navigate', targetView);
  } else {
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow?.webContents.send('electron/navigate', targetView);
    });
  }
}

function showWidgetWindow() {
  if (!widgetWindow) {
    widgetWindow = createWidgetWindow();
  }

  mainWindow?.hide();
  widgetWindow.showInactive();
  widgetWindow.focus();
}

function restartWidgetWindow() {
  if (widgetWindow) {
    widgetWindow.destroy();
    widgetWindow = null;
  }
  widgetWindow = createWidgetWindow();
}

function createTray() {
  const trayIcon = nativeImage.createFromDataURL(trayIconDataUrl);
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Dashboard',
      click: () => {
        showMainWindow('dashboard');
        widgetWindow?.hide();
      },
    },
    {
      label: 'Widget Mode',
      click: () => {
        showWidgetWindow();
        mainWindow?.hide();
      },
    },
    {
      label: 'Settings',
      click: () => {
        showMainWindow('settings');
        widgetWindow?.hide();
      },
    },
    {
      label: 'Restart Widgets',
      click: () => restartWidgetWindow(),
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('TimeDesk');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    showMainWindow('dashboard');
    widgetWindow?.hide();
  });
}

function configureStartup(enabled = false) {
  if (process.platform === 'win32') {
    app.setLoginItemSettings({
      openAtLogin: Boolean(enabled),
      path: process.execPath,
      args: enabled ? ['--hidden'] : [],
    });
  }
}

app.on('before-quit', () => {
  isQuiting = true;
});

app.on('second-instance', () => {
  showMainWindow('dashboard');
});

app.whenReady().then(() => {
  app.setAppUserModelId('com.timedesk.app');

  mainWindow = createDashboardWindow();
  if (!startHidden) {
    mainWindow.once('ready-to-show', () => {
      mainWindow?.show();
    });
  }

  createTray();
  configureStartup();

  app.on('activate', () => {
    showMainWindow('dashboard');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && isQuiting) {
    app.quit();
  }
});

// IPC Validation Middleware
const validateIPCEvent = (event) => {
  if (!event.senderFrame) throw new Error('Invalid IPC sender: no frame');
  if (!event.senderFrame.url.startsWith('file://') && !event.senderFrame.url.startsWith('http://127.0.0.1')) {
    throw new Error('Invalid IPC sender: untrusted origin');
  }
};

const validateBoolean = (value, fieldName = 'value') => {
  if (typeof value !== 'boolean') throw new TypeError(`${fieldName} must be boolean, got ${typeof value}`);
  return value;
};

const validateString = (value, fieldName = 'value', allowedValues) => {
  if (typeof value !== 'string') throw new TypeError(`${fieldName} must be string, got ${typeof value}`);
  if (allowedValues && !allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of [${allowedValues.join(', ')}]`);
  }
  return value;
};

ipcMain.handle('electron/get-platform', (event) => {
  validateIPCEvent(event);
  return process.platform;
});

ipcMain.handle('electron/get-version', (event) => {
  validateIPCEvent(event);
  return app.getVersion();
});

ipcMain.on('electron/show-main-window', (event) => {
  validateIPCEvent(event);
  showMainWindow('dashboard');
});

ipcMain.on('electron/hide-main-window', (event) => {
  validateIPCEvent(event);
  mainWindow?.hide();
});

ipcMain.on('electron/toggle-overlay-window', (event) => {
  validateIPCEvent(event);
  if (!widgetWindow) {
    widgetWindow = createWidgetWindow();
  }

  if (widgetWindow.isVisible()) {
    widgetWindow.hide();
  } else {
    widgetWindow.show();
  }
});

ipcMain.on('electron/set-overlay-window-visibility', (event, visible) => {
  validateIPCEvent(event);
  validateBoolean(visible, 'visible');
  if (!widgetWindow) {
    widgetWindow = createWidgetWindow();
  }

  if (visible) {
    widgetWindow.show();
  } else {
    widgetWindow.hide();
  }
});

ipcMain.on('electron/set-overlay-click-through', (event, enabled) => {
  validateIPCEvent(event);
  validateBoolean(enabled, 'enabled');
  if (widgetWindow) {
    widgetWindow.setIgnoreMouseEvents(enabled, { forward: true });
  }
});

ipcMain.on('electron/set-always-on-top', (event, enabled) => {
  validateIPCEvent(event);
  validateBoolean(enabled, 'enabled');
  mainWindow?.setAlwaysOnTop(enabled);
  widgetWindow?.setAlwaysOnTop(enabled);
});

ipcMain.handle('electron/get-run-at-login', (event) => {
  validateIPCEvent(event);
  return app.getLoginItemSettings().openAtLogin;
});

ipcMain.on('electron/set-run-at-login', (event, enabled) => {
  validateIPCEvent(event);
  validateBoolean(enabled, 'enabled');
  configureStartup(enabled);
});

ipcMain.on('electron/open-dashboard', (event) => {
  validateIPCEvent(event);
  showMainWindow('dashboard');
  widgetWindow?.hide();
});

ipcMain.on('electron/open-settings', (event) => {
  validateIPCEvent(event);
  showMainWindow('settings');
  widgetWindow?.hide();
});

ipcMain.on('electron/open-widget-mode', (event) => {
  validateIPCEvent(event);
  showWidgetWindow();
});

ipcMain.on('electron/restart-widgets', (event) => {
  validateIPCEvent(event);
  restartWidgetWindow();
});
