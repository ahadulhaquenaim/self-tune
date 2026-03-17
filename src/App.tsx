import { useState, useEffect, useCallback } from 'react'
import {
  AppData, View, DayEntry, BacklogItem,
  getTodayString, getWeekDays
} from './types'
import Sidebar from './components/Sidebar'
import DailyPlanner from './components/DailyPlanner'
import WeeklyReport from './components/WeeklyReport'
import CategoryManager from './components/CategoryManager'
import Backlog from './components/Backlog'

function Titlebar() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })
  return (
    <div className="titlebar">
      <div className="titlebar-left">
        <div className="titlebar-logo">🎯</div>
        Self Tune
      </div>
      <div className="titlebar-center">{today}</div>
      <div className="titlebar-controls">
        <button className="titlebar-btn" onClick={() => window.electronAPI?.minimizeWindow()} title="Minimize">—</button>
        <button className="titlebar-btn" onClick={() => window.electronAPI?.maximizeWindow()} title="Maximize">⬜</button>
        <button className="titlebar-btn close" onClick={() => window.electronAPI?.closeWindow()} title="Close">✕</button>
      </div>
    </div>
  )
}

const DEFAULT_DATA: AppData = {
  categories: [
    { id: 'dsa', name: 'DSA', color: '#f97316', emoji: '🧮' },
    { id: 'dev', name: 'Development', color: '#3b82f6', emoji: '💻' },
    { id: 'sysdesign', name: 'System Design', color: '#8b5cf6', emoji: '🏗️' },
    { id: 'running', name: 'Running', color: '#22c55e', emoji: '🏃' },
  ],
  days: {},
  backlog: [],
}

function ensureDayEntry(entry: Partial<DayEntry> | undefined, date: string): DayEntry {
  return {
    date,
    plan: [],
    log: [],
    isVictory: false,
    victoryScore: 0,
    taskIds: [],
    completedTaskIds: [],
    ...entry,
  }
}

function randomId() {
  return Math.random().toString(36).slice(2, 12)
}

export default function App() {
  const [data, setData] = useState<AppData | null>(null)
  const [view, setView] = useState<View>('plan')
  const today = getTodayString()

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.loadData().then(loaded => {
        const d = loaded || DEFAULT_DATA
        if (!d.backlog) d.backlog = []
        setData(d)
      })
    } else {
      try {
        const saved = localStorage.getItem('self-tune-data')
        const d = saved ? JSON.parse(saved) : DEFAULT_DATA
        if (!d.backlog) d.backlog = []
        setData(d)
      } catch { setData(DEFAULT_DATA) }
    }
  }, [])

  const persist = useCallback(async (newData: AppData) => {
    setData(newData)
    if (window.electronAPI) {
      await window.electronAPI.saveData(newData)
    } else {
      localStorage.setItem('self-tune-data', JSON.stringify(newData))
    }
  }, [])

  // ── Day handlers ─────────────────────────────────────────────────────
  const handleCompleteTask = async (itemId: string) => {
    if (!data) return
    const entry = ensureDayEntry(data.days[today], today)
    if (entry.completedTaskIds.includes(itemId)) return
    const updated: DayEntry = {
      ...entry,
      completedTaskIds: [...entry.completedTaskIds, itemId],
    }
    const backlog = data.backlog.map(i =>
      i.id === itemId ? { ...i, status: 'done' as const } : i
    )
    await persist({ ...data, days: { ...data.days, [today]: updated }, backlog })
  }

  const handleSaveCategories = async (categories: AppData['categories']) => {
    if (!data) return
    await persist({ ...data, categories })
  }

  // ── Backlog handlers ─────────────────────────────────────────────────
  const handleAddBacklog = async (item: Omit<BacklogItem, 'id' | 'createdAt' | 'status'>) => {
    if (!data) return
    const newItem: BacklogItem = {
      ...item,
      id: randomId(),
      createdAt: new Date().toISOString(),
      status: 'active',
    }
    await persist({ ...data, backlog: [newItem, ...data.backlog] })
  }

  const handleScheduleToday = async (itemId: string) => {
    if (!data) return
    const entry = ensureDayEntry(data.days[today], today)
    if (entry.taskIds.includes(itemId)) return
    const updated = { ...entry, taskIds: [...entry.taskIds, itemId] }
    const backlog = data.backlog.map(i =>
      i.id === itemId ? { ...i, scheduledDate: today } : i
    )
    await persist({ ...data, days: { ...data.days, [today]: updated }, backlog })
  }

  const handleUnschedule = async (itemId: string) => {
    if (!data) return
    const entry = ensureDayEntry(data.days[today], today)
    const updated = { ...entry, taskIds: entry.taskIds.filter(id => id !== itemId) }
    const backlog = data.backlog.map(i =>
      i.id === itemId ? { ...i, scheduledDate: undefined } : i
    )
    await persist({ ...data, days: { ...data.days, [today]: updated }, backlog })
  }

  const handleMarkDone = async (itemId: string) => {
    if (!data) return
    const backlog = data.backlog.map(i =>
      i.id === itemId ? { ...i, status: 'done' as const } : i
    )
    await persist({ ...data, backlog })
  }

  const handleDeleteBacklog = async (itemId: string) => {
    if (!data) return
    const backlog = data.backlog.filter(i => i.id !== itemId)
    const days = { ...data.days }
    Object.keys(days).forEach(date => {
      days[date] = {
        ...days[date],
        taskIds: days[date].taskIds?.filter(id => id !== itemId) ?? [],
        completedTaskIds: days[date].completedTaskIds?.filter(id => id !== itemId) ?? [],
      }
    })
    await persist({ ...data, backlog, days })
  }

  if (!data) {
    return (
      <div className="loading">
        <div className="titlebar-logo" style={{ width: 48, height: 48, fontSize: 28, borderRadius: 12 }}>🎯</div>
        <div className="loading-dot"><span /><span /><span /></div>
      </div>
    )
  }

  const todayEntry = data.days[today]
  const weekDays = getWeekDays()
  const weekCompletions = weekDays.reduce((sum, d) => sum + (data.days[d]?.completedTaskIds?.length ?? 0), 0)
  const activeBacklog = data.backlog.filter(i => i.status === 'active').length
  const todayTaskIds = todayEntry?.taskIds ?? []

  return (
    <div className="app-layout">
      <Titlebar />
      <div className="app-body">
        <Sidebar
          view={view}
          onChangeView={setView}
          todayEntry={todayEntry}
          weekCompletions={weekCompletions}
          backlogCount={activeBacklog}
          todayTaskCount={todayTaskIds.length}
        />
        <main className="main-content">
          {view === 'plan' && (
            <DailyPlanner
              categories={data.categories}
              todayEntry={todayEntry}
              backlogItems={data.backlog}
              onUnscheduleTask={handleUnschedule}
              onCompleteTask={handleCompleteTask}
            />
          )}
          {view === 'weekly' && (
            <WeeklyReport
              categories={data.categories}
              days={data.days}
              backlog={data.backlog}
            />
          )}
          {view === 'backlog' && (
            <Backlog
              items={data.backlog}
              categories={data.categories}
              todayTaskIds={todayTaskIds}
              onAddItem={handleAddBacklog}
              onScheduleToday={handleScheduleToday}
              onUnschedule={handleUnschedule}
              onMarkDone={handleMarkDone}
              onDelete={handleDeleteBacklog}
            />
          )}
          {view === 'categories' && (
            <CategoryManager
              categories={data.categories}
              onSave={handleSaveCategories}
            />
          )}
        </main>
      </div>
    </div>
  )
}
