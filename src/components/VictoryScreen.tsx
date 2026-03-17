import { useEffect, useState } from 'react'
import { Category, DayEntry } from '../types'

interface Props {
  entry: DayEntry
  categories: Category[]
  onClose: () => void
  onViewWeekly: () => void
}

interface Confetti {
  id: number
  x: number
  color: string
  duration: number
  delay: number
  size: number
}

const COLORS = ['#7c6fff', '#4ade80', '#fb923c', '#f87171', '#38bdf8', '#a78bfa', '#fbbf24']

function makeConfetti(n: number): Confetti[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
  }))
}

export default function VictoryScreen({ entry, categories, onClose, onViewWeekly }: Props) {
  const [confetti] = useState(() => makeConfetti(60))

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const score = entry.victoryScore

  return (
    <>
      {/* Confetti */}
      <div className="confetti-container">
        {confetti.map(c => (
          <div
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.x}%`,
              background: c.color,
              width: c.size,
              height: c.size,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="victory-overlay" onClick={onClose}>
        <div className="victory-card" onClick={e => e.stopPropagation()}>
          <div className="victory-emoji">🏆</div>
          <div className="victory-title">VICTORY!</div>
          <div className="victory-score">{score}%</div>
          <div className="victory-subtitle">
            Amazing work! You nailed your goals for today.
          </div>

          <div className="victory-breakdown">
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Breakdown
            </div>
            {categories.map(cat => {
              const planned = entry.plan?.find(p => p.categoryId === cat.id)
              const actual = entry.log?.find(l => l.categoryId === cat.id)
              if (!planned && !actual) return null
              const t = planned?.targetPercent ?? 0
              const a = actual?.actualPercent ?? 0
              const hit = a >= t * 0.9
              return (
                <div key={cat.id} className="victory-row">
                  <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                  <span className="victory-row-name">{cat.name}</span>
                  <span className="victory-row-plan">{t}% plan</span>
                  <span
                    className="victory-row-actual"
                    style={{ color: hit ? 'var(--success)' : 'var(--warning)' }}
                  >
                    {a}% done
                  </span>
                  <span className="victory-row-check">{hit ? '✅' : '⚡'}</span>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={onViewWeekly}>
              📊 See Weekly Report
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Continue 🚀
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
