import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api'

const goals = ['Build Muscle', 'Lose Fat', 'Improve Strength', 'General Fitness']

export default function Signup() {
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' })
  const [goal, setGoal]         = useState(null)
  const [focused, setFocused]   = useState(null)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { data } = await authAPI.register(form.name, form.email, form.password, goal)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify({ id: data.user_id, name: data.name }))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

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
            START HERE
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
            DAY<br />
            ONE<br />
            <span style={{ color: '#E8753A' }}>STARTS<br />NOW.</span>
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
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: '#F5F0E8',
              marginBottom: 8,
            }}>
              Create account.
            </h1>
            <p style={{ fontSize: 12, color: '#4A4846' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#E8753A', textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <Field
              label="NAME"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              focused={focused}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              placeholder="Dylan"
            />

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

            <Field
              label="CONFIRM PASSWORD"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              focused={focused}
              onFocus={() => setFocused('confirm')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
            />

            {/* Goal selector */}
            <div style={{ marginTop: 8 }}>
              <div style={{
                fontSize: 10,
                letterSpacing: '0.12em',
                color: '#4A4846',
                marginBottom: 10,
              }}>
                PRIMARY GOAL
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {goals.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    style={{
                      padding: '10px 12px',
                      fontSize: 11,
                      letterSpacing: '0.04em',
                      fontFamily: 'DM Mono, monospace',
                      background: goal === g ? '#E8753A' : '#111111',
                      color: goal === g ? '#0F0F0F' : '#4A4846',
                      border: '1px solid',
                      borderColor: goal === g ? '#E8753A' : '#1E1E1E',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    {g.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 12, color: '#E85A3A', letterSpacing: '0.04em' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.85' }}
              onMouseLeave={e => { if (!loading) e.target.style.opacity = '1' }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
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
