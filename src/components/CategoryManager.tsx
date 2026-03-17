import { useState } from 'react'
import { Category } from '../types'

interface Props {
  categories: Category[]
  onSave: (categories: Category[]) => void
}

function randomId() {
  return Math.random().toString(36).slice(2, 10)
}

const PRESET_COLORS = [
  '#f97316', '#3b82f6', '#8b5cf6', '#22c55e',
  '#ef4444', '#06b6d4', '#ec4899', '#f59e0b',
]

export default function CategoryManager({ categories, onSave }: Props) {
  const [cats, setCats] = useState<Category[]>(categories)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('📌')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [saved, setSaved] = useState(false)

  const handleEdit = (id: string, field: keyof Category, value: string) => {
    setCats(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
    setSaved(false)
  }

  const handleDelete = (id: string) => {
    if (cats.length <= 1) return
    setCats(prev => prev.filter(c => c.id !== id))
    setSaved(false)
  }

  const handleAdd = () => {
    if (!newName.trim()) return
    setCats(prev => [...prev, { id: randomId(), name: newName.trim(), emoji: newEmoji || '📌', color: newColor }])
    setNewName('')
    setNewEmoji('📌')
    setNewColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)])
    setSaved(false)
  }

  const handleSave = () => {
    onSave(cats)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Categories</div>
        <div className="page-subtitle">Manage your focus categories. Changes apply to new entries.</div>
      </div>

      <div className="card">
        <div className="card-title">Your Categories</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          Edit name, emoji, or color for each category.
        </div>

        {cats.map(cat => (
          <div key={cat.id} className="cat-manage-row">
            <div className="cat-color-dot" style={{ background: cat.color }} />
            <input
              className="cat-edit-emoji"
              value={cat.emoji}
              onChange={e => handleEdit(cat.id, 'emoji', e.target.value)}
              maxLength={2}
              title="Emoji"
            />
            <input
              className="cat-edit-name"
              value={cat.name}
              onChange={e => handleEdit(cat.id, 'name', e.target.value)}
              placeholder="Category name"
            />
            <input
              className="cat-edit-color"
              type="color"
              value={cat.color}
              onChange={e => handleEdit(cat.id, 'color', e.target.value)}
              title="Pick color"
            />
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(cat.id)}
              disabled={cats.length <= 1}
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="btn-row">
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? '✓ Saved!' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Add New Category</div>
        <div className="add-cat-form">
          <input
            className="cat-edit-emoji"
            value={newEmoji}
            onChange={e => setNewEmoji(e.target.value)}
            maxLength={2}
            placeholder="🎯"
            title="Emoji"
          />
          <input
            className="cat-edit-name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Category name"
            onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            style={{ flex: 1 }}
          />
          <input
            className="cat-edit-color"
            type="color"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            title="Pick color"
          />
          <button className="btn btn-primary" onClick={handleAdd} disabled={!newName.trim()}>
            + Add
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Quick colors:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PRESET_COLORS.map(color => (
              <div
                key={color}
                onClick={() => setNewColor(color)}
                style={{
                  width: 24, height: 24,
                  background: color,
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: newColor === color ? '2px solid var(--text)' : '2px solid transparent',
                  transition: 'border var(--transition)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Tips</div>
        <ul style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2, paddingLeft: 16 }}>
          <li>Categories represent areas of focus (DSA, Reading, Exercise, etc.)</li>
          <li>Each day you assign target % to each category in <strong>Today's Plan</strong></li>
          <li>Then log your actual work in <strong>Today's Log</strong></li>
          <li>Score ≥ 75% = Victory 🏆 for that day</li>
          <li>Weekly report shows your consistency over the week</li>
        </ul>
      </div>
    </div>
  )
}
