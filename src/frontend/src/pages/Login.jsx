import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [focused, setFocused] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); navigate('/dashboard') }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
    }}>
      {/* Left panel — branding */}
      <div style={{
        width: '45%',
        background: '#0A0A0A',
        borderRight: '1px solid #1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 60px',
      }}>
        <div style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 24,
          fontWeight: 700,
          color: '#E8753A',
          letterSpacing: '-0.5px',
        }}>
          lift.
        </div>

        <div>
          <div style={{
            fontSize: 11,
            color: '#2A2A2A',
            letterSpacing: '0.12em',
            marginBottom: 24,
          }}>
            TODAY
          </div>
          <div style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 72,
            fontWeight: 900,
            color: '#1A1A1A',
            lineHeight: 0.9,
            letterSpacing: '-3px',
            userSelect: 'none',
          }}>
            TRACK.<br />
            LIFT.<br />
            <span style={{ color: '#E8753A' }}>GROW.</span>
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#2A2A2A', letterSpacing: '0.06em' }}>
          YOUR BODY. YOUR DATA.
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '52px 60px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          <div style={{ marginBottom: 48 }}>
            <h1 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: '#F5F0E8',
              marginBottom: 8,
            }}>
              Welcome back.
            </h1>
            <p style={{ fontSize: 12, color: '#4A4846' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#E8753A', textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <Field
              label="EMAIL"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              focused={focused}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="you@example.com"
            />

            <Field
              label="PASSWORD"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              focused={focused}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8 }}>
              <a href="#" style={{ fontSize: 11, color: '#4A4846', textDecoration: 'none', letterSpacing: '0.04em' }}>
                FORGOT PASSWORD?
              </a>
            </div>

            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: '14px',
                background: '#E8753A',
                color: '#0F0F0F',
                border: 'none',
                fontSize: 12,
                letterSpacing: '0.1em',
                fontFamily: 'DM Mono, monospace',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              SIGN IN
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, name, type, value, onChange, focused, onFocus, onBlur, placeholder }) {
  const isActive = focused === name

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: 10,
        letterSpacing: '0.12em',
        color: isActive ? '#E8753A' : '#4A4846',
        marginBottom: 8,
        transition: 'color 0.15s',
      }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: '#111111',
          border: '1px solid',
          borderColor: isActive ? '#E8753A' : '#1E1E1E',
          color: '#F5F0E8',
          padding: '12px 14px',
          fontSize: 13,
          fontFamily: 'DM Mono, monospace',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        autoComplete="off"
      />
    </div>
  )
}
