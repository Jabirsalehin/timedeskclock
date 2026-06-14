Mobile Widgets Architecture for TimeDesk

Goal:
- Prepare scalable architecture for Android/iOS Home & Lock Screen widgets without implementing native code yet.

Principles:
- Keep clock rendering logic platform-agnostic and export a small renderer API.
- Share formatting and scheduling logic via a lightweight core module (JS/TS).
- Provide small JSON manifest per widget describing size presets, supported refresh cadence, and interactive actions.

Structure:
- /src/widgets/core/
  - renderer.tsx -> small, dependency-free rendering helpers that can be embedded in native wrappers.
  - schedule.ts  -> background schedule helpers to compute next update times (second, minute, hourly)
  - manifest.ts  -> widget manifest helpers

Future native integration notes:
- Android App Widgets and iOS WidgetKit wrappers should call into the core JS logic (via React Native, Capacitor, or a tiny nodejs service) for time/data formatting.
- Keep visual assets (fonts, icons) in a separate assets/manifest for easy bundling.

Recommendations:
- Expose `renderClockSnapshot(size, theme, timestamp)` that returns a small HTML/SVG/Canvas snapshot for native widget rendering.
- Limit refresh cadence to minute-level for battery savings on mobile, with optional real-time (second) for lock-screen implementations.
- Design interaction intents (open app, start timer, toggle pomodoro) as small URI actions for native platforms.

Notes:
- This document is a planning artifact only; no native implementation was added yet.
