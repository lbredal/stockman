import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const p = {
  bg: '#0f1117', surface: '#1a1d27', surfaceHigh: '#22263a',
  border: '#2a2d3a', accent: '#6ee7b7', accentDim: 'rgba(110,231,183,0.12)',
  text: '#e8eaf0', muted: '#6b7280',
  available: '#6ee7b7', reserved: '#fbbf24', sold: '#6b7280',
  danger: '#f87171',
}

const STATUSES = ['available', 'reserved', 'sold']
const statusLabel = { available: 'Tilgjengelig', reserved: 'Reservert', sold: 'Solgt' }

function toDateInput(val) {
  if (!val) return ''
  return new Date(val).toISOString().slice(0, 10)
}

const s = {
  page: { minHeight: '100vh', background: p.bg, color: p.text, fontFamily: "'Segoe UI', system-ui, sans-serif" },
  nav: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', borderBottom: `1px solid ${p.border}` },
  logo: { fontSize: '1.1rem', fontWeight: 700, color: p.accent, margin: 0 },
  backBtn: { marginLeft: 'auto', background: 'transparent', border: `1px solid ${p.border}`, color: p.muted, padding: '0.35rem 0.9rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem' },
  body: { maxWidth: 860, margin: '0 auto', padding: '2.5rem 2rem' },
  heading: { fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' },
  sub: { color: p.muted, fontSize: '0.88rem', margin: '0 0 2.5rem' },
  productCard: { background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden' },
  productHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: `1px solid ${p.border}` },
  productName: { fontWeight: 600, fontSize: '1rem', margin: 0 },
  addBtn: { background: p.accentDim, color: p.accent, border: `1px solid rgba(110,231,183,0.2)`, padding: '0.3rem 0.85rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 },
  batchRow: { display: 'grid', gridTemplateColumns: '1fr 120px 130px 130px 80px 32px', gap: '0.6rem', alignItems: 'center', padding: '0.75rem 1.5rem', borderBottom: `1px solid ${p.border}` },
  fieldLabel: { fontSize: '0.7rem', color: p.muted, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: { width: '100%', padding: '0.45rem 0.6rem', background: p.surfaceHigh, border: `1px solid ${p.border}`, borderRadius: 6, color: p.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.45rem 0.6rem', background: p.surfaceHigh, border: `1px solid ${p.border}`, borderRadius: 6, color: p.text, fontSize: '0.85rem', outline: 'none', cursor: 'pointer' },
  saveBtn: (saving) => ({ background: saving ? p.accentDim : p.accent, color: saving ? p.accent : '#0f1117', border: 'none', borderRadius: 6, padding: '0.45rem 0.75rem', cursor: saving ? 'default' : 'pointer', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }),
  deleteBtn: { background: 'transparent', border: 'none', color: p.muted, cursor: 'pointer', fontSize: '1rem', padding: '0.2rem 0.4rem', borderRadius: 4, lineHeight: 1 },
  savedTag: { fontSize: '0.75rem', color: p.accent, fontWeight: 600 },
  errorTag: { fontSize: '0.72rem', color: p.danger },
  newBatchForm: { padding: '1rem 1.5rem', background: p.surfaceHigh, display: 'grid', gridTemplateColumns: '1fr 120px 130px 130px auto', gap: '0.6rem', alignItems: 'flex-end', borderBottom: `1px solid ${p.border}` },
  newFormLabel: { fontSize: '0.7rem', color: p.muted, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' },
  createBtn: { padding: '0.5rem 1rem', background: p.accent, color: '#0f1117', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' },
  empty: { padding: '1.25rem 1.5rem', color: p.muted, fontSize: '0.85rem' },
}

function BatchRow({ batch, units, onSaved }) {
  const [form, setForm] = useState({
    quantity: batch.quantity,
    status: batch.status,
    harvestDate: toDateInput(batch.harvestDate),
    expiryDate: toDateInput(batch.expiryDate),
  })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setFeedback(null) }

  async function save() {
    setSaving(true)
    setFeedback(null)
    try {
      const r = await fetch(`/api/dev/batches/${batch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) throw new Error((await r.json()).error)
      setFeedback('ok')
      onSaved()
    } catch (e) {
      setFeedback(e.message)
    } finally {
      setSaving(false)
    }
  }

  const unitLabel = units.find(u => u.name === batch.unit)?.abbreviation ?? batch.unitAbbreviation ?? ''

  return (
    <div style={s.batchRow}>
      <div>
        <div style={s.fieldLabel}>Antall ({unitLabel})</div>
        <input style={s.input} type="number" min="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
      </div>
      <div>
        <div style={s.fieldLabel}>Status</div>
        <select style={s.select} value={form.status} onChange={e => set('status', e.target.value)}>
          {STATUSES.map(st => <option key={st} value={st}>{statusLabel[st]}</option>)}
        </select>
      </div>
      <div>
        <div style={s.fieldLabel}>Høstet</div>
        <input style={s.input} type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} />
      </div>
      <div>
        <div style={s.fieldLabel}>Utløper</div>
        <input style={s.input} type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} />
      </div>
      <div>
        <div style={s.fieldLabel}>&nbsp;</div>
        {feedback === 'ok'
          ? <span style={s.savedTag}>✓ Lagret</span>
          : feedback
            ? <span style={s.errorTag}>{feedback}</span>
            : <button style={s.saveBtn(saving)} onClick={save} disabled={saving}>{saving ? '…' : 'Lagre'}</button>
        }
      </div>
      <div style={{ paddingTop: '1.2rem' }}>
        {/* placeholder for future delete */}
      </div>
    </div>
  )
}

function NewBatchForm({ product, units, onCreated, onCancel }) {
  const [form, setForm] = useState({
    unitId: units[0]?.id ?? '',
    quantity: '',
    status: 'available',
    harvestDate: '',
    expiryDate: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function create() {
    if (!form.quantity) { setError('Antall er påkrevd'); return }
    setSaving(true)
    setError(null)
    try {
      const r = await fetch('/api/dev/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, ...form }),
      })
      if (!r.ok) throw new Error((await r.json()).error)
      onCreated()
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <div style={s.newBatchForm}>
      <div>
        <div style={s.newFormLabel}>Antall</div>
        <input style={s.input} type="number" min="0" placeholder="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
      </div>
      <div>
        <div style={s.newFormLabel}>Status</div>
        <select style={s.select} value={form.status} onChange={e => set('status', e.target.value)}>
          {STATUSES.map(st => <option key={st} value={st}>{statusLabel[st]}</option>)}
        </select>
      </div>
      <div>
        <div style={s.newFormLabel}>Høstet</div>
        <input style={s.input} type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} />
      </div>
      <div>
        <div style={s.newFormLabel}>Utløper</div>
        <input style={s.input} type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', paddingBottom: '0.05rem' }}>
        <button style={s.createBtn} onClick={create} disabled={saving}>{saving ? '…' : '+ Legg til'}</button>
        <button onClick={onCancel} style={{ ...s.createBtn, background: 'transparent', color: p.muted, border: `1px solid ${p.border}` }}>Avbryt</button>
      </div>
      {error && <div style={{ gridColumn: '1/-1', color: p.danger, fontSize: '0.78rem', marginTop: '0.25rem' }}>{error}</div>}
    </div>
  )
}

function NewProductForm({ categories, onCreated, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', categoryId: categories[0]?.id ?? '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function create() {
    if (!form.name.trim()) { setError('Navn er påkrevd'); return }
    setSaving(true); setError(null)
    try {
      const r = await fetch('/api/dev/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) throw new Error((await r.json()).error)
      onCreated()
    } catch (e) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
      <p style={{ margin: '0 0 1.25rem', fontWeight: 600, fontSize: '0.95rem' }}>Nytt produkt</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={s.fieldLabel}>Navn *</div>
          <input style={s.input} placeholder="f.eks. Bredal Ekstra Sterk" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <div style={s.fieldLabel}>Beskrivelse</div>
          <input style={s.input} placeholder="Valgfri beskrivelse" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div>
          <div style={s.fieldLabel}>Kategori</div>
          <select style={s.select} value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      {error && <div style={{ color: p.danger, fontSize: '0.78rem', marginBottom: '0.75rem' }}>{error}</div>}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button style={s.createBtn} onClick={create} disabled={saving}>{saving ? '…' : 'Opprett produkt'}</button>
        <button onClick={onCancel} style={{ ...s.createBtn, background: 'transparent', color: p.muted, border: `1px solid ${p.border}` }}>Avbryt</button>
      </div>
    </div>
  )
}

export default function UpdateInventory() {
  const [data, setData] = useState(null)
  const [units, setUnits] = useState([])
  const [categories, setCategories] = useState([])
  const [addingTo, setAddingTo] = useState(null)
  const [addingProduct, setAddingProduct] = useState(false)

  async function load() {
    const [inv, u, cats] = await Promise.all([
      fetch('/api/dev/inventory').then(r => r.json()),
      fetch('/api/dev/units').then(r => r.json()),
      fetch('/api/dev/categories').then(r => r.json()),
    ])
    setData(inv)
    setUnits(u)
    setCategories(cats)
  }

  useEffect(() => { load() }, [])

  if (!data) return <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.muted }}>Laster...</div>

  return (
    <div style={s.page}>
<div style={s.body}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <h2 style={{ ...s.heading, margin: 0 }}>Oppdater lager</h2>
          <button style={s.addBtn} onClick={() => setAddingProduct(v => !v)}>
            {addingProduct ? '✕ Avbryt' : '+ Nytt produkt'}
          </button>
        </div>
        <p style={s.sub}>Rediger partier eller legg til nye</p>

        {addingProduct && (
          <NewProductForm
            categories={categories}
            onCreated={() => { setAddingProduct(false); load() }}
            onCancel={() => setAddingProduct(false)}
          />
        )}

        {data.products.map(product => (
          <div key={product.id} style={s.productCard}>
            <div style={s.productHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                <p style={s.productName}>{product.name}</p>
              </div>
              <button style={s.addBtn} onClick={() => setAddingTo(addingTo === product.id ? null : product.id)}>
                {addingTo === product.id ? '✕ Avbryt' : '+ Nytt parti'}
              </button>
            </div>

            {addingTo === product.id && (
              <NewBatchForm
                product={product}
                units={units}
                onCreated={() => { setAddingTo(null); load() }}
                onCancel={() => setAddingTo(null)}
              />
            )}

            {product.batches.length === 0 && addingTo !== product.id
              ? <div style={s.empty}>Ingen partier ennå</div>
              : product.batches.map(batch => (
                  <BatchRow key={batch.id} batch={batch} units={units} onSaved={load} />
                ))
            }
          </div>
        ))}
      </div>
    </div>
  )
}
