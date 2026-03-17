import { Category, DayEntry, getWeekDays, getTodayString } from '../types'

interface Props {
  categories: Category[]
  days: Record<string, DayEntry>
}

export default function WeeklyReport({ categories, days }: Props) {
  const today = getTodayString()
  const weekDays = getWeekDays()
  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const victories = weekDays.filter(d => days[d]?.isVictory).length
  const logged = weekDays.filter(d => days[d]?.loggedAt).length
  const consistency = logged > 0 ? Math.round((victories / logged) * 100) : 0

  // Current streak from today back
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (days[key]?.isVictory) streak++
    else if (i > 0) break
  }

  // Category totals for the week (average of actual %)
  const catTotals: Record<string, number[]> = {}
  categories.forEach(c => { catTotals[c.id] = [] })
  weekDays.forEach(d => {
    const entry = days[d]
    entry?.log?.forEach(l => {
      if (catTotals[l.categoryId]) catTotals[l.categoryId].push(l.actualPercent)
    })
  })

  const avgScore = weekDays
    .filter(d => days[d]?.victoryScore)
    .map(d => days[d].victoryScore)
    .reduce((s, v, _, arr) => s + v / arr.length, 0)

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
          <div className="stat-value" style={{ color: 'var(--success)' }}>{victories}/7</div>
          <div className="stat-label">Victories</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{consistency}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>🔥 {streak}</div>
          <div className="stat-label">Current Streak</div>
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
            const hasVictory = entry?.isVictory
            const hasLog = !!entry?.loggedAt
            const hasPlan = !!entry?.plan?.length

            let icon = '⬜'
            if (isFuture) icon = '…'
            else if (hasVictory) icon = '🏆'
            else if (hasLog) icon = `${entry.victoryScore}%`
            else if (hasPlan) icon = '📋'

            const dayNum = new Date(date + 'T00:00:00').getDate()

            return (
              <div
                key={date}
                className={`day-card ${isToday ? 'today' : ''} ${hasVictory ? 'victory' : ''} ${isFuture && !isToday ? 'empty' : ''}`}
              >
                <div className="day-name">{DAY_NAMES[i]}</div>
                <div className="day-num">{dayNum}</div>
                <div className="day-icon">{icon}</div>
                {entry?.victoryScore !== undefined && entry.victoryScore > 0 && (
                  <div
                    className="day-score"
                    style={{ color: hasVictory ? 'var(--success)' : 'var(--warning)' }}
                  >
                    {entry.victoryScore}%
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Category breakdown */}
      {logged > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Category Breakdown (Weekly Avg)</div>
          {categories.map(cat => {
            const arr = catTotals[cat.id]
            if (!arr.length) return null
            const avg = Math.round(arr.reduce((s, v) => s + v, 0) / arr.length)
            return (
              <div key={cat.id} className="cat-week-row">
                <div className="cat-week-name">
                  <span>{cat.emoji}</span>
                  <span style={{ color: 'var(--text)' }}>{cat.name}</span>
                </div>
                <div className="cat-week-bar-wrap">
                  <div
                    className="cat-week-bar-fill"
                    style={{ width: `${avg}%`, background: cat.color }}
                  />
                </div>
                <div className="cat-week-pct" style={{ color: cat.color }}>{avg}%</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Daily detail */}
      {weekDays.filter(d => days[d]?.loggedAt).length > 0 && (
        <div className="card">
          <div className="card-title">Daily Detail</div>
          {weekDays.map((date, i) => {
            const entry = days[date]
            if (!entry?.loggedAt) return null
            return (
              <div key={date} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>
                    {DAY_NAMES[i]}, {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span
                    className={`score-badge ${entry.isVictory ? 'victory' : 'defeat'}`}
                  >
                    {entry.isVictory ? '🏆' : '💪'} {entry.victoryScore}%
                  </span>
                </div>
                {categories.map(cat => {
                  const log = entry.log?.find(l => l.categoryId === cat.id)
                  const plan = entry.plan?.find(p => p.categoryId === cat.id)
                  if (!log && !plan) return null
                  return (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 14 }}>{cat.emoji}</span>
                      <span style={{ width: 120, fontSize: 13, color: 'var(--text-secondary)' }}>{cat.name}</span>
                      <div style={{ flex: 1, height: 6, background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${log?.actualPercent ?? 0}%`, height: '100%', background: cat.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ width: 34, textAlign: 'right', fontSize: 12, fontWeight: 700, color: cat.color }}>
                        {log?.actualPercent ?? 0}%
                      </span>
                      {plan && (
                        <span style={{ width: 44, textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
                          /{plan.targetPercent}%
                        </span>
                      )}
                    </div>
                  )
                })}
                {entry.log?.some(l => l.notes) && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontStyle: 'italic' }}>
                    {entry.log.filter(l => l.notes).map(l => {
                      const cat = categories.find(c => c.id === l.categoryId)
                      return cat ? `${cat.emoji} ${l.notes}` : l.notes
                    }).join(' · ')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {logged === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No logs yet this week</div>
          <div className="empty-state-text">Start by making a plan and logging your daily work. Your weekly report will appear here.</div>
        </div>
      )}
    </div>
  )
}
