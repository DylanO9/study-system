import { useState, useEffect } from 'react'
import { templatesAPI, workoutsAPI, exercisesAPI } from '../api'

const makeSet  = (weight = '', reps = '') => ({ id: crypto.randomUUID(), weight, reps, done: false })
const makeExercise = (name = '', muscle_group = '') => ({
  id: crypto.randomUUID(), name, muscle_group, sets: [makeSet()],
})

function totalVolume(exercises) {
  return exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) => s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0)
}

// ─── Main component ────────────────────────────────────────────────────────
export default function Workout() {
  const [templates, setTemplates]   = useState([])
  const [activeTemplate, setActive] = useState(null)   // full template object
  const [exercises, setExercises]   = useState([])
  const [editingCell, setEditingCell] = useState(null)
  const [addingEx, setAddingEx]     = useState(false)
  const [newExName, setNewExName]   = useState('')
  const [exLibrary, setExLibrary]   = useState([])
  const [exSearch, setExSearch]     = useState('')
  const [finished, setFinished]     = useState(false)
  const [saving, setSaving]         = useState(false)
  const [loading, setLoading]       = useState(true)

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const isoDate = new Date().toISOString().split('T')[0]

  useEffect(() => {
    Promise.all([templatesAPI.list(), exercisesAPI.list()]).then(([t, e]) => {
      setTemplates(t.data)
      setExLibrary(e.data)
      setLoading(false)
    })
  }, [])

  // ── Load a template ────────────────────────────────────────────────────
  const loadTemplate = (tmpl) => {
    setActive(tmpl)
    setExercises(tmpl.exercises.map(e => makeExercise(e.exercise_name, e.muscle_group)))
    setFinished(false)
  }

  const startCustom = () => {
    setActive({ id: null, name: 'Custom' })
    setExercises([])
    setFinished(false)
  }

  const clearWorkout = () => { setActive(null); setExercises([]); setFinished(false) }

  // ── Set mutations ──────────────────────────────────────────────────────
  const updateSet = (exId, setId, field, value) =>
    setExercises(prev => prev.map(ex =>
      ex.id !== exId ? ex : { ...ex, sets: ex.sets.map(s => s.id !== setId ? s : { ...s, [field]: value }) }
    ))

  const toggleDone = (exId, setId) =>
    setExercises(prev => prev.map(ex =>
      ex.id !== exId ? ex : { ...ex, sets: ex.sets.map(s => s.id !== setId ? s : { ...s, done: !s.done }) }
    ))

  const addSet = (exId) =>
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex
      const last = ex.sets[ex.sets.length - 1]
      return { ...ex, sets: [...ex.sets, makeSet(last?.weight || '', last?.reps || '')] }
    }))

  const removeSet = (exId, setId) =>
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId || ex.sets.length === 1) return ex
      return { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
    }))

  const removeExercise = (exId) => setExercises(prev => prev.filter(ex => ex.id !== exId))

  const confirmAddExercise = () => {
    if (!newExName.trim()) return
    setExercises(prev => [...prev, makeExercise(newExName.trim())])
    setNewExName(''); setExSearch(''); setAddingEx(false)
  }

  const addFromLibrary = (ex) => {
    setExercises(prev => [...prev, makeExercise(ex.name, ex.muscle_group)])
    setNewExName(''); setExSearch(''); setAddingEx(false)
  }

  const filteredLibrary = exSearch.length > 1
    ? exLibrary.filter(e => e.name.toLowerCase().includes(exSearch.toLowerCase())).slice(0, 7)
    : []

  // ── Finish & save ──────────────────────────────────────────────────────
  const finishWorkout = async () => {
    setSaving(true)
    const sets = []
    let order = 0
    exercises.forEach(ex => {
      ex.sets.forEach((s, setNumber) => {
        sets.push({
          exercise_name: ex.name,
          muscle_group:  ex.muscle_group || null,
          set_number:    setNumber + 1,
          weight:        parseFloat(s.weight) || null,
          reps:          parseInt(s.reps)     || null,
          order:         order++,
        })
      })
    })
    await workoutsAPI.save({
      name:        activeTemplate?.name || 'Custom',
      date:        isoDate,
      template_id: activeTemplate?.id  || null,
      sets,
    })
    setSaving(false)
    setFinished(true)
  }

  const volume    = totalVolume(exercises)
  const totalSets = exercises.reduce((a, ex) => a + ex.sets.length, 0)
  const doneSets  = exercises.reduce((a, ex) => a + ex.sets.filter(s => s.done).length, 0)

  // ─── Finished summary ─────────────────────────────────────────────────
  if (finished) {
    return (
      <div style={{ padding: '48px 52px', maxWidth: 700 }}>
        <p style={{ fontSize: 11, color: '#3A3836', letterSpacing: '0.1em', marginBottom: 12 }}>WORKOUT SAVED</p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 52, fontWeight: 900, letterSpacing: '-2px', color: '#E8753A', lineHeight: 1, marginBottom: 24 }}>
          {activeTemplate?.name || 'Custom'}
        </h1>
        <div style={{ display: 'flex', gap: 48, marginBottom: 40 }}>
          <Stat label="TOTAL VOLUME" value={volume.toLocaleString()} unit="lbs" big />
          <Stat label="SETS"         value={totalSets}               unit="sets" big />
          <Stat label="EXERCISES"    value={exercises.length}         unit="lifts" big />
        </div>
        {exercises.map(ex => (
          <div key={ex.id} style={{ marginBottom: 8, padding: '16px 20px', background: '#111111' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 700, color: '#F5F0E8', marginBottom: 10 }}>{ex.name}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {ex.sets.map((s, i) => (
                <div key={s.id} style={{ fontSize: 12, color: '#7A7370' }}>
                  {i + 1}. {s.weight || '—'} lbs × {s.reps || '—'}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={clearWorkout} style={{ ...btnStyle('#E8753A', '#0F0F0F'), marginTop: 24 }}>
          LOG ANOTHER WORKOUT
        </button>
      </div>
    )
  }

  // ─── Main view ────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '48px 52px', maxWidth: 800, width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <p style={{ fontSize: 11, color: '#3A3836', letterSpacing: '0.1em', marginBottom: 12 }}>
            {today.toUpperCase()}
          </p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 44, fontWeight: 900, letterSpacing: '-2px', color: '#F5F0E8', lineHeight: 1 }}>
            {activeTemplate?.name || 'Workout'}
          </h1>
        </div>
        {exercises.length > 0 && (
          <div style={{ display: 'flex', gap: 32, textAlign: 'right' }}>
            <Stat label="VOLUME"   value={volume.toLocaleString()} unit="lbs" />
            <Stat label="PROGRESS" value={`${doneSets}/${totalSets}`} unit="sets" />
          </div>
        )}
      </div>

      {/* Template picker */}
      {loading ? (
        <div style={{ fontSize: 11, color: '#3A3836', letterSpacing: '0.08em', marginBottom: 40 }}>LOADING TEMPLATES...</div>
      ) : (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {templates.map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => loadTemplate(tmpl)}
              style={{
                padding: '8px 16px', fontSize: 11, letterSpacing: '0.06em',
                fontFamily: 'DM Mono, monospace',
                background:  activeTemplate?.id === tmpl.id ? '#E8753A' : 'transparent',
                color:       activeTemplate?.id === tmpl.id ? '#0F0F0F' : '#3A3836',
                border: '1px solid', borderColor: activeTemplate?.id === tmpl.id ? '#E8753A' : '#2A2A2A',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {tmpl.name.toUpperCase()}
            </button>
          ))}
          <button
            onClick={startCustom}
            style={{
              padding: '8px 16px', fontSize: 11, letterSpacing: '0.06em',
              fontFamily: 'DM Mono, monospace',
              background:  activeTemplate?.id === null && activeTemplate?.name === 'Custom' ? '#E8753A' : 'transparent',
              color:       activeTemplate?.id === null && activeTemplate?.name === 'Custom' ? '#0F0F0F' : '#3A3836',
              border: '1px solid #2A2A2A', cursor: 'pointer',
            }}
          >
            + CUSTOM
          </button>
        </div>
      )}

      {/* Empty state */}
      {exercises.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#2A2A2A', fontSize: 13, letterSpacing: '0.06em', borderTop: '1px solid #1A1A1A' }}>
          {activeTemplate ? 'ADD YOUR FIRST EXERCISE BELOW' : 'PICK A TEMPLATE OR START CUSTOM'}
        </div>
      )}

      {/* Exercises */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {exercises.map(ex => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            editingCell={editingCell}
            onEditCell={setEditingCell}
            onUpdateSet={updateSet}
            onToggleDone={toggleDone}
            onAddSet={addSet}
            onRemoveSet={removeSet}
            onRemoveExercise={removeExercise}
          />
        ))}
      </div>

      {/* Add exercise + finish */}
      {activeTemplate && (
        <div style={{ marginTop: 2 }}>
          {addingEx ? (
            <div style={{ background: '#111111', padding: '16px 20px', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <input
                  autoFocus
                  value={exSearch}
                  onChange={e => { setExSearch(e.target.value); setNewExName(e.target.value) }}
                  onKeyDown={e => { if (e.key === 'Enter' && filteredLibrary.length === 0) confirmAddExercise(); if (e.key === 'Escape') setAddingEx(false) }}
                  placeholder="Search library or type a custom name..."
                  style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #E8753A', color: '#F5F0E8', fontSize: 13, fontFamily: 'DM Mono, monospace', outline: 'none', paddingBottom: 6 }}
                />
                <button onClick={() => { setAddingEx(false); setExSearch(''); setNewExName('') }} style={btnStyle('transparent', '#3A3836', true, '#2A2A2A')}>CANCEL</button>
              </div>

              {/* Library results */}
              {filteredLibrary.length > 0 && (
                <div style={{ border: '1px solid #1E1E1E', marginTop: 4 }}>
                  {filteredLibrary.map(ex => (
                    <div
                      key={ex.id}
                      onClick={() => addFromLibrary(ex)}
                      style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #161616' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1A1A1A'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 13, color: '#F5F0E8' }}>{ex.name}</span>
                      <span style={{ fontSize: 10, color: '#3A3836' }}>{ex.muscle_group}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom fallback when no library match */}
              {exSearch.length > 1 && filteredLibrary.length === 0 && (
                <div
                  onClick={confirmAddExercise}
                  style={{ padding: '10px 14px', cursor: 'pointer', border: '1px solid #1E1E1E', color: '#E8753A', fontSize: 12, letterSpacing: '0.04em', fontFamily: 'DM Mono' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1A1A1A'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  + ADD "{exSearch}" AS CUSTOM EXERCISE
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setAddingEx(true)} style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px dashed #1E1E1E', color: '#3A3836', fontSize: 11, letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', cursor: 'pointer' }}>
              + ADD EXERCISE
            </button>
          )}
        </div>
      )}

      {exercises.length > 0 && (
        <button
          onClick={finishWorkout}
          disabled={saving}
          style={{ ...btnStyle('#E8753A', '#0F0F0F'), marginTop: 16, width: '100%', padding: '14px', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'SAVING...' : 'FINISH WORKOUT'}
        </button>
      )}
    </div>
  )
}

// ─── Exercise card ─────────────────────────────────────────────────────────
function ExerciseCard({ exercise, editingCell, onEditCell, onUpdateSet, onToggleDone, onAddSet, onRemoveSet, onRemoveExercise }) {
  return (
    <div style={{ background: '#111111', padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 700, color: '#F5F0E8' }}>{exercise.name}</span>
          {exercise.muscle_group && <span style={{ fontSize: 10, color: '#3A3836', marginLeft: 12 }}>{exercise.muscle_group.toUpperCase()}</span>}
        </div>
        <button onClick={() => onRemoveExercise(exercise.id)} style={{ background: 'none', border: 'none', color: '#2A2A2A', cursor: 'pointer', fontSize: 18 }}>×</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 80px 28px', gap: 8, marginBottom: 6 }}>
        <span style={colHead}>SET</span><span style={colHead}>WEIGHT</span><span style={colHead}>REPS</span><span /><span />
      </div>

      {exercise.sets.map((set, i) => {
        const editW = editingCell?.exId === exercise.id && editingCell?.setId === set.id && editingCell?.field === 'weight'
        const editR = editingCell?.exId === exercise.id && editingCell?.setId === set.id && editingCell?.field === 'reps'
        return (
          <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 80px 28px', gap: 8, alignItems: 'center', marginBottom: 4, opacity: set.done ? 0.4 : 1, transition: 'opacity 0.2s' }}>
            <span style={{ fontSize: 12, color: '#3A3836', fontFamily: 'DM Mono' }}>{i + 1}</span>
            <InlineCell value={set.weight} isEditing={editW} placeholder="0" onFocus={() => onEditCell({ exId: exercise.id, setId: set.id, field: 'weight' })} onChange={v => onUpdateSet(exercise.id, set.id, 'weight', v)} onBlur={() => onEditCell(null)} />
            <InlineCell value={set.reps}   isEditing={editR} placeholder="0" onFocus={() => onEditCell({ exId: exercise.id, setId: set.id, field: 'reps'   })} onChange={v => onUpdateSet(exercise.id, set.id, 'reps',   v)} onBlur={() => onEditCell(null)} />
            <button onClick={() => onToggleDone(exercise.id, set.id)} style={{ padding: '5px 10px', fontSize: 10, letterSpacing: '0.06em', fontFamily: 'DM Mono', background: set.done ? '#E8753A' : 'transparent', color: set.done ? '#0F0F0F' : '#3A3836', border: '1px solid', borderColor: set.done ? '#E8753A' : '#2A2A2A', cursor: 'pointer' }}>
              {set.done ? 'DONE ✓' : 'DONE'}
            </button>
            <button onClick={() => onRemoveSet(exercise.id, set.id)} style={{ background: 'none', border: 'none', color: '#2A2A2A', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        )
      })}

      <button onClick={() => onAddSet(exercise.id)} style={{ marginTop: 10, padding: '5px 12px', fontSize: 10, letterSpacing: '0.08em', fontFamily: 'DM Mono', background: 'transparent', color: '#E8753A', border: '1px solid #2A2A2A', cursor: 'pointer' }}>
        + ADD SET
      </button>
    </div>
  )
}

function InlineCell({ value, isEditing, placeholder, onFocus, onChange, onBlur }) {
  return (
    <div onClick={onFocus} style={{ padding: '7px 10px', background: isEditing ? '#1A1A1A' : 'transparent', border: '1px solid', borderColor: isEditing ? '#E8753A' : '#1A1A1A', cursor: 'text', transition: 'border-color 0.15s' }}>
      {isEditing ? (
        <input autoFocus type="number" value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#F5F0E8', fontSize: 14, fontFamily: 'DM Mono' }} />
      ) : (
        <span style={{ fontSize: 14, fontFamily: 'DM Mono', color: value ? '#F5F0E8' : '#2A2A2A' }}>{value || placeholder}</span>
      )}
    </div>
  )
}

function Stat({ label, value, unit, big }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#3A3836', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'DM Mono', fontSize: big ? 32 : 22, fontWeight: 500, color: '#F5F0E8', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: '#3A3836', marginTop: 4 }}>{unit}</div>
    </div>
  )
}

const btnStyle = (bg, color, small = false, borderColor) => ({
  padding: small ? '6px 14px' : '11px 20px', fontSize: 11, letterSpacing: '0.08em',
  fontFamily: 'DM Mono', background: bg, color, border: '1px solid', borderColor: borderColor || bg, cursor: 'pointer',
})

const colHead = { fontSize: 9, color: '#2A2A2A', letterSpacing: '0.1em' }
