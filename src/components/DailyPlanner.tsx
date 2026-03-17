import { useState, useEffect } from 'react'
import { Category, CategoryPlan, DayEntry, BacklogItem, formatDate, getTodayString } from '../types'

interface Props {
  categories: Category[]
  todayEntry?: DayEntry
  backlogItems: BacklogItem[]
  onSave: (plan: CategoryPlan[]) => void
  onUnscheduleTask: (itemId: string) => void
}

export default function DailyPlanner({ categories, todayEntry, backlogItems, onSave, onUnscheduleTask }: Props) {
  const [plan, setPlan] = useState<Record<string, number>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (todayEntry?.plan?.length) {
      const map: Record<string, number> = {}
      todayEntry.plan.forEach(p => { map[p.categoryId] = p.targetPercent })
      setPlan(map)
    } else {
      const equal = Math.floor(100 / categories.length)
      const map: Record<string, number> = {}
      categories.forEach((c, i) => {
        map[c.id] = i === categories.length - 1 ? 100 - equal * (categories.length - 1) : equal
      })
      setPlan(map)
    }
  }, [categories, todayEntry])

  const total = Object.values(plan).reduce((s, v) => s + (v || 0), 0)
  const isValid = total === 100
  const totalClass = total === 100 ? 'ok' : total > 100 ? 'bad' : 'warn'

  const todayTasks = backlogItems.filter(
    i => i.status === 'active' && (todayEntry?.taskIds ?? []).includes(i.id)
  )

  const handleChange = (id: string, val: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val))
    setPlan(prev => ({ ...prev, [id]: clamped }))
    setSaved(false)
  }

  const handleSave = () => {
    if (!isValid) return
    const planArr: CategoryPlan[] = categories
      .filter(c => (plan[c.id] ?? 0) > 0)
      .map(c => ({ categoryId: c.id, targetPercent: plan[c.id] ?? 0 }))
    onSave(planArr)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Today's Plan</div>
        <div className="page-subtitle">{formatDate(getTodayString())} — Set your focus targets for today</div>
      </div>

      {todayEntry?.isVictory && (
        <div className="info-banner success">🏆 You hit your goals yesterday! Keep the streak going.</div>
      )}

      {/* Focus allocation */}
      <div className="card">
        <div className="card-title">Focus Allocation</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          Set target % per area — must total 100%.
        </div>

        {categories.map(cat => (
          <div key={cat.id} className="cat-row">
            <span className="cat-emoji">{cat.emoji}</span>
            <span className="cat-name">{cat.name}</span>
            <div className="progress-bar-wrap" style={{ maxWidth: 180 }}>
              <div className="progress-bar-fill" style={{ width: `${plan[cat.id] ?? 0}%`, background: cat.color }} />
            </div>
            <input
              className="cat-percent-input"
              type="number" min={0} max={100}
              value={plan[cat.id] ?? 0}
              onChange={e => handleChange(cat.id, parseInt(e.target.value, 10))}
            />
            <span className="percent-symbol">%</span>
          </div>
        ))}

        <div className={`total-row ${totalClass}`}>
          <span>Total</span>
          <span style={{ fontSize: 17, fontWeight: 800 }}>
            {total}%
            {total !== 100 && (
              <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8 }}>
                {total > 100 ? `(${total - 100} over)` : `(${100 - total} remaining)`}
              </span>
            )}
          </span>
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={handleSave} disabled={!isValid}>
            {saved ? '✓ Saved!' : '💾 Save Plan'}
          </button>
          {todayEntry?.plan?.length ? (
            <button className="btn btn-ghost" onClick={() => {
              const map: Record<string, number> = {}
              todayEntry.plan.forEach(p => { map[p.categoryId] = p.targetPercent })
              setPlan(map); setSaved(false)
            }}>↩ Restore</button>
          ) : null}
        </div>
      </div>

      {/* Today's tasks from backlog */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="card-title" style={{ margin: 0 }}>Today's Tasks from Backlog</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {todayTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            <div style={{ fontSize: 13 }}>No tasks yet.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Go to <strong>Backlog</strong> and click <strong>"Add to Today"</strong> to pull tasks in.
            </div>
          </div>
        ) : (
          todayTasks.map(task => {
            const cat = categories.find(c => c.id === task.categoryId)
            return (
              <div key={task.id} className="task-check-item" style={{ alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18, paddingTop: 2 }}>{cat?.emoji ?? '📌'}</span>
                <div style={{ flex: 1 }}>
                  <div className="task-check-title">{task.title}</div>
                  {task.notes && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{task.notes}</div>
                  )}
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: 11, padding: '3px 9px' }}
                  onClick={() => onUnscheduleTask(task.id)}
                >✕</button>
              </div>
            )
          })
        )}
      </div>

      {/* Saved plan summary */}
      {todayEntry?.plan?.length ? (
        <div className="card">
          <div className="card-title">Saved Plan</div>
          {categories.map(cat => {
            const p = todayEntry.plan.find(x => x.categoryId === cat.id)
            if (!p) return null
            return (
              <div key={cat.id} className="cat-row">
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name">{cat.name}</span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${p.targetPercent}%`, background: cat.color }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15, width: 40, textAlign: 'right' }}>
                  {p.targetPercent}%
                </span>
              </div>
            )
          })}
          {todayEntry.plannedAt && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
              Saved at {new Date(todayEntry.plannedAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
