import { useState, useEffect } from 'react'
import { templatesAPI, exercisesAPI } from '../api'

export default function Templates() {
  const [templates, setTemplates]   = useState([])
  const [exercises, setExercises]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [editing, setEditing]       = useState(null)   // template being edited
  const [creating, setCreating]     = useState(false)

  useEffect(() => {
    Promise.all([templatesAPI.list(), exercisesAPI.list()]).then(([t, e]) => {
      setTemplates(t.data)
      setExercises(e.data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id) => {
    await templatesAPI.delete(id)
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  const handleSave = async (data, id) => {
    if (id) {
      const { data: updated } = await templatesAPI.update(id, data)
      setTemplates(prev => prev.map(t => t.id === id ? updated : t))
    } else {
      const { data: created } = await templatesAPI.create(data)
      setTemplates(prev => [...prev, created])
    }
    setEditing(null)
    setCreating(false)
  }

  if (loading) return <div style={{ padding: '48px 52px', color: '#3A3836', fontSize: 12 }}>LOADING...</div>

  return (
    <div style={{ padding: '48px 52px', maxWidth: 800, width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
        <div>
          <p style={{ fontSize: 11, color: '#3A3836', letterSpacing: '0.1em', marginBottom: 12 }}>
            YOUR LIBRARY
          </p>
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: '-2px',
            color: '#F5F0E8',
            lineHeight: 1,
          }}>
            Templates
          </h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          style={btn('#E8753A', '#0F0F0F')}
        >
          + NEW TEMPLATE
        </button>
      </div>

      {/* New template form */}
      {creating && (
        <TemplateForm
          exercises={exercises}
          onSave={(data) => handleSave(data, null)}
          onCancel={() => setCreating(false)}
        />
      )}

      {/* Template list */}
      {templates.length === 0 && !creating && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#2A2A2A', fontSize: 12, letterSpacing: '0.06em' }}>
          NO TEMPLATES YET — CREATE ONE ABOVE
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {templates.map(tmpl => (
          editing?.id === tmpl.id ? (
            <TemplateForm
              key={tmpl.id}
              initial={tmpl}
              exercises={exercises}
              onSave={(data) => handleSave(data, tmpl.id)}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <TemplateCard
              key={tmpl.id}
              template={tmpl}
              onEdit={() => setEditing(tmpl)}
              onDelete={() => handleDelete(tmpl.id)}
            />
          )
        ))}
      </div>
    </div>
  )
}

// ── Template card (read view) ─────────────────────────────────────────────
function TemplateCard({ template, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const muscleGroups = [...new Set(template.exercises.map(e => e.muscle_group).filter(Boolean))]

  return (
    <div style={{ background: '#111111', padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 20,
            fontWeight: 700,
            color: '#F5F0E8',
            marginBottom: 6,
          }}>
            {template.name}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {muscleGroups.map(g => (
              <span key={g} style={{
                fontSize: 9,
                padding: '2px 8px',
                background: '#1A1A1A',
                color: '#4A4846',
                letterSpacing: '0.08em',
              }}>
                {g.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onEdit} style={btn('transparent', '#3A3836', true, '#2A2A2A')}>EDIT</button>
          {confirmDelete ? (
            <>
              <button onClick={onDelete}    style={btn('#E85A3A', '#FFF', true)}>CONFIRM</button>
              <button onClick={() => setConfirmDelete(false)} style={btn('transparent', '#3A3836', true, '#2A2A2A')}>CANCEL</button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={btn('transparent', '#3A3836', true, '#2A2A2A')}>DELETE</button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {template.exercises.map((ex, i) => (
          <div key={ex.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 0',
            borderBottom: '1px solid #161616',
          }}>
            <span style={{ fontSize: 10, color: '#2A2A2A', width: 16 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: '#F5F0E8' }}>{ex.exercise_name}</span>
            {ex.muscle_group && (
              <span style={{ fontSize: 10, color: '#3A3836', marginLeft: 'auto' }}>{ex.muscle_group}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Template form (create / edit) ─────────────────────────────────────────
function TemplateForm({ initial, exercises, onSave, onCancel }) {
  const [name, setName]         = useState(initial?.name || '')
  const [exList, setExList]     = useState(
    initial?.exercises.map(e => ({ exercise_name: e.exercise_name, muscle_group: e.muscle_group || '', order: e.order })) || []
  )
  const [search, setSearch]     = useState('')
  const [saving, setSaving]     = useState(false)

  const filtered = search.length > 1
    ? exercises.filter(e => e.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : []

  const addExercise = (ex) => {
    if (exList.find(e => e.exercise_name === ex.name)) return
    setExList(prev => [...prev, { exercise_name: ex.name, muscle_group: ex.muscle_group, order: prev.length }])
    setSearch('')
  }

  const addCustomExercise = () => {
    const name = search.trim()
    if (!name || exList.find(e => e.exercise_name === name)) return
    setExList(prev => [...prev, { exercise_name: name, muscle_group: '', order: prev.length }])
    setSearch('')
  }

  const removeExercise = (idx) => {
    setExList(prev => prev.filter((_, i) => i !== idx).map((e, i) => ({ ...e, order: i })))
  }

  const handleSave = async () => {
    if (!name.trim() || exList.length === 0) return
    setSaving(true)
    await onSave({ name: name.trim(), exercises: exList })
    setSaving(false)
  }

  return (
    <div style={{ background: '#111111', padding: '24px', marginBottom: 2, border: '1px solid #E8753A' }}>

      {/* Template name */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 10, color: '#4A4846', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
          TEMPLATE NAME
        </label>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. My Push Day"
          style={inputStyle}
        />
      </div>

      {/* Exercise search */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <label style={{ fontSize: 10, color: '#4A4846', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
          ADD EXERCISES
        </label>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search exercise library..."
          style={inputStyle}
        />
        {search.length > 1 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#1A1A1A',
            border: '1px solid #2A2A2A',
            zIndex: 10,
            marginTop: 2,
          }}>
            {filtered.map(ex => (
              <div
                key={ex.id}
                onClick={() => addExercise(ex)}
                style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#F5F0E8', borderBottom: '1px solid #222222' }}
                onMouseEnter={e => e.currentTarget.style.background = '#222222'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span>{ex.name}</span>
                <span style={{ fontSize: 10, color: '#3A3836' }}>{ex.muscle_group}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div
                onClick={addCustomExercise}
                style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 12, color: '#E8753A', fontFamily: 'DM Mono, monospace', letterSpacing: '0.04em' }}
                onMouseEnter={e => e.currentTarget.style.background = '#222222'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                + ADD "{search.trim()}" AS CUSTOM EXERCISE
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected exercises */}
      {exList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
          {exList.map((ex, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #161616',
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#2A2A2A', width: 16 }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: '#F5F0E8' }}>{ex.exercise_name}</span>
                {ex.muscle_group && <span style={{ fontSize: 10, color: '#3A3836' }}>{ex.muscle_group}</span>}
              </div>
              <button
                onClick={() => removeExercise(i)}
                style={{ background: 'none', border: 'none', color: '#2A2A2A', cursor: 'pointer', fontSize: 16 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} disabled={saving || !name.trim() || exList.length === 0} style={btn('#E8753A', '#0F0F0F', true)}>
          {saving ? 'SAVING...' : 'SAVE TEMPLATE'}
        </button>
        <button onClick={onCancel} style={btn('transparent', '#3A3836', true, '#2A2A2A')}>CANCEL</button>
      </div>
    </div>
  )
}

// ── Style helpers ─────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  background: '#0F0F0F',
  border: '1px solid #2A2A2A',
  color: '#F5F0E8',
  padding: '10px 14px',
  fontSize: 13,
  fontFamily: 'DM Mono, monospace',
  outline: 'none',
}

const btn = (bg, color, small = false, borderColor) => ({
  padding: small ? '7px 14px' : '10px 20px',
  fontSize: 11,
  letterSpacing: '0.08em',
  fontFamily: 'DM Mono, monospace',
  background: bg,
  color,
  border: '1px solid',
  borderColor: borderColor || bg,
  cursor: 'pointer',
})
