import { View, DayEntry } from '../types'

interface Props {
  view: View
  onChangeView: (v: View) => void
  todayEntry?: DayEntry
  weekCompletions: number
  backlogCount: number
  todayTaskCount: number
}

const navItems: { view: View; icon: string; label: string }[] = [
  { view: 'plan', icon: '📅', label: "Today's Plan" },
  { view: 'weekly', icon: '📊', label: 'Weekly Report' },
  { view: 'backlog', icon: '📋', label: 'Backlog' },
  { view: 'categories', icon: '🏷️', label: 'Categories' },
]

export default function Sidebar({
  view, onChangeView, todayEntry,
  weekCompletions, backlogCount, todayTaskCount,
}: Props) {
  const todayDone = todayEntry?.completedTaskIds?.length ?? 0
  const todayTotal = todayEntry?.taskIds?.length ?? 0

  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">Menu</div>
      {navItems.map(item => (
        <div
          key={item.view}
          className={`nav-item ${view === item.view ? 'active' : ''}`}
          onClick={() => onChangeView(item.view)}
        >
          <span className="nav-item-icon">{item.icon}</span>
          {item.label}
          {item.view === 'plan' && todayTotal > 0 && (
            <span style={{
              marginLeft: 'auto', fontSize: 11, fontWeight: 700,
              color: todayDone === todayTotal ? 'var(--success)' : 'var(--accent)',
            }}>
              {todayDone}/{todayTotal}
            </span>
          )}
          {item.view === 'backlog' && backlogCount > 0 && (
            <span style={{
              marginLeft: 'auto',
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 999,
              padding: '1px 7px',
            }}>
              {backlogCount}
            </span>
          )}
        </div>
      ))}

      <div className="sidebar-bottom">
        <div style={{ padding: '10px 4px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 2.2 }}>
          {weekCompletions > 0 && (
            <div>This week: <strong style={{ color: 'var(--success)' }}>{weekCompletions}</strong> tasks done</div>
          )}
          {todayTaskCount > 0 && (
            <div>Today's tasks: <strong style={{ color: 'var(--accent)' }}>{todayTaskCount}</strong></div>
          )}
        </div>
      </div>
    </nav>
  )
}
