#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const os = require('os')
const { execSync } = require('child_process')

const releaseDir = path.join(__dirname, '..', 'release')

if (!fs.existsSync(releaseDir)) {
  console.error('❌  No release/ directory found. Run: npm run electron:build')
  process.exit(1)
}

const files = fs.readdirSync(releaseDir)
const appImage = files.find(f => f.endsWith('.AppImage'))

if (!appImage) {
  console.error('❌  No AppImage found in release/. Run: npm run electron:build')
  process.exit(1)
}

const appImagePath = path.join(releaseDir, appImage)

// Make executable
execSync(`chmod +x "${appImagePath}"`)
console.log(`✓  AppImage: ${appImagePath}`)

// Icon path
const iconPath = path.join(__dirname, '..', 'public', 'icon.svg')

// Create .desktop file content
const desktopContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=Self Tune
Comment=Track your weekly progress and build consistency
Exec=${appImagePath}
Icon=${iconPath}
Terminal=false
Categories=Utility;Education;
Keywords=productivity;tracker;goals;weekly;consistency;
StartupWMClass=Self Tune
`

// Install to applications
const appsDir = path.join(os.homedir(), '.local', 'share', 'applications')
fs.mkdirSync(appsDir, { recursive: true })
const desktopFilePath = path.join(appsDir, 'self-tune.desktop')
fs.writeFileSync(desktopFilePath, desktopContent)
execSync(`chmod +x "${desktopFilePath}"`)
console.log(`✓  Desktop entry: ${desktopFilePath}`)

// Update desktop database
try { execSync('update-desktop-database ~/.local/share/applications', { stdio: 'ignore' }) } catch {}

// Copy to Desktop
const desktopDir = path.join(os.homedir(), 'Desktop')
if (fs.existsSync(desktopDir)) {
  const desktopShortcut = path.join(desktopDir, 'Self Tune.desktop')
  fs.writeFileSync(desktopShortcut, desktopContent)
  execSync(`chmod +x "${desktopShortcut}"`)
  // Trust desktop file (GNOME)
  try { execSync(`gio set "${desktopShortcut}" metadata::trusted true`, { stdio: 'ignore' }) } catch {}
  console.log(`✓  Desktop shortcut: ${desktopShortcut}`)
}

console.log('')
console.log('🎯  Self Tune installed!')
console.log('    You can launch it from your desktop or application launcher.')
