import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// ── Data storage ──────────────────────────────────────────────────────────────
const dataFilePath = path.join(app.getPath('userData'), 'self-tune-data.json')

function getDefaultData() {
  return {
    categories: [
      { id: 'dsa', name: 'DSA', color: '#f97316', emoji: '🧮' },
      { id: 'dev', name: 'Development', color: '#3b82f6', emoji: '💻' },
      { id: 'sysdesign', name: 'System Design', color: '#8b5cf6', emoji: '🏗️' },
      { id: 'running', name: 'Running', color: '#22c55e', emoji: '🏃' },
    ],
    days: {},
  }
}

function loadData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Failed to load data:', e)
  }
  return getDefaultData()
}

function saveData(data: unknown) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (e) {
    console.error('Failed to save data:', e)
    return false
  }
}

// ── IPC handlers ──────────────────────────────────────────────────────────────
ipcMain.handle('data:load', () => loadData())
ipcMain.handle('data:save', (_event, data) => saveData(data))
ipcMain.handle('app:version', () => app.getVersion())
ipcMain.on('window:minimize', () => win?.minimize())
ipcMain.on('window:maximize', () => {
  if (win?.isMaximized()) win.unmaximize()
  else win?.maximize()
})
ipcMain.on('window:close', () => win?.close())
ipcMain.on('shell:openExternal', (_event, url: string) => shell.openExternal(url))

// ── Window ────────────────────────────────────────────────────────────────────
let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1120,
    height: 740,
    minWidth: 860,
    minHeight: 620,
    frame: false,
    backgroundColor: '#0c0c1e',
    icon: path.join(process.env.VITE_PUBLIC!, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.whenReady().then(createWindow)
