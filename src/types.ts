export interface Category {
  id: string
  name: string
  color: string
  emoji: string
}

export interface CategoryPlan {
  categoryId: string
  targetPercent: number
}

export interface CategoryLog {
  categoryId: string
  actualPercent: number
  notes: string
}

export type Priority = 'high' | 'medium' | 'low'

export interface BacklogItem {
  id: string
  title: string
  categoryId: string
  notes: string
  priority: Priority
  createdAt: string
  status: 'active' | 'done'
  scheduledDate?: string   // YYYY-MM-DD: which day it's assigned to
}

export interface DayEntry {
  date: string             // YYYY-MM-DD
  plan: CategoryPlan[]
  log: CategoryLog[]
  isVictory: boolean
  victoryScore: number
  taskIds: string[]        // backlog item IDs assigned to this day
  completedTaskIds: string[] // backlog item IDs completed on this day
  plannedAt?: string
  loggedAt?: string
}

export interface AppData {
  categories: Category[]
  days: Record<string, DayEntry>
  backlog: BacklogItem[]
}

export type View = 'plan' | 'weekly' | 'backlog' | 'categories'

export function calculateScore(plan: CategoryPlan[], log: CategoryLog[]): number {
  if (!plan.length) return 0
  const totalTarget = plan.reduce((sum, p) => sum + p.targetPercent, 0)
  if (totalTarget === 0) return 0
  let earned = 0
  plan.forEach(p => {
    const actual = log.find(l => l.categoryId === p.categoryId)?.actualPercent ?? 0
    earned += Math.min(actual, p.targetPercent)
  })
  return Math.round((earned / totalTarget) * 100)
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function getWeekDays(date: Date = new Date()): string[] {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const wd = new Date(d)
    wd.setDate(d.getDate() + i)
    return wd.toISOString().split('T')[0]
  })
}

declare global {
  interface Window {
    electronAPI: {
      loadData: () => Promise<AppData>
      saveData: (data: AppData) => Promise<boolean>
      getVersion: () => Promise<string>
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
    }
  }
}
