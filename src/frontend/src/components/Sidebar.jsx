import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/workout',    label: 'Workout'   },
  { to: '/nutrition',  label: 'Nutrition' },
  { to: '/strength',   label: 'Strength'  },
  { to: '/body',       label: 'Body'      },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: 200,
      minHeight: '100vh',
      background: '#0A0A0A',
      borderRight: '1px solid #1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 28px', marginBottom: 52 }}>
        <span style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 22,
          fontWeight: 700,
          color: '#E8753A',
          letterSpacing: '-0.5px',
        }}>
          lift.
        </span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {nav.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px 28px',
              fontSize: 11,
              letterSpacing: '0.08em',
              textDecoration: 'none',
              color: isActive ? '#F5F0E8' : '#3A3836',
              borderRight: isActive ? '2px solid #E8753A' : '2px solid transparent',
              transition: 'color 0.15s',
            })}
          >
            {label.toUpperCase()}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0 28px' }}>
        <NavLink
          to="/login"
          style={{
            fontSize: 10,
            color: '#2A2A2A',
            letterSpacing: '0.08em',
            textDecoration: 'none',
          }}
        >
          SIGN OUT
        </NavLink>
      </div>
    </aside>
  )
}
