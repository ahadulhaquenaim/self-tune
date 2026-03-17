import { Category, DayEntry, BacklogItem, getWeekDays, getTodayString } from '../types'

interface Props {
  categories: Category[]
  days: Record<string, DayEntry>
  backlog: BacklogItem[]
}

export default function WeeklyReport({ categories, days, backlog }: Props) {
  const today = getTodayString()
  const weekDays = getWeekDays()
  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Collect all completed task IDs for the week
  const weekCompletedIds: string[] = []
  weekDays.forEach(d => {
    const entry = days[d]
    if (entry?.completedTaskIds?.length) {
      weekCompletedIds.push(...entry.completedTaskIds)
    }
  })

  const totalCompleted = weekCompletedIds.length
  const activeDays = weekDays.filter(d => (days[d]?.completedTaskIds?.length ?? 0) > 0).length

  // Count completed tasks per category
  const catCounts: Record<string, number> = {}
  categories.forEach(c => { catCounts[c.id] = 0 })
  weekCompletedIds.forEach(taskId => {
    const task = backlog.find(b => b.id === taskId)
    if (task && catCounts[task.categoryId] !== undefined) {
      catCounts[task.categoryId]++
    }
  })

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Weekly Report</div>
        <div className="page-subtitle">
          {new Date(weekDays[0] + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          {' – '}
          {new Date(weekDays[6] + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="week-stat-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{totalCompleted}</div>
          <div className="stat-label">Tasks Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{activeDays}/7</div>
          <div className="stat-label">Active Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {activeDays > 0 ? Math.round(totalCompleted / activeDays) : 0}
          </div>
          <div className="stat-label">Avg Tasks/Day</div>
        </div>
      </div>

      {/* Day cards */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Day by Day</div>
        <div className="week-grid">
          {weekDays.map((date, i) => {
            const entry = days[date]
            const isToday = date === today
            const isFuture = date > today
            const count = entry?.completedTaskIds?.length ?? 0

            let icon: string
            if (isFuture) icon = '…'
            else if (count > 0) icon = `${count}✓`
            else icon = '⬜'

            const dayNum = new Date(date + 'T00:00:00').getDate()

            return (
              <div
                key={date}
                className={`day-card ${isToday ? 'today' : ''} ${count > 0 ? 'victory' : ''} ${isFuture && !isToday ? 'empty' : ''}`}
              >
                <div className="day-name">{DAY_NAMES[i]}</div>
                <div className="day-num">{dayNum}</div>
                <div className="day-icon">{icon}</div>
                {count > 0 && (
                  <div className="day-score" style={{ color: 'var(--success)' }}>
                    {count} task{count !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Category breakdown */}
      {totalCompleted > 0 ? (
        <div className="card">
          <div className="card-title">Category Breakdown</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
            Share of completed tasks this week
          </div>
          {categories.map(cat => {
            const count = catCounts[cat.id] ?? 0
            if (count === 0) return null
            const pct = Math.round((count / totalCompleted) * 100)
            return (
              <div key={cat.id} className="cat-week-row">
                <div className="cat-week-name">
                  <span>{cat.emoji}</span>
                  <span style={{ color: 'var(--text)' }}>{cat.name}</span>
                </div>
                <div className="cat-week-bar-wrap">
                  <div
                    className="cat-week-bar-fill"
                    style={{ width: `${pct}%`, background: cat.color }}
                  />
                </div>
                <div className="cat-week-pct" style={{ color: cat.color }}>{pct}%</div>
              </div>
            )
          })}
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, textAlign: 'right' }}>
            {totalCompleted} total tasks completed
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No tasks completed yet this week</div>
          <div className="empty-state-text">Add tasks from your Backlog to Today's Plan and mark them done. Your weekly report will appear here.</div>
        </div>
      )}
    </div>
  )
}
