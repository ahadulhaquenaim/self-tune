import { useState, useEffect } from 'react'
import { Category, CategoryLog, DayEntry, BacklogItem, calculateScore, formatDate, getTodayString } from '../types'

interface Props {
  categories: Category[]
  todayEntry?: DayEntry
  backlogItems: BacklogItem[]
  onSubmit: (log: CategoryLog[], completedTaskIds: string[]) => void
}

export default function DailyLog({ categories, todayEntry, backlogItems, onSubmit }: Props) {
  const [log, setLog] = useState<Record<string, { percent: number; notes: string }>>({})
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const map: Record<string, { percent: number; notes: string }> = {}
    categories.forEach(c => {
      const existing = todayEntry?.log?.find(l => l.categoryId === c.id)
      map[c.id] = { percent: existing?.actualPercent ?? 0, notes: existing?.notes ?? '' }
    })
    setLog(map)
    setChecked(new Set(todayEntry?.completedTaskIds ?? []))
  }, [categories, todayEntry])

  const hasPlan = (todayEntry?.plan?.length ?? 0) > 0
  const todayTasks = backlogItems.filter(
    i => i.status === 'active' && (todayEntry?.taskIds ?? []).includes(i.id)
  )

  const logArr: CategoryLog[] = categories.map(c => ({
    categoryId: c.id,
    actualPercent: log[c.id]?.percent ?? 0,
    notes: log[c.id]?.notes ?? '',
  }))

  const total = logArr.reduce((s, l) => s + l.actualPercent, 0)
  const previewScore = hasPlan ? calculateScore(todayEntry!.plan, logArr) : 0
  const scoreColor = previewScore >= 75 ? 'var(--success)' : previewScore >= 50 ? 'var(--warning)' : 'var(--danger)'
  const totalClass = total === 100 ? 'ok' : total > 100 ? 'bad' : 'warn'

  const handleChange = (id: string, field: 'percent' | 'notes', val: string | number) => {
    setLog(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: field === 'percent'
          ? Math.max(0, Math.min(100, isNaN(Number(val)) ? 0 : Number(val)))
          : val,
      },
    }))
    setSubmitted(false)
  }

  const toggleTask = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setSubmitted(false)
  }

  const handleSubmit = () => {
    onSubmit(logArr, Array.from(checked))
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Today's Log</div>
        <div className="page-subtitle">{formatDate(getTodayString())} — Record what you actually did today</div>
      </div>

      {!hasPlan && (
        <div className="info-banner info">
          ℹ️ No plan set yet. You can still log your work, or set a plan first.
        </div>
      )}

      {todayEntry?.isVictory && (
        <div className="info-banner success">
          🏆 Victory achieved! Score: <strong>{todayEntry.victoryScore}%</strong> — You can still update your log.
        </div>
      )}

      {/* Time allocation */}
      <div className="card">
        <div className="card-title">Actual Time Allocation</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          How did you actually spend your time? Should total 100%.
        </div>

        {categories.map(cat => {
          const target = todayEntry?.plan?.find(p => p.categoryId === cat.id)?.targetPercent ?? null
          const actual = log[cat.id]?.percent ?? 0

          return (
            <div key={cat.id} className="log-compare-row">
              <div className="log-compare-top">
                <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                <span className="log-compare-name">{cat.name}</span>
                {target !== null && (
                  <span className="log-compare-target">Target: {target}%</span>
                )}
                <input
                  className="cat-percent-input"
                  type="number" min={0} max={100}
                  value={actual}
                  onChange={e => handleChange(cat.id, 'percent', parseInt(e.target.value, 10))}
                />
                <span className="percent-symbol">%</span>
              </div>

              {target !== null ? (
                <div className="log-bar-group">
                  <div className="log-bar-label"><span>Target</span><span>{target}%</span></div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${target}%`, background: cat.color, opacity: 0.35 }} />
                  </div>
                  <div className="log-bar-label" style={{ marginTop: 4 }}><span>Actual</span><span>{actual}%</span></div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${actual}%`, background: cat.color }} />
                  </div>
                </div>
              ) : (
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${actual}%`, background: cat.color }} />
                </div>
              )}

              <textarea
                className="notes-input"
                placeholder={`Notes for ${cat.name}…`}
                value={log[cat.id]?.notes ?? ''}
                onChange={e => handleChange(cat.id, 'notes', e.target.value)}
                rows={1}
              />
            </div>
          )
        })}

        <div className={`total-row ${totalClass}`}>
          <span>Total logged</span>
          <span style={{ fontSize: 17, fontWeight: 800 }}>
            {total}%
            {total !== 100 && (
              <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8 }}>
                {total > 100 ? `(${total - 100} over)` : `(${100 - total} remaining)`}
              </span>
            )}
          </span>
        </div>

        {hasPlan && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginTop: 12, padding: '12px 14px',
            background: 'var(--surface2)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Achievement Score:</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: scoreColor }}>{previewScore}%</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {previewScore >= 75 ? '🏆 Victory!' : previewScore >= 50 ? '⚡ Getting there…' : '💪 Keep pushing!'}
            </span>
          </div>
        )}
      </div>

      {/* Task checklist */}
      {todayTasks.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="card-title" style={{ margin: 0 }}>Today's Tasks</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {checked.size}/{todayTasks.length} done
            </span>
          </div>

          {todayTasks.map(task => {
            const cat = categories.find(c => c.id === task.categoryId)
            const isChecked = checked.has(task.id)
            return (
              <div key={task.id} className="task-check-item">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTask(task.id)}
                />
                <span style={{ fontSize: 16 }}>{cat?.emoji ?? '📌'}</span>
                <span className={`task-check-title ${isChecked ? 'checked' : ''}`}>
                  {task.title}
                </span>
                {task.notes && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.notes}</span>
                )}
              </div>
            )
          })}

          {checked.size === todayTasks.length && todayTasks.length > 0 && (
            <div style={{
              marginTop: 12, padding: '8px 12px',
              background: 'var(--success-dim)', color: 'var(--success)',
              borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600,
            }}>
              🎉 All tasks completed!
            </div>
          )}
        </div>
      )}

      <div className="btn-row">
        <button className="btn btn-primary" onClick={handleSubmit}>
          {submitted ? '✓ Logged!' : '📝 Submit Log'}
        </button>
      </div>
    </div>
  )
}
