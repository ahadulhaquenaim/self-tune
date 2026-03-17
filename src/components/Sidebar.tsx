import { View, DayEntry } from '../types'

interface Props {
  view: View
  onChangeView: (v: View) => void
  todayEntry?: DayEntry
  streak: number
  weekVictories: number
  weekLogged: number
  backlogCount: number
  todayTaskCount: number
}

const navItems: { view: View; icon: string; label: string }[] = [
  { view: 'plan', icon: '📅', label: "Today's Plan" },
  { view: 'log', icon: '✅', label: "Today's Log" },
  { view: 'weekly', icon: '📊', label: 'Weekly Report' },
  { view: 'backlog', icon: '📋', label: 'Backlog' },
  { view: 'categories', icon: '🏷️', label: 'Categories' },
]

export default function Sidebar({
  view, onChangeView, todayEntry, streak,
  weekVictories, weekLogged, backlogCount, todayTaskCount,
}: Props) {
  const hasPlan = (todayEntry?.plan?.length ?? 0) > 0
  const hasLog = (todayEntry?.log?.length ?? 0) > 0
  const isVictory = todayEntry?.isVictory

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
          {/* Badges */}
          {item.view === 'plan' && hasPlan && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>✓ Set</span>
          )}
          {item.view === 'log' && hasLog && (
            <span style={{
              marginLeft: 'auto', fontSize: 11, fontWeight: 700,
              color: isVictory ? 'var(--success)' : 'var(--warning)'
            }}>
              {isVictory ? '🏆' : `${todayEntry?.victoryScore}%`}
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
        {streak > 0 && (
          <div className="streak-badge">
            <span>🔥</span>
            <span>{streak} day{streak !== 1 ? 's' : ''} streak</span>
          </div>
        )}
        <div style={{ padding: '10px 4px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 2.2 }}>
          <div>This week: <strong style={{ color: 'var(--text-secondary)' }}>{weekVictories}/7</strong> victories</div>
          <div>Logged: <strong style={{ color: 'var(--text-secondary)' }}>{weekLogged}/7</strong> days</div>
          {todayTaskCount > 0 && (
            <div>Today's tasks: <strong style={{ color: 'var(--accent)' }}>{todayTaskCount}</strong></div>
          )}
        </div>
      </div>
    </nav>
  )
}
