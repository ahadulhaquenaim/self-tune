import { Category, DayEntry, BacklogItem, formatDate, getTodayString } from '../types'

interface Props {
  categories: Category[]
  todayEntry?: DayEntry
  backlogItems: BacklogItem[]
  onUnscheduleTask: (itemId: string) => void
  onCompleteTask: (itemId: string) => void
}

export default function DailyPlanner({ categories, todayEntry, backlogItems, onUnscheduleTask, onCompleteTask }: Props) {
  const completedIds = todayEntry?.completedTaskIds ?? []

  const todayTasks = backlogItems.filter(
    i => (todayEntry?.taskIds ?? []).includes(i.id)
  )

  const activeTasks = todayTasks.filter(t => !completedIds.includes(t.id))
  const doneTasks = todayTasks.filter(t => completedIds.includes(t.id))

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Today's Plan</div>
        <div className="page-subtitle">{formatDate(getTodayString())} — Your tasks for today</div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="card-title" style={{ margin: 0 }}>Today's Tasks</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {doneTasks.length} done / {todayTasks.length} total
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
          <>
            {activeTasks.map(task => {
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
                    className="btn btn-primary"
                    style={{ fontSize: 11, padding: '3px 9px' }}
                    onClick={() => onCompleteTask(task.id)}
                  >✓ Done</button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11, padding: '3px 9px' }}
                    onClick={() => onUnscheduleTask(task.id)}
                  >✕</button>
                </div>
              )
            })}

            {doneTasks.length > 0 && (
              <>
                {activeTasks.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-soft)', margin: '10px 0' }} />
                )}
                {doneTasks.map(task => {
                  const cat = categories.find(c => c.id === task.categoryId)
                  return (
                    <div key={task.id} className="task-check-item" style={{ alignItems: 'flex-start', gap: 10, opacity: 0.5 }}>
                      <span style={{ fontSize: 18, paddingTop: 2 }}>{cat?.emoji ?? '📌'}</span>
                      <div style={{ flex: 1 }}>
                        <div className="task-check-title" style={{ textDecoration: 'line-through' }}>{task.title}</div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>✓</span>
                    </div>
                  )
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
