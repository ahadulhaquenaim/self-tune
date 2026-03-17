import { useState } from 'react'
import { BacklogItem, Category, Priority, getTodayString, formatDate } from '../types'

interface Props {
  items: BacklogItem[]
  categories: Category[]
  todayTaskIds: string[]
  onAddItem: (item: Omit<BacklogItem, 'id' | 'createdAt' | 'status'>) => void
  onScheduleToday: (itemId: string) => void
  onUnschedule: (itemId: string) => void
  onMarkDone: (itemId: string) => void
  onDelete: (itemId: string) => void
}

const PRIORITY_LABELS: Record<Priority, { label: string; icon: string }> = {
  high: { label: 'High', icon: '🔴' },
  medium: { label: 'Medium', icon: '🟡' },
  low: { label: 'Low', icon: '🟢' },
}

function randomId() {
  return Math.random().toString(36).slice(2, 12)
}

export default function Backlog({
  items, categories, todayTaskIds,
  onAddItem, onScheduleToday, onUnschedule, onMarkDone, onDelete,
}: Props) {
  const [tab, setTab] = useState<'all' | 'today' | 'done'>('all')
  const [title, setTitle] = useState('')
  const [catId, setCatId] = useState(categories[0]?.id ?? '')
  const [priority, setPriority] = useState<Priority>('medium')
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)

  const today = getTodayString()

  const handleAdd = () => {
    if (!title.trim()) return
    onAddItem({ title: title.trim(), categoryId: catId, priority, notes })
    setTitle('')
    setNotes('')
    setPriority('medium')
    setShowNotes(false)
  }

  const activeItems = items.filter(i => i.status === 'active')
  const doneItems = items.filter(i => i.status === 'done')
  const todayItems = activeItems.filter(i => todayTaskIds.includes(i.id))

  const displayItems =
    tab === 'today' ? todayItems :
    tab === 'done' ? doneItems :
    activeItems

  const getCat = (id: string) => categories.find(c => c.id === id)

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Backlog</div>
        <div className="page-subtitle">
          Capture everything you want to do — then pull items into Today's Plan when ready.
        </div>
      </div>

      {/* Add form */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Add to Backlog</div>
        <div className="backlog-add-form">
          <input
            placeholder="What do you want to accomplish?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            autoFocus
          />
          <select value={catId} onChange={e => setCatId(e.target.value)} style={{ width: 150 }}>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
            ))}
          </select>
          <select value={priority} onChange={e => setPriority(e.target.value as Priority)} style={{ width: 110 }}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => setShowNotes(v => !v)}
          >
            {showNotes ? '▲ Hide notes' : '▼ Add notes'}
          </button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!title.trim()}>
            + Add Item
          </button>
        </div>
        {showNotes && (
          <textarea
            className="notes-input"
            placeholder="Optional notes…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            style={{ marginTop: 10 }}
          />
        )}
      </div>

      {/* Today quick-add hint */}
      {todayItems.length > 0 && tab !== 'today' && (
        <div className="info-banner success">
          ✅ {todayItems.length} item{todayItems.length > 1 ? 's' : ''} scheduled for today
        </div>
      )}

      {/* Tabs */}
      <div className="backlog-tabs">
        <button className={`backlog-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
          All
          {activeItems.length > 0 && <span className="backlog-tab-count">{activeItems.length}</span>}
        </button>
        <button className={`backlog-tab ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>
          📅 Today
          {todayItems.length > 0 && <span className="backlog-tab-count">{todayItems.length}</span>}
        </button>
        <button className={`backlog-tab ${tab === 'done' ? 'active' : ''}`} onClick={() => setTab('done')}>
          ✅ Done
          {doneItems.length > 0 && <span className="backlog-tab-count">{doneItems.length}</span>}
        </button>
      </div>

      {/* Item list */}
      {displayItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {tab === 'today' ? '📅' : tab === 'done' ? '✅' : '📋'}
          </div>
          <div className="empty-state-title">
            {tab === 'today' ? 'Nothing scheduled for today' :
             tab === 'done' ? 'No completed items yet' :
             'Your backlog is empty'}
          </div>
          <div className="empty-state-text">
            {tab === 'today'
              ? 'Go to the "All" tab and click "Add to Today" to schedule items for today.'
              : tab === 'done'
              ? 'Completed items will appear here.'
              : 'Add tasks, topics, or anything you want to accomplish.'}
          </div>
        </div>
      ) : (
        <div>
          {/* Group by category in All tab */}
          {tab === 'all' ? (
            categories.map(cat => {
              const catItems = displayItems.filter(i => i.categoryId === cat.id)
              if (!catItems.length) return null
              return (
                <div key={cat.id} style={{ marginBottom: 20 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 10, paddingLeft: 4,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: cat.color, flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)' }}>
                      {cat.emoji} {cat.name}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {catItems.length} item{catItems.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {catItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      cat={cat}
                      isScheduledToday={todayTaskIds.includes(item.id)}
                      today={today}
                      onScheduleToday={onScheduleToday}
                      onUnschedule={onUnschedule}
                      onMarkDone={onMarkDone}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )
            })
          ) : (
            displayItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                cat={getCat(item.categoryId)}
                isScheduledToday={todayTaskIds.includes(item.id)}
                today={today}
                onScheduleToday={onScheduleToday}
                onUnschedule={onUnschedule}
                onMarkDone={onMarkDone}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function ItemCard({
  item, cat, isScheduledToday, today,
  onScheduleToday, onUnschedule, onMarkDone, onDelete,
}: {
  item: BacklogItem
  cat?: Category
  isScheduledToday: boolean
  today: string
  onScheduleToday: (id: string) => void
  onUnschedule: (id: string) => void
  onMarkDone: (id: string) => void
  onDelete: (id: string) => void
}) {
  const isDone = item.status === 'done'
  const priority = PRIORITY_LABELS[item.priority]

  return (
    <div className={`backlog-item ${isScheduledToday ? 'scheduled' : ''} ${isDone ? 'done' : ''}`}>
      <div style={{ fontSize: 22, paddingTop: 2 }}>{cat?.emoji ?? '📌'}</div>
      <div className="backlog-item-body">
        <div className={`backlog-item-title ${isDone ? 'done-text' : ''}`}>{item.title}</div>
        <div className="backlog-item-meta">
          <span className={`priority-badge ${item.priority}`}>
            {priority.icon} {priority.label}
          </span>
          {cat && (
            <span className="cat-tag" style={{ color: cat.color }}>
              {cat.name}
            </span>
          )}
          {isScheduledToday && (
            <span className="scheduled-badge">📅 Today</span>
          )}
          {item.scheduledDate && item.scheduledDate !== today && (
            <span className="cat-tag">
              {formatDate(item.scheduledDate)}
            </span>
          )}
        </div>
        {item.notes && (
          <div className="backlog-item-notes">{item.notes}</div>
        )}
      </div>
      <div className="backlog-item-actions">
        {!isDone && (
          <>
            {isScheduledToday ? (
              <button
                className="btn btn-ghost"
                style={{ fontSize: 11, padding: '4px 10px', whiteSpace: 'nowrap' }}
                onClick={() => onUnschedule(item.id)}
              >
                ✕ Remove today
              </button>
            ) : (
              <button
                className="btn btn-success"
                style={{ fontSize: 11, padding: '4px 10px', whiteSpace: 'nowrap' }}
                onClick={() => onScheduleToday(item.id)}
              >
                📅 Add to Today
              </button>
            )}
            <button
              className="btn btn-ghost"
              style={{ fontSize: 11, padding: '4px 10px' }}
              onClick={() => onMarkDone(item.id)}
            >
              ✅ Done
            </button>
          </>
        )}
        <button
          className="btn btn-danger"
          style={{ fontSize: 11, padding: '4px 10px' }}
          onClick={() => onDelete(item.id)}
        >
          🗑
        </button>
      </div>
    </div>
  )
}
