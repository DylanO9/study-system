const stats = [
  { label: 'Streak',      value: '14',    unit: 'days'     },
  { label: 'This Week',   value: '4',     unit: 'sessions' },
  { label: 'Calories',    value: '2,340', unit: 'kcal'     },
  { label: 'Body Weight', value: '183.4', unit: 'lbs'      },
]

const recentWorkouts = [
  { date: 'Apr 09', name: 'Push Day', sets: 18, volume: '12,400' },
  { date: 'Apr 07', name: 'Pull Day', sets: 16, volume: '9,800'  },
  { date: 'Apr 05', name: 'Leg Day',  sets: 20, volume: '18,200' },
  { date: 'Apr 03', name: 'Push Day', sets: 17, volume: '11,900' },
]

const prs = [
  { lift: 'Bench Press', weight: '225', date: 'Apr 09' },
  { lift: 'Deadlift',    weight: '365', date: 'Mar 28' },
  { lift: 'Squat',       weight: '295', date: 'Mar 21' },
]

// Simple 7-day streak heatmap data (mock)
const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const trained = [true, false, true, true, false, true, false]

export default function Dashboard() {
  return (
    <div style={{ padding: '48px 52px', maxWidth: 1000, width: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 11, color: '#3A3836', letterSpacing: '0.1em', marginBottom: 12 }}>
          THURSDAY — APRIL 10, 2026
        </p>
        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 52,
          fontWeight: 900,
          letterSpacing: '-2px',
          color: '#F5F0E8',
          lineHeight: 1,
        }}>
          Good morning.
        </h1>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1,
        marginBottom: 48,
      }}>
        {stats.map(({ label, value, unit }, i) => (
          <div key={label} style={{
            background: '#111111',
            padding: '28px 24px',
            borderTop: i === 0 ? '2px solid #E8753A' : '2px solid transparent',
          }}>
            <div style={{
              fontSize: 10,
              color: '#3A3836',
              letterSpacing: '0.1em',
              marginBottom: 16,
            }}>
              {label.toUpperCase()}
            </div>
            <div style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 38,
              fontWeight: 500,
              color: '#F5F0E8',
              letterSpacing: '-1.5px',
              lineHeight: 1,
              marginBottom: 6,
            }}>
              {value}
            </div>
            <div style={{ fontSize: 11, color: '#3A3836' }}>{unit}</div>
          </div>
        ))}
      </div>

      {/* This week strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 48,
        padding: '20px 24px',
        background: '#111111',
      }}>
        <span style={{ fontSize: 10, color: '#3A3836', letterSpacing: '0.1em', marginRight: 12 }}>
          THIS WEEK
        </span>
        {week.map((day, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 28,
              height: 28,
              background: trained[i] ? '#E8753A' : '#1A1A1A',
              opacity: trained[i] ? 1 : 1,
            }} />
            <span style={{ fontSize: 9, color: '#2A2A2A', letterSpacing: '0.06em' }}>{day}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontFamily: 'DM Mono', fontSize: 22, color: '#E8753A', letterSpacing: '-0.5px' }}>4/7</div>
          <div style={{ fontSize: 10, color: '#3A3836' }}>days trained</div>
        </div>
      </div>

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

        {/* Recent workouts */}
        <div>
          <div style={{
            fontSize: 10,
            color: '#3A3836',
            letterSpacing: '0.1em',
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: '1px solid #1A1A1A',
          }}>
            RECENT WORKOUTS
          </div>

          {recentWorkouts.map((w) => (
            <div key={w.date} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: '1px solid #141414',
              cursor: 'pointer',
            }}>
              <div>
                <div style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 16,
                  color: '#F5F0E8',
                  marginBottom: 4,
                  fontWeight: 700,
                }}>
                  {w.name}
                </div>
                <div style={{ fontSize: 11, color: '#3A3836' }}>
                  {w.sets} sets &nbsp;·&nbsp; {w.volume} lbs
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#2A2A2A' }}>{w.date}</div>
            </div>
          ))}

          <button style={{
            marginTop: 16,
            width: '100%',
            padding: '11px',
            background: 'transparent',
            border: '1px dashed #1E1E1E',
            color: '#3A3836',
            fontSize: 11,
            letterSpacing: '0.08em',
            fontFamily: 'DM Mono, monospace',
            cursor: 'pointer',
          }}>
            + LOG TODAY'S WORKOUT
          </button>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* PRs */}
          <div>
            <div style={{
              fontSize: 10,
              color: '#3A3836',
              letterSpacing: '0.1em',
              marginBottom: 20,
              paddingBottom: 12,
              borderBottom: '1px solid #1A1A1A',
            }}>
              PERSONAL RECORDS
            </div>

            {prs.map((pr) => (
              <div key={pr.lift} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #141414',
              }}>
                <div>
                  <div style={{ fontSize: 14, color: '#F5F0E8', marginBottom: 3 }}>{pr.lift}</div>
                  <div style={{ fontSize: 10, color: '#3A3836' }}>{pr.date}</div>
                </div>
                <div style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 20,
                  fontWeight: 500,
                  color: '#E8753A',
                  letterSpacing: '-0.5px',
                }}>
                  {pr.weight}<span style={{ fontSize: 11, color: '#3A3836', marginLeft: 4 }}>lbs</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div style={{
            padding: '22px 24px',
            background: '#111111',
            borderLeft: '2px solid #E8753A',
          }}>
            <div style={{
              fontSize: 10,
              color: '#E8753A',
              letterSpacing: '0.1em',
              marginBottom: 12,
            }}>
              AI INSIGHT
            </div>
            <p style={{
              fontSize: 13,
              color: '#7A7370',
              lineHeight: 1.7,
            }}>
              Your bench has improved <span style={{ color: '#F5F0E8' }}>12%</span> over 6 weeks.
              You're ready to attempt <span style={{ color: '#F5F0E8' }}>235 lbs</span> — consider
              testing it on your next push day.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
