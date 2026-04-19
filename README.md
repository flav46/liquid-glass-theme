# Liquid Glass Theme Desktop App

A beautiful desktop application with liquid glass effects, built with React, TypeScript, and Electron. Originally inspired by iPhone aesthetics, now available as a cross-platform desktop app.

## Features

- 🌊 Liquid glass theme with animated backgrounds
- 📱 Functional app drawer with working applications
- ⚙️ Settings, Calculator, Notepad, File Explorer, Paint, and Browser
- 🎨 Smooth animations and glassmorphism effects
- 🖥️ Cross-platform desktop application (Linux, macOS, Windows)

## Quick Start for Linux Users

### Option 1: Use the Pre-Built AppImage (Easiest)

The application is pre-built and ready to run:

```bash
cd dist-electron
chmod +x "Liquid Glass Theme-1.0.0.AppImage"
./Liquid\ Glass\ Theme-1.0.0.AppImage
```

### Option 2: Build from Source

```bash
# Install dependencies
npm install

# Build the Electron app for Linux
npm run build-electron-linux

# Run the generated AppImage
./dist-electron/Liquid\ Glass\ Theme-1.0.0.AppImage
```

### Option 3: Install System-Wide

You can also install via package manager after building:

**DEB (Debian/Ubuntu):**
```bash
sudo dpkg -i dist-electron/liquid-glass-theme_1.0.0_amd64.deb
```

**RPM (Fedora/RHEL):**
```bash
sudo rpm -i dist-electron/liquid-glass-theme-1.0.0.x86_64.rpm
```

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (web version)
npm run dev
```

### Electron Development

```bash
# Run Electron app in development mode
npm run electron-dev

# Or run separately:
npm run dev          # Start Vite dev server
npm run electron     # Start Electron (after Vite is running)
```

## Building for Distribution

### Build for Current Platform

```bash
npm run dist
```

### Build for Specific Platforms

```bash
# Linux
npm run build-electron-linux

# macOS
npm run build-electron-mac

# Windows
npm run build-electron-win

# All platforms
npm run build-electron
```

## Installation on Linux and macOS

### Linux

After building, you'll find the distributables in `dist-electron/`:

1. **AppImage** (Recommended for Linux):
   - `Liquid Glass Theme-1.0.0.AppImage`
   - Make executable: `chmod +x Liquid\ Glass\ Theme-1.0.0.AppImage`
   - Run: `./Liquid\ Glass\ Theme-1.0.0.AppImage`

2. **DEB Package**:
   - `liquid-glass-theme_1.0.0_amd64.deb`
   - Install: `sudo dpkg -i liquid-glass-theme_1.0.0_amd64.deb`

3. **RPM Package**:
   - `liquid-glass-theme-1.0.0.x86_64.rpm`
   - Install: `sudo rpm -i liquid-glass-theme-1.0.0.x86_64.rpm`

### macOS

After building, you'll find:

1. **DMG File**:
   - `Liquid Glass Theme-1.0.0.dmg` (Intel) or `Liquid Glass Theme-1.0.0-arm64.dmg` (Apple Silicon)
   - Open the DMG and drag the app to Applications folder

## App Icons

To add custom icons:

1. Place your icons in the `build/` directory:
   - `icon.png` (Linux - 512x512 recommended)
   - `icon.icns` (macOS)
   - `icon.ico` (Windows)

2. Update icon paths in `electron/main.js` and `package.json` if needed.

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Electron** - Desktop app framework
- **Framer Motion** - Animations
- **CSS** - Glassmorphism effects

## Project Structure

```
├── electron/           # Electron main process
│   ├── main.js        # Main Electron process
│   └── preload.js     # Preload script
├── src/               # React application
│   ├── components/    # React components
│   └── App.css        # Global styles
├── build/             # Build assets (icons)
├── dist/              # Built React app
└── dist-electron/     # Built Electron apps
```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build React app for production
- `npm run electron` - Run Electron app
- `npm run electron-dev` - Run both Vite and Electron in development
- `npm run dist` - Build Electron app for current platform
- `npm run build-electron-linux` - Build for Linux
- `npm run build-electron-mac` - Build for macOS
- `npm run build-electron-win` - Build for Windows

## License

MIT License
