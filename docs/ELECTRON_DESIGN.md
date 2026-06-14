Desktop Overlay — Electron Integration Notes

Goal: Prepare Electron architecture for a transparent, always-on-top desktop overlay window that displays TimeDesk without hiding the user's wallpaper.

Key Window Options
- transparent: true
- frame: false (frameless)
- alwaysOnTop: true
- skipTaskbar: true
- focusable: false (when click-through enabled)
- resizable: true/false depending on layout

Sample main process (conceptual)

// main.js
const { app, BrowserWindow } = require('electron');
function createOverlay() {
  const overlay = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  overlay.setIgnoreMouseEvents(false); // toggle for click-through
  overlay.loadURL('http://localhost:5173');
}

Notes & Considerations
- On Windows, use `transparent: true` and `setIgnoreMouseEvents(true, { forward: true })` to allow click-through while still processing specific elements.
- On macOS, use `overlay.setAlwaysOnTop(true, 'screen-saver')` for maximum persistence behind other windows.
- Use a second hidden window or a tray menu to manage overlay toggles and settings.
- Keep the overlay renderer lightweight; avoid heavy background tasks when overlay is active.

Security
- Use contextIsolation and disable nodeIntegration in overlay windows.
- Only expose minimal IPC endpoints for toggling overlay settings.

This document is a design scaffold — actual Electron integration requires packaging and platform testing.
